require('dotenv').config(); // Tambahkan ini di baris 1
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// LOGIKA FALLBACK: 
// Jika di Vercel, pakai process.env.MONGODB_URI
// Jika di lokal dan .env belum kebaca, pakai string manual
const atlasURI = process.env.MONGODB_URI || "mongodb+srv://sd43bkl:5LU4jpvqSysAdMDo@sd.lfice1a.mongodb.net/kurir_db"; 

mongoose.connect(atlasURI)
  .then(() => console.log('✅ Atlas Terkoneksi'))
  .catch(err => console.error('❌ Koneksi Gagal:', err.message));

const LocationSchema = new mongoose.Schema({
  noRumah: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }
  }
}, { collection: 'mpas' });

const Location = mongoose.model('Location', LocationSchema);

app.get('/api/locations', async (req, res) => {
  try {
    const data = await Location.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/locations', async (req, res) => {
  const { noRumah, lat, lng } = req.body;
  try {
    const newLoc = new Location({
      noRumah,
      location: { type: 'Point', coordinates: [lng, lat] }
    });
    await newLoc.save();
    res.status(201).json(newLoc);
  } catch (err) { res.status(400).json(err); }
});

app.delete('/api/locations/:id', async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: "Terhapus" });
  } catch (err) { res.status(500).json(err); }
});

// Hanya untuk jalan di lokal (Vercel tidak butuh ini, tapi tidak apa-apa ada di sini)
if (process.env.NODE_ENV !== 'production') {
    const PORT = 5000;
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Lokal jalan di port ${PORT}`));
}

module.exports = app;