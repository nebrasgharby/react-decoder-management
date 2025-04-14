const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/decodeurs', require('./routes/decodeurs'));
app.use('/api/operations', require('./routes/operations'));


// Test DB Connection
prisma.$connect()
  .then(() => console.log('Connecté à PostgreSQL avec Prisma'))
  .catch(err => console.error('Erreur de connexion à la DB:', err));

module.exports = app;