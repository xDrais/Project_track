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
const orderRoutes = require ('./routes/orderRoute.js')
const chatRoute = require ('./routes/chatRoute.js');

const image = require('./routes/image.js')
const {graphqlHTTP} = require('express-graphql')
const Schema = require('./Schema/Schema')
const http = require("http")
var xss = require("xss")
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
app.use('/product',require('./routes/productRoute.js'));
app.use('/course',require('./routes/courseRoute.js'));
app.use('/api/upload', require('./routes/uploadRoute'));
app.use("/auth",authRoute) ;
app.use('/api/orders', orderRoutes);

app.use('/api/event', require('./routes/Event.js'));
app.use('/api/project', require('./routes/project.js'));
app.use("/image",image);
app.use('/chat', chatRoute)

app.get('/api/config/paypal' , (req ,res)=>res.send(process.env.PAYPAL_CLIENT_ID))



//



app.use('/graphql',
graphqlHTTP({
  schema:Schema,
  graphiql:true
}))

// npm run dev




// video chat
app.set('port', (port || 5000))
sanitizeString = (str) => {
	return xss(str)
}

connections = {}
messages = {}
timeOnline = {}

io.on('connection', (socket) => {

	socket.on('join-call', (path) => {
		if(connections[path] === undefined){
			connections[path] = []
		}
		connections[path].push(socket.id)

		timeOnline[socket.id] = new Date()

		for(let a = 0; a < connections[path].length; ++a){
			io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
		}

		if(messages[path] !== undefined){
			for(let a = 0; a < messages[path].length; ++a){
				io.to(socket.id).emit("chat-message", messages[path][a]['data'], 
					messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
			}
		}

		console.log(path, connections[path])
	})

	socket.on('signal', (toId, message) => {
		io.to(toId).emit('signal', socket.id, message)
	})

	socket.on('chat-message', (data, sender) => {
		data = sanitizeString(data)
		sender = sanitizeString(sender)

		var key
		var ok = false
		for (const [k, v] of Object.entries(connections)) {
			for(let a = 0; a < v.length; ++a){
				if(v[a] === socket.id){
					key = k
					ok = true
				}
			}
		}

		if(ok === true){
			if(messages[key] === undefined){
				messages[key] = []
			}
			messages[key].push({"sender": sender, "data": data, "socket-id-sender": socket.id})
			console.log("message", key, ":", sender, data)

			for(let a = 0; a < connections[key].length; ++a){
				io.to(connections[key][a]).emit("chat-message", data, sender, socket.id)
			}
		}
	})

	socket.on('disconnect', () => {
		var diffTime = Math.abs(timeOnline[socket.id] - new Date())
		var key
		for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
			for(let a = 0; a < v.length; ++a){
				if(v[a] === socket.id){
					key = k

					for(let a = 0; a < connections[key].length; ++a){
						io.to(connections[key][a]).emit("user-left", socket.id)
					}
			
					var index = connections[key].indexOf(socket.id)
					connections[key].splice(index, 1)

					console.log(key, socket.id, Math.ceil(diffTime / 1000))

					if(connections[key].length === 0){
						delete connections[key]
					}
				}
			}
		}
	})
})
// npm run dev!
server.listen(port , ()=> console.log(`SERVER CONNECTED ${port}`))