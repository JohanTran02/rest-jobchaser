import { prisma } from "../src/db/connect"

async function main() {
    await prisma.jobs.deleteMany()
    await prisma.user.deleteMany()
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })