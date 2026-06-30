type GlyphTileProps = {
  glyph: string;
  selected: boolean;
};

const GlyphTile = ({ glyph, selected }: GlyphTileProps) => (
  <div
    className={`w-10 h-10 rounded-md grid place-items-center text-[18px] border ${
      selected
        ? 'bg-tertiary text-[var(--color-bg-primary-400)] border-[var(--color-bg-tertiary)]'
        : 'bg-primary-400 text-tertiary border-[rgba(224,180,4,0.45)]'
    }`}
  >
    {glyph}
  </div>
);

export default GlyphTile;
