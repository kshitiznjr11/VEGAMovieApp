"use client";

import {
  FaHeart,
  FaRegHeart,
  FaCalendarAlt,
  FaFilm,
  FaStar,
  FaClock,
} from "react-icons/fa";

// MovieCard Component - Displays individual movie information
const MovieCard = ({
  movie,
  onAddToFavorites,
  onRemoveFromFavorites,
  isFavorite,
}) => {
  // Handle favorite button click
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isCurrentlyFavorite = isFavorite(movie.imdbID);
    console.log(
      `Movie: ${movie.Title}, Currently favorite: ${isCurrentlyFavorite}`
    ); // Debug log

    if (isCurrentlyFavorite) {
      console.log(`Removing ${movie.Title} from favorites`); // Debug log
      onRemoveFromFavorites(movie.imdbID);
    } else {
      console.log(`Adding ${movie.Title} to favorites`); // Debug log
      onAddToFavorites(movie);
    }
  };

  // Handle missing poster image
  const posterSrc =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "/placeholder.svg?height=400&width=300";

  // Format runtime
  const formatRuntime = (runtime) => {
    if (!runtime || runtime === "N/A") return null;
    return runtime;
  };

  // Format rating
  const formatRating = (rating) => {
    if (!rating || rating === "N/A") return null;
    return rating;
  };

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={posterSrc || "/placeholder.svg"}
          alt={`${movie.Title} poster`}
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=400&width=300";
          }}
        />
        <div className="movie-overlay">
          <button
            onClick={handleFavoriteClick}
            className={`favorite-btn-overlay ${
              isFavorite(movie.imdbID) ? "favorited" : ""
            }`}
            title={
              isFavorite(movie.imdbID)
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            {isFavorite(movie.imdbID) ? (
              <FaHeart className="heart-icon filled" />
            ) : (
              <FaRegHeart className="heart-icon" />
            )}
          </button>
        </div>

        {/* Rating Badge */}
        {formatRating(movie.imdbRating) && (
          <div className="rating-badge">
            <FaStar className="star-icon" />
            <span>{movie.imdbRating}</span>
          </div>
        )}
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>

        {/* Movie metadata */}
        <div className="movie-meta">
          <span className="movie-year">
            <FaCalendarAlt className="info-icon" />
            {movie.Year}
          </span>

          {formatRuntime(movie.Runtime) && (
            <span className="movie-runtime">
              <FaClock className="info-icon" />
              {movie.Runtime}
            </span>
          )}
        </div>

        {/* Genre */}
        {movie.Genre && movie.Genre !== "N/A" && (
          <div className="movie-genre">
            <span className="genre-label">
              <FaFilm className="info-icon" />
              {movie.Genre.split(",")[0].trim()}
            </span>
          </div>
        )}

        {/* Plot */}
        {movie.Plot && movie.Plot !== "N/A" && (
          <p className="movie-plot">{movie.Plot}</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
