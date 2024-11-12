// api/sendNFT/route.js

'use server';

import { NextResponse } from 'next/server';
import { Client, Wallet, convertStringToHex } from 'xrpl';

export async function POST(request) {
  try {
    const { walletAddress, tokenUrl } = await request.json();
    console.log('Received wallet address for NFT minting and transfer:', walletAddress);

    if (!walletAddress || !tokenUrl) {
      throw new Error('Wallet address and token URL are required.');
    }

    const seed = process.env.XRPL_SEED;
    if (!seed) {
      throw new Error('XRPL_SEED is not set in environment variables');
    }

    const client = new Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    const wallet = Wallet.fromSeed(seed);

    const mintTx = {
      TransactionType: 'NFTokenMint',
      Account: wallet.classicAddress,
      URI: convertStringToHex(tokenUrl), 
      Flags: 8, 
      NFTokenTaxon: 0, 
    };

    const mintResponse = await client.submitAndWait(mintTx, { wallet });
    if (mintResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
      await client.disconnect();
      throw new Error(`NFT minting failed: ${mintResponse.result.meta.TransactionResult}`);
    }

    const nfts = await client.request({
      method: 'account_nfts',
      account: wallet.classicAddress
    });
    const mintedNFT = nfts.result.account_nfts.find(
      (nft) => nft.URI === convertStringToHex(tokenUrl)
    );

    if (!mintedNFT) {
      await client.disconnect();
      throw new Error('Minted NFT not found in account');
    }

    const tokenID = mintedNFT.NFTokenID;

    const sellOfferTx = {
      TransactionType: 'NFTokenCreateOffer',
      Account: wallet.classicAddress,
      NFTokenID: tokenID,
      Amount: '0',
      Flags: 1, 
      Destination: walletAddress
    };

    const sellOfferResponse = await client.submitAndWait(sellOfferTx, { wallet });

    console.log("Sell offer response:", JSON.stringify(sellOfferResponse, null, 2));

    if (sellOfferResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
      await client.disconnect();
      throw new Error(`Sell offer creation failed. TransactionResult: ${sellOfferResponse.result.meta.TransactionResult}`);
    }

    const offerNode = sellOfferResponse.result.meta.AffectedNodes.find(node => 
      node.CreatedNode && node.CreatedNode.LedgerEntryType === "NFTokenOffer"
    );

    if (!offerNode || !offerNode.CreatedNode.LedgerIndex) {
      await client.disconnect();
      throw new Error('Failed to retrieve the sell offer ID from transaction metadata');
    }

    const sellOfferIndex = offerNode.CreatedNode.LedgerIndex;

    await client.disconnect();

    return NextResponse.json({
      success: true,
      detail: 'NFT minted and offer created successfully',
      tokenID: tokenID,
      sellOfferIndex: sellOfferIndex
    }, { status: 200 });

  } catch (error) {
    console.error('Error during NFT minting and offer creation:', error);
    return NextResponse.json({
      success: false,
      detail: `NFT minting and offer creation failed: ${error.message}`,
    }, { status: 500 });
  }
}
