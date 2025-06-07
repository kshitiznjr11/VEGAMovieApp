import { useState } from "react";
import { FaHome, FaHeart, FaFilm, FaSearch, FaTimes } from "react-icons/fa";

// Navbar Component - Navigation bar with integrated search
const Navbar = ({
  currentView,
  onViewChange,
  searchQuery,
  setSearchQuery,
  onSearch,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle input blur
  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <FaFilm className="brand-icon" />
          <span className="brand-text">VEGA Movies</span>
        </div>

        {/* Integrated Search Bar */}
        <div className="navbar-search">
          <form onSubmit={handleSubmit} className="navbar-search-form">
            <div
              className={`navbar-search-wrapper ${isFocused ? "focused" : ""}`}
            >
              {/* Search Icon */}
              <FaSearch className="navbar-search-icon" />

              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Search movies..."
                className="navbar-search-input"
              />

              {/* Clear Button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="navbar-clear-button"
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}

              {/* Search Button */}
              <button
                type="submit"
                className={`navbar-search-button ${
                  searchQuery.trim() ? "active" : ""
                }`}
                disabled={!searchQuery.trim()}
              >
                <FaSearch />
              </button>
            </div>
          </form>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <button
            onClick={() => onViewChange("home")}
            className={`nav-link ${currentView === "home" ? "active" : ""}`}
          >
            <FaHome className="nav-icon" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onViewChange("favorites")}
            className={`nav-link ${
              currentView === "favorites" ? "active" : ""
            }`}
          >
            <FaHeart className="nav-icon" />
            <span>Favorites</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
