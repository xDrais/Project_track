const resourceSchema = new mongoose.Schema({
    label: String,
    comment: String
  });
  
  const Resource = mongoose.model('Resource', resourceSchema);
  