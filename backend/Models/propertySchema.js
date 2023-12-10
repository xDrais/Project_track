const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  label: String,
  comment: String,
  domain: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
  range: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }
});

const Property = mongoose.model('Property', propertySchema);
