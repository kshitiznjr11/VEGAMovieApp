import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import MovieCard from "./components/MovieCard";
import { FaFilm } from "react-icons/fa";
import "./App.css";

// Main App Component
function App() {
  // State management for search and movies
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("home");
  const [latestMovies, setLatestMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem("movieFavorites");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Key
  const API_KEY = "b5688a9e";

  // Popular movie titles to fetch for latest movies (exact OMDb titles)
  const popularMovieTitles = [
    "Avatar: The Way of Water",
    "The Lord of the Rings: The Return of the King",
    "Avengers: Endgame",
    "Spider-Man: No Way Home",
  ];

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem("movieFavorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favorites]);

  // Fetch movie details from OMDb API
  const fetchMovieDetails = async (title) => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?t=${encodeURIComponent(
          title
        )}&apikey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.Response === "True") {
        return data;
      } else {
        console.warn(`Movie not found: ${title} - ${data.Error}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching movie ${title}:`, error);
      return null;
    }
  };

  // Search movies from OMDb API
  const searchMovies = async (query) => {
    try {
      setSearchLoading(true);
      setError(null);

      const response = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          query
        )}&type=movie&apikey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.Response === "True") {
        // Fetch detailed information for each movie s
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            const details = await fetchMovieDetails(movie.Title);
            return details || movie;
          })
        );
        setSearchResults(detailedMovies.filter((movie) => movie !== null));
      } else {
        setSearchResults([]);
        setError(data.Error || "No movies found");
      }
    } catch (error) {
      console.error("Search error:", error);
      setError(
        "Failed to search movies. Please check your connection and try again."
      );
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Load latest movies on component mount
  useEffect(() => {
    const loadLatestMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch details for popular movies
        const moviePromises = popularMovieTitles.map(async (title) => {
          const movie = await fetchMovieDetails(title);
          return movie;
        });

        const movies = await Promise.all(moviePromises);

        // Filter out null results and set movies
        const validMovies = movies.filter((movie) => movie !== null);

        if (validMovies.length === 0) {
          setError("Unable to load movies. Please check your connection.");
        } else {
          setLatestMovies(validMovies);
        }
      } catch (error) {
        console.error("Error loading latest movies:", error);
        setError("Failed to load latest movies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadLatestMovies();
  }, []);

  // Handle search submission
  const handleSearch = (query) => {
    if (query.trim()) {
      searchMovies(query);
      setCurrentView("search");
    }
  };

  // Handle view change from navbar
  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === "home") {
      setSearchResults([]);
      setError(null);
    }
  };

  // Handle add to favorites
  const handleAddToFavorites = (movie) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.find(
        (fav) => fav.imdbID === movie.imdbID
      );
      if (!isAlreadyFavorite) {
        return [...prevFavorites, movie];
      }
      return prevFavorites;
    });
  };

  // Handle remove from favorites
  const handleRemoveFromFavorites = (movieId) => {
    setFavorites((prevFavorites) => {
      return prevFavorites.filter((movie) => movie.imdbID !== movieId);
    });
  };

  // Check if movie is favorite
  const isFavorite = (movieId) => {
    const result = favorites.some((movie) => movie.imdbID === movieId);
    console.log(`Checking if ${movieId} is favorite:`, result); // Debug log
    return result;
  };

  // Get current movies to display
  const getCurrentMovies = () => {
    if (currentView === "search") {
      return searchResults;
    } else if (currentView === "favorites") {
      return favorites;
    } else {
      return latestMovies;
    }
  };

  // Get current loading state
  const getCurrentLoading = () => {
    if (currentView === "search") {
      return searchLoading;
    } else {
      return loading;
    }
  };

  // Get current section title
  const getSectionTitle = () => {
    if (currentView === "search") {
      return searchQuery
        ? `Search Results for "${searchQuery}"`
        : "Search Results";
    } else if (currentView === "favorites") {
      return "Your Favorites";
    } else {
      return "Popular Movies";
    }
  };

  // Get current section description
  const getSectionDescription = () => {
    if (currentView === "search") {
      return searchResults.length > 0
        ? `Found ${searchResults.length} movies`
        : "";
    } else if (currentView === "favorites") {
      return favorites.length > 0
        ? `You have ${favorites.length} favorite movies`
        : "Your favorite movies will appear here once you start adding them!";
    } else {
      return "Discover popular and trending films";
    }
  };

  // Render movie grid
  const renderMovieGrid = (movies, title, description) => {
    if (getCurrentLoading()) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading movies...</p>
        </div>
      );
    }

    if (movies.length === 0) {
      return (
        <div className="empty-state">
          <FaFilm className="empty-icon" />
          <h3>No movies found</h3>
          <p>Try searching with different keywords</p>
        </div>
      );
    }

    return (
      <div className="movies-section">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onAddToFavorites={handleAddToFavorites}
              onRemoveFromFavorites={handleRemoveFromFavorites}
              isFavorite={isFavorite}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Navigation Bar with Integrated Search */}
      <NavBar
        currentView={currentView}
        onViewChange={handleViewChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      <main className="app-main">
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            {currentView === "home" && (
              <button
                onClick={() => window.location.reload()}
                className="retry-btn"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {currentView === "home" ? (
          <>
            {renderMovieGrid(
              latestMovies,
              "Popular Movies",
              "Discover popular and trending films"
            )}
            {favorites.length > 0 && (
              <div className="favorites-section">
                {renderMovieGrid(
                  favorites,
                  "Your Favorites",
                  `You have ${favorites.length} favorite movies`
                )}
              </div>
            )}
          </>
        ) : (
          renderMovieGrid(
            getCurrentMovies(),
            getSectionTitle(),
            getSectionDescription()
          )
        )}
      </main>
    </div>
  );
}

export default App;
