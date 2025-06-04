import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
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
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Key
  const API_KEY = "b5688a9e";

  // Popular movie titles to fetch for latest movies (exact OMDb titles)
  const popularMovieTitles = [
    "Avatar",
    "The Batman",
    "Spider-Man: No Way Home",
    "Black Panther",
    "Doctor Strange",
    "Avengers: Endgame",
  ];

  // Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("movieFavorites");
      console.log("Loading favorites from localStorage:", savedFavorites); // Debug log
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
          console.log("Loaded favorites:", parsedFavorites); // Debug log
        }
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem("movieFavorites");
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      console.log("Saving favorites to localStorage:", favorites); // Debug log
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
        // Fetch detailed information for each movie (limit to 6)
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
        const newFavorites = [...prevFavorites, movie];
        console.log("Adding to favorites:", movie.Title); // Debug log
        // Immediate save to localStorage
        try {
          localStorage.setItem("movieFavorites", JSON.stringify(newFavorites));
          console.log("Favorites saved to localStorage"); // Debug log
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
        return newFavorites;
      }
      return prevFavorites;
    });
  };

  // Handle remove from favorites
  const handleRemoveFromFavorites = (movieId) => {
    console.log("Attempting to remove movie with ID:", movieId); // Debug log

    setFavorites((prevFavorites) => {
      const movieToRemove = prevFavorites.find(
        (movie) => movie.imdbID === movieId
      );
      console.log("Movie to remove:", movieToRemove); // Debug log

      if (!movieToRemove) {
        console.log("Movie not found in favorites"); // Debug log
        return prevFavorites;
      }

      const newFavorites = prevFavorites.filter(
        (movie) => movie.imdbID !== movieId
      );
      console.log("New favorites after removal:", newFavorites); // Debug log

      // Immediate save to localStorage
      try {
        localStorage.setItem("movieFavorites", JSON.stringify(newFavorites));
        console.log("Favorites updated in localStorage after removal"); // Debug log
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }

      return newFavorites;
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

  return (
    <div className="app">
      {/* Navigation Bar with Integrated Search */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      <main className="app-main">
        {/* Content Display based on current view */}
        <div className="movies-section">
          <h2>{getSectionTitle()}</h2>
          <p>{getSectionDescription()}</p>

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

          {getCurrentLoading() ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading movies...</p>
            </div>
          ) : getCurrentMovies().length > 0 ? (
            <div className="movies-grid">
              {getCurrentMovies().map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onAddToFavorites={handleAddToFavorites}
                  onRemoveFromFavorites={handleRemoveFromFavorites}
                  isFavorite={isFavorite}
                />
              ))}
            </div>
          ) : currentView === "favorites" ? (
            <div className="empty-state">
              <FaFilm className="empty-icon" />
              <h3>No favorites yet</h3>
              <p>Start exploring movies to build your personal collection</p>
              <button
                onClick={() => handleViewChange("home")}
                className="go-home-btn"
              >
                Start Exploring
              </button>
            </div>
          ) : currentView === "search" && !getCurrentLoading() && !error ? (
            <div className="empty-state">
              <FaFilm className="empty-icon" />
              <h3>No movies found</h3>
              <p>Try searching with different keywords</p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default App;
