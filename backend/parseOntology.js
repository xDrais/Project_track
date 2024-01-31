import fs from 'fs';
import { Parser } from 'n3';

// Since dynamic imports are not supported in CommonJS, you might need to directly require the module
import rdfDataModel from '@rdfjs/data-model';

// File path to your Turtle file
const filePath = './garbage_classification.ttl';

// Read the Turtle file
fs.readFile(filePath, 'utf8', (err, turtleContent) => {
    if (err) {
        console.error('Error reading the Turtle file:', err);
        return;
    }

    // Extract the namedNode, literal, and defaultGraph from rdfDataModel
    const { namedNode, literal, defaultGraph } = rdfDataModel;

    // Parse the Turtle content
    const parser = new Parser();
    parser.parse(turtleContent, (error, quad, prefixes) => {
        if (error) {
            console.error('Error parsing the Turtle content:', error);
        } else if (quad) {
            console.log(quad.subject.value, quad.predicate.value, quad.object.value, quad.graph.value);
        } else {
            console.log('Prefixes:', prefixes);
        }
    });
});
