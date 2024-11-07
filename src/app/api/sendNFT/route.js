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
    const recipientSeed = process.env.RECIPIENT_SEED; // Add recipient seed to .env for security
    if (!seed || !recipientSeed) {
      throw new Error('XRPL_SEED and RECIPIENT_SEED must be set in environment variables');
    }

    const client = new Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    const wallet = Wallet.fromSeed(seed);
    const recipientWallet = Wallet.fromSeed(recipientSeed);
    console.log('Here is the recipientWallet address: ', recipientWallet)

    // Step 1: Mint the NFT
    const mintTx = {
      TransactionType: 'NFTokenMint',
      Account: wallet.classicAddress,
      URI: convertStringToHex(tokenUrl), // Convert metadata URI to hex
      Flags: 8, // tfTransferable flag to allow transfer
      NFTokenTaxon: 0, // Use 0 if you don't have a specific category for this token
    };

    const mintResponse = await client.submitAndWait(mintTx, { wallet });
    if (mintResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
      await client.disconnect();
      throw new Error(`NFT minting failed: ${mintResponse.result.meta.TransactionResult}`);
    }

    // Get the NFT ID from the account's NFTs
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

    // Step 2: Create a sell offer for 0 XRP to transfer the NFT
    const sellOfferTx = {
      TransactionType: 'NFTokenCreateOffer',
      Account: wallet.classicAddress,
      NFTokenID: tokenID,
      Amount: '0', // Zero XRP for transfer
      Flags: 1, // tfSellNFToken flag
      Destination: walletAddress // Recipient address
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

    // Step 3: Accept the sell offer to complete the transfer
    const acceptOfferTx = {
      TransactionType: 'NFTokenAcceptOffer',
      Account: recipientWallet.classicAddress,
      NFTokenSellOffer: sellOfferIndex,
    };

    const acceptOfferResponse = await client.submitAndWait(acceptOfferTx, { wallet: recipientWallet });
    await client.disconnect();

    if (acceptOfferResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`NFT transfer failed: ${acceptOfferResponse.result.meta.TransactionResult}`);
    }

    return NextResponse.json({
      success: true,
      detail: 'NFT minted and transferred successfully',
      tokenID: tokenID,
      txHash: acceptOfferResponse.result.hash
    }, { status: 200 });

  } catch (error) {
    console.error('Error during NFT minting and transfer:', error);
    return NextResponse.json({
      success: false,
      detail: `NFT minting and transfer failed: ${error.message}`,
    }, { status: 500 });
  }
}
