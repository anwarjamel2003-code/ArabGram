# 🔐 القائمة الشاملة لمتغيرات البيئة (Environment Variables) لمشروع ArabGram

هذه هي القائمة النهائية والكاملة لجميع متغيرات البيئة التي يحتاجها مشروع ArabGram ليعمل بكامل ميزاته (قاعدة البيانات، المصادقة، الإشعارات، المكالمات، والبريد الإلكتروني) على منصة Vercel.

## 1. إعدادات قاعدة البيانات (Supabase)
هذه المتغيرات ضرورية لربط المشروع بقاعدة البيانات لتخزين المستخدمين، المنشورات، والرسائل.

| المفتاح (Key) | القيمة (Value) | الوصف |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgres://postgres.[REF]:[PASS]@aws-0-pooler.supabase.com:6543/postgres?pgbouncer=true` | رابط الاتصال الأساسي (Transaction Pooler) |
| `DIRECT_URL` | `postgres://postgres.[REF]:[PASS]@db.[REF].supabase.co:5432/postgres` | رابط الاتصال المباشر (Direct Connection) لعمليات Prisma |

## 2. إعدادات المصادقة والأمان (NextAuth & Security)
هذه المتغيرات مسؤولة عن تشفير الجلسات وحماية الموقع من الهجمات.

| المفتاح (Key) | القيمة (Value) | الوصف |
| :--- | :--- | :--- |
| `NEXTAUTH_SECRET` | *(رمز عشوائي طويل)* | مفتاح تشفير الجلسات. يمكنك توليده عبر موقع مثل [Generate Secret](https://generate-secret.vercel.app/32) |
| `NEXTAUTH_URL` | `https://arabgram.vercel.app` | الرابط الفعلي لمشروعك بعد نشره على Vercel |
| `CSRF_SECRET` | *(رمز عشوائي طويل)* | مفتاح تشفير لحماية النماذج من هجمات CSRF |

## 3. إعدادات الاتصال الفوري (Supabase Realtime)
هذه المتغيرات ضرورية لعمل الدردشة الفورية (Real-time Chat) وإشارات المكالمات (WebRTC Signaling).

| المفتاح (Key) | القيمة (Value) | الوصف |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[REF].supabase.co` | رابط مشروع Supabase الخاص بك (من إعدادات API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(مفتاح طويل يبدأ بـ eyJ)* | مفتاح الوصول العام (Anon Key) من إعدادات API في Supabase |

## 4. إعدادات الإشعارات الحقيقية (Web Push Notifications)
هذه المتغيرات مسؤولة عن إرسال الإشعارات لأجهزة المستخدمين (VAPID Keys).

| المفتاح (Key) | القيمة (Value) | الوصف |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | `BLPCq34oPaFEH7cHqJW3obW2hIUq7ZaaTaLy7dl_89h3mfpsCb6H2PxfPxS4fOyDSwowA7UyWEFeKGnWtUT6US0` | المفتاح العام للإشعارات (ثابت) |
| `VAPID_PRIVATE_KEY` | `tYz9PO9aJ1ZGoz5YJbk4MbeTJlokL0W7KySjLibgprc` | المفتاح الخاص للإشعارات (ثابت وسري) |
| `VAPID_SUBJECT` | `mailto:support@arabgram.com` | بريد الدعم الفني الخاص بالإشعارات |

## 5. إعدادات البريد الإلكتروني (Nodemailer)
هذه المتغيرات ضرورية لإرسال رموز التحقق (6 أرقام) عند تسجيل حساب جديد.

| المفتاح (Key) | القيمة (Value) | الوصف |
| :--- | :--- | :--- |
| `EMAIL_HOST` | `smtp.gmail.com` | خادم البريد (افتراضي لـ Gmail) |
| `EMAIL_PORT` | `587` | منفذ البريد (افتراضي) |
| `EMAIL_SECURE` | `false` | إعداد الأمان (افتراضي لـ 587) |
| `EMAIL_USER` | `your-email@gmail.com` | بريدك الإلكتروني الشخصي |
| `EMAIL_PASSWORD` | `xxxx xxxx xxxx xxxx` | كلمة مرور التطبيق (App Password) من إعدادات أمان Google |
| `EMAIL_FROM` | `ArabGram <noreply@arabgram.com>` | الاسم الذي سيظهر للمستلم |

---

**المؤلف:** Manus AI
**التاريخ:** 21 أبريل 2026
