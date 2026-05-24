process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import "dotenv/config";
import { db } from "./src/db/index.js";
import { spots } from "./src/db/schemas/spots.schema.js";

async function seed() {
  console.log("🗑️  Menghapus data spots lama...");
  await db.delete(spots);

  console.log("🌱 Memasukkan data spots dari CSV PM...");

  await db.insert(spots).values([
    {
      name: "Kopi Kenangan Fatmawati",
      description: "Kopi Kenangan adalah cafe yang menawarkan berbagai minuman kopi...",
      facilities: "Cafe",
      spotType: "indoor",
      crowdedness: "high",
      atmosphere: "busy",
      visitType: "group",
      mood: "focused",
      photoUrl: "/bg-cafe.jpeg" // <- Tambahan Gambar
    },
    {
      name: "Lima Mangkok Bistro",
      description: "Bistro yang nyaman dengan desain interior estetik...",
      facilities: "Cafe",
      spotType: "indoor",
      crowdedness: "low",
      atmosphere: "quiet",
      visitType: "alone",
      mood: "relaxed",
      photoUrl: "/bg-cafe.jpeg" // <- Tambahan Gambar
    },
    {
      name: "Foreword Library",
      description: "Perpustakaan privat dengan suasana homey dan estetik...",
      facilities: "Perpustakaan",
      spotType: "indoor",
      crowdedness: "low",
      atmosphere: "quiet",
      visitType: "alone",
      mood: "focused",
      photoUrl: "/foreword.png" // <- Tambahan Gambar Asli
    },
    {
      name: "Erasmus Huis",
      description: "Perpustakaan pusat kebudayaan Belanda dengan desain interior minimalis...",
      facilities: "Perpustakaan",
      spotType: "indoor",
      crowdedness: "low",
      atmosphere: "quiet",
      visitType: "alone",
      mood: "focused",
      photoUrl: "/erasmus.png" // <- Tambahan Gambar Asli
    },
    {
      name: "Urban Forest Cipete",
      description: "Area terbuka hijau di tengah kota yang asri...",
      facilities: "Taman",
      spotType: "outdoor",
      crowdedness: "high",
      atmosphere: "busy",
      visitType: "group",
      mood: "relaxed",
      photoUrl: "/urbanforest.png" // <- Tambahan Gambar Asli
    },
    {
      name: "WŌRK-UNUSUAL JAKARTA",
      description: "Kafe minimalis dengan area open space yang asri...",
      facilities: "Cafe",
      spotType: "indoor",
      crowdedness: "low",
      atmosphere: "quiet",
      visitType: "alone",
      mood: "focused",
      photoUrl: "/bg-library.webp" 
    },
    {
      name: "Tebet Eco Park",
      description: "Taman modern dengan jembatan ikonik yang menghubungkan dua area hijau...",
      facilities: "Taman",
      spotType: "outdoor",
      crowdedness: "low",
      atmosphere: "quiet",
      visitType: "alone",
      mood: "relaxed",
      photoUrl: "/tebet.png" // <- Tambahan Gambar Asli
    },
    {
      name: "TierSpace",
      description: "Coworking space yang didesain agar terasa seperti rumah sendiri...",
      facilities: "Coworking Space",
      spotType: "indoor",
      crowdedness: "low",
      atmosphere: "quiet",
      visitType: "group",
      mood: "focused",
      photoUrl: "/tierspace.png" // <- Tambahan Gambar Asli
    },
    {
      name: "Cinere Garden Food Street",
      description: "Pusat kuliner outdoor yang asri dengan banyak pilihan jajanan...",
      facilities: "Pusat Kuliner, Food Court, Area Terbuka",
      spotType: "outdoor",
      crowdedness: "low",
      atmosphere: "quiet",
      visitType: "group",
      mood: "relaxed",
      photoUrl: "/cinere.jpg" // <- Tambahan Gambar Asli
    },
    {
      name: "Perpustakaan Freedom",
      description: "Menawarkan rak buku tinggi yang ikonik dan area duduk yang sangat luas...",
      facilities: "Perpustakaan",
      spotType: "indoor",
      crowdedness: "low",
      atmosphere: "quiet",
      visitType: "alone",
      mood: "focused",
      photoUrl: "/freedomlib.jpg" // <- Tambahan Gambar Asli
    },
    {
      name: "Galeri Salihara",
      description: "Galeri seni kontemporer dengan desain arsitektur yang unik dan modern...",
      facilities: "Galeri Seni, Pusat Kebudayaan",
      spotType: "indoor",
      crowdedness: "low",
      atmosphere: "quiet",
      visitType: "alone",
      mood: "focused",
      photoUrl: "/salihara.jpg" // <- Tambahan Gambar Asli
    },
    {
      name: "GoWork Fatmawati",
      description: "Ruang kerja komersial dengan fasilitas premium...",
      facilities: "Coworking Space",
      spotType: "indoor",
      crowdedness: "low",
      atmosphere: "quiet",
      visitType: "group",
      mood: "focused",
      photoUrl: "/gowork.png" // <- Tambahan Gambar Asli
    },
    {
      name: "Dia.Lo.Gue Artspace",
      description: "Galeri seni kontemporer dengan desain interior minimalis serba putih...",
      facilities: "Galeri Seni, Pusat Kebudayaan, Kafe",
      spotType: "indoor",
      crowdedness: "low",
      atmosphere: "quiet",
      visitType: "alone",
      mood: "focused",
      photoUrl: "/dialogue.png" // <- Tambahan Gambar Asli
    },
    {
      name: "Museum Layang-layang Indonesia",
      description: "Museum unik yang menyimpan koleksi ribuan layang-layang dari berbagai penjuru...",
      facilities: "Museum, Edukasi",
      spotType: "indoor",
      crowdedness: "low",
      atmosphere: "quiet",
      visitType: "group",
      mood: "relaxed",
      photoUrl: "/museumlayang.png" // <- Tambahan Gambar Asli
    },
    {
      name: "Taman Cempaka",
      description: "Area terbuka hijau di tengah kota yang asri. Cocok untuk kamu yang bosan...",
      facilities: "Taman",
      spotType: "outdoor",
      crowdedness: "low",
      atmosphere: "quiet",
      visitType: "alone",
      mood: "relaxed",
      photoUrl: "/cempaka.png" // <- Tambahan Gambar Asli
    }
  ]);

  console.log("✅ Seeding selesai! 15 spots berhasil dimasukkan.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error saat seeding:", err);
  process.exit(1);
});
