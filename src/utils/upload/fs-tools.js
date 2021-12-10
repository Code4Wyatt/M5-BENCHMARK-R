import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const { readJSON, writeJSON } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../data')
const moviesJSONPath = join(dataFolderPath, 'movies.json')
const reviewsJSONPath = join(dataFolderPath, 'reviews.json')

export const getMovies = () => readJSON(moviesJSONPath)
export const writeMovie = content => writeJSON(moviesJSONPath, content)
export const getReviews = () => readJSON(reviewsJSONPath)
export const writeReview = content => writeJSON(reviewsJSONPath, content)