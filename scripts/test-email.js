// Test email sending script  
import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';

// Load environment variables from .env.local
const envContent = readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'mail.ehkarabas.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: envVars.EMAIL_SERVER_USER,
      pass: envVars.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    }
  });

  try {
    console.log('🔍 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    console.log('📧 Sending test email...');
    const result = await transporter.sendMail({
      from: envVars.EMAIL_FROM,
      to: 'emirhkarabas@gmail.com',
      subject: 'Test Email - ' + new Date().toISOString(),
      text: 'This is a test email sent at ' + new Date().toISOString(),
      html: `
        <h2>Test Email</h2>
        <p>This is a test email sent at ${new Date().toISOString()}</p>
        <p>From: Radio Calico Development</p>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
  } finally {
    transporter.close();
  }
}

testEmail();