import React from 'react';
import '../styles/ThemePanel.css';

function ThemePanel({ theme, onClose, searchResults }) {
  return (
    <div className="theme-panel">
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
      <h2>{theme.label}</h2>
      <div className="search-results">
        <h3>Search Results:</h3>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((result, index) => (
              <li key={index} className="search-result-item">
                <div className="result-title">{result.title}</div>
                <a href={result.link} target="_blank" rel="noopener noreferrer" className="result-link">
                  {result.link}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default ThemePanel;
