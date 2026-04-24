# 🚀 دليل نقل جداول قاعدة البيانات من Neon إلى Supabase

يهدف هذا الدليل إلى توضيح الخطوات اللازمة لنقل جداول قاعدة البيانات الخاصة بمشروع ArabGram من خدمة Neon إلى Supabase. هذه العملية تتضمن تصدير البيانات من Neon ثم استيرادها إلى مشروعك الجديد في Supabase.

## المتطلبات الأساسية

قبل البدء بعملية النقل، تأكد من توفر ما يلي:

1.  **حساب Neon نشط:** مع صلاحية الوصول إلى قاعدة البيانات التي ترغب في نقلها.
2.  **مشروع Supabase جديد أو موجود:** يجب أن يكون لديك مشروع Supabase جاهز لاستقبال البيانات. يمكنك إنشاء مشروع جديد مجاني من [Supabase.com](https://supabase.com/).
3.  **أدوات PostgreSQL:** ستحتاج إلى أدوات سطر الأوامر `pg_dump` و `psql` المثبتة على جهازك. هذه الأدوات تأتي عادةً مع تثبيت PostgreSQL. إذا لم تكن مثبتة، يمكنك تثبيتها من [موقع PostgreSQL الرسمي](https://www.postgresql.org/download/).
4.  **اتصال بالإنترنت:** لضمان الوصول إلى كلتا الخدمتين.

## الخطوات

### الخطوة 1: الحصول على Connection String من Neon

1.  سجّل الدخول إلى لوحة تحكم [Neon](https://console.neon.tech/).
2.  اختر المشروع وقاعدة البيانات التي تحتوي على الجداول التي تريد نقلها.
3.  ابحث عن **Connection String** الخاص بقاعدة البيانات. عادةً ما يكون بهذا الشكل:
    `postgresql://[user]:[password]@[host]/[database]?sslmode=require`
4.  احتفظ بهذا الرابط، ستحتاجه في الخطوة التالية.

### الخطوة 2: تصدير البيانات من Neon باستخدام `pg_dump`

افتح نافذة Terminal (أو Command Prompt) وقم بتنفيذ الأمر التالي. استبدل `[YOUR_NEON_CONNECTION_STRING]` برابط الاتصال الذي حصلت عليه في الخطوة السابقة، و `arabgram_neon_dump.sql` بالاسم الذي تفضله لملف التصدير:

```bash
pg_dump -Fc --no-acl --no-owner -d "[YOUR_NEON_CONNECTION_STRING]" > arabgram_neon_dump.sql
```

**شرح الأمر:**
*   `pg_dump`: أداة PostgreSQL لتصدير قاعدة البيانات.
*   `-Fc`: يحدد تنسيق الإخراج المخصص، وهو مفيد للاستيراد لاحقاً.
*   `--no-acl`: يمنع تصدير قوائم التحكم في الوصول (ACLs)، حيث قد تختلف الصلاحيات بين Neon و Supabase.
*   `--no-owner`: يمنع تصدير معلومات المالك، لنفس السبب أعلاه.
*   `-d "[YOUR_NEON_CONNECTION_STRING]"`: يحدد قاعدة البيانات المصدر باستخدام رابط الاتصال.
*   `> arabgram_neon_dump.sql`: يحفظ الإخراج في ملف باسم `arabgram_neon_dump.sql`.

### الخطوة 3: إنشاء مشروع جديد في Supabase (إذا لم يكن لديك)

1.  سجّل الدخول إلى لوحة تحكم [Supabase](https://app.supabase.com/).
2.  اضغط على `New project`.
3.  اختر اسم المشروع، كلمة المرور، والمنطقة.
4.  انتظر حتى يتم إنشاء المشروع.

### الخطوة 4: الحصول على Connection String من Supabase

1.  بعد إنشاء مشروع Supabase، اذهب إلى `Project Settings` → `Database`.
2.  ابحث عن **Connection String** الخاص بقاعدة البيانات. سيكون بهذا الشكل:
    `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`
3.  احتفظ بهذا الرابط، ستحتاجه في الخطوة التالية.

### الخطوة 5: استيراد البيانات إلى Supabase باستخدام `psql`

الآن، استخدم الأمر `psql` لاستيراد البيانات من الملف الذي قمت بتصديره. استبدل `[YOUR_SUPABASE_CONNECTION_STRING]` برابط اتصال Supabase الذي حصلت عليه، و `arabgram_neon_dump.sql` بمسار واسم ملف التصدير:

```bash
psql "[YOUR_SUPABASE_CONNECTION_STRING]" < arabgram_neon_dump.sql
```

**شرح الأمر:**
*   `psql`: أداة PostgreSQL لتنفيذ استعلامات SQL وإدارة قواعد البيانات.
*   `"[YOUR_SUPABASE_CONNECTION_STRING]"`: يحدد قاعدة البيانات الوجهة باستخدام رابط الاتصال.
*   `< arabgram_neon_dump.sql`: يوجه محتوى ملف `arabgram_neon_dump.sql` كمدخل لأمر `psql`.

**ملاحظة هامة:** قد تحتاج إلى حذف الجداول الموجودة مسبقاً في Supabase (إذا كان المشروع ليس جديداً تماماً) قبل الاستيراد لتجنب تعارضات الأسماء أو البيانات. يمكنك القيام بذلك من SQL Editor في Supabase:

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### الخطوة 6: التحقق من نجاح النقل

1.  سجّل الدخول إلى لوحة تحكم Supabase.
2.  اذهب إلى `Table Editor`.
3.  يجب أن تشاهد الآن جميع الجداول التي قمت بنقلها من Neon مع بياناتها.
4.  يمكنك أيضاً تشغيل بعض استعلامات SQL البسيطة في `SQL Editor` للتأكد من أن البيانات موجودة وصحيحة (مثلاً: `SELECT * FROM users;`).

--- 

**المراجع:**

*   [PostgreSQL Documentation - pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
*   [PostgreSQL Documentation - psql](https://www.postgresql.org/docs/current/app-psql.html)
*   [Supabase Documentation - Migrating from other databases](https://supabase.com/docs/guides/database/migrating-to-supabase)
*   [Neon Documentation - Connect to your database](https://neon.tech/docs/connect/connecting-from-any-application)

**المؤلف:** Manus AI
**التاريخ:** 21 أبريل 2026
