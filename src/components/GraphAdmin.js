import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/Graph.css';
import '../styles/ThemePanel.css';

import mockGraph from '../data/mockThemes.json';
import ThemePanel from './ThemePanel'; // Подключаем компонент ThemePanel

export default function Graph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [copiedNode, setCopiedNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null); // Состояние для выбранной темы
  const [isPanelOpen, setIsPanelOpen] = useState(false); // Состояние для открытия/закрытия панели

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: `Theme ${nodes.length + 1}` },
      position: { x: 250, y: 100 + nodes.length * 50 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey && event.key === 'c') {
        const selectedNode = nodes.find((node) => node.selected);
        if (selectedNode) setCopiedNode(selectedNode);
      }

      if (event.ctrlKey && event.key === 'v' && copiedNode) {
        const newNode = {
          ...copiedNode,
          id: (nodes.length + 1).toString(),
          position: {
            x: copiedNode.position.x + 50,
            y: copiedNode.position.y + 50,
          },
        };
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [nodes, copiedNode]
  );

  const updateNodeLabel = (id, newLabel) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, label: newLabel },
          };
        }
        return node;
      })
    );
  };

  const handleDoubleClick = (event, node) => {
    const newLabel = prompt('Edit label:', node.data.label);
    if (newLabel !== null) {
      updateNodeLabel(node.id, newLabel);
    }
  };

  const handleNodeClick = (event, node) => {
    setSelectedNode(node); // Устанавливаем выбранную тему
    setIsPanelOpen(true);   // Открываем панель
  };

  const exportGraph = () => {
    const graphData = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([graphData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importGraph = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const text = await file.text();
      const { nodes: importedNodes, edges: importedEdges } = JSON.parse(text);
      setNodes(importedNodes);
      setEdges(importedEdges);
    }
  };

  useEffect(() => {
    setNodes(mockGraph.nodes || []);
    setEdges(mockGraph.edges || []);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedNode(null); // Закрываем панель и сбрасываем выбранную тему
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <button
        onClick={addNode}
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 10,
          padding: '10px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Add Node
      </button>
      <button
        onClick={exportGraph}
        style={{
          position: 'absolute',
          top: 50,
          left: 10,
          zIndex: 10,
          padding: '10px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Export Graph
      </button>
      <input
        type="file"
        accept="application/json"
        onChange={importGraph}
        style={{
          position: 'absolute',
          top: 90,
          left: 10,
          zIndex: 10,
        }}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={handleDoubleClick}
        onNodeClick={handleNodeClick} // Добавляем обработчик клика на узел
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
