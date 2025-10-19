import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import cors from "cors";
import admin from 'firebase-admin';

dotenv.config();
console.log("API Key loaded:", process.env.SENDGRID_API_KEY?.slice(0,8)+"...");
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// initalize Firebase Admin（initialize first，then use db）
let db;  // init db
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT || './serviceAccountKey.json'),
    });
    console.log('Firebase Admin initialized successfully');
    db = admin.firestore();  // move to this, initialize then make a defination
  } catch (error) {
    console.error('Firebase initialize failed:', error);
    process.exit(1);  // quiz to avoid collapse
  }
} else {
  db = admin.firestore();
}

const apiKey = process.env.API_KEY;
console.log('API Key loaded:', apiKey ? 'Success' : 'undefined');
if (apiKey && !apiKey.startsWith('SG.')) {
  console.warn('API key does not start with "SG.".');
}

// User Dashboard（use db）
app.get("/userDashboard", async (req, res) => {
  console.log('get /userDashboard request');  // debug logs
  try {
    // 1️⃣ validate token and obtain uid
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      console.log('missing token');
      return res.status(401).json({ error: "Missing token" });
    }

    const decoded = await admin.auth().verifyIdToken(idToken).catch(() => null);
    if (!decoded || !decoded.uid) {
      console.log('token failed');
      return res.status(401).json({ error: "Invalid token" });
    }
    const uid = decoded.uid;
    console.log('validate UID:', uid);

    // 2️⃣ obtain all posts by this user
    const postsSnapshot = await db.collection("posts")
      .where("userId", "==", uid)
      .get();

    const totalPosts = postsSnapshot.size;
    console.log('Found posts count:', totalPosts);

    // 3️⃣ count the daily trend
    const trend = {};
    postsSnapshot.forEach(doc => {
      const createdAt = doc.data().createdAt;
      if (createdAt) {
        const dateStr = createdAt.toDate().toISOString().slice(0, 10);
        trend[dateStr] = (trend[dateStr] || 0) + 1;
      }
    });

    // 4️⃣ average posts per day
    const dates = Object.keys(trend);
    const days = dates.length || 1;
    const averagePerDay = totalPosts / days;

    // 5️⃣ return the data
    console.log('return data:', { totalPosts, averagePerDay });
    res.json({
      totalPosts,
      averagePerDay: parseFloat(averagePerDay.toFixed(2)),
      dailyTrend: trend
    });

  } catch (error) {
    console.error('error in routes:', error);
    res.status(500).json({ error: error.message });
  }
});


app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).header('Content-Type', 'application/json')
    .json({ error: err.message || 'Internal Server Error' });
});



//send the email to user who subscribe the service
app.post("/sendEmail", async (req, res) => {
  const { email, articleId } = req.body;

  const msg = {
    to: email,
    from: "rongtianmu39@gmail.com",
    templateId:"d-1ae08389c5304f8b95c2fb345165c27e",
    dynamic_template_data:{
      name: "Teenagers School Life",
      link:"http://localhost:3000/blog",
      subject:'Teenagers School Life',
      content: [{ type: "text/plain", value: "This is fallback content" }],
    }
  };

  try {
  await sgMail.send(msg);
  res.json({ status: "success", message: "Email sent successfully!" });
} catch (error) {
  console.error("SendGrid Error:", error.response ? error.response.body : error);
  res.status(500).json({ status: "error", error: error.response ? error.response.body : "Failed to send email" });
}
});

app.use((req, res) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('404:', req.url);
  res.status(404).header('Content-Type', 'application/json')
    .json({ error: 'Route not found' });
});

async function sendBulkWelcomeEmails() {
  // fetch users who subscribed to welcome emails
  const usersSnapshot = await db.collection('users')
    .where('subscribedToWelcome', '==', true)
    .get();

  const users = usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

  for (const user of users) {
    if (!user.hasReceivedWelcome) { // avoid resending
      const msg = {
        to: user.email,
        from: 'rongtianmu39@gmail.com',
        subject: 'Welcome to Our Service!',
        html: `<p>Hi ${user.username}, welcome to our platform!</p>`,
      };
      await sgMail.send(msg);

      // update user record to mark welcome email as sent
      await db.collection('users').doc(user.uid).update({
        hasReceivedWelcome: true
      });
    }
  }
  console.log('Bulk emails sent!');
}

app.post('/sendBulkEmails', async (req, res) => {
  try {
    await sendBulkWelcomeEmails();
    res.json({ status: 'success', message: 'Bulk emails sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
console.log("Using API Key:", process.env.SENDGRID_API_KEY?.slice(0, 8) + "...");
