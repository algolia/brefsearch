import { BrefHit } from '../types';
import { formatSubtitle } from '../utils/functions';

const Subtitle = ({ hit }: { hit: BrefHit }) => {
  const value = formatSubtitle(hit._snippetResult.line.content.value);
  return (
    <div className="absolute bottom-4 text-center w-full z-[9] pointer-events-none">
      <div className="text-md bg-black/80 text-white font-bold inline md:inline-block p-2 rounded-lg text-balance whitespace-pre-line max-w-[42ch] box-decoration-clone leading-[2.15em]">
        <span dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    </div>
  );
};

export default Subtitle;
