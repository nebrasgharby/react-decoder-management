const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = (role) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: "Non autorisé" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const utilisateur = await prisma.utilisateur.findUnique({ where: { id: decoded.id } });
      
      if (!utilisateur) return res.status(401).json({ message: "Non autorisé" });
      if (role && utilisateur.role !== role) return res.status(403).json({ message: "Accès refusé" });

      req.utilisateur = utilisateur;
      next();
    } catch (error) {
      res.status(401).json({ message: "Non autorisé" });
    }
  };
};