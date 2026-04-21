# 🚀 دليل النشر على Vercel - ArabGram

## المتطلبات الأساسية

قبل البدء، تأكد من أن لديك:

1. **حساب GitHub** - لربط المستودع
2. **حساب Vercel** - للنشر (مجاني)
3. **قاعدة بيانات PostgreSQL** - مثل Neon أو Supabase
4. **حساب بريد إلكتروني** - لإرسال رموز التحقق

---

## خطوات النشر على Vercel

### 1. إعداد قاعدة البيانات

#### استخدام Neon (موصى به)

1. اذهب إلى [neon.tech](https://neon.tech)
2. أنشئ حساب مجاني
3. أنشئ مشروع جديد
4. انسخ **Connection String**
5. استخدمه كـ `DATABASE_URL`

#### أو استخدام Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد
3. انسخ **PostgreSQL Connection String**
4. استخدمه كـ `DATABASE_URL`

### 2. إعداد البريد الإلكتروني

#### استخدام Gmail (الأسهل)

1. اذهب إلى [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. اختر "Mail" و "Windows Computer"
3. انسخ **App Password** (16 حرف)
4. استخدمه كـ `EMAIL_PASSWORD`

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@arabgram.com
```

#### أو استخدام SendGrid

1. اذهب إلى [sendgrid.com](https://sendgrid.com)
2. أنشئ حساب مجاني
3. أنشئ API Key
4. استخدم:

```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=your-verified-email@domain.com
```

### 3. توليد المفاتيح الأمنية

```bash
# توليد NEXTAUTH_SECRET
openssl rand -base64 32

# توليد JWT_SECRET
openssl rand -base64 32

# توليد CSRF_SECRET
openssl rand -base64 32
```

احفظ هذه المفاتيح في مكان آمن.

### 4. ربط Vercel بـ GitHub

1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط "New Project"
3. اختر "Import Git Repository"
4. اختر مستودع `ArabGram`
5. اضغط "Import"

### 5. إضافة متغيرات البيئة

في Vercel Dashboard:

1. اذهب إلى **Settings** → **Environment Variables**
2. أضف المتغيرات التالية:

```
DATABASE_URL = postgresql://...
NEXTAUTH_SECRET = your-generated-secret
NEXTAUTH_URL = https://your-domain.vercel.app
JWT_SECRET = your-generated-secret
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = your-app-password
EMAIL_FROM = noreply@arabgram.com
NODE_ENV = production
```

### 6. تشغيل Migrations

بعد النشر الأول:

```bash
# محليًا (اختياري)
npm run db:push

# أو عبر Vercel CLI
vercel env pull
npm run db:push
```

### 7. النشر

1. اضغط **Deploy** في Vercel Dashboard
2. انتظر اكتمال البناء (عادة 2-3 دقائق)
3. سيتم إنشاء URL تلقائي: `https://your-project.vercel.app`

---

## التحقق من النشر

بعد النشر بنجاح:

1. **اختبر الصفحة الرئيسية**
   ```
   https://your-domain.vercel.app
   ```

2. **اختبر التسجيل**
   ```
   https://your-domain.vercel.app/auth/signup
   ```

3. **اختبر تسجيل الدخول**
   ```
   https://your-domain.vercel.app/auth/signin
   ```

4. **تحقق من الأمان**
   - جرّب Security Headers: https://securityheaders.com
   - جرّب SSL: https://www.ssllabs.com/ssltest

---

## استخدام نطاق مخصص (Custom Domain)

1. في Vercel Dashboard → **Settings** → **Domains**
2. أضف نطاقك المخصص
3. حدّث DNS records عند مزود النطاق
4. انتظر التحديث (عادة 24 ساعة)

---

## الصيانة والمراقبة

### مراقبة الأداء

- **Vercel Analytics**: مدمج تلقائياً
- **Vercel Monitoring**: تتبع الأخطاء والأداء

### التحديثات الأمنية

```bash
# فحص الثغرات
npm audit

# تحديث المكتبات
npm update

# دفع التحديثات
git push origin main
```

Vercel سيعيد النشر تلقائياً.

### النسخ الاحتياطية

- **قاعدة البيانات**: استخدم خدمة النسخ الاحتياطي من Neon/Supabase
- **الملفات**: استخدم GitHub كنسخة احتياطية

---

## استكشاف الأخطاء

### المشكلة: خطأ في الاتصال بقاعدة البيانات

**الحل:**
1. تحقق من `DATABASE_URL` صحيح
2. تأكد من أن قاعدة البيانات متاحة
3. جرّب الاتصال محليًا: `npm run db:push`

### المشكلة: البريد الإلكتروني لا يُرسل

**الحل:**
1. تحقق من بيانات البريد صحيحة
2. تأكد من تفعيل "Less secure apps" في Gmail
3. جرّب استخدام App Password بدلاً من كلمة المرور

### المشكلة: الأداء بطيء

**الحل:**
1. تحقق من حجم الصور
2. استخدم CDN للملفات الثابتة
3. فعّل Caching في Vercel

### المشكلة: خطأ 500

**الحل:**
1. تحقق من Vercel Logs: `vercel logs`
2. تحقق من متغيرات البيئة
3. أعد النشر: `vercel --prod`

---

## الأوامر المفيدة

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر المحلي للاختبار
vercel dev

# عرض السجلات
vercel logs

# سحب متغيرات البيئة
vercel env pull

# النشر الفوري
vercel --prod
```

---

## الأمان على Vercel

✅ **ما تم تفعيله:**
- SSL/TLS تشفير تلقائي
- DDoS protection
- WAF (Web Application Firewall)
- Security headers
- Rate limiting

✅ **توصيات إضافية:**
- استخدم VPN للوصول إلى لوحة التحكم
- فعّل Two-Factor Authentication على Vercel
- راجع السجلات بانتظام
- حدّث المكتبات بانتظام

---

## الدعم والمساعدة

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

**آخر تحديث:** 21 أبريل 2026  
**الإصدار:** 1.0.0
