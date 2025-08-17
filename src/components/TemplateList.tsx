import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { createAgentFromTemplate } from "@/lib/createAgentFromTempate";
import { toast } from "react-hot-toast";
import { templateConfigs } from "@/lib/templateConfigs"; // ✅ all 30 UUID configs

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

interface Template {
  uuid: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  date: string;
  icon?: string;
}

const TemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching templates:", error);
        toast.error("Failed to load templates");
      } else {
        setTemplates(data || []);
      }
      setLoading(false);
    };

    fetchTemplates();
  }, []);

  const handleClick = async (template: Template) => {
    try {
      // ✅ Merge DB template data with predefined config
      const config = templateConfigs[template.uuid];
      if (!config) {
        toast.error("No predefined settings found for this template.");
        return;
      }

      const fullTemplate = {
        ...template,
        ...config,
      };

      // ✅ Save locally (optional, for quick reloads)
      localStorage.setItem("selectedTemplate", JSON.stringify(fullTemplate));

      // ✅ Get logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error("You must be logged in to select a template.");
        return;
      }

      // ✅ Pass fullTemplate to agent creator
      const newAgent = await createAgentFromTemplate(fullTemplate, user.id);

      if (newAgent) {
        navigate(`/agent-settings/${newAgent.id}`);
      }
    } catch (err) {
      console.error("Error handling template click:", err);
      toast.error("Something went wrong.");
    }
  };

  if (loading) return <p>Loading templates...</p>;

  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      }}
    >
      {templates.map((template) => (
        <div
          key={template.uuid}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            cursor: "pointer",
            background: "#fff",
            transition: "0.2s ease-in-out",
          }}
          onClick={() => handleClick(template)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow =
              "0px 4px 12px rgba(0,0,0,0.1)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          <h3>{template.title}</h3>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            {template.excerpt}
          </p>
          <small>
            {template.category} • {template.date}
          </small>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;