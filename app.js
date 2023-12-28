if(process.env.NODE_ENV != "production"){
require('dotenv').config()  
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
//const dbURL=process.env.ATLASDB_URL;
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js"); 
const session = require("express-session")
const MongoStore= require("connect-mongo")
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User= require("./models/user.js");
const { localsName } = require("ejs");


const listingRouter= require("./routes/listing.js")
const reviewRouter= require("./routes/review.js")
const userRouter= require("./routes/user.js")
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
 
async function main() {
 // await mongoose.connect(MONGO_URL);
  await mongoose.connect(MONGO_URL); 
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store= MongoStore.create({
  mongoUrl:MONGO_URL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24*3600,
})
store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});


const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+1000*60*60*24*3,
    maxAge:1000*60*60*24*3,
    httpOnly:true
  },
};




app.use(session(sessionOptions));
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



 
app.use((req,res,next)=>{
 res.locals.success=req.flash("success");
 res.locals.error=req.flash("error");
 res.locals.currUser = req.user; 
 next();
});

// app.get("/demouser",async (req,res)=>{
//   let fakeUser= new User({
//     email:"student@gmail.com",
//     username:"delta-student"
//   });
//  let registerUser = await User.register(fakeUser,"helloworld");
//  res.send(registerUser);
// })


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
