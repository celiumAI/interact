import { useCallback, useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

function TextUpdaterNode({ data, isConnectable }) {
  const communicate = data.communicate;
  const [inputString, setInputString] = useState("");
  const [displayString, setDisplayString] = useState("");

  useEffect(() => {
    setDisplayString(data?.text);
  }, [data?.text])

  const handleSubmit = useCallback(() => {
    communicate('node-2', { text: inputString });
  }, [inputString, communicate]);

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
