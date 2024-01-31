const fs = require('fs');

async function parseTurtle(filePath) {
  try {
    const turtleContent = fs.readFileSync(filePath, 'utf8');

    // Dynamic imports for ES modules
    const rdf = await import('rdf-ext');
    const N3 = await import('@rdfjs/parser-n3');
    const parser = new N3.default();

    // Use the imported rdf-ext to create a dataset
    const quadStream = rdf.dataset();

    // Import the parser stream into the dataset
    await quadStream.import(parser.import(rdf.toStream(turtleContent)));

    // Iterate through quads and log them
    quadStream.forEach(quad => {
      console.log(`Subject: ${quad.subject.value}`);
      console.log(`Predicate: ${quad.predicate.value}`);
      console.log(`Object: ${quad.object.value}`);
      console.log('---');
    });

    console.log('Turtle file has been parsed successfully.');
  } catch (error) {
    console.error('Error parsing Turtle file:', error);
  }
}

parseTurtle('./garbage_classification.ttl');
