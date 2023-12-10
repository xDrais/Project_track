const statementSchema = new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    predicate: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    object: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }
  });
  
  const Statement = mongoose.model('Statement', statementSchema);
  