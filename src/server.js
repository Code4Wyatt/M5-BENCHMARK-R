import express from 'express';
import cors from "cors";
import listEndpoints from 'express-list-endpoints';
import moviesRouter from "../src/media/index.js";

import { notFound, forbidden, catchAllErrorHandler } from "../src/errorHandlers.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDirectory = path.join(__dirname, "../public");

const whiteList = [process.env.FE_LOCAL_URL];

const corsOptions = {
    origin: function (origin, callback) {
        console.log("Current origin: ", origin);
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error({ status: 500, message: "CORS Error!" }))
        }
    },
};

const server = express();
const PORT = process.env.PORT;

server.use(cors());
server.use(express.json());
server.use(express.static(publicDirectory));

server.use("/media", moviesRouter);


server.use(notFound);
server.use(forbidden);
server.use(catchAllErrorHandler);

console.log(listEndpoints(server));

server.listen(PORT, () => console.log("Server running on port: ", PORT));

server.on("error", (error) => console.log(`Server not running due to error: ${error}`));