import { notFound } from 'next/navigation';

import { blog } from '../../../lib/source';

export const dynamicParams = false;

export const generateStaticParams = () => blog.getPages().map((page) => ({ slug: page.slugs[0] }));

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = blog.getPage([slug]);
    if (!page) notFound();

    return <h1>{page.data.title}</h1>;
}
