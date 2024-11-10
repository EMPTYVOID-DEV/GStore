import { env } from '$env/dynamic/private';
import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export async function sendVerificationEmail(email: string, text: string) {
	let settings: SMTPTransport.Options = {
		host: env.SMTP_HOST,
		port: parseInt(env.SMTP_PORT),
		secure: env.NODE_ENV == 'dev'
	};

	if (env.SMTP_REQUIRE_AUTH == 'true')
		settings = { ...settings, auth: { pass: env.SMTP_PASSWORD, user: env.SMTP_USERNAME } };

	const transport = createTransport(settings);

	const mailOptions: SMTPTransport.MailOptions = {
		from: env.SMTP_EMAIL,
		subject: 'Email verification',
		to: email,
		text
	};
	return transport.sendMail(mailOptions);
}
