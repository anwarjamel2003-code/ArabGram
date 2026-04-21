# ArabGram - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Generate Secret
```bash
openssl rand -base64 32
```

### 2. Create `.env.local`
```bash
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
NEXTAUTH_SECRET="paste-your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Install & Run
```bash
npm install
npm run db:push
npm run dev
```

### 4. Visit
Open http://localhost:3000

---

## 📋 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma Client
npm run db:studio    # Open Prisma Studio GUI
npm run lint         # Run ESLint
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Random 32-byte secret |
| `NEXTAUTH_URL` | Yes | Your app URL (localhost:3000 for dev) |

---

## 🎯 Key Features

- 👤 User authentication (email/password)
- 📸 Create and browse posts
- ❤️ Like posts
- 💬 Comments
- 👥 Follow users
- 💬 Direct messages
- 📖 Stories
- 🔔 Notifications
- 🔍 Search

---

## 🗄️ Database Setup

If database doesn't exist yet:
```bash
npm run db:push
```

To open database GUI:
```bash
npm run db:studio
```

---

## 🐛 Troubleshooting

**Error: "No database connection"**
- Check DATABASE_URL is correct
- Verify database is running
- Run `npm run db:push`

**Error: "QueryClient not set"**
- Clear `.next` folder: `rm -r .next`
- Rebuild: `npm run build`

**Error: "Secret not set"**
- Generate new secret: `openssl rand -base64 32`
- Update NEXTAUTH_SECRET in `.env.local`

---

## 📚 Documentation

See `README.md` for complete documentation.

---

**Ready? Let's build! 🚀**
