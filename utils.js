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
    const randomId = Math.floor(Math.random() * id) + 1;
    const randomMovieResponse = await fetch(
      `${baseUrl}/movie/${randomId}?${baseQuery}`
    );
    const randomMovie = await randomMovieResponse.json();
    if (randomMovie.imdb_id) {
      return randomMovie.imdb_id;
    }
  }
};

export const hitMe = async () => {
  const latest = await getLatestMovieId();
  const movie = await getRandomMovie(latest);
  return `https://www.imdb.com/title/${movie}/`;
};
