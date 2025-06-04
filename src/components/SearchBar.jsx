import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({ searchQuery = "", setSearchQuery, onSearch }) => {
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

  // Handle input focus
  const handleBlur = () => {
    setIsFocused(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
  };

  return (
    <div className="search-section">
      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className={`search-input-wrapper ${isFocused ? "focused" : ""}`}>
            {/* Search Icon */}
            <FaSearch className="search-icon-left" />

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Search movies..."
              className="search-input"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="clear-button"
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}

            {/* Integrated Search Button */}
            <button
              type="submit"
              className={`search-button-integrated ${
                searchQuery.trim() ? "active" : ""
              }`}
              disabled={!searchQuery.trim()}
            >
              <FaSearch />
            </button>
          </div>
        </form>

        {/* Search suggestions */}
        <div className="search-suggestions">
          <span className="suggestion-label">Popular Searches:</span>
          <button
            className="suggestion-tag"
            onClick={() => handleSuggestionClick("Marvel")}
          >
            Marvel
          </button>
          <button
            className="suggestion-tag"
            onClick={() => handleSuggestionClick("Batman")}
          >
            Batman
          </button>
          <button
            className="suggestion-tag"
            onClick={() => handleSuggestionClick("Star Wars")}
          >
            Star Wars
          </button>
          <button
            className="suggestion-tag"
            onClick={() => handleSuggestionClick("Harry Potter")}
          >
            Harry Potter
          </button>
          <button
            className="suggestion-tag"
            onClick={() => handleSuggestionClick("The Lord of the Rings")}
          >
            The Lord of the Rings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
