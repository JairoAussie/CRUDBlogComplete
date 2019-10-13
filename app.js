const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const postRouter = require('./routes/posts_routes');
const authRouter = require("./routes/auth_routes");
const userRouter = require("./routes/user_routes");


const port = process.env.PORT || 3000;
const app = express();
const uri = "mongodb+srv://jairo:abcd1234@cluster0-b2f3i.mongodb.net/blog_app?retryWrites=true&w=majority";

//const dbConn = process.env.MONGODB_URI || uri
const dbConn = uri
mongoose.connect(
	dbConn,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	},
	err => {
		if (err) {
			console.log("Error connecting to database", err)
		} else {
			console.log("Connected to database!")
			console.log(process.env.PORT)
		}
	}
)

app.use(
	session({
		// resave and saveUninitialized set to false for deprecation warnings
		secret: "Express is awesome",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1800000
		},
		store: new MongoStore({
			mongooseConnection: mongoose.connection
		})
	})
)

app.use(cors());
app.use(bodyParser.json());

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    console.log('get on /');
    console.log('req.session', req.session)
    res.send('got your request');
})

app.use('/posts', postRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Blog express app listening on port ${port}`);
});