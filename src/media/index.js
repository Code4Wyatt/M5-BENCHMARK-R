import express from "express";
import fs from "fs";
import uniqid from "uniqid";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { parseFile, uploadFile } from "../utils/upload/index.js";
import { mediaFilePath } from "../utils/upload/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mediaRouter = express.Router();

mediaRouter.get("/", async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(mediaFilePath);
        const fileAsString = fileAsBuffer.toString();
        const fileAsJSON = JSON.parse(fileAsString);
        res.send(fileAsJSON);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

mediaRouter.post("/", async (req, res, next) => {
    try {
        const media = {
            id: uniqid(),
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const fileAsBuffer = fs.readFileSync(mediaFilePath);
        const fileAsString = fileAsBuffer.toString();
        const fileAsJSONArray = JSON.parse(fileAsString);

        fileAsJSONArray.push(media);

        fs.writeFileSync(mediaFilePath, JSON.stringify(fileAsJSONArray));
        res.send(media);
    } catch (error) {
        res.send({ message: error.message });
    }
});

mediaRouter.get("/:id", async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(mediaFilePath);
        const fileAsString = fileAsBuffer.toString();
        const fileAsJSONArray = JSON.parse(fileAsString);

        const media = fileAsJSONArray.find((media) => media.id === req.params.id);
        if (!media) {
            res.status(404).send({ message: `media with ${req.params.id} not found`})
        }
        res.send(media);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})