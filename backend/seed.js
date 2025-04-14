const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // ✅ Créer un utilisateur ADMIN
  const admin = await prisma.utilisateur.create({
    data: {
      nom: "Admin",
      email: "admin@decodeur.com",
      motDePasse: await bcrypt.hash("admin123", 10),
      role: "ADMIN"
    }
  });

  // ✅ Créer un utilisateur CLIENT
  const client = await prisma.utilisateur.create({
    data: {
      nom: "Client 1",
      email: "client1@decodeur.com",
      motDePasse: await bcrypt.hash("client123", 10),
      role: "CLIENT"
    }
  });

  // ✅ Créer 12 décodeurs sans client assigné (INACTIF)
  for (let i = 1; i <= 12; i++) {
    await prisma.decodeur.create({
      data: {
        adresseIp: `127.0.10.${i}`,
        etat: "INACTIF",
        chaines: [],
        model: `DEC-${i.toString().padStart(3, '0')}`
      }
    });
  }

  console.log("✅ Données initiales créées avec succès.");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors de la création des données :", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
