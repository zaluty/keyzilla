import { CodeComparison } from "@/components/ui/comparison";

const beforeCode = `import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.API_KEY;
  return NextResponse.json({ message: \`API Key: \${apiKey}\` });
}`;

const afterCode = `import { NextResponse } from 'next/server';
import { k } from 'keyzilla';  < ----- here 

export async function GET() {
  const apiKey = k.API_KEY; < ----- get the api key  using keyzilla
  return NextResponse.json({ message: \`API Key: \${apiKey}\` });
}`;

export default function KeyzillaComparison() {
  return (
    <CodeComparison
      beforeCode={beforeCode}
      afterCode={afterCode}
      language="typescript"
      filename="route.ts"
      lightTheme="github-light"
      darkTheme="github-dark"
    />
  );
}
