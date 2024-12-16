import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Graph from './components/Graph';
import SectionList from './components/SectionList';
import { getSections, getGraphBySectionId } from './services/api'; 
import './styles/App.css';

function App() {
  const [sections, setSections] = useState([]);
  const [selectedGraph, setSelectedGraph] = useState(null);

  const [language, setLanguage] = useState('ENG'); // Состояние для языка
  const [section, setSection] = useState(""); // Состояние для языка

  const handleLanguageChange = (language) => {
    setLanguage(language); // Обновляем язык в родительском компоненте
  };

  // Загружаем секции при монтировании компонента
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionsData = await getSections(); // Используем API для получения секций
        setSections(sectionsData);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    fetchSections();
  }, []);

  const handleSectionClick = async (sectionId, sectionName) => {
    try {
      const graphData = await getGraphBySectionId(sectionId); // Используем API для получения графа
      setSelectedGraph(graphData); // Сохраняем граф в состоянии
      setSection(sectionName);
    } catch (error) {
      console.error('Error fetching graph:', error);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <SectionList 
          sections={sections} 
          onSectionClick={handleSectionClick}
          onLanguageChange={handleLanguageChange} 
        />
        <div className="content">
          {selectedGraph && (
            <Graph graph={selectedGraph} section = {section} language={language}/>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
