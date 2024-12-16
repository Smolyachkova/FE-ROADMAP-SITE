import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid'; 
import 'reactflow/dist/style.css';
import '../styles/Graph.css';
import '../styles/ThemePanel.css';

import mockGraph from '../data/mockThemes.json';
import ThemePanel from './ThemePanel';
import { getCustomSearchResults } from '../services/api'; 


export default function Graph({ graph, section, language }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // Добавим состояние для результатов поиска

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
    const query = node.data.label; // Получаем название темы как запрос
    fetchCustomSearchResults(node.data.label, section, language); // Выполним запрос с языком
  };

  // Метод для получения результатов поиска
  const fetchCustomSearchResults = async (topic, technology, language) => {
    try {
      const results = await getCustomSearchResults(topic, technology, language); // Передаем язык
      setSearchResults(results); // Обновляем состояние с результатами поиска
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handlePaneClick = () => {
    if (isPanelOpen) {
      setIsPanelOpen(false);
      setSelectedNode(null);
    }
  };

  useEffect(() => {
    const { nodes, edges } = graph;
  
    // Назначаем уникальный ID каждому узлу
    const updatedNodes = nodes.map((node, index) => ({
      ...node,
      id: node.id || `${index + 1}`, // Генерация уникального ID, если отсутствует
    }));
  
    // Создаем мапу для старых ID
    const idMap = new Map(nodes.map((node, index) => [node.id || null, updatedNodes[index].id]));
  
    // Назначаем уникальный ID каждому ребру и обновляем source и target
    const updatedEdges = edges.map((edge, index) => ({
      ...edge,
      id: edge.id || `${edge.source}-${edge.target}`, // Генерация уникального ID, если отсутствует
      source: idMap.get(edge.source) || edge.source,
      target: idMap.get(edge.target) || edge.target,
      animated: false
    }));
    console.log('Nodes:', updatedNodes);
    console.log('Edges:', updatedEdges);

    setNodes(updatedNodes.map(node => ({ ...node, draggable: false })));
    setEdges(updatedEdges);
  }, []);
  



  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedNode(null);
  };

  return (
    <div style={{ height: '100vh', position: 'relative', backgroundColor: '#ffffff' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        fitView
        connectable={false} // Отключаем добавление соединений
        defaultViewport={{ x: 0, y: 0, zoom: 0.01 }}
        proOptions={{ hideAttribution: true }} // Убираем лого React Flow
      >
        <Background color="#e0e0e0" gap={20} variant="dots" />
        <MiniMap />
        {/* Оставляем только те элементы управления, которые нужны */}
        <Controls showInteractive={false} />
      </ReactFlow>
      {isPanelOpen && selectedNode && (
        <ThemePanel theme={selectedNode.data} onClose={closePanel} searchResults={searchResults} />
      )}
    </div>
  );
}
