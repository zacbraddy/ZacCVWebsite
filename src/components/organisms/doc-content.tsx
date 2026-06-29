import type { Doc } from '@velite';
import styles from './doc-content.module.css';

type DocContentProps = {
  doc: Doc;
};

const DocContent = ({ doc }: DocContentProps) => (
  <article>
    <header className="mb-8">
      <p className="text-secondary text-[13px] font-semibold uppercase tracking-[0.04em]">
        {doc.section}
      </p>
      <h1 className="font-fancy-heading text-secondary text-[38px] leading-[1.1] mt-2">
        {doc.title}
      </h1>
      {doc.adr !== undefined && (
        <p className="text-dim text-sm mt-3">
          ADR {String(doc.adr).padStart(4, '0')}
        </p>
      )}
    </header>
    <div
      className={styles.docContent}
      dangerouslySetInnerHTML={{ __html: doc.content }}
    />
  </article>
);

export default DocContent;
