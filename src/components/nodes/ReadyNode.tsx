import React from "react";
import { Handle, Position } from "reactflow";

const ReadyNode = ({ data }: any) => {
  return (
    <div className="bg-green-100 shadow rounded-lg p-4 text-sm border border-green-400">
      <div>{data.label}</div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default ReadyNode;
