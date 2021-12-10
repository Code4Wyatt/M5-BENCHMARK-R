import express from "express";
import fs from "fs";
import uniqid from "uniqid";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { parseFile, uploadFile } from "../../src/utils/upload/index.js";
// import { reviewsFilePath } from "../../utils/upload/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const reviewsRouter = express.Router();

reviewsRouter.post("/media/:id/review", async (req, res, next) => {
  try {
    const review = {
      id: uniqid(),
      comment,
      rate,
      elementId,
      createdAt: new Date(),
    };
    const fileAsBuffer = fs.readFileSync(reviewsFilePath);

    const fileAsString = fileAsBuffer.toString();

    let fileAsJSONArray = JSON.parse(fileAsString);

    const mediaIndex = fileAsJSONArray.findIndex(
      (media) => media.id === req.params.id
    );
    if (!mediaIndex == -1) {
      res
        .status(404)
        .send({ message: `Media with ${req.params.id} is not found.` });
    }
    const previousMediaData = fileAsJSONArray[mediaIndex];
    previousmediaData.reviews = previousmediaData.reviews || [];
    const changedMedia = {
      ...previousMediaData,
      ...req.body,
      reviews: [...previousMediaData.reviews, review],
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[mediaIndex] = changedMedia;

    fs.writeFileSync(reviewsFilePath, JSON.stringify(fileAsJSONArray));
    res.send(changedMedia);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

reviewsRouter.put("/media/:id/review", async (req, res, next) => {
  try {
    const { text, userName } = req.body;
    const review = {
      id: uniqid(),
      review,
      rate,
      elementId,
      createdAt: new Date(),
    };
    const fileAsBuffer = fs.readFileSync(mediaFilePath);
    const fileAsString = fileAsBuffer.toString();
    let fileAsJSONArray = JSON.parse(fileAsString);

    const mediaIndex = fileAsJSONArray.findIndex(
      (media) => media.id === req.params.id
    );
    if (mediaIndex == -1) {
      res
        .status(404)
        .send({ message: `Media with ${req.params.id} is not found` });
    }
    const previousMediaData = fileAsJSONArray[mediaIndex];
    previousMediaData.reviews = previousMediaData.reviews || [];
    const changedMedia = {
      ...previousMediaData,
      ...req.body,
      reviews: [...previousMediaData.reviews, review],
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[mediaIndex] = changedMedia;

    fs.writeFileSync(mediaFilePath, JSON.stringify(fileAsJSONArray));
    res.send(changedMedia);
  } catch (error) {
      res.status(500).send({ message: error.message });
  }
});


reviewsRouter.delete("/media/:id/review", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediaFilePath);
    const fileAsString = fileAsBuffer.toString();
    let fileAsJSONArray = JSON.parse(fileAsString);

    const media = fileAsJSONArray.find((media) => media.id === req.params.id);
    if (!media) {
      res
        .status(404)
        .send({ message: `Media with ${req.params.id} is not found!` });
    }
    fileAsJSONArray = fileAsJSONArray.filter(
      (media) => media.id !== req.params.id
    );
    fs.writeFileSync(mediaFilePath, JSON.stringify(fileAsJSONArray));
    res.status(204).send();
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

export default reviewsRouter;