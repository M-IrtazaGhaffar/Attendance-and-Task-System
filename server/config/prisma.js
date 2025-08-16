// prisma/prismaClient.js (or wherever you place it)

import { PrismaClient } from '../generated/prisma/index.js'; // path adjusted to match your output

const prisma = new PrismaClient();

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma };
