import React from "react";
import { Handle, Position } from "reactflow";

const PromptNode = ({ data }: any) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 text-sm border border-gray-300">
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default PromptNode;
