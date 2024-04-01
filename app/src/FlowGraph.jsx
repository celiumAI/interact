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
import BaseNode from './BaseNode';

const initialNodes = [
  { id: 'node-1', type: 'base', position: { x: 200, y: 100 }, data: { value: "" } },
  { id: 'node-2', type: 'base', position: { x: 400, y: 100 }, data: { value: "" } },
];

const initialEdges = [];

const nodeTypes = {
  base: BaseNode,
}

export default function FlowGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const addNode = useCallback(() => {
    const newNodeId = Date.now().valueOf().toString()
    const newNode = {
      id: newNodeId,
      type: 'base',
      position: { x: 100, y: 100 },
      data: { value: "" },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onConnect = useCallback(
    (params) => {
      return setEdges((eds) => {
        return addEdge(params, eds)
      })
    },
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
