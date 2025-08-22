import { Download, Save } from "lucide-react";

export default function PlaygroundHeader({ selectedAgent, onSelectAgent }) {
  const agents = ["Agent Alpha", "Agent Beta", "Agent Gamma"];

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
      <select
        value={selectedAgent}
        onChange={e => onSelectAgent(e.target.value)}
        className="bg-background border border-border rounded-lg px-3 py-1 text-sm"
      >
        {agents.map(agent => (
          <option key={agent}>{agent}</option>
        ))}
      </select>

      <div className="flex gap-2">
        <button className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/80">
          <Save size={16} /> Save Changes
        </button>
        <button className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg border border-border hover:bg-muted">
          <Download size={16} /> Export Files
        </button>
      </div>
    </div>
  );
}
