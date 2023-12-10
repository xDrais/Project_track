const Property = require('../Models/propertySchema');



// Get all properties

exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Create a new property
exports.createProperty = async (req, res) => {
    const property = new Property({
        label: req.body.label,
        comment: req.body.comment,
        domain: req.body.domain,
        range: req.body.range
    });

    try {
        const newProperty = await property.save();
        res.status(201).json(newProperty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};