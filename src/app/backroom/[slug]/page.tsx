import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { docs } from '@velite';
import DocContent from '@/components/organisms/doc-content';

export const dynamicParams = false;

export function generateStaticParams() {
  return docs
    .filter(doc => doc.section !== 'Overview')
    .map(doc => ({ slug: doc.slug }));
}

type DocPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = docs.find(d => d.slug === slug);
  return { title: doc?.title ?? '404: Not found' };
}

export default async function BackroomDoc({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = docs.find(d => d.slug === slug);
  if (!doc) notFound();
  return <DocContent doc={doc} />;
}
