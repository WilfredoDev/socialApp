import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import  {fileURLToPath} from "url";
import {register} from "./controllers/auth.controller.js";
import authRoutes from "./routes/auth.router.js";
import userRoutes from "./routes/users.router.js";
import postsRoutes from "./routes/posts.router.js";
import { verifyToken } from "./middleware/auth.middleware.js";
import { createPost } from "./controllers/posts.controller.js";

/* CONFIGURATIONS */
const __filename =  fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb", extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */ 
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/assets');
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

/* ROUTES WITH FILES*/
app.post('/auth/register', upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost)

/*ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);

/* MONGOOSE SETUP*/
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    app.listen(PORT);
}).catch((err)=>console.error(`${err} did not connect`));