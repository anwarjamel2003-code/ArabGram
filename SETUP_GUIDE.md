# دليل إعداد ArabGram

## المتطلبات الأساسية

- Node.js 18+ و npm 9+
- PostgreSQL 12+
- حساب بريد إلكتروني (Gmail أو خادم SMTP آخر)

## خطوات الإعداد

### 1. تثبيت التبعيات

```bash
npm install
```

### 2. إعداد متغيرات البيئة

انسخ ملف `.env.example` إلى `.env.local`:

```bash
cp .env.example .env.local
```

ثم قم بتحديث المتغيرات التالية:

#### قاعدة البيانات
```env
DATABASE_URL="postgresql://username:password@localhost:5432/arabgram?schema=public"
DIRECT_URL="postgresql://username:password@localhost:5432/arabgram?schema=public"
```

#### NextAuth
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -hex 32)"
```

#### البريد الإلكتروني (Gmail)

إذا كنت تستخدم Gmail:

1. فعّل المصادقة ذات العاملين (2FA)
2. أنشئ كلمة مرور تطبيق:
   - اذهب إلى https://myaccount.google.com/apppasswords
   - اختر Gmail والجهاز
   - انسخ كلمة المرور المُنتجة

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="ArabGram <noreply@arabgram.com>"
```

#### خادم SMTP مخصص

إذا كنت تستخدم خادم SMTP آخر:

```env
EMAIL_HOST="your-smtp-host.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-username"
EMAIL_PASSWORD="your-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### 3. إعداد قاعدة البيانات

```bash
# توليد عميل Prisma
npx prisma generate

# دفع المخطط إلى قاعدة البيانات
npx prisma db push

# (اختياري) فتح Prisma Studio
npx prisma studio
```

### 4. تشغيل المشروع

```bash
npm run dev
```

المشروع سيكون متاحاً على `http://localhost:3000`

## نظام المصادقة والتحقق من البريد

### عملية التسجيل

1. **الخطوة 1-4**: إدخال البيانات الأساسية (الاسم، البريد، اسم المستخدم، كلمة المرور)
2. **الخطوة 5**: إرسال رمز التحقق إلى البريد الإلكتروني
3. **التحقق**: إدخال الرمز المُرسل (صالح لمدة 10 دقائق)
4. **النجاح**: تفعيل الحساب والتوجيه إلى صفحة تسجيل الدخول

### ميزات الأمان

- **تشفير كلمات المرور**: استخدام Argon2id (الأقوى)
- **تشفير الأكواد**: تخزين أكواس التحقق مشفرة في قاعدة البيانات
- **انتهاء الصلاحية**: أكواد التحقق صالحة لمدة 10 دقائق فقط
- **حفظ الجلسات**: جلسات المستخدمين محفوظة في قاعدة البيانات (Database Strategy)
- **مدة الجلسة**: 30 يوماً

### إعادة إرسال الرمز

إذا لم تستقبل الرمز:

1. انقر على "تغيير البريد الإلكتروني" للعودة
2. أو استخدم رابط إعادة الإرسال (بعد 60 ثانية)

## استكشاف الأخطاء

### "فشل إرسال البريد الإلكتروني"

**الحل**:
- تأكد من متغيرات البريد في `.env.local`
- تحقق من اتصال الإنترنت
- إذا كان Gmail: تأكد من كلمة مرور التطبيق (ليس كلمة المرور العادية)
- تحقق من سجلات الخادم: `npm run dev` يعرض الأخطاء

### "خطأ في قاعدة البيانات"

**الحل**:
- تأكد من أن PostgreSQL قيد التشغيل
- تحقق من `DATABASE_URL` و `DIRECT_URL`
- جرّب: `npx prisma db push` مرة أخرى

### "الرمز غير صحيح"

**الحل**:
- تأكد من إدخال الرمز الصحيح من البريد
- تحقق من انتهاء صلاحية الرمز (10 دقائق)
- اطلب رمزاً جديداً إذا انتهت الصلاحية

## نشر المشروع

### على Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# نشر المشروع
vercel
```

تأكد من إضافة متغيرات البيئة في لوحة تحكم Vercel.

### على خادم مخصص

```bash
# بناء المشروع
npm run build

# تشغيل الإنتاج
npm start
```

## الدعم والمساعدة

للمزيد من المعلومات، راجع:
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
