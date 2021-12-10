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