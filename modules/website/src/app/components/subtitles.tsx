import { BrefHit } from '../types';

const Subtitle = ({ hit }: { hit: BrefHit }) => {
  const value = hit._highlightResult.line.content.value;
  return (
    <div className="absolute bottom-4 text-center w-full z-[9] pointer-events-none">
      <div className="text-md bg-black/80 text-white whitespace-pre-line inline-block p-2 rounded-lg max-w-[90%] font-bold select-none">
        <span dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    </div>
  );
};

export default Subtitle;
