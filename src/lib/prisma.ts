import { PrismaClient } from '@prisma/client';

//creating a single client instance so we can reuse it throughout the application
declare global{
    var prisma: PrismaClient
}

export const prisma = globalThis.prisma || new PrismaClient({
    log: ['query'], //this will help in debugging so we can see what query prisma is running exactly
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;