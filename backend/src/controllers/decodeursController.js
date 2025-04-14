const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

// In decodeursController.js
const SIMULATOR_URL = 'https://wflageol-uqtr.net/decoder';
const DECODER_IP_RANGE = Array.from({length: 12}, (_, i) => `127.0.10.${i+1}`);
const CODE_PERMANENT = 'SOLO87370400'; // Replace with your actual permanent code
// Add this to decodeursController.js
async function callDecoderSimulator(ipAddress, action) {
  try {
    const { data } = await axios.post(SIMULATOR_URL, {
      id: CODE_PERMANENT,
      address: ipAddress,
      action: action
    });
    
    if (data.response !== 'OK') {
      throw new Error(data.message || `Simulator returned error for ${action} action`);
    }
    
    return data;
  } catch (error) {
    console.error(`Simulator error (${action}):`, error.message);
    throw error;
  }
}

// Helper function to check access rights
async function checkAccess(user, decodeurId) {
  if (user.role === 'ADMIN') return true;
  const decodeur = await prisma.decodeur.findUnique({ 
    where: { id: decodeurId },
    select: { clientId: true }
  });
  return decodeur && decodeur.clientId === user.id;
}

// Get all decoders (admin gets all, client gets theirs)
exports.getAllDecodeurs = async (req, res) => {
  try {
    const decodeurs = await prisma.decodeur.findMany({
      where: req.user.role === 'ADMIN' ? {} : { clientId: req.user.id },
      include: { 
        client: { select: { id: true, nom: true } },
        operations: { take: 5, orderBy: { createdAt: 'desc' } }
      },
    });
    res.json(decodeurs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get decoder details
exports.getDecodeurById = async (req, res) => {
  try {
    const decodeur = await prisma.decodeur.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { 
        client: { select: { id: true, nom: true } },
        operations: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!decodeur) {
      return res.status(404).json({ message: 'Décodeur introuvable' });
    }

    if (!(await checkAccess(req.user, decodeur.id))) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json(decodeur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get decoder status from external API
exports.getDecodeurStatus = async (req, res) => {
  try {
    const decodeur = await prisma.decodeur.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!decodeur) {
      return res.status(404).json({ message: 'Décodeur introuvable' });
    }

    if (!DECODER_IP_RANGE.includes(decodeur.adresseIp)) {
      return res.status(400).json({ message: 'Adresse IP du décodeur invalide' });
    }

    const simulatorData = await callDecoderSimulator(decodeur.adresseIp, 'info');
    
    // Update decoder state in database
    const updatedDecodeur = await prisma.decodeur.update({
      where: { id: decodeur.id },
      data: { 
        etat: simulatorData.state === 'Active' ? 'ACTIF' : 'INACTIF',
        lastRestart: simulatorData.lastRestart ? new Date(simulatorData.lastRestart) : undefined,
        lastReinit: simulatorData.lastReinit ? new Date(simulatorData.lastReinit) : undefined
      },
      include: { client: true }
    });

    res.json({
      ...simulatorData,
      decodeur: updatedDecodeur
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du statut',
      error: error.message 
    });
  }
};

// Assign decoder to client
exports.assignDecodeur = async (req, res) => {
  const { clientId } = req.body;
  const decodeurId = parseInt(req.params.id);

  try {
    if (!(await checkAccess(req.user, decodeurId))) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const decodeur = await prisma.decodeur.update({
      where: { id: decodeurId },
      data: { clientId },
      include: { client: true }
    });

    await prisma.operation.create({
      data: { 
        type: 'ASSIGNATION', 
        decodeurId,
        utilisateurId: req.user.id 
      }
    });

    res.json(decodeur);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Unassign decoder
exports.unassignDecodeur = async (req, res) => {
  const decodeurId = parseInt(req.params.id);

  try {
    if (!(await checkAccess(req.user, decodeurId))) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const decodeur = await prisma.decodeur.update({
      where: { id: decodeurId },
      data: { clientId: null }
    });

    await prisma.operation.create({
      data: { 
        type: 'DESASSIGNATION', 
        decodeurId,
        utilisateurId: req.user.id 
      }
    });

    res.json(decodeur);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Restart decoder
exports.restartDecodeur = async (req, res) => {
  try {
    const decodeur = await prisma.decodeur.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    // Validate decoder exists and IP is valid
    if (!decodeur) return res.status(404).json({ message: 'Décodeur introuvable' });
    if (!DECODER_IP_RANGE.includes(decodeur.adresseIp)) {
      return res.status(400).json({ message: 'Adresse IP du décodeur invalide' });
    }

    // Call simulator
    const simulatorData = await callDecoderSimulator(decodeur.adresseIp, 'reset');
    
    // Log operation and update decoder
    await Promise.all([
      prisma.operation.create({
        data: { 
          type: 'REDEMARRAGE', 
          decodeurId: decodeur.id,
          utilisateurId: req.user.id,
          metadata: JSON.stringify({
            ip: decodeur.adresseIp,
            duration: '10-30 seconds'
          })
        }
      }),
      prisma.decodeur.update({
        where: { id: decodeur.id },
        data: { 
          etat: 'ACTIF',
          lastRestart: new Date() 
        }
      })
    ]);

    res.json({
      message: 'Décodeur en cours de redémarrage (10-30 secondes)',
      ...simulatorData
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors du redémarrage',
      error: error.message 
    });
  }
};
// Add channel to decoder
// In decodeursController.js
exports.addChannel = async (req, res) => {
  try {
    const { chaine } = req.body; // Must match what frontend sends
    if (!chaine) {
      return res.status(400).json({ error: "Channel name is required" });
    }

    const decoder = await prisma.decodeur.update({
      where: { id: parseInt(req.params.id) },
      data: { 
        chaines: { push: chaine } 
      }
    });

    res.json(decoder);
  } catch (error) {
    console.error('Add channel error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Remove channel from decoder
// Change the parameter name from 'channel' to 'chaine' to match the route
exports.removeChannel = async (req, res) => {
  const decodeurId = parseInt(req.params.id);
  const { chaine } = req.params; // Changed from 'channel' to 'chaine'

  try {
    const decodeur = await prisma.decodeur.findUnique({ 
      where: { id: decodeurId }
    });

    if (!decodeur) {
      return res.status(404).json({ message: 'Décodeur introuvable' });
    }

    if (!(await checkAccess(req.user, decodeurId))) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const updatedChaines = decodeur.chaines.filter(c => c !== chaine);

    const updatedDecodeur = await prisma.decodeur.update({
      where: { id: decodeurId },
      data: { chaines: updatedChaines }
    });

    await prisma.operation.create({
      data: { 
        type: 'RETRAIT_CHAINE', 
        decodeurId: decodeurId,
        utilisateurId: req.user.id
        // Remove metadata if not in your Prisma schema
      }
    });

    res.json(updatedDecodeur);
  } catch (error) {
    console.error('Remove channel error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Shutdown decoder
exports.shutdownDecoder = async (req, res) => {
  const decodeurId = parseInt(req.params.id);

  try {
    const decodeur = await prisma.decodeur.findUnique({ 
      where: { id: decodeurId }
    });

    if (!decodeur) {
      return res.status(404).json({ message: 'Décodeur introuvable' });
    }

    if (!(await checkAccess(req.user, decodeurId))) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { data } = await axios.post(SIMULATOR_URL, {
      id: CODE_PERMANENT,
      address: decodeur.adresseIp,
      action: 'shutdown',
    });

    await prisma.operation.create({
      data: { 
        type: 'EXTINCTION', 
        decodeurId,
        utilisateurId: req.user.id 
      }
    });

    // Update decoder state
    await prisma.decodeur.update({
      where: { id: decodeurId },
      data: { etat: 'INACTIF' }
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reinitialize decoder password
exports.reinitDecoder = async (req, res) => {
  const decodeurId = parseInt(req.params.id);

  try {
    const decodeur = await prisma.decodeur.findUnique({ 
      where: { id: decodeurId }
    });

    if (!decodeur) {
      return res.status(404).json({ message: 'Décodeur introuvable' });
    }

    if (!(await checkAccess(req.user, decodeurId))) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { data } = await axios.post(SIMULATOR_URL, {
      id: CODE_PERMANENT,
      address: decodeur.adresseIp,
      action: 'reinit',
    });

    await prisma.operation.create({
      data: { 
        type: 'REINITIALISATION', 
        decodeurId,
        utilisateurId: req.user.id 
      }
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete decoder (admin only)
exports.deleteDecoder = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    await prisma.decodeur.delete({ 
      where: { id: parseInt(req.params.id) }
    });
    
    res.json({ message: 'Décodeur supprimé' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add to decodeursController.js

// Get all decoder IPs available in the simulator
exports.getAvailableDecoderIps = async (req, res) => {
  res.json(DECODER_IP_RANGE);
};

// Get decoder list from simulator HTML page (scraping)
exports.getSimulatorDecoderList = async (req, res) => {
  try {
    const { data } = await axios.get(`https://wflageol-uqtr.net/list?id=${CODE_PERMANENT}`);
    // Parse HTML and extract decoder list
    // This is a simplified example - you may need proper HTML parsing
    const decoders = data.match(/127\.0\.10\.\d{1,2}/g) || [];
    res.json(decoders);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la liste',
      error: error.message 
    });
  }
};