const mongoose = require('mongoose');

const wasteBinSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  image: String, // URL to the image of the waste bin
  type: {
    type: String,
    enum: ['recycling', 'general waste', 'compost', 'hazardous'], // Example bin types
    required: true
  },
});

// Apply the 2dsphere index to the 'location' field for supporting geospatial queries
wasteBinSchema.index({ location: '2dsphere' });

const WasteBin = mongoose.model('WasteBin', wasteBinSchema);

module.exports = WasteBin;
