// /app/api/fetchVotes/route.js

'use server';

import { NextResponse } from 'next/server';
import { Client, Wallet } from 'xrpl';

export async function GET() {
    console.log('You are trying to fetch the total amount of votes from the ledger')
  try {
    const seed = process.env.XRPL_SEED;
    if (!seed) {
      throw new Error('XRPL_SEED is not set in environment variables');
    }

    const wallet = Wallet.fromSeed(seed);
    const client = new Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();
    console.log('Connected to testnet for fetching votes!');

    const votes = {};

    // Fetch transactions sent from the trusted wallet
    const response = await client.request({
      command: 'account_tx',
      account: wallet.address,
      ledger_index_min: -1, // Fetch from earliest available ledger
      ledger_index_max: -1, // Up to the latest ledger
      limit: 100, // Adjust limit as needed for batch processing
    });

    response.result.transactions.forEach((tx) => {
      if (tx.tx.TransactionType === 'Payment' && tx.tx.Memos) {
        tx.tx.Memos.forEach((memo) => {
          try {
            const memoData = Buffer.from(memo.Memo.MemoData, 'hex').toString('utf8');
            const vote = JSON.parse(memoData).vote;

            if (vote) {
              votes[vote] = (votes[vote] || 0) + 1; // Tally the votes
            }
          } catch (e) {
            console.error('Error parsing memo:', e);
          }
        });
      }
    });

    await client.disconnect();

    console.log('Vote tally:', votes);
    return NextResponse.json({ success: true, votes });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { success: false, detail: `Error fetching votes: ${error.message}` },
      { status: 500 }
    );
  }
}
