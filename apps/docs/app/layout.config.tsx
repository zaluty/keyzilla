import { type HomeLayoutProps } from 'fumadocs-ui/home-layout';
import { FileText, Pencil, Package } from 'lucide-react';
/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: HomeLayoutProps = {
  githubUrl: 'https://github.com/zaluty/keyzilla',
  nav: {
    title: 'Keyzilla',
  },
  links: [
    {
      text: 'Documentation',
      url: '/docs',
      active: 'nested-url',
      icon: <FileText />,
    },
    {
      text: 'Changelog',
      url: '/changelog',
      active: 'nested-url',
      icon: <Pencil />,
    },
    {
      label: 'Package Docs for contributors',
      text: 'Package',
      url: '/package',
      active: 'nested-url',
      icon: <Package />,
    },
  ],
};

