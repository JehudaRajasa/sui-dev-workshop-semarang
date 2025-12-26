# Module 4: NFT Minter App

This is a simple NFT Minter application for Module 4 demonstration.

## Structure

- `move/`: Contains the Sui Move smart contract.
- `ui/`: Contains the React frontend application.

## Prerequisites

- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) installed.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (or pnpm/yarn) installed.
- A Sui Wallet (e.g., Sui Wallet browser extension).

## Setup Instructions

### 1. Deploy the Smart Contract

1. Navigate to the `move` directory:

   ```bash
   cd move
   ```

2. Switch to the appropriate environment (e.g., testnet):

   ```bash
   sui client switch --env testnet
   ```

   (Make sure you have gas in your address. You can get it from the faucet in Discord or wallet).

3. Build and deploy the contract:

   ```bash
   sui client publish --gas-budget 100000000
   ```

4. **Important**: Note the `PackageID` from the output. You will need this for the frontend.

### 2. Configure the Frontend

1. Navigate to the `ui` directory:

   ```bash
   cd ../ui
   ```

2. Open `src/App.tsx` and replace the `PACKAGE_ID` constant with the `PackageID` you obtained from the deployment step.

   ```typescript
   const PACKAGE_ID = '0x...'; // Replace this
   ```

### 3. Run the Frontend

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser at the URL shown (usually `http://localhost:5173`).
4. Connect your wallet and try minting an NFT!
