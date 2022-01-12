if (process.env.NODE_ENV!=="production") {
  require('dotenv').config();
}

const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const morgan=require("morgan");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utilities/ExpressError");
const campgroundRoutes=require("./routes/campground")
const reviewRoutes=require("./routes/reviews");
const userRoutes=require("./routes/auth");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalPassport=require("passport-local");
const User=require("./models/user");
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const MongoStore=require('connect-mongo')



const dbUrl=process.env.DB_URL
//const dbUrl="mongodb://localhost:27017/yelp-camp"


//"mongodb://localhost:27017/yelp-camp"
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
});

const db=mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const app=express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

const secret=process.env.SECRET||"iwishthiswasasecret"

const sessionConfiguration={
  store: MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24*60*60
  }),
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    //secure: true,
    expirse: Date.now()+1000*60*60*24*7,
    maxAge: 1000*60*60*24*7
  }
}

app.use(session(sessionConfiguration));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);

app.use((req, res, next) => {
  res.locals.signedUser=req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode=500 }=err;
  if (!err.message) err.message="Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen("3000", () => {
  console.log("Listening on port 3000...");
});