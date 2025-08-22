export default function LogicPreview() {
  const mockLogic = `
export default async function handler(input) {
  return "Hello from Agent Alpha!";
}
`;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Logic Preview</h2>
      <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
        <code>{mockLogic}</code>
      </pre>
    </div>
  );
}
