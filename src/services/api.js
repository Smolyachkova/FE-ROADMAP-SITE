export const getSections = async () => {
    const response = await fetch('https://be-roadmap-site-1-1-3.onrender.com/v1/roadmaps');
    if (!response.ok) {
      throw new Error('Failed to fetch sections');
    }
    const data = await response.json();
    return data.roadmaps; // Возвращаем список секций
};
  

export const getGraphBySectionId = async (sectionId) => {
    const response = await fetch(`https://be-roadmap-site-1-1-3.onrender.com/v1/roadmaps/${sectionId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch graph data');
    }
    const data = await response.json();
    return data.graph; // Возвращаем граф
};


export const getCustomSearchResults = async (topic, technology, language) => {
    const response = await fetch(`https://be-roadmap-site-1-1-3.onrender.com/v1/materials?topic=${topic}&technology=${technology}&language=${language}`);
    if (!response.ok) {
      throw new Error('Failed to fetch custom search results');
    }
    const data = await response.json();
    return data.items; // Возвращаем результаты поиска
};