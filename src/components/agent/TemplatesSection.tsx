"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "phosphor-react";

interface Template {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  category?: string;
  date?: string;
  logo?: JSX.Element;
}

interface Props {
  templates: Template[];
  handleTemplateSelect: (template: Template) => void;
}

const TemplatesSection: React.FC<Props> = ({
  templates,
  handleTemplateSelect,
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const all = templates.map(t => t.category).filter(Boolean) as string[];
    return Array.from(new Set(all));
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    if (!activeCategory) return templates;
    return templates.filter(t => t.category === activeCategory);
  }, [activeCategory, templates]);

  return (
    <section className="pb-24">
      <div className="container mx-auto px-4">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1 text-xs font-thin rounded-full border ${
              !activeCategory
                ? "bg-primary text-white"
                : "text-muted-foreground border-muted"
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs font-thin rounded-full border ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "text-muted-foreground border-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.article
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="group relative rounded-2xl border bg-card text-card-foreground p-6 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              {/* Top badge and icon */}
              <div className="flex items-center justify-between mb-4 ">
                <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                  {template.category}
                </span>
                <div className="text-xl text-muted-foreground transition-colors duration-200 group-hover:text-green-500">
                  {template.logo}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-thin text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                {template.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm font-thin text-muted-foreground mb-2">
                {template.excerpt}
              </p>

              {/* Description */}
              <p className="text-sm font-thin text-muted-foreground mb-4">
                {template.description}
              </p>

              {/* Date + Arrow */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar size={12} />
                  <span>{template.date}</span>
                </div>
                <ArrowRight
                  size={16}
                  className="transition group-hover:text-primary"
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplatesSection;
