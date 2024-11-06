// /app/api/sendXrp/route.js

'use server';

import { NextResponse } from 'next/server';
import {
  Client,
  Wallet,
  xrpToDrops,
  isValidClassicAddress,
  getBalanceChanges,
} from 'xrpl';

export async function POST(request) {
  try {
    const { walletAddress } = await request.json();
    console.log('Received walletAddress:', walletAddress);

    const seed = process.env.XRPL_SEED;
    if (!seed) {
      throw new Error('XRPL_SEED is not set in environment variables');
    }

    const wallet = Wallet.fromSeed(seed);

    // Connect to the XRP Ledger Testnet
    const client = new Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    if (!isValidClassicAddress(walletAddress)) {
      await client.disconnect();
      throw new Error('Invalid destination wallet address');
    }

    const preparedTx = await client.autofill({
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: xrpToDrops('5'),
      Destination: walletAddress,
    });

    const signedTx = wallet.sign(preparedTx);

    const txResult = await client.submitAndWait(signedTx.tx_blob);

    console.log(
      'Transaction result:',
      txResult.result.meta.TransactionResult
    );
    console.log(
      'Balance changes:',
      JSON.stringify(getBalanceChanges(txResult.result.meta), null, 2)
    );

    await client.disconnect();

    if (txResult.result.meta.TransactionResult === 'tesSUCCESS') {
      return NextResponse.json(
        {
          success: true,
          detail: 'XRP transfer successful',
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
    console.error('Error sending XRP:', error);
    return NextResponse.json(
      { success: false, detail: `XRP transfer failed: ${error.message}` },
      { status: 500 }
    );
  }
}
