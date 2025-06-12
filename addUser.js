const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function addUser() {
    try {
        const hashedPassword = await bcrypt.hash('12345', 10);
        const user = await prisma.user.create({
            data: {
                email: 'admin@admin.com',
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        console.log('User created:', user);
    } catch (error) {
        console.error('Error creating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

addUser();