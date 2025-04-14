const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prismaClient');

exports.login = async (req, res) => {
  const { email, motDePasse } = req.body;
  
  try {
    // Validate email format
    

    const user = await prisma.utilisateur.findUnique({ where: { email } });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        errorType: "email",
        message: "Email incorrect" 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        errorType: "password",
        message: "Mot de passe incorrect" 
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        nom: user.nom, 
        role: user.role 
      } 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};