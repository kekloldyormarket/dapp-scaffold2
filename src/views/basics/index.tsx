import {
  FC,
  useEffect,
  useState,
} from 'react';

import JupiterForm from './JupiterForm';

export const BasicsView: FC = ({ }) => {
const [goodTokens, setGoodTokens] = useState([]);
useEffect(() => {
  fetch('https://cake.best/goodCache.json')
    .then(response => response.json())
    .then(data => {
      setGoodTokens(Object.keys(data));
    });
}
, []);
  return (
    <>

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Swap
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          {goodTokens.length > 0 ? (
            <div>
              <h2 className="text-3xl font-bold mb-4">Good Tokens</h2>
              {goodTokens.map((token: any) => {

  return (
    <div key={token}>
                     <JupiterForm INPUT_MINT_ADDRESS={'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'} OUTPUT_MINT_ADDRESS={token} />

    </div>
  );
              }
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold mb-4">Loading...</h2>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};
