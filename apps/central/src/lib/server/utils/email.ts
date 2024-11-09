import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

type mailOptions = {
	from: string;
	to: string;
	subject: string;
	text?: string;
	html?: string;
};

export async function sendVerificationEmail(email: string, text: string) {
	const settings: SMTPTransport.Options = dev
		? {
				host: env.SMTP_HOST,
				port: parseInt(env.SMTP_PORT)
			}
		: {
				host: env.SMTP_HOST,
				port: parseInt(env.SMTP_PORT),
				auth: { pass: env.SMTP_KEY, user: env.SMTP_EMAIL }
			};
	const transport = createTransport(settings);

	const mailOptions: mailOptions = {
		from: env.SMTP_EMAIL,
		subject: 'Email verification',
		to: email,
		text
	};
	return transport.sendMail(mailOptions);
}
