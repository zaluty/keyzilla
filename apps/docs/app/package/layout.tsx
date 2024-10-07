import { DocsLayout } from 'fumadocs-ui/layout';
import type { ReactNode } from 'react';
import { baseOptions } from '../layout.config';
import { packageSource as  source } from '@/app/source';
import { Banner } from 'fumadocs-ui/components/banner';
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={source.pageTree} {...baseOptions}   >
    
      
      {children}
    </DocsLayout>
  );
}
