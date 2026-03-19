import { Resend } from "resend";

export default async function handler(req, res) {
  console.log("request received");
  console.log("env check", process.env.RESEND_API_KEY ? "present" : "missing");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, company, role, message } = req.body || {};

  try {
    console.log("sending email");

    const { data, error } = await resend.emails.send({
      from: "SignalLayer <onboarding@resend.dev>",
      to: process.env.LEAD_NOTIFICATION_EMAIL || "diyu121@gmail.com",
      subject: "New SignalLayer Lead",
      html: `
        <p><strong>Name:</strong> ${name || ""}</p>
        <p><strong>Email:</strong> ${email || ""}</p>
        <p><strong>Company:</strong> ${company || ""}</p>
        <p><strong>Role:</strong> ${role || ""}</p>
        <p><strong>Message:</strong> ${message || ""}</p>
      `,
    });

    console.log("resend response:", { data, error });

    if (error) {
      throw new Error(error.message || "Resend failed");
    }

    console.log("email success");

    return res.status(200).json({
      success: true,
      id: data?.id || null,
    });
  } catch (err) {
    console.error("email error:", err);

    return res.status(500).json({
      success: false,
      error: "Email failed",
      details: err instanceof Error ? err.message : String(err),
    });
  }
}