// api/sendNFT/route.js

'use server';

import { NextResponse } from 'next/server';
import { 
  Client, 
  Wallet, 
  isValidClassicAddress, 
  convertStringToHex 
} from 'xrpl';

export async function POST(request) {
  try {
    const { walletAddress } = await request.json();
    console.log('Received walletAddress for NFT minting:', walletAddress);

    // Validate the wallet address
    if (!isValidClassicAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }

    // Get the seed from environment variables
    const seed = process.env.XRPL_SEED;
    if (!seed) {
      throw new Error('XRPL_SEED is not set in environment variables');
    }

    const wallet = Wallet.fromSeed(seed);

    // Connect to the XRP Ledger Testnet
    const client = new Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    // Prepare the NFT minting transaction
    const transactionJson = {
      TransactionType: "NFTokenMint",
      Account: wallet.classicAddress,
      URI: convertStringToHex("https://example.com/nft-metadata"), // Replace with your NFT metadata URI
      Flags: parseInt('8'), // tfTransferable
      TransferFee: 0,
      NFTokenTaxon: 0,
      // Destination field requires special authorization; omitting for simplicity
    };

    // Submit the transaction
    const preparedTx = await client.autofill(transactionJson);
    const signedTx = wallet.sign(preparedTx);
    const txResult = await client.submitAndWait(signedTx.tx_blob);

    if (txResult.result.meta.TransactionResult === 'tesSUCCESS') {
      // Extract NFTokenID from the transaction metadata
      let nftokenId;
      const affectedNodes = txResult.result.meta.AffectedNodes;
      for (const node of affectedNodes) {
        if (node.CreatedNode && node.CreatedNode.LedgerEntryType === 'NFTokenPage') {
          const nft = node.CreatedNode.NewFields.NFTokens[0];
          nftokenId = nft.NFToken.NFTokenID;
          break;
        }
      }

      console.log('NFT minted successfully with NFTokenID:', nftokenId);
      await client.disconnect();

      return NextResponse.json({
        success: true,
        detail: 'NFT minting successful',
        nftokenId: nftokenId,
        txHash: txResult.result.hash,
      }, { status: 200 });

    } else {
      await client.disconnect();
      return NextResponse.json({
        success: false,
        detail: `Transaction failed with result code ${txResult.result.meta.TransactionResult}`,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error minting NFT:', error);
    return NextResponse.json({
      success: false,
      detail: `NFT minting failed: ${error.message}`,
    }, { status: 500 });
  }
}
