import dotenv from "dotenv";
dotenv.config();
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