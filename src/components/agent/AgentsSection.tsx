import React from "react";

interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  prompt: string;
  tools: string[];
  lastRun: string;
  lastModified: string;
  created: string;
  tasksDone: number;
}

interface Props {
  agents: Agent[];
}

const AgentsSection: React.FC<Props> = ({ agents }) => {
  return (
    <div className="space-y-6">
      {agents.length === 0 ? (
        <p className="text-muted-foreground">No agents created yet.</p>
      ) : (
        agents.map(agent => (
          <div
            key={agent.id}
            className="p-4 border border-border rounded-xl bg-card"
          >
            <h3 className="text-lg font-medium text-foreground">
              {agent.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {agent.description}
            </p>
            <div className="text-xs text-muted-foreground">
              <strong>Model:</strong> {agent.model} · <strong>Prompt:</strong>{" "}
              {agent.prompt}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AgentsSection;
