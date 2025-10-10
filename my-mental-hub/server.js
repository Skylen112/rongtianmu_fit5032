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
