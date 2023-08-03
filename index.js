import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 3000;
import userRoutes from "./routes/usersRoute.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

/*
ROUTES

USERS

GET http://localhost:3000/api/user/getUsers  /
GET http://localhost:3000/api/user/getUser/id /
POST http://localhost:3000/api/user/register
PUT http://localhost:3000/api/user/update /


LOGIN / LOGOUT
POST http://localhost:3000/api/user/login /
POST http://localhost:3000/api/logout / 

ALARM 
POST http://localhost:3000/api/alarm/create


ADMINS
GET http://localhost:3000/api/user/admins

*/
