import { useEffect, useState } from 'react';
import { splitIntoChunks, hexToBase10, createRandomHash } from './helpers';
import classes from './app.module.css';

const Planet8 = ({ data, order }: { data: string; order: number }) => {
  if (data.length < 8) return null;

  const colorVal = data.slice(1, 7);
  const [angleRaw, skewRaw, sizeRaw] = splitIntoChunks(data, 3);

  const min_size = 10;
  const orbitSize = 2.5 * order;

  const size = (hexToBase10(sizeRaw) % 30) + min_size;
  const skew = hexToBase10(skewRaw) % orbitSize || 1;
  const angle = hexToBase10(angleRaw) % 360;

  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: '50%',
        display: 'grid',
        alignItems: 'center',
        zIndex: 100 - order,
        border: `1px dotted #${colorVal}`,
        width: `min(100%, ${orbitSize}rem)`,
        height: `${skew}rem`,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <div
        style={{
          position: 'relative',
          boxShadow: `0 0 10px 1px #${colorVal}`,
          borderRadius: '50%',
          left: `-${size / 2}px`,
          background: `linear-gradient(${angle}deg, #${colorVal}, #aaa`,
          width: `${size}px`,
          height: `${size}px`,
        }}
      ></div>
    </div>
  );
};

const PlanetSystem = ({ data }: { data: string }) => {
  return (
    <div className={classes.planet_system}>
      {splitIntoChunks(data, 8).map((str, idx) => {
        return <Planet8 key={idx} order={idx + 1} data={str} />;
      })}
    </div>
  );
};

const HashesList = ({ hashes }: { hashes: string[] }) => {
  return (
    <ul className={classes.hashes_list}>
      data set:
      {hashes.map((hash, idx) => {
        return <li key={hash + idx}>{hash}</li>;
      })}
    </ul>
  );
};

const App = () => {
  const [userHash, setUserHash] = useState('');
  const [hashes, setHashes] = useState<string[]>([]);

  useEffect(() => {
    createRandomHash().then(setUserHash);
    Promise.all(Array(10).fill(null).map(createRandomHash)).then(setHashes);
  }, []);

  return (
    <div className={classes.app}>
      <header className={classes.header}>
        <HashesList hashes={[userHash, ...hashes]} />
        <input
          className={classes.hex_input}
          type="text"
          name="hex"
          value={userHash}
          onChange={(e) => {
            if (e.target.value.length > 64) {
              return;
            }

            if (e.target.value === '') {
              setUserHash('');
            } else if (/^[0-9a-fA-F]+$/.test(e.target.value)) {
              setUserHash(e.target.value);
            }
          }}
        />
      </header>
      {[userHash, ...hashes].map((hash, idx) => (
        <PlanetSystem key={hash + idx} data={hash} />
      ))}
    </div>
  );
};

export default App;
