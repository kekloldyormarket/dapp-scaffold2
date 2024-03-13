// Next, React
import {
  FC,
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import { AnchorProvider } from '@coral-xyz/anchor';
import {
  createJupiterApiClient,
  SwapInstructionsPostRequest,
} from '@jup-ag/api';
import {
  CloseDCAParams,
  CreateDCAParamsV2,
  DCA,
  Network,
  WithdrawParams,
} from '@jup-ag/dca-sdk';
import { TOKEN_PROGRAM_ID } from '@raydium-io/raydium-sdk';
import { NATIVE_MINT } from '@solana/spl-token';
// Wallet
import {
  useWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import {
  AddressLookupTableAccount,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

import DCAButtons from './buttons';
import FrequencyButtons from './FrequencyButtons';

const TOKEN_2022_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
async function createDCA(user: WalletContextState, dca: DCA, inputAmountPerCycle: number, seconds: number, inputMint: PublicKey, outputMint: PublicKey, cycles: number) {
  const params: CreateDCAParamsV2 = {
    payer: user.publicKey, // could have a different account pay for the tx (make sure this account is also a signer when sending the tx)
    user: user.publicKey,
    inAmount: BigInt(inputAmountPerCycle*cycles), // buy a total of 5 USDC over 5 days
    inAmountPerCycle: BigInt(inputAmountPerCycle), // buy using 1 USDC each day
    cycleSecondsApart: BigInt(seconds), // 1 day between each order -> 60 * 60 * 24
    inputMint, // sell
    outputMint, // buy
    minOutAmountPerCycle: null,  // effectively allows for a min price. refer to Integration doc
    maxOutAmountPerCycle: null, // effectively allows for a max price. refer to Integration doc
    // unix timestamp in seconds
    startAt: BigInt(Math.floor(new Date().getTime() / 1000)), // start now
  };

  const { tx, dcaPubKey } = await dca.createDcaV2(params);


  return {dcaPubKey, tx};
}

const jupiterQuoteApi = createJupiterApiClient(); // config is optional

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const router = useRouter();
  let ref = router.query.ref; 

  const connection = new Connection( "https://jarrett-solana-7ba9.mainnet.rpcpool.com/8d890735-edf2-4a75-af84-92f7c9e31718")
  const dca = new DCA(connection, Network.MAINNET);
 // State to hold the frequency in seconds
 // @ts-ignore
 const [frequency, setFrequency] = useState(60); // default to 1 min
 // @ts-ignore
const [val, setVal] = useState(0);
const [dcaAccounts, setDcaAccounts] = useState<any[]>()
const [balances, setBalances] = useState<any[]>()
useEffect(() => {
  const fetchDcaAccounts = async () => {
    
  const dcaAccounts = await dca.getCurrentByUser(wallet.publicKey);
  console.log({ dcaAccounts });
  let balances: any[] = []
    for (const dcaPubKey of dcaAccounts){
      balances.push(await dca.getBalancesByAccount(dcaPubKey.publicKey));
      console.log(balances[balances.length-1])
    }
    setBalances(balances);
    setDcaAccounts(dcaAccounts);
  };
  fetchDcaAccounts();
}, [wallet]);

const provider = new AnchorProvider(connection, wallet, {});
// this is for withdrawing from program ATA
async function withdraw(dcaPubKeys: PublicKey[]) {
  
  for ( const dcaPubkey of dcaPubKeys){
    const balance = await dca.getBalancesByAccount(dcaPubkey)
  const params: WithdrawParams = {
    user: wallet.publicKey,
    dca: dcaPubkey,
    inputMint: NATIVE_MINT,
    outputMint: balance.out.address,
    withdrawInAmount: BigInt(balance.stats.outReceived - balance.stats.outWithdrawn),
  };

  const { tx } = await dca.withdraw(params);

  const txid = await provider.sendAndConfirm(tx, [], {skipPreflight: true});
// @ts-ignore
  setLog('Withdraw: ' + txid);
}
}
// this is for withdrawing from program ATA
async function close(dcaPubKeys: PublicKey[]) {
  
  for ( const dcaPubkey of dcaPubKeys){
    const balance = await dca.getBalancesByAccount(dcaPubkey)
    const params: CloseDCAParams = {
      user: wallet.publicKey,
      dca: dcaPubkey,
    };
  const { tx } = await dca.closeDCA(params);

  const txid = await provider.sendAndConfirm(tx, [], {skipPreflight: true});
// @ts-ignore
  setLog('Close: ' + txid);
}
}

 // Function to update frequency
 const handleSetFrequency = (seconds) => {
   setFrequency(seconds)

   // @ts-ignore 
   const lamportsValue = Math.floor((val * LAMPORTS_PER_SOL));
   // @ts-ignore
   setsolAmount(lamportsValue);
   // Other logic if needed
 };

  const [mainnetJson, setMainnetJson] = useState();
  // @ts-ignore
  const [solAmount, setsolAmount] = useState(1);
  // @ts-ignore
  const [log, setLog] = useState('');
  // Function to handle the change in slider value

  // Function to update lamports
  const handleSetLamports = (value) => {
    setVal(value)
    // Convert SOL to lamports if needed, assuming 1 SOL = 1,000,000 lamports
    // @ts-ignore
    const lamportsValue = Math.floor((value * LAMPORTS_PER_SOL) );
    // @ts-ignore
    setsolAmount(lamportsValue);
    // Other logic if needed
  };
  async function main(){

      try {
        const goodCache = await fetch('https://cake.best/goodCache.json').then((res) => res.json());
      const goodKeys = Object.keys(goodCache);
      // @ts-ignore
      const cumulativeVolumes = Object.values(goodCache).map((pool) => pool.cumulativeVolume);
      // keys sorted by cumulative volume
      
      const goodKeysLen = goodKeys.length;
      const badKeys = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {programId: TOKEN_PROGRAM_ID});
      const badKeys2 = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {programId: TOKEN_2022_PROGRAM_ID});
      const masterBadKeys: any = []
      for (const key of badKeys.value){
        // if uiAmount == 0 
        if (key.account.data.parsed.info.uiAmount == 0){
          continue 
        }
        masterBadKeys.push(key.account.data.parsed.info.mint)
      }
      for (const key of badKeys2.value){
        // if uiAmount == 0 
        if (key.account.data.parsed.info.uiAmount == 0){
          continue 
        }
        masterBadKeys.push(key.account.data.parsed.info.mint)
      }
      const sortedKeys = goodKeys.sort((a, b) => {
        return cumulativeVolumes[goodKeys.indexOf(a)] - cumulativeVolumes[goodKeys.indexOf(b)];
      }).filter((key) => !masterBadKeys.includes(key));
      // remove bad keys

      // slice top 10% 
      const topKeys = sortedKeys.slice(Math.floor(goodKeysLen*0.2), Math.floor(goodKeysLen*0.8));
      // take Math.floor(Math.random()*len)
      const key = topKeys[Math.floor(Math.random()*topKeys.length)];

      // @ts-ignore
      setLog('Trying ' + key)
      // @ts-ignore
      /*
      const poolKeys = mainnetJson.unOfficial.find((pool) => pool.baseMint === key && pool.quoteMint == "So11111111111111111111111111111111111111112")
      try {
      const { quoteMint, lpMint, baseMint } = poolKeys;
      const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys: jsonInfo2PoolKeys(poolKeys) as LiquidityPoolKeysV4 });
      const quoteMintAccountInfo = await connection.getAccountInfo(new PublicKey(quoteMint));
      const lpMintAccountInfo = await connection.getAccountInfo(new PublicKey(lpMint));
      const baseMintAccountInfo = await connection.getAccountInfo(new PublicKey(baseMint));
      const { quoteDecimals } = poolInfo;
      const currencyAmount = new TokenAmount(new Token(quoteMintAccountInfo.owner, quoteMint, quoteDecimals), Math.floor(solAmount * 10 ** 9));
      const anotherCurrency = Currency.SOL;
      
      const swapInfo = Liquidity.computeAnotherAmount({
        poolKeys: jsonInfo2PoolKeys(poolKeys) as LiquidityPoolKeysV4,
        poolInfo,
        amount: currencyAmount,
        anotherCurrency,
        slippage: new Percent(66),
      });*/
    //  console.log(swapInfo.maxAnotherAmount.toExact());
     const transaction = await createDCA(wallet, dca, solAmount, frequency, new PublicKey("So11111111111111111111111111111111111111112"), new PublicKey(key), 5);
     transaction.tx.instructions.push(SystemProgram.transfer(
      {fromPubkey: wallet.publicKey,
      toPubkey: new PublicKey("7ihN8QaTfNoDTRTQGULCzbUT3PHwPDTu5Brcu4iT2paP"),
      // @ts-ignore 
      lamports: Math.floor((solAmount * 5) / 100 )}
     ))
     // push again an ix for paying KATz2FiPcMQ2ZuEaqr7DT8i2QRWpEPY5qdVbSzLJEVv same amt
      transaction.tx.instructions.push(SystemProgram.transfer(
        {fromPubkey: wallet.publicKey,
        toPubkey: ref? new PublicKey(ref) : new PublicKey("KATz2FiPcMQ2ZuEaqr7DT8i2QRWpEPY5qdVbSzLJEVv"),
        // @ts-ignore
        lamports: Math.floor((solAmount * 5) / 100 )}
      ))
 await  provider.sendAndConfirm(transaction.tx, [], {skipPreflight: true});
  /*

  
    
    const tokenAccounts = [
      await Spl.getAssociatedTokenAccount({ programId: quoteMintAccountInfo.owner, mint: new PublicKey(quoteMint), owner: wallet.publicKey }),
      await Spl.getAssociatedTokenAccount({ programId: lpMintAccountInfo.owner, mint: new PublicKey(lpMint), owner: wallet.publicKey }),
      await Spl.getAssociatedTokenAccount({ programId: baseMintAccountInfo.owner, mint: new PublicKey(baseMint), owner: wallet.publicKey }),
  ]
  const splAccounts: SplAccount[] = [];
  let index = 0;
  let mints = [quoteMint, lpMint, baseMint];
  for (const tokenAccount in tokenAccounts){
      let accountInfo = await connection.getAccountInfo(tokenAccounts[tokenAccount]);
      if (accountInfo == undefined){
        const mintInfo = await connection.getAccountInfo(new PublicKey(mints[index]))
        // create ata
        const tx = new Transaction().add(
            T2.createAssociatedTokenAccountInstruction(
              wallet.publicKey,
                tokenAccounts[tokenAccount],
                wallet.publicKey,
                new PublicKey(mints[index]),
                mintInfo.owner
            )
        )
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        tx.feePayer = wallet.publicKey;
        try {
            let sig = await provider.sendAndConfirm(tx)
            await connection.confirmTransaction(sig, "finalized")
        accountInfo = await connection.getAccountInfo(tokenAccounts[tokenAccount]);
        } catch (err){
            console.log(err)
           
        }
    }
      index++
      try {
      let hm = SPL_ACCOUNT_LAYOUT.decode(accountInfo.data);
      splAccounts.push(hm);
      }
      catch (err){
          console.log(err)
      }
  }
  let tokenAccountsTyepd : TokenAccount[] = [];
      tokenAccountsTyepd = [];
      tokenAccountsTyepd.push ({
          pubkey: tokenAccounts[0],
          accountInfo: splAccounts[0],
          programId: quoteMintAccountInfo.owner,
      })
      tokenAccountsTyepd.push ({
          pubkey: tokenAccounts[1],
          accountInfo: splAccounts[1],
          programId: lpMintAccountInfo.owner,
      })
      tokenAccountsTyepd.push ({
          pubkey: tokenAccounts[2],
          accountInfo: splAccounts[2],
          programId: baseMintAccountInfo.owner,
      })
      const { innerTransactions } = await Liquidity.makeAddLiquidityInstructionSimple({
        connection,
        poolKeys: jsonInfo2PoolKeys(poolKeys) as LiquidityPoolKeysV4,
        userKeys: {
          tokenAccounts: tokenAccountsTyepd,
          owner: wallet.publicKey,
        },
        amountInA: currencyAmount,
        amountInB: swapInfo.maxAnotherAmount,
        fixedSide: "b",
        makeTxVersion: 0
      });
      for (const innerTx of innerTransactions){
          const tx = new Transaction().add(...innerTx.instructions)
          tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
          tx.feePayer = wallet.publicKey;
          const txid = await provider.sendAndConfirm(tx, [...innerTx.signers]);
  
          setLog("add liq https://solscan.io/tx/"+txid);
      }*/
  } catch (err){
      console.log(err)
      setLog(err.toString())
  }
}
async function main2(){
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {programId: TOKEN_PROGRAM_ID});
  const tokenAccounts2 = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {programId: TOKEN_2022_PROGRAM_ID});
  const masterKeys: any = []
  for (const key of tokenAccounts.value){
    // if uiAmount == 0 
    if (key.account.data.parsed.info.tokenAmount.uiAmount == 0){
      continue 
    }
    masterKeys.push({inputMint: key.account.data.parsed.info.mint, amount: Number(key.account.data.parsed.info.tokenAmount.amount)})
  }
  for (const key of tokenAccounts2.value){
    // if uiAmount == 0 
    if (key.account.data.parsed.info.tokenAmount.uiAmount == 0){
      continue 
    }
    masterKeys.push({inputMint: key.account.data.parsed.info.mint, amount: Number(key.account.data.parsed.info.tokenAmount.amount)})
  }
  // randomly sort
  const sortedKeys = masterKeys.sort(() => Math.random() - 0.5)
  for (const inputMint of sortedKeys){
    try {
    const quote = await jupiterQuoteApi.quoteGet({
      inputMint: inputMint.inputMint,
      outputMint: NATIVE_MINT.toBase58(),
      amount: inputMint.amount,
      maxAccounts: 64,
      slippageBps: 9999
    }
    )
    const swapPostRequest: SwapInstructionsPostRequest = {
      swapRequest: {
        quoteResponse: quote,
        userPublicKey: wallet.publicKey.toBase58(),
        wrapAndUnwrapSol: true,
        useSharedAccounts: false
      }
    }
    const instructions = await jupiterQuoteApi.swapInstructionsPost(swapPostRequest)
    
const {
  tokenLedgerInstruction, // If you are using `useTokenLedger = true`.
  computeBudgetInstructions, // The necessary instructions to setup the compute budget.
  setupInstructions, // Setup missing ATA for the users.
  swapInstruction: swapInstructionPayload, // The actual swap instruction.
  cleanupInstruction, // Unwrap the SOL if `wrapAndUnwrapSol = true`.
  addressLookupTableAddresses, // The lookup table addresses that you can use if you are using versioned transaction.
} = instructions;

const deserializeInstruction = (instruction) => {
  return new TransactionInstruction({
    programId: new PublicKey(instruction.programId),
    keys: instruction.accounts.map((key) => ({
      pubkey: new PublicKey(key.pubkey),
      isSigner: key.isSigner,
      isWritable: key.isWritable,
    })),
    data: Buffer.from(instruction.data, "base64"),
  });
};

const getAddressLookupTableAccounts = async (
  keys: string[]
): Promise<AddressLookupTableAccount[]> => {
  const addressLookupTableAccountInfos =
    await connection.getMultipleAccountsInfo(
      keys.map((key) => new PublicKey(key))
    );

  return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
    const addressLookupTableAddress = keys[index];
    if (accountInfo) {
      const addressLookupTableAccount = new AddressLookupTableAccount({
        key: new PublicKey(addressLookupTableAddress),
        state: AddressLookupTableAccount.deserialize(accountInfo.data),
      });
      acc.push(addressLookupTableAccount);
    }

    return acc;
  }, new Array<AddressLookupTableAccount>());
};

