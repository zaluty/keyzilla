import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const beforeCode = `
export async function GET() {
  const apiKey = process.env.API_KEY;
  return { message: \`API Key: \${apiKey}\` };
}`;

const afterCode = `
import { k } from 'keyzilla';  // <----- Import Keyzilla

export async function GET() {
  const apiKey = k.API_KEY; // <----- Get the API key using Keyzilla
  return { message: \`API Key: \${apiKey}\` }; // 123
}`;

export default function KeyzillaComparison() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      <h1 className="bg-background text-3xl font-bold text-center mb-8">
        Keyzilla Comparison
      </h1>
      <ComparisonGrid />
      <DifferencesList />
    </div>
  );
}

function ComparisonGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <ComparisonBlock title="Before Keyzilla" code={beforeCode} />
      <ComparisonBlock title="After Keyzilla" code={afterCode} />
    </div>
  );
}

function ComparisonBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="bg-card rounded-lg overflow-hidden shadow-lg">
        <SyntaxHighlighter
          language="typescript"
          style={atomOneDark}
          customStyle={{ padding: "1.5rem" }}
          className="text-sm md:text-base"
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function DifferencesList() {
  const differences = [
    {
      label: "Added import for Keyzilla:",
      code: "import { k } from 'keyzilla';",
    },
    {
      label: "Changed API key retrieval from",
      oldCode: "process.env.API_KEY",
      newCode: "k.API_KEY",
    },
    {
      label: "Improved security:",
      description:
        "Keyzilla helps prevent accidental exposure of API keys in version control.",
    },
    {
      label: "Simplified management:",
      description:
        "Centralized key management with Keyzilla makes it easier to update and rotate keys.",
    },
  ];

  return (
    <div className="bg-card shadow-lg rounded-lg p-8">
      <h3 className="text-2xl font-semibold mb-6">Key Differences</h3>
      <ul className="space-y-4">
        {differences.map((diff, index) => (
          <DifferenceItem key={index} {...diff} />
        ))}
      </ul>
    </div>
  );
}

function DifferenceItem({
  label,
  code,
  oldCode,
  newCode,
  description,
}: {
  label: string;
  code?: string;
  oldCode?: string;
  newCode?: string;
  description?: string;
}) {
  return (
    <li className="flex items-start">
      <span className="text-[hsl(var(--color-1))] mr-2">•</span>
      <span>
        {label} {code && <CodeSnippet code={code} />}
        {oldCode && (
          <>
            <CodeSnippet code={oldCode} /> to{" "}
            <CodeSnippet code={newCode || ""} />
          </>
        )}
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </span>
    </li>
  );
}

function CodeSnippet({ code }: { code: string }) {
  return (
    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{code}</code>
  );
}
