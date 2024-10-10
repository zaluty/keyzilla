import { Metadata } from "next";

export function GenerateMetadata({
  params,
}: {
  params: { name: string };
}): Metadata {
  return {
    title: `Project - ${params.name}`,
  };
}