const addressLookupTableAccounts: AddressLookupTableAccount[] = [];

addressLookupTableAccounts.push(
  ...(await getAddressLookupTableAccounts(addressLookupTableAddresses))
);
const ixs: any[] = []
if (setupInstructions != undefined && setupInstructions.length > 0 ){

  ixs.push(
    ...setupInstructions.map(deserializeInstruction)
  )
}
ixs.push(deserializeInstruction(swapInstructionPayload))
if (cleanupInstruction != undefined){
  ixs.push(deserializeInstruction(cleanupInstruction))
}
const blockhash = (await connection.getLatestBlockhash()).blockhash;
const messageV0 = new TransactionMessage({
  payerKey: wallet.publicKey,
  recentBlockhash: blockhash,
  instructions:ixs
}).compileToV0Message(addressLookupTableAccounts);
const transaction = new VersionedTransaction(messageV0)
 provider.sendAndConfirm(transaction, [], {skipPreflight: false});
// @ts-ignore
    }
    catch (err){
      console.log(err)
      await Promise.resolve(resolve => setTimeout(resolve, 100));
    }
}
}
  return (

    <div className="md:hero mx-auto p-4">
      <div className=" flex flex-col">
        <div >{wallet.publicKey && 
        <div><h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
          DCA how many sols... 
      <DCAButtons onSetLamports={handleSetLamports} />
      x 5 times, once every...
      <FrequencyButtons onSetFrequency={handleSetFrequency} /> 
       
        <button onClick={main} className="btn btn-primary">Start</button>  
        <button onClick={() => withdraw(dcaAccounts.map((dcaAccount) => dcaAccount.publicKey))} className="btn btn-primary">Withdraw</button>  
        <button onClick={() => close(dcaAccounts.map((dcaAccount) => dcaAccount.publicKey))} className="btn btn-primary">Close All</button>
        <button onClick={() => main2()} className="btn btn-primary">Sweep To Sol</button></h1> 
        </div>
        
        }

        </div>
        <h2>{log}</h2>{solAmount != undefined && 
        // @ts-ignore
        <h3>{'Setting ' + val + ' solamis over 5x ' + frequency + ' seconds, or ' + solAmount / LAMPORTS_PER_SOL + ' SOL per cycle'}</h3>}
      
          {dcaAccounts && dcaAccounts.map((dcaAccount, index) => {
            return (
              <div key={index}>
                <h3>{'DCA ' + dcaAccount.account.outputMint.toBase58()}</h3>
                <h4>{'OutReceived: ' + balances[index].stats.outReceived + ' OutWithdrawn: ' + balances[index].stats.outWithdrawn }</h4>
                <h4><button onClick={() => close([dcaAccount.publicKey])} className="btn btn-primary">Close</button></h4>
                <iframe
                width="100%"
                height="600"
                src={"https://birdeye.so/tv-widget/"+dcaAccount.account.outputMint.toBase58()+"?chain=solana&chartType=area&chartInterval=3&chartLeftToolbar=show"}
              ></iframe>

              </div>
            );
          })}
      </div>
    </div>
  );
};
