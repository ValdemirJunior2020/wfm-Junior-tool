// server/src/services/prisma.js

let prisma = null;

export async function getPrisma() {
  const prismaEnabled = process.env.USE_PRISMA === "true";

  if (!prismaEnabled) {
    console.log("Prisma is disabled. Using Google Sheet / mock data mode.");
    return null;
  }

  if (prisma) {
    return prisma;
  }

  try {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient();
    return prisma;
  } catch (error) {
    console.warn("Prisma could not initialize. Falling back to mock/Google Sheet mode.");
    console.warn(error.message);
    return null;
  }
}

export default getPrisma;