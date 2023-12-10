const classSchema = new mongoose.Schema({
    label: String,
    comment: String,
    subClassOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }
  });
  
  const Class = mongoose.model('Class', classSchema);
  