import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.resolve();
dotenv.config({
  path: path.resolve(__dirname, `./.${process.env.NODE_ENV}.env`),
});
const apiKey = process.env.MOVIE_TOKEN;
const baseUrl = "https://api.themoviedb.org/3";
const baseQuery = `api_key=${apiKey}&language=en-US`;

const getLatestMovieId = async () => {
  const response = await fetch(`${baseUrl}/movie/latest?${baseQuery}`);
  const { id } = await response.json();
  return id;
};

const getRandomMovie = async (id) => {
  while (true) {
    const randomId = Math.floor(Math.random() * (id - 1)) + 1;
    const randomMovieResponse = await fetch(
      `${baseUrl}/movie/${randomId}?${baseQuery}`
    );
    const randomMovie = await randomMovieResponse.json();
    if (randomMovie.imdb_id) {
      return randomMovie.imdb_id;
    }
  }
};

const getMovieById = async (id) => {
  const response = await fetch(`${baseUrl}/movie/${id}?${baseQuery}`);
  return response.json();
};

export const getRandomMovieByGenre = async (genre) => {
  while (true) {
    const randomPage = Math.floor(Math.random() * 500);
    const randomMovie = Math.floor(Math.random() * 20);
    const response = await fetch(
      `${baseUrl}/discover/movie?${baseQuery}&page=${randomPage}&with_genres=${genre}&append_to_response`
    );
    const { results } = await response.json();
    const movie = await getMovieById(results[randomMovie]?.id);
    if (movie.imdb_id) {
      return `https://www.imdb.com/title/${movie.imdb_id}/`;
    }
  }
};

export const hitMe = async () => {
  const latest = await getLatestMovieId();
  const movie = await getRandomMovie(latest);
  return `https://www.imdb.com/title/${movie}/`;
};

export const getTrending = async () => {
  const randomMovie = Math.floor(Math.random() * 20);
  const response = await fetch(`${baseUrl}/trending/movie/day?${baseQuery}`);
  const { results } = await response.json();
  return results[randomMovie].title;
};
export const getTopRated = async () => {
  while (true) {
    const randomPage = Math.floor(Math.random() * 500);
    const randomMovie = Math.floor(Math.random() * 20);
    const response = await fetch(
      `${baseUrl}/movie/top_rated?page=${randomPage}&${baseQuery}&append_to_response`
    );
    const { results } = await response.json();
    const movie = await getMovieById(results[randomMovie]?.id);
    if (movie.imdb_id) {
      return `https://www.imdb.com/title/${movie.imdb_id}/`;
    }
  }
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
