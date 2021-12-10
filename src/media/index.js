import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { getMovies, writeMovie, getReviews, writeReview } from "../utils/upload/fs-tools.js";

const moviesRouter = express.Router();

moviesRouter.get("/", async (req, res, next) => {
  try {
      const movies = await getMovies();
      res.send(movies);
  } catch (error) {
      next(error);
  }
});

moviesRouter.post("/", async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return next(createHttpError(400, errors))
        const movies = await getMovies();
        const imdbIdCheck = movies.findIndex(movie => movie.imdbID === req.body.imdbID);
        if (imdbIdCheck !== -1) return next(createHttpError(400, 'This movie has already been created'));
        movies.push(req.body);
        await writeMovie(movies);
        res.status(201).send(req.body);
    } catch (error) {
    console.log(error);
        next(error);
  }
});

moviesRouter.get('/reviews', async (req, res, next) => {
    try {
        const reviews = await getReviews();
        res.send(reviews);
    } catch (error) {
        next(error);
    }
});

moviesRouter.delete('/reviews/:reviewId', async (req, res, next) => {
    try {
        const reviews = await getReviews();
        const reviewsNotDeleted = reviews.filter(review => review.id === req.params.reviewId);
        if (reviews.length === reviewsNotDeleted.length) return next(createHttpError(404, 'Review not created'));
        await writeReview(reviewsNotDeleted);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

moviesRouter.route('/:movieId')
.get(async (req, res, next) => {
    try {
        const movies = await getMovies()
        const movie = movies.filter(movie => movie.imdbID === req.params.movieId)
        if (movie.length === 0) return next(createHttpError(404, moviesError404))
        const reviews = await getReviews()
        const movieReviews = reviews.filter(review => review.movieId === req.params.movieId)
        res.send({ movie, movieReviews })
    } catch (error) {
        next(error)
    }
})
.put(async (req, res, next) => {
    try {
        const movies = await getMovies()
        const index = movies.findIndex(movie => movie.imdbID === req.params.movieId)
        if (index === -1) return next(createHttpError(404, moviesError404))
        movies[index] = {
            ...movies[index],
            ...req.body
        }
        await writeMovie(movies)
        res.send(movies[index])
    } catch (error) {
        next(error)
    }
})
.delete(async (req, res, next) => {
    try {
        const movies = await getMovies()
        const remainingMovies = movies.filter(movie => movie.imdbID !== req.params.movieId)
        if (movies.length === remainingMovies.length) return next(createHttpError(404, moviesError404))
        await writeMovie(remainingMovies)
        res.status(204).send(remainingMovies)
    } catch (error) {
        next(error)
    }
})

moviesRouter.patch('/:movieId/poster', async (req, res, next) => {   
    try {
        const movies = await getMovies()
        const index = movies.findIndex(movie => movie.imdbID === req.params.movieId)
        if (index === -1) return next(createHttpError(404, moviesError404))
        movies[index].Poster = req.body.Poster
        await writeMovie(movies)
        res.send(movies[index])
    } catch (error) {
        next(error)
    }   
})

moviesRouter.post('/:movieId/reviews', async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return next(createHttpError(400, errors))
        const movies = await getMovies()

        const movieExistsInDB = movies.findIndex(movie => movie.imdbID === req.params.movieId)
        if (movieExistsInDB === -1) return next(createHttpError(404, moviesError404))

        const reviews = await getReviews()
        const newReview = {
            id: uuidv4(),
            ...req.body,
            movieId: req.params.movieId,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        reviews.push(newReview)
        await writeReview(reviews)
        res.status(201).send(newReview)
    } catch (error) {
        next(error)
    }
})

export default moviesRouter;
