const axios = require('axios');

async function executeSparqlQuery(query) {
  try {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:3030/Waste_Ontology/query',
      data: `query=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error executing SPARQL query: ", error);
    return null;
  }
}

module.exports = executeSparqlQuery