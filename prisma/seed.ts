// npx tsx prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing data
  await prisma.user.deleteMany({})

  // Create sample users
  const hashedPassword = await hash('password123')

  const user1 = await prisma.user.create({
    data: {
      email: 'user1@arabgram.com',
      name: 'User One',
      username: 'user_one',
      hashedPassword: hashedPassword,
      bio: 'Welcome to ArabGram!',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@arabgram.com',
      name: 'User Two',
      username: 'user_two',
      hashedPassword: hashedPassword,
      bio: 'Enjoying ArabGram',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  })

  console.log('Seed completed!')
  console.log('Created users:', { user1, user2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
