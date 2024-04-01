import { useCallback, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import Collapsible from './CollapsibleObject';

const renderJsonAsHtml = (json) => {
  if (typeof json !== 'object') {
    return json;
  }

  return (
    <ul>
      {Object.entries(json).map(([key, value]) => (
        <li key={key}>
          <strong>{key}:</strong>
          {typeof value === 'object' ? (
            <ul>{renderJsonAsHtml(value)}</ul>
          ) : (
            value
          )}
        </li>
      ))}
    </ul>
  );
};


function BaseNode(props) {
  const [collapsibleObject, setCollapsibleObject] = useState({})
  const [incomingEdges, setIncomingEdges] = useState([])
  const [outgoingEdges, setOutgoingEdges] = useState([])
  const reactFlow = useReactFlow();

  function updateInfoText() {
    setCollapsibleObject({ "node": props, "incomingEdges": incomingEdges, "outgoingEdges": outgoingEdges })
  }

  useEffect(() => {
    if (props.data?.needsUpdate) {
      console.info("updating node", props.id)
      const allEdges = reactFlow.getEdges();
      const incomingEdges = [];
      const outgoingEdges = [];

      for (let edge of allEdges) {
        if (edge.target === props.id) {
          incomingEdges.push(edge);
        } else if (edge.source === props.id) {
          outgoingEdges.push(edge);
        }
      }

      setIncomingEdges(incomingEdges)
      setOutgoingEdges(outgoingEdges)

      const currentNodes = reactFlow.getNodes();

      const updatedNodes = currentNodes.map(node => {
        if (node.id == props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              needsUpdate: false,
            },
          };
        }
        return node;
      });
      reactFlow.setNodes(updatedNodes);
    }
    updateInfoText()
  }, [props]);

  const runNode = (value) => {
    const allEdges = reactFlow.getEdges();
    const outgoingEdges = [];
    for (let edge of allEdges) {
      if (edge.source === props.id) {
        outgoingEdges.push(edge);
      }
    }

    const currentNodes = reactFlow.getNodes();

    const updatedNodes = currentNodes.map(node => {
      const isTargetNode = outgoingEdges.some(edge => edge.target === node.id);
      if (isTargetNode) {
        return {
          ...node,
          data: {
            ...node.data,
            needsUpdate: true,
          },
        };
      } else if (node.id == props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            value: value
          },
        };
      }
      return node;
    });
    reactFlow.setNodes(updatedNodes);
  };

  return (
    <div style={{ border: "1px solid black", padding: "8px" }}>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <Collapsible json={collapsibleObject}></Collapsible>
      <div>
        <form onSubmit={e => {
          e.preventDefault();
          runNode("derp");
        }}>
          <button type="submit">Run Node</button>
        </form>
      </div>
    </div>
  );
}

export default BaseNode;
