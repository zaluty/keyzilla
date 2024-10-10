import Org from "./org.client";

export function generateMetadata({ params }: { params: { name: string } }) {
  return {
    title: `Organization Settings - keyzilla`,
  };
}

export default function Page() {
  return <Org />;
}
