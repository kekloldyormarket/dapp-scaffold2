import type { NextPage } from 'next';
import Head from 'next/head';

import { JupiterProvider } from '@jup-ag/react-hook';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';

import { BasicsView } from '../views';

const Basics: NextPage = (props) => {
  const wallet = useWallet()
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>     
          <JupiterProvider
      connection={new Connection( "https://jarrett-solana-7ba9.mainnet.rpcpool.com/8d890735-edf2-4a75-af84-92f7c9e31718")}
      userPublicKey={wallet.publicKey || undefined}
      routeCacheDuration={60}
    >
      <BasicsView /> </JupiterProvider>
    </div>
  );
};

export default Basics;
