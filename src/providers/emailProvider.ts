import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function emailProvider(payload: any): Promise<void> {
  const { to, subject, body } = payload;
  const result = await resend.emails.send({
  from: process.env.EMAIL_FROM!,
  to,
  subject,
  html: body,
}); 
if(result.error) {
    throw new Error(result.error.message)
}
}