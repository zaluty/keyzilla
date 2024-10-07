import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import { defineCollections } from 'fumadocs-mdx/config';

export const { docs, meta } = defineDocs();
export const { docs: packageDocs, meta: packageMeta } = defineDocs();
export default defineConfig( );

 