import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';

const posts = defineDocs({
    dir: 'content/blog',
    docs: { files: ['*/index.mdx'] }
});

export const blog = loader({ baseUrl: '/blog', source: posts.toFumadocsSource() });
