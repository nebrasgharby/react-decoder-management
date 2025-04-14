// src/utils/prismaClient.js
const { PrismaClient } = require('@prisma/client');

// Initialisation d'une instance PrismaClient pour interagir avec la DB
const prisma = new PrismaClient();

module.exports = prisma;
