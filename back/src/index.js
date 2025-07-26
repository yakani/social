import { app , server } from "./lib/socket.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import connetedDB from "./lib/db.js";
import session from 'express-session';
import passport from "passport";
import express from "express";
import dotenv from "dotenv";
import { errorhandeler , notfound} from './lib/error.js'
import userroute from './routes/user.route.js';
import fileroute from './routes/file.route.js';
import commentroute from './routes/comment.route.js';
import messageroute from './routes/message.route.js';
import authroute from './routes/auth.route.js';
import followerroute from './routes/follower.route.js';
dotenv.config();
app.use(express.urlencoded({ extended:false }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret:process.env.secret,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge: 1000*60*60*24
    }
}));
app.use(passport.initialize());
app.use(passport.authenticate('session'));
const corsoption = {
    origin: [
    process.env.CLIENT_URL, // Your React/Web App development origin

  process.env.APP, // Example: Replace XXX with your actual IP, 19000 is a common Expo port
   process.env.APP2, // Another common Expo port
   process.env.APP3, // For Expo Go and dev clients (more flexible but be careful)
  null 
    ],
    methods: ["POST", "GET", "PUT", "DELETE",, "OPTIONS"], 
    credentials: true,
    allowedHeaders: ['Content-Type'],
    };
app.use(cors(corsoption));
app.use('/user',userroute);
app.use('/auth',authroute);
app.use('/post',fileroute);
app.use('/comment',commentroute);
app.use('/message',messageroute);
app.use('/follow',followerroute);
connetedDB();
app.use(errorhandeler);
app.use(notfound);
server.listen(7000,'0.0.0.0', () => {
  console.log('Server is running on port 7000');
});
