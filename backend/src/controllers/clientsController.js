
exports.getAllClients = async (req, res) => {
  const users = await prisma.utilisateur.findMany({
    select: { id: true, nom: true, email: true, role: true, decodeurs: true },
    orderBy: { nom: 'asc' }
  });
  res.json(users);
};

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

exports.createClient = async (req, res) => {
  const { nom, email, motDePasse, role } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const newUser = await prisma.utilisateur.create({
      data: {
        nom,
        email,
        motDePasse: hashedPassword,
        role: role || 'CLIENT'
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erreur lors de la création du client :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


exports.deleteClient = async (req, res) => {
  await prisma.utilisateur.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: "Client supprimé" });
};
