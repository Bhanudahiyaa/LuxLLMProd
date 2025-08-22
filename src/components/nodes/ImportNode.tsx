import React from "react";
import { Handle, Position } from "reactflow";

const ImportNode = ({ data }: any) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 text-sm border border-gray-300">
      <div>{data.label}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default ImportNode;
