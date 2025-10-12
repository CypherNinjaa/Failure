import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "admin") {
		return NextResponse.json(
			{ success: false, error: "Unauthorized" },
			{ status: 403 }
		);
	}

	try {
		const { email } = await req.json();

		// Get admin's email from Clerk
		const { userId } = auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "User not authenticated" },
				{ status: 401 }
			);
		}

		const { clerkClient } = await import("@clerk/nextjs/server");
		const user = await clerkClient.users.getUser(userId);
		const adminEmail = user.emailAddresses[0]?.emailAddress;

		if (!adminEmail) {
			return NextResponse.json(
				{
					success: false,
					error: "Admin email not found. Please update your profile.",
				},
				{ status: 400 }
			);
		}

		// Test email configuration
		const emailTransporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER, // vk6938663@gmail.com (sender)
				pass: process.env.GMAIL_APP_PASSWORD,
			},
		});

		// Send test email to admin (recipient)
		await emailTransporter.sendMail({
			from: '"Happy Child School Test" <vk6938663@gmail.com>',
			to: email || adminEmail, // Send to provided email or admin's email
			subject: "🧪 Test Notification - Happy Child School",
			html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-badge { background: #10b981; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧪 Test Notification</h1>
            </div>
            <div class="content">
              <div class="success-badge">✅ Email System Working!</div>
              <p><strong>Congratulations!</strong></p>
              <p>Your Happy Child School notification system is properly configured and working.</p>
              <p><strong>Test Details:</strong></p>
              <ul>
                <li>✅ Gmail SMTP connection successful</li>
                <li>✅ Email delivery working</li>
                <li>✅ HTML formatting enabled</li>
                <li>🕐 Sent at: ${new Date().toLocaleString()}</li>
              </ul>
              <p>You can now send notifications to students, parents, teachers, and admins via email and web push.</p>
            </div>
            <div class="footer">
              <p>HCS - Happy Child School Management System</p>
              <p>This is a test email from the notification system.</p>
            </div>
          </div>
        </body>
        </html>
      `,
		});

		return NextResponse.json({
			success: true,
			message: "Test email sent successfully!",
			sentTo: email || adminEmail,
			sentFrom: process.env.GMAIL_USER,
			timestamp: new Date().toISOString(),
		});
	} catch (error: any) {
		console.error("Test notification error:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to send test notification",
				details: error.toString(),
			},
			{ status: 500 }
		);
	}
}
