import type { Metadata } from 'next';
import NotFoundContent from '@/components/organisms/not-found-content';

export const metadata: Metadata = {
  title: { absolute: '404: Not found - Zac Braddy' },
};

export default function BackroomNotFound() {
  return <NotFoundContent />;
}
