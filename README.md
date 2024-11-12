Inspiration:
The recent election highlighted to me the critical need for a secure, transparent, and reliable voting platform that truly protects voter information and voting history. Observing the vulnerabilities in the current systems—such as the risks of data breaches, potential tampering, and the lack of confidence many people feel about the integrity of their vote—I felt a strong motivation to innovate in this space. I believe that, in a democratic society, voters deserve a platform that ensures their personal information is kept private, their vote remains anonymous, and the voting history is stored in a way that prevents any form of unauthorized alteration. My goal is to build a solution that addresses these security gaps by implementing the latest encryption methods and blockchain technologies to safeguard every vote cast. 


What it does:
The platform implements a secure and transparent voting system by storing voting data in both a centralized database and the XRP Ledger. It utilizes two trusted wallets that transfer a minimal amount of XRP for each vote, embedding the voted candidate's name in the transaction memos. This dual-storage approach ensures data integrity and immutability on the blockchain while maintaining the flexibility and accessibility of a centralized database. Votes are tallied by querying the transaction history of the trusted wallets, providing an accurate and verifiable count of total votes cast. Additionally, voters are incentivized for their participation by receiving 1 XRP and a unique NFT upon casting their vote. This combination of blockchain security, privacy-preserving verification, and tangible rewards creates a robust and user-friendly voting platform.

To enforce the one-vote-per-person constraint without compromising voter privacy, the platform integrates WorldID and its zero-knowledge proofs. WorldID ensures that each person votes only once while keeping voter identity confidential from both the platform and any third party. Using IDKit, I prompt voters to verify their identity through a seamless, privacy-preserving QR scan. WorldID’s proof verification guarantees each unique voter interaction by creating a unique identifier (nullifier hash) for each user-action combination, effectively preventing duplicate votes.


How I built it:
- Next.js 14 app router with typescript & tailwind.css.
- WorldID (WorldCoin)
- XRPL

Challenges I ran into:
- I ran out of time to create a secure password page when a user edits the election information. If I had more time, I would've created a middleware and authetication system, to make sure only verified individuals can update the election form information.

What I learned:
I learned a ton about using Next.js 14’s app router and how helpful TypeScript can be for catching bugs early. Working with XRPL gave me hands-on experience with blockchain transactions, and integrating WorldID taught me a lot about secure, privacy-focused user verification.
