import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { docs } from '@velite';
import DocContent from '@/components/organisms/doc-content';

export const metadata: Metadata = {
  title: 'The Backroom',
};

export default function BackroomOverview() {
  const doc = docs.find(d => d.section === 'Overview');
  if (!doc) notFound();
  return <DocContent doc={doc} />;
}
