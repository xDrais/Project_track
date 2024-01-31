const mongoose = require('mongoose');

const wasteBinSchema = new mongoose.Schema({
  name: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere' // Create a geospatial index
    }
  },
  image: String, // URL to the image of the waste bin
  // Add other relevant fields like 'type' of bin, 'capacity', etc.
});

const WasteBin = mongoose.model('WasteBin', wasteBinSchema);

module.exports = WasteBin;
