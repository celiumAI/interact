import { useCallback, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const handleStyle = { left: 10 };

function TextUpdaterNode(props) {
  const [inputString, setInputString] = useState("");
  const [displayString, setDisplayString] = useState("");
  const reactFlow = useReactFlow();

  useEffect(() => {
    setDisplayString(props.data?.label);
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
            label: inputString,
          },
        };
      }
      return node;
    });

    console.log(updatedNodes)
    reactFlow.setNodes(updatedNodes);
  };

  return (
    <div>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div>
        <p>Display Text: {displayString}</p>
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
