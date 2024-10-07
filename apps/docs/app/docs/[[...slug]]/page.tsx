import { source } from '@/app/source';
import type { Metadata } from 'next';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Callout } from 'fumadocs-ui/components/callout';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
export default async function Page({
  params,
}: {
  params: { slug?: string[] };
}) {
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
 const path = `apps/docs/content/docs/${page.file.path}`;
  return (
    <DocsPage     tableOfContent={{
      style: 'clerk',
      single: false,
    }}
    editOnGithub={{
      repo: 'keyzilla',
      owner: 'zaluty',  
      sha: 'main',
      path,
    }} toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription >{page.data.description}</DocsDescription>
      <DocsBody >
        <MDX  components={{ ...defaultMdxComponents, Callout, Steps, Step,   img: (props) => <ImageZoom {...(props as any)} />   }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}
