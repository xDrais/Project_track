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
const http = require("http")
var xss = require("xss")
const propertyRoutes = require('./routes/propertyRoutes');
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



app.get('/api/query', async (req, res) => {
  const query = 'SELECT * WHERE {?s ?p ?o} LIMIT 10'; 
  const results = await executeSparqlQuery(query);
  if (results) {
    res.json(results);
  } else {
    res.status(500).send('Error executing query');
  }
});

app.get('/api/getObject', async (req, res) => {
  const query = ' select distinct ?subject ?predicate ?object where {?subject ?predicate ?object.filter(contains(?object, "ScreensAndTVSAndMonitoris"@en)).}'; 
  const results = await executeSparqlQuery(query);
  if (results) {
    res.json(results);
  } else {
    res.status(500).send('Error executing query');
  }
});

app.get('/api/getClassbyLabel', async (req, res) => {
  const query = 'PREFIX owl: <http://www.w3.org/2002/07/owl#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT DISTINCT ?class ?label WHERE {?class a owl:Class. OPTIONAL { ?class rdfs:label ?label}filter(contains(?label, "ScreensAndTVSAnd")).}'; 
  const results = await executeSparqlQuery(query);
  if (results) {
    res.json(results);
  } else {
    res.status(500).send('Error executing query');
  }
});


// npm run dev!
server.listen(port , ()=> console.log(`SERVER CONNECTED ${port}`))