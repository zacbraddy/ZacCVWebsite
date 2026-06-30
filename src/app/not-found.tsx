import type { Metadata } from 'next';
import SiteShell from '@/components/organisms/site-shell';
import NotFoundContent from '@/components/organisms/not-found-content';

export const metadata: Metadata = {
  title: { absolute: '404: Not found - Zac Braddy' },
};

export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
