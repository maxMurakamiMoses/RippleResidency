// /app/api/saveVoteToLedger/route.js

'use server';

import { NextResponse } from 'next/server';
import { Client, Wallet } from 'xrpl';

export async function POST(request) {
  try {
    const { candidateName } = await request.json();
    console.log('Received candidateName:', candidateName);

    const seed = process.env.XRPL_SEED;
    const seed2 = process.env.XRPL_SEED2;
    if (!seed || !seed2) {
      throw new Error('XRPL_SEED or XRPL_SEED2 is not set in environment variables');
    }

    const wallet = Wallet.fromSeed(seed);
    const destinationWallet = Wallet.fromSeed(seed2);

    const client = new Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();
    console.log('Connected to testnet!');

    const memoData = { vote: candidateName };
    const memoHex = Buffer.from(JSON.stringify(memoData), 'utf8').toString('hex');
    console.log('Original Memo: ', memoData);
    console.log('Hex memo: ', memoHex);


    const preparedTx = await client.autofill({
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: '1', 
      Destination: destinationWallet.address, 
      Memos: [{ Memo: { MemoData: memoHex } }],
    });

    preparedTx.LastLedgerSequence += 1;

    const signedTx = wallet.sign(preparedTx);
    const txResult = await client.submitAndWait(signedTx.tx_blob);

    console.log('Transaction result:', txResult.result.meta.TransactionResult);

    await client.disconnect();

    if (txResult.result.meta.TransactionResult === 'tesSUCCESS') {
      return NextResponse.json(
        {
          success: true,
          detail: 'Vote saved successfully',
          txHash: txResult.result.hash,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          detail: `Transaction failed with result code ${txResult.result.meta.TransactionResult}`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error saving vote to ledger:', error);
    return NextResponse.json(
      { success: false, detail: `Vote saving failed: ${error.message}` },
      { status: 500 }
    );
  }
}
