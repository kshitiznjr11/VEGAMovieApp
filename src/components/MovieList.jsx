import MovieCard from "./MovieCard";

// MovieList component - Renders a list of movie cards
const MovieList = ({
  movies,
  onAddToFavorites,
  onRemoveFromFavorites,
  isFavorite,
}) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="no-movies">
        <p>No movies to display</p>
      </div>
    );
  }
  return (
    <div className="movies-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={{ movie }}
          onAddToFavorites={onAddToFavorites}
          onRemoveFromFavorites={onRemoveFromFavorites}
          isFavorite={isFavorite}
        />
      ))}
    </div>
  );
};

export default MovieList;
