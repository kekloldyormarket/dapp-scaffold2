import Head from 'next/head';
import TweetEmbed from 'react-tweet-embed';
import { HomeView } from 'views';

import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const wallet = useWallet();

  return (
    <>
      <Head>
        <title>Welcome to Solami: The Frontier of DeFi DCA</title>
        <meta name="description" content="Discover the next leap in DeFi investing with Solami's DCA tool." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
            
            {!wallet.connected ? (

      <main className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-r from-blue-500 to-purple-600">
        <section className="ytext-center p-10">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to Solami: The Frontier of DeFi DCA
          </h1>
          <h2 className="text-3xl font-light mb-6">
            Harness the Uncharted, Directly on Solana
          </h2>
          <p className="text-xl mb-8">
            Automate Your Investment, Innovate Your Strategy
          </p>
          <p className="text-lg font-light">
            Solami presents the next leap in DeFi investing – a Dollar-Cost Averaging (DCA) tool that ventures beyond the beaten path. Discover. Decide. DCA.
          </p>
          <div className="my-10">
          <section className="my-8">
            <button className="btn btn-primary" >
              Connect Wallet in top right..
            </button>
          </section>
        
          </div>
        </section>

        <section className="bg-white text-gray-800 p-10 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-3">Empower Your Portfolio with Intelligent Automation</h3>
          <ul className="list-disc list-inside mb-6">
            <li>Connect your wallet in seconds.</li>
            <li>Tailor your DCA frequency to match your investment pace.</li>
            <li>Stay ahead with data from our smart scraper that navigates the nuances of new tokens.</li>
          </ul>
          <h3 className="text-2xl font-semibold mb-3">Invest in Tomorrow, Today</h3>
          <p>
            Join Solami where opportunity meets innovation. Step into a world where your investments are as dynamic as the markets they inhabit.
          </p>
        </section>
      </main>
            ) : (
              <HomeView/>
            )}
<TweetEmbed tweetId="1766949794591740398" />
      <footer className="bg-gray-900 text-white text-center p-4">
        Solami – Where New Tokens Shine & Strategies Evolve
      </footer>
    </>
  );
}
