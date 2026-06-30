type NumberTileProps = {
  adr: number;
  selected: boolean;
};

const NumberTile = ({ adr, selected }: NumberTileProps) => (
  <div
    className={`w-10 h-10 rounded-md grid place-items-center text-[15px] font-bold border ${
      selected
        ? 'bg-secondary text-[var(--color-bg-primary-400)] border-secondary'
        : 'bg-primary-400 text-secondary border-[rgba(4,180,224,0.4)]'
    }`}
  >
    {String(adr).padStart(2, '0')}
  </div>
);

export default NumberTile;
