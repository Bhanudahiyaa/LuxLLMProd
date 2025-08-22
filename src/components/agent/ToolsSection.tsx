import React from "react";

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface Props {
  tools: Tool[];
  selectedToolCategory: string;
  setSelectedToolCategory: (category: string) => void;
}

const ToolsSection: React.FC<Props> = ({
  tools,
  selectedToolCategory,
  setSelectedToolCategory,
}) => {
  const filtered =
    selectedToolCategory === "All tools"
      ? tools
      : tools.filter(tool => tool.category === selectedToolCategory);

  const categories = [
    "All tools",
    ...new Set(tools.map(tool => tool.category)),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            className={`text-sm px-3 py-1 rounded-full border ${
              selectedToolCategory === category
                ? "bg-primary text-white border-primary"
                : "text-muted-foreground border-border hover:border-muted"
            }`}
            onClick={() => setSelectedToolCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(tool => (
          <div
            key={tool.id}
            className="border border-border rounded-lg p-4 bg-card"
          >
            <h4 className="font-semibold text-foreground">{tool.name}</h4>
            <p className="text-sm text-muted-foreground">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsSection;
