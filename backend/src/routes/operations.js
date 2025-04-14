const express = require('express');
const router = express.Router();
const prisma = require('../utils/prismaClient');
const { authenticate, isAdmin } = require('../middlewares/auth');

// 📌 GET /api/operations/statistiques (dashboard admin)
router.get('/statistiques', authenticate, isAdmin, async (req, res) => {
  try {
    const totalOperations = await prisma.operation.count();

    const operationsParType = await prisma.operation.groupBy({
      by: ['type'],
      _count: { type: true }
    });

    const recentOperations = await prisma.operation.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        decodeur: {
          select: { numeroSerie: true, adresseIp: true }
        }
      }
    });

    res.json({ totalOperations, operationsParType, recentOperations });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques", error });
  }
});

// 📌 GET /api/operations/decodeur/:id (historique d’un décodeur)
router.get('/decodeur/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const operations = await prisma.operation.findMany({
      where: { decodeurId: id },
      orderBy: { date: 'desc' }
    });
    res.json(operations);
  } catch (error) {
    res.status(500).json({ message: "Erreur historique décodeur", error });
  }
});

// 📌 GET /api/operations/client/:id (historique client)
router.get('/client/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const operations = await prisma.operation.findMany({
      where: { decodeur: { clientId: id } },
      include: { decodeur: true },
      orderBy: { date: 'desc' }
    });
    res.json(operations);
  } catch (error) {
    res.status(500).json({ message: "Erreur historique client", error });
  }
});

// 📌 POST /api/operations (création manuelle si besoin)
router.post('/', authenticate, async (req, res) => {
  const { type, decodeurId } = req.body;
  try {
    const op = await prisma.operation.create({
      data: { type, decodeurId }
    });
    res.status(201).json(op);
  } catch (error) {
    res.status(400).json({ message: "Erreur création opération", error });
  }
});

module.exports = router;
