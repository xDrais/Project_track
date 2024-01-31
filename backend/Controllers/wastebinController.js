const WasteBin = require('../Models/wasteBinSchema');


exports.getAllBins = async (req, res) => {
  try {
      const wasteBins = await WasteBin.find();
      res.json(wasteBins);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};



// Create a new property
exports.createBin = async (req, res) => {
    try {
        const newWasteBin = new WasteBin(req.body);
        await newWasteBin.save();
        res.status(201).json(newWasteBin);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};













