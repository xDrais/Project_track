const express =  require('express')
const env = require('dotenv').config()
const port = process.env.port 
const mongodb = require ('./Config/database.js')
const morgan = require('morgan')
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport')
const passportSetUp=require('./passport.js')
const authRoute = require('./routes/auth.js')

const image = require('./routes/image.js')
const wasteBinSchema = require('./Models/wasteBinSchema.js')

const http = require("http")
var xss = require("xss")
const propertyRoutes = require('./routes/propertyRoutes');
const wastebinsRoutes = require('./routes/binsRoutes.js');
const statementRoutes = require('./routes/statementRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const executeSparqlQuery = require('./Controllers/executeSparqlQuery.js');
//connect database
mongodb() 

const app =express()
var server = http.createServer(app)
var io = require('socket.io')(server, {
	cors: {
	  origin: "*",
	  methods: ["GET", "POST"]
	}
  })


app.use(express.json())
app.use(
    cookieSession({ name: "session", keys: ["fares"], maxAge: 24 * 60 * 60 * 100 })
  );
  
  app.use(passport.initialize())
  app.use(passport.session()) 
  app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET ,POST ,PUT ,DELETE",
    credentials : true  ,
    exposedHeaders:"Authorization"
  }
  
  ));
  

app.use(morgan('dev'))

app.use(express.urlencoded({extended : false}))
app.use('/api/user',require('./routes/userRoute.js'));

app.use('/api/upload', require('./routes/uploadRoute'));
app.use("/auth",authRoute) ;

app.use("/image",image);

// Use routes
app.use('/api/properties', propertyRoutes);
app.use('/api/bins', wastebinsRoutes);



app.get('/api/query', async (req, res) => {
  const query = 'SELECT * WHERE {?s ?p ?o} LIMIT 10'; 
  const results = await executeSparqlQuery(query);
  if (results) {
    res.json(results);
  } else {
    res.status(500).send('Error executing query');
  }
});

//               ---------------------------
app.get('/api/getObjectbyname', async (req, res) => {
  // Retrieve classname from query parameters
  const classname = req.query.classname;

  // Sanitize and validate the classname
  // This is a basic example. Depending on your use case, you might need more robust sanitization
  const safeClassname = classname.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  // Ensure the classname is not empty after sanitization
  if (!safeClassname) {
    return res.status(400).send('Invalid input');
  }

  const query = `
    SELECT DISTINCT ?subject ?predicate ?object
    WHERE {
      ?subject ?predicate ?object
      FILTER(CONTAINS(?object, "${safeClassname}"))
    }`;

  try {
    const results = await executeSparqlQuery(query);
    if (results) {
      res.json(results);
    } else {
      res.status(204).send('No results found');
    }
  } catch (error) {
    console.error('Error executing SPARQL query:', error);
    res.status(500).send('Error executing query');
  }
});


//----------------------------------------------------


app.get('/api/getObject', async (req, res) => {

  const query = `
    SELECT DISTINCT ?subject ?predicate ?object
    WHERE {
      ?subject ?predicate ?object
    }`;

  try {
    const results = await executeSparqlQuery(query);
    if (results) {
      res.json(results);
    } else {
      res.status(204).send('No results found');
    }
  } catch (error) {
    console.error('Error executing SPARQL query:', error);
    res.status(500).send('Error executing query');
  }
});



//---------------------------------------------------

app.get('/api/getClassbyLabel', async (req, res) => {

  const classname = req.query.classname;


  const safeClassname = classname.replace(/[^a-zA-Z0-9]/g, "");

  const query = `
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
   PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT DISTINCT ?class ?label ?image
      WHERE {
        ?class a owl:Class.
  
        OPTIONAL { ?class  foaf:depiction  ?image }
        OPTIONAL { ?class rdfs:label ?label }
        FILTER(CONTAINS(LCASE(?label), "${safeClassname.toLowerCase()}"))
      }`;

  try {
    const results = await executeSparqlQuery(query);
    if (results) {
      res.json(results);
    } else {
      res.status(204).send('No results found');
    }}
     catch (error) {
    res.status(500).send('Error executing query');
  }
});







// getting the related informations to one enitity example fruits 


app.get('/api/getinstances', async (req, res) => {


  const query = `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  
  SELECT ?instance ?label ?imageURL
  WHERE {
    ?instance rdf:type <http://webprotege.stanford.edu/R7Q3isikghp43ZPWddExqsz> .
    OPTIONAL { ?instance rdfs:label ?label }
    OPTIONAL { ?instance <urn:webprotege:ontology:d6e1b789-6146-4270-b384-c9c4c9d15412#hasImageURL> ?imageURL }
  }
  `;

  try {
    const results = await executeSparqlQuery(query);
    if (results) {
      res.json(results);
    } else {
      res.status(204).send('No results found');
    }}
     catch (error) {
    res.status(500).send('Error executing query');
  }
});


////////////////////////////////////////////////









// Route to find the nearest waste bin
app.get('/api/bins/nearest', async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).send("Latitude and longitude query parameters are required.");
  }

  try {
    const nearestWasteBin = await wasteBinSchema.findOne({
      location: {
        $near: {
          $geometry: {
             type: "Point",
             coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: 10000 // Adjust this value based on your needs
        }
      }
    });
    if (nearestWasteBin) {
      res.json(nearestWasteBin);
    } else {
      res.status(404).send("No nearby waste bins found.");
    }
  } catch (error) {
    console.error("Error finding nearest waste bin:", error);
    res.status(500).send("An error occurred while finding the nearest waste bin.");
  }
});










// npm run dev!
server.listen(port , ()=> console.log(`SERVER CONNECTED ${port}`))