import { checkSchema, validationResult } from "express-validator";

const schema = {
    title: {
        in: ["body"],
        isString: {
            errorMessage: "Title validation failed, must be a string",
        },
    },
    year: {
        in: ["body"],
        isNumeric: {
            errorMessage: "Category validation failed, must be a number",
        },
    },
    type: {
        in: ["body"],
        isString: {
            errorMessage: "Content validation failed, must be a string",
        },
    },
    poster: {
        in: ["body"],
        isString: {
            errorMessage: "Poster validation failed, must be a string",
        },
    },
};

export const checkMediaSchema = checkSchema(schema);
export const checkReviewSchema = checkSchema(schema);

export const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Media validation has failed!");
        error.status = 400;
        error.errors = errors.array();
        next(error);
    }
    next();
};