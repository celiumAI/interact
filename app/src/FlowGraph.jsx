import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TextUpdaterNode from './TextUpdaterNode';

const initialNodes = [
  { id: 'node-1', type: 'textUpdater', position: { x: 200, y: 100 }, data: {} },
  { id: 'node-2', type: 'textUpdater', position: { x: 400, y: 100 }, data: {} },
];

const initialEdges = [];

const nodeTypes = {
  textUpdater: TextUpdaterNode,
}

export default function FlowGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const addNode = useCallback(() => {
    const newNodeId = Date.now().valueOf().toString()
    const newNode = {
      id: newNodeId,
      type: 'textUpdater',
      position: { x: 100, y: 100 },
      data: {},
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button onClick={addNode} style={{ position: 'absolute', zIndex: 100 }}>Add Node</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
