import React from "react";

interface Template {
  id: string;
  title: string;
  description: string;
}

interface Props {
  templates: Template[];
  handleTemplateSelect: (template: Template) => void;
}

const TemplatesSection: React.FC<Props> = ({ templates, handleTemplateSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => handleTemplateSelect(template)}
          className="p-6 border border-border rounded-xl bg-card hover:bg-muted/40 transition text-left"
        >
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {template.title}
          </h2>
          <p className="text-sm text-muted-foreground">{template.description}</p>
        </button>
      ))}
    </div>
  );
};

export default TemplatesSection;