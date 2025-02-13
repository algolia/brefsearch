import { useHits } from 'react-instantsearch';
import Image from 'next/image';
/*[
    {
        "episode": {
            "durationHuman": "1:48",
            "durationInSeconds": 108,
            "index": 1,
            "name": "J'ai dragué cette fille.",
            "slug": "brefJaiDragueCetteFille",
            "videoId": "UO8tcf3U0dY"
        },
        "line": {
            "content": "Alors, c'est ma soirée ou c'est pas ma soirée là ?",
            "end": 2,
            "index": 0,
            "start": 0,
            "url": "https://www.youtube.com/watch?v=UO8tcf3U0dY&t=0s"
        },
        "thumbnail": {
            "hash": "38d4efb9c0",
            "height": 1080,
            "lqip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAJCAIAAAC0SDtlAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRDb21tZW50AG9yb3NoaV9jb21wcmVzc2VkJoea2wAAAahJREFUeJwVzc9P01AcAPBe1vW9933v9cdrX7tuLaztfhbohGyiziHOhiVkMI1OEtggQTMuhgVPxKAXD8SL0T+AxHjzYuLRf874+Qc+yulgY9rvnuQ754cH3XT77WT89+7rn2/XF5NdT9gIWQebW3tppGoIALAGiqDgMNqJVhcvno8eDK9mJz9ub46H/VE7NihXNT6oJ4M4IBh0SoGAYlMwCIlc+XE2Pdufvp/Pf95+mnR743aSSEct8pq78nKj7up803czz1EkA5cxjvBF/mgxerY8fv391+/p3tG669i6XrG8x0l9ttVqSLEdeLuh/38QlAEiw/XWcj+/eXP6YXk5jpOmaQrO01JFcpnXo5Zr9ypePygpOsEUQ2CJqnTzRvTu1eHdl89HnXtPZHknzQSQYlFv+nFocd/Qs5JUOCGUQGwLwfWH8crTztpiPs+z+1kQel5FUxEQwwBpUCYoqzmWQjEWlLq6rmkgGAO1KE0rKofNxhoGhhEF4GoBqkEa+4EAUELOemUZWMJA0g/bl9dXaS3uVVeHrTZGBCMgGqgFzTZdaTpqAf0D+EhGKMI2PK8AAAAASUVORK5CYII=",
            "url": "https://assets.pixelastic.com/brefsearch/01_brefJaiDragueCetteFille/000.png",
            "width": 1920
        },
        "objectID": "753cedc041fd19b44525c6df806df2934eb6022bf528414357ef1ba6107696e2",
        "_highlightResult": {
            "episode": {
                "name": {
                    "value": "J&#39;ai dragué cette fille.",
                    "matchLevel": "none",
                    "matchedWords": []
                }
            },
            "line": {
                "content": {
                    "value": "Alors, c&#39;est ma soirée ou c&#39;est pas ma soirée là ?",
                    "matchLevel": "none",
                    "matchedWords": []
                }
            }
        }
    },

]*/

const Subtitle = ({ text }: { text: string }) => {
  return (
    <div className="absolute bottom-4 text-center w-full">
      <div className="text-md bg-black/80 text-white  inline-block p-2 rounded-lg max-w-[90%] font-bold">
        {text}
      </div>
    </div>
  );
};

const CustomHits = () => {
  const { results } = useHits();
  const hits = results?.hits;

  console.log(hits);

  if (!hits?.length) {
    return <div className="text-center p-4">No results found</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {hits?.map((hit) => (
        <div key={hit.objectID} className="relative min-h-[340px] w-full">
          <h2 className="font-bold">🎥 {hit.episode.name}</h2>
          <div className="clip grid place-items-center">
            <div className="relative aspect-video w-full">
              <Image
                src={hit.thumbnail.url}
                alt={hit.episode.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={hit.thumbnail.lqip}
                priority={false}
                loader={({ src }) =>
                  // add before src
                  `https://res.cloudinary.com/det9vl8xp/image/fetch/f_auto/q_auto/${src}`
                }
              />
              <Subtitle text={hit.line.content} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomHits;
