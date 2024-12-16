import React, { useState } from 'react';
import '../styles/SectionList.css';

function SectionList({ sections, onSectionClick, onLanguageChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ENG'); // По умолчанию русский

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLanguageChange = (event) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    onLanguageChange(language); // Передаем выбранный язык в родительский компонент
  };

  return (
    <div className={`section-list ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="collapse-toggle" onClick={toggleCollapse}>
        {isCollapsed ? '▶' : '✖'}
      </div>
      {!isCollapsed && (
        <div className="section-list-content">
          <h3>Technologies</h3>
          <ul>
            {sections.map((section) => (
              <li key={section.id} onClick={() => onSectionClick(section.id, section.technology)}>
                {section.technology}
              </li>
            ))}
          </ul>

          <div className="language-selector">
          <div>
          <label htmlFor="language-select">Source Language:</label>
          <select
            id="language-select"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            <option value="ENG">ENG</option>
          </select>
          </div>
        </div>
        </div>
        
      )}
    </div>
  );
}

export default SectionList;
