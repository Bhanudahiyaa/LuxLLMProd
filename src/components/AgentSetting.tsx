export default function AgentSettings({ settings, onSettingsChange }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Agent Settings</h2>

      {/* Temperature */}
      <label className="block mb-2 text-sm">Temperature</label>
      <input
        type="number"
        min={0}
        max={1}
        step={0.1}
        value={settings.temperature}
        onChange={e =>
          onSettingsChange({
            ...settings,
            temperature: parseFloat(e.target.value),
          })
        }
        className="w-full mb-4 px-3 py-2 rounded-lg border border-border bg-background"
      />

      {/* Max Tokens */}
      <label className="block mb-2 text-sm">Max Tokens</label>
      <input
        type="number"
        value={settings.maxTokens}
        onChange={e =>
          onSettingsChange({ ...settings, maxTokens: parseInt(e.target.value) })
        }
        className="w-full mb-4 px-3 py-2 rounded-lg border border-border bg-background"
      />

      {/* Model */}
      <label className="block mb-2 text-sm">Model</label>
      <select
        value={settings.model}
        onChange={e => onSettingsChange({ ...settings, model: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background"
      >
        <option value="gpt-4o-mini">gpt-4o-mini</option>
        <option value="gpt-4">gpt-4</option>
        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
      </select>
    </div>
  );
}
