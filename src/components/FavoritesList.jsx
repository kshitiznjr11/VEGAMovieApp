import { FaHeart, FaTimes } from "react-icons/fa";

// FavoritesList Component- Displays favorite movies
const FavoritesList = ({ favorites, onRemoveFromFavorites }) => {
  return (
    <div className="favorites-sidebar">
      <h2>
        <FaHeart className="favorites-icon" />
        Your Favorites ({favorites.length})
      </h2>

      {
        (favorites,
        length === 0 ? (
          <p className="no-favorites">No favorites movies yet!</p>
        ) : (
          <div className="favorites-list">
            {favorites.map((movie) => (
              <div key={movie.imdbID} className="favorite-item">
                <div className="favorite-poster">
                  <img
                    src={
                      movie.Poster !== "N/A"
                        ? movie.Poster
                        : "/placeholder.svg?height=100&width=70"
                    }
                    alt={`${movie.Title} poster`}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=100&width=70";
                    }}
                  />
                </div>

                <div className="favorite-details">
                  <h4>{movie.Title}</h4>
                  <p>{movie.Year}</p>
                  <button
                    onClick={() => onRemoveFromFavorites(movie.imdbID)}
                    className="remove-btn"
                  >
                    <FaTimes className="remove-icon" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      }
    </div>
  );
};

export default FavoritesList;
