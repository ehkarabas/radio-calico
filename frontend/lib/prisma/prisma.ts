import { PrismaClient } from "@prisma/client"

// BACKUP - Complex pattern that was causing issues:
// import { withAccelerate } from "@prisma/extension-accelerate"
// const prismaClientSingleton = () => {
//   return new PrismaClient().$extends(withAccelerate())
// }
// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;
// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

// OFFICIAL NEXTAUTH.JS + PRISMA PATTERN (from docs)
const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

// BACKUP - Basic Prisma client without performance optimization:
// const prisma = globalForPrisma.prisma ?? new PrismaClient()
// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// OPTIMIZED - Prisma client with connection pooling and performance settings
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  errorFormat: 'minimal',
})

// Modern Prisma extension with query hooks for AuthRateLimit cleanup
const extendedPrisma = prisma.$extends({
  name: 'authRateLimitCleanup',
  query: {
    user: {
      // User soft delete (update ile deletedAt set ediliyor)
      async update({ args, query }: any) {
        const result = await query(args)
        
        // Eğer deletedAt field'ı set edildiyse (soft delete)
        if (args.data?.deletedAt) {
          const userEmail = result.email
          if (userEmail) {
            // email_User.email ve email_activation_User.email pattern'larındaki identifier'ları hard delete et
            const emailIdentifier = `email_${userEmail}`
            const activationIdentifier = `email_activation_${userEmail}`
            
            await prisma.authRateLimit.deleteMany({
              where: {
                OR: [
                  { identifier: emailIdentifier },
                  { identifier: activationIdentifier }
                ]
              }
            })
            console.log(`✅ AuthRateLimit cleanup: Removed entries for identifiers: ${emailIdentifier}, ${activationIdentifier}`)
          }
        }
        
        return result
      },
      
      // User hard delete (delete action)
      async delete({ args, query }: any) {
        // Önce user'ı getir (email için)
        const user = await prisma.user.findUnique({
          where: args.where,
          select: { email: true }
        })
        
        const result = await query(args)
        
        // User delete edildikten sonra AuthRateLimit cleanup
        if (user?.email) {
          const emailIdentifier = `email_${user.email}`
          const activationIdentifier = `email_activation_${user.email}`
          
          await prisma.authRateLimit.deleteMany({
            where: {
              OR: [
                { identifier: emailIdentifier },
                { identifier: activationIdentifier }
              ]
            }
          })
          console.log(`✅ AuthRateLimit cleanup: Removed entries for identifiers: ${emailIdentifier}, ${activationIdentifier}`)
        }
        
        return result
      },
      
      // User updateMany ile soft delete (toplu işlem)
      async updateMany({ args, query }: any) {
        // Önce etkilenecek user'ları getir
        const users = await prisma.user.findMany({
          where: args.where,
          select: { email: true }
        })
        
        const result = await query(args)
        
        // Eğer deletedAt set edildiyse
        if (args.data?.deletedAt) {
          for (const user of users) {
            if (user.email) {
              const emailIdentifier = `email_${user.email}`
              const activationIdentifier = `email_activation_${user.email}`
              
              await prisma.authRateLimit.deleteMany({
                where: {
                  OR: [
                    { identifier: emailIdentifier },
                    { identifier: activationIdentifier }
                  ]
                }
              })
              console.log(`✅ AuthRateLimit cleanup: Removed entries for identifiers: ${emailIdentifier}, ${activationIdentifier}`)
            }
          }
        }
        
        return result
      },
      
      // User deleteMany (toplu hard delete)
      async deleteMany({ args, query }: any) {
        // Önce etkilenecek user'ları getir
        const users = await prisma.user.findMany({
          where: args.where,
          select: { email: true }
        })
        
        const result = await query(args)
        
        // Cleanup
        for (const user of users) {
          if (user.email) {
            const emailIdentifier = `email_${user.email}`
            const activationIdentifier = `email_activation_${user.email}`
            
            await prisma.authRateLimit.deleteMany({
              where: {
                OR: [
                  { identifier: emailIdentifier },
                  { identifier: activationIdentifier }
                ]
              }
            })
            console.log(`✅ AuthRateLimit cleanup: Removed entries for identifiers: ${emailIdentifier}, ${activationIdentifier}`)
          }
        }
        
        return result
      }
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = extendedPrisma

export default extendedPrisma