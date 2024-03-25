import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import LLMGenerate from './LLMGenerate';

const handleStyle = { left: 10 };

function TextUpdaterNode({ data, isConnectable }) {
  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <LLMGenerate/>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default TextUpdaterNode;