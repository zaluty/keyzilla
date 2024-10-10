import Secrets from "./page.client";

export function generateMetadata({ params }: { params: { name: string } }) {
  return {
    title: `Secrets - keyzilla`,
  };
}

export default function Page() {
  return <Secrets />;
}
