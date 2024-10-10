import { Metadata } from "next";
import ProjectPage from "./page.client";
export function generateMetadata({
  params,
}: {
  params: { name: string };
}): Metadata {
  return {
    title: `Project - ${params.name}`,
  };
}

export default function Page({ params }: { params: { name: string } }) {
  return <ProjectPage params={params} />;
}
