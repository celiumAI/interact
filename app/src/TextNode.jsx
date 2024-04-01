import { useCallback, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

function TextUpdaterNode(props) {
  const [inputString, setInputString] = useState("");
  const [inputValues, setInputValues] = useState([]);
  const reactFlow = useReactFlow();

  useEffect(() => {
    if (props.data?.inputsChanged) {
      const allEdges = reactFlow.getEdges();
      const incomingEdges = [];

      for (let edge of allEdges) {
        if (edge.target === props.id) {
          incomingEdges.push(edge);
        }
      }

      const currentNodes = reactFlow.getNodes();
      const incomingNodes = incomingEdges.map(edge => {
        return currentNodes.find(node => node.id === edge.source);
      });

      console.log(incomingNodes)
      const values = []
      incomingNodes.forEach(node => {
        values.push(node.data.value)
      })

      setInputValues(values);
    }
  }, [props]);

  const handleSubmit = () => {
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
            inputsChanged: true,
          },
        };
      } else if (node.id == props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            value: inputString
          },
        };
      }
      return node;
    });
    reactFlow.setNodes(updatedNodes);
  };

  return (
    <div>
      <div>
        <form onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}>
          <input type="text" value={inputString} onChange={e => setInputString(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default TextUpdaterNode;
