import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import cors from "cors";

dotenv.config();
console.log("API Key loaded:", process.env.SENDGRID_API_KEY?.slice(0,8)+"...");
const app = express();
app.use(bodyParser.json());
app.use(cors());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const admin = require("firebase-admin");
const db = admin.firestore(); // Import Firebase Admin SDK

// initialise once
if (!admin.apps.length) {
  admin.initializeApp();
}

const adminAuth = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  // Reject if no token provided
  if (!idToken) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  try {
    // Verify the Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Only allow users with admin = true in their custom claims
    if (!decoded.admin) {
      return res.status(403).json({ error: "Admins only" });
    }

    // Attach decoded token to request object for later use
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler

  } catch (error) {
    console.error("Auth error:", error);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

//Manager's Dashboard
app.get("/userData", adminAuth, async (req, res) => {
  try {

    // 1️⃣ count of users
    const userSnapshot = await db.collection('users').get();
    const totalUsers = userSnapshot.size;

    // 2️⃣ time range
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // 3️⃣ activity data
    const activities = await db.collection('activity')
      .where('timestamp', '>=', lastMonth)
      .get();

    // 4️⃣ calculate daily activity trends
    const trend = {};
    activities.forEach(doc => {
      const date = doc.data().timestamp.toDate().toISOString().slice(0, 10);
      trend[date] = (trend[date] || 0) + 1;
    });

    // 5️⃣ return to the frontend
    res.json({
      totalUsers,
      activityCount: activities.size,
      trend
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/postData", adminAuth, async (req, res) => {
  try {
    // 1️⃣ time zone: one week
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    // 2️⃣ count of post
    const allPostsSnapshot = await db.collection("posts").get();
    const totalPosts = allPostsSnapshot.size;

    // 3️⃣ count of posts in this week
    const postsThisWeekSnapshot = await db.collection("posts")
      .where("createdAt", ">=", oneWeekAgo)
      .get();
    const postsThisWeek = postsThisWeekSnapshot.size;

    // 4️⃣ post trend per week
    const trend = {};
    postsThisWeekSnapshot.forEach(doc => {
      const data = doc.data();
      const dateStr = data.createdAt.toDate().toISOString().slice(0, 10);
      trend[dateStr] = (trend[dateStr] || 0) + 1;
    });

    // 5️⃣ return to the frontend
    res.json({
      totalPosts,
      postsThisWeek,
      trend
    });

  } catch (error) {
    console.error("Error fetching posts stats:", error);
    res.status(500).json({ error: error.message });
  }
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
console.log("Using API Key:", process.env.SENDGRID_API_KEY?.slice(0, 8) + "...");
