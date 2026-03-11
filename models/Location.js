const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  noRumah: { type: String, required: true },
  catatan: String,
  // Format GeoJSON wajib seperti ini untuk fitur Map yang canggih
  location: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude] -> Ingat: MongoDB pakai urutan ini!
      required: true
    }
  },
  createdAt: { type: Date, default: Date.now }
});

// Penting: Buat index 2dsphere agar bisa pencarian jarak (geospatial)
LocationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Location', LocationSchema);