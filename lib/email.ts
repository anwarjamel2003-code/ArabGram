import nodemailer from 'nodemailer'

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

/**
 * Generate a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send verification code email
 */
export async function sendVerificationEmail(
  email: string,
  code: string,
  name: string
): Promise<boolean> {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Cairo', 'Tajawal', Arial, sans-serif; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #F59E0B 0%, #EC4899 50%, #7C3AED 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; }
          .content { background: #f5f5f5; padding: 30px; border-radius: 12px; margin-top: 20px; }
          .code-box { background: white; border: 2px solid #7C3AED; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #7C3AED; font-family: monospace; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">ArabGram</h1>
            <p style="margin: 10px 0 0 0;">تحقق من حسابك</p>
          </div>

          <div class="content">
            <p>مرحباً <strong>${name}</strong>,</p>
            
            <p>شكراً لتسجيلك في ArabGram! لإكمال عملية التحقق من حسابك، يرجى استخدام الرمز أدناه:</p>

            <div class="code-box">
              <div class="code">${code}</div>
              <p style="color: #999; margin: 10px 0 0 0; font-size: 14px;">هذا الرمز صالح لمدة 10 دقائق</p>
            </div>

            <p>إذا لم تقم بإنشاء حساب ArabGram، يرجى تجاهل هذا البريد.</p>

            <div class="warning">
              ⚠️ <strong>تحذير أمني:</strong> لا تشارك هذا الرمز مع أي شخص. فريق ArabGram لن يطلب منك هذا الرمز أبداً.
            </div>
          </div>

          <div class="footer">
            <p>© 2026 ArabGram - جميع الحقوق محفوظة</p>
            <p>Developed by Eng. Anwar</p>
          </div>
        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: `رمز التحقق من ArabGram: ${code}`,
      html: htmlContent,
    })

    return true
  } catch (error) {
    console.error('Failed to send verification email:', error)
    return false
  }
}

/**
 * Send welcome email after successful verification
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
  username: string
): Promise<boolean> {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Cairo', 'Tajawal', Arial, sans-serif; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #F59E0B 0%, #EC4899 50%, #7C3AED 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; }
          .content { background: #f5f5f5; padding: 30px; border-radius: 12px; margin-top: 20px; }
          .features { margin: 20px 0; }
          .feature { background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-right: 4px solid #7C3AED; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #F59E0B 0%, #EC4899 50%, #7C3AED 100%); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">أهلاً وسهلاً!</h1>
            <p style="margin: 10px 0 0 0;">تم تفعيل حسابك بنجاح</p>
          </div>

          <div class="content">
            <p>مرحباً <strong>${name}</strong>,</p>
            
            <p>تم تفعيل حسابك بنجاح! أنت الآن جزء من عائلة ArabGram.</p>

            <div class="features">
              <div class="feature">
                <strong>📸 شارك لحظاتك</strong>
                <p>انشر صورك وفيديوهاتك مع قصص تختفي بعد 24 ساعة</p>
              </div>
              <div class="feature">
                <strong>💬 تواصل مباشر</strong>
                <p>أرسل رسائل خاصة وتحدث مع أصدقائك في الوقت الفعلي</p>
              </div>
              <div class="feature">
                <strong>🌍 اكتشف المحتوى</strong>
                <p>استكشف محتوى مخصص لاهتماماتك وتابع الترندات</p>
              </div>
            </div>

            <p>اسم المستخدم الخاص بك: <strong>@${username}</strong></p>

            <a href="${process.env.NEXTAUTH_URL || 'https://arabgram.com'}/feed" class="cta-button">
              ابدأ الآن
            </a>
          </div>

          <div class="footer">
            <p>© 2026 ArabGram - جميع الحقوق محفوظة</p>
            <p>Developed by Eng. Anwar</p>
          </div>
        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: `مرحباً بك في ArabGram يا ${name}!`,
      html: htmlContent,
    })

    return true
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return false
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string,
  name: string
): Promise<boolean> {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Cairo', 'Tajawal', Arial, sans-serif; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #F59E0B 0%, #EC4899 50%, #7C3AED 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; }
          .content { background: #f5f5f5; padding: 30px; border-radius: 12px; margin-top: 20px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #F59E0B 0%, #EC4899 50%, #7C3AED 100%); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">إعادة تعيين كلمة المرور</h1>
          </div>

          <div class="content">
            <p>مرحباً <strong>${name}</strong>,</p>
            
            <p>تلقينا طلب لإعادة تعيين كلمة المرور الخاصة بك. انقر على الزر أدناه لإعادة تعيينها:</p>

            <a href="${resetLink}" class="cta-button">
              إعادة تعيين كلمة المرور
            </a>

            <p style="margin-top: 20px; color: #666;">أو انسخ الرابط التالي في متصفحك:</p>
            <p style="word-break: break-all; background: white; padding: 10px; border-radius: 8px; font-size: 12px; color: #7C3AED;">
              ${resetLink}
            </p>

            <div class="warning">
              ⚠️ هذا الرابط صالح لمدة 1 ساعة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد.
            </div>
          </div>

          <div class="footer">
            <p>© 2026 ArabGram - جميع الحقوق محفوظة</p>
            <p>Developed by Eng. Anwar</p>
          </div>
        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'إعادة تعيين كلمة المرور - ArabGram',
      html: htmlContent,
    })

    return true
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    return false
  }
}
