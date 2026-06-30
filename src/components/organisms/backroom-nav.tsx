import { docs, type Doc } from '@velite';

import SectionLabel from '@/components/atoms/section-label';
import BackroomNavRow from '@/components/molecules/backroom-nav-row';

const SECTION_ORDER: Doc['section'][] = [
  'Overview',
  'Decisions',
  'Pragmatism & process',
];

const sortSection = (section: Doc['section'], sectionDocs: Doc[]) =>
  [...sectionDocs].sort(
    (a, b) =>
      (section === 'Decisions'
        ? (a.adr ?? 0) - (b.adr ?? 0)
        : a.order - b.order) || a.slug.localeCompare(b.slug),
  );

const BackroomNav = () => (
  <>
    {SECTION_ORDER.map(section => {
      const sectionDocs = sortSection(
        section,
        docs.filter(doc => doc.section === section),
      );
      if (sectionDocs.length === 0) return null;

      return (
        <div key={section}>
          <SectionLabel>{section}</SectionLabel>
          {sectionDocs.map(doc => (
            <BackroomNavRow
              key={doc.slug}
              href={
                doc.section === 'Overview'
                  ? '/backroom'
                  : `/backroom/${doc.slug}`
              }
              title={doc.title}
              teaser={doc.teaser}
              section={doc.section}
              adr={doc.adr}
            />
          ))}
        </div>
      );
    })}
  </>
);

export default BackroomNav;
