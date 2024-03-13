import fs from 'fs';
import fetch from 'node-fetch';

import { getAssociatedTokenAddress } from '@solana/spl-token';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js';

import {
  Clmm,
  PoolInfoLayout,
} from './raydium-sdk';

const pubkeys = JSON.parse(fs.readFileSync('../pubkeys123.json', 'utf-8'))
console.log(pubkeys)
const targets: any [] =  []
const connection = new Connection(process.env.CONNECTION as string)

const CLMM = new PublicKey("CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK")

const getClmm = async () => {
    const ammPoolsApiInfo = (await(await fetch("https://api.raydium.io/v2/ammV3/ammPools")).json()).data
    const ids = ammPoolsApiInfo.map((amm: any) => amm.id)
    const clmm = await connection.getParsedProgramAccounts(CLMM, {
        filters: [
            {
                dataSize: 1544,
            },
        ]
    })
    for (const amm of clmm) {
            const decoded = PoolInfoLayout.decode(amm.account.data as Buffer)
            const creator = decoded.creator.toBase58()
            if (["7ihN8QaTfNoDTRTQGULCzbUT3PHwPDTu5Brcu4iT2paP"].includes(creator)) {
                try {
                let collectFundFeeIxs = (await Clmm.makeCollectFundFeeInstructions({
                    poolInfo: {...decoded, programId: CLMM, id: amm.pubkey},
                    ownerInfo: {
                        wallet: new PublicKey("7ihN8QaTfNoDTRTQGULCzbUT3PHwPDTu5Brcu4iT2paP"),
                        tokenAccountA:await getAssociatedTokenAddress(
                            decoded.mintA,
                            new PublicKey("7ihN8QaTfNoDTRTQGULCzbUT3PHwPDTu5Brcu4iT2paP")
                        ),
                        tokenAccountB:await getAssociatedTokenAddress(
                            decoded.mintB,
                            new PublicKey("7ihN8QaTfNoDTRTQGULCzbUT3PHwPDTu5Brcu4iT2paP")
                        )
                    }
              
                  })).innerTransaction.instructions
                  console.log(...collectFundFeeIxs)
                  let tx = new Transaction().add(...collectFundFeeIxs)
                tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash
                tx.feePayer = new PublicKey("7ihN8QaTfNoDTRTQGULCzbUT3PHwPDTu5Brcu4iT2paP")
                let sig = await connection.sendTransaction(tx, [Keypair.fromSecretKey(
                    new Uint8Array(
                        JSON.parse(
                            fs.readFileSync("/home/ubuntu/7i.json", "utf-8")

                        )
                    )
                )])
                console.log('https://solscan.io/tx/' + sig)
                        }
                catch (e) {
                    console.log(e)
                }
            }

                  
    }

}
getClmm()
