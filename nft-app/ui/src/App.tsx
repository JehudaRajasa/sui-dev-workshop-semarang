import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useState } from 'react';
import './App.css';

// Replace with your actual package ID after deployment
const PACKAGE_ID =
  '0x49649ef13ff32d0ca99768dc7dda6f8d3a47620b7ee5d92b7c6612413ae1a900';
const MODULE_NAME = 'workshop_nft';
const FUNCTION_NAME = 'mint_nft';

// Static NFT Data
// This must match the hardcoded data in the Move contract
const NFT_DATA = {
  name: 'Sui Dev Workshop NFT',
  description:
    'A commemorative NFT for the 2025 Semarang Sui Developer Workshop.',
  imageUrl:
    'https://turquoise-adequate-jay-379.mypinata.cloud/ipfs/bafybeicfbvqubifkwxhorjtolybvj2staix2j4yofaok5zzii75fedk4ua'
};

function App() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const [digest, setDigest] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = () => {
    if (!currentAccount) return;
    setIsMinting(true);

    const tx = new Transaction();
    const [nft] = tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`
    });

    tx.transferObjects([nft], tx.pure.address(currentAccount.address));

    signAndExecuteTransaction(
      {
        transaction: tx
      },
      {
        onSuccess: (result) => {
          console.log('executed transaction', result);
          setDigest(result.digest);
          setIsMinting(false);
          alert(`NFT Minted! Digest: ${result.digest}`);
        },
        onError: (error) => {
          console.error(error);
          setIsMinting(false);
          alert(
            'Minting failed. Make sure you have deployed the contract and updated PACKAGE_ID.'
          );
        }
      }
    );
  };

  return (
    <div className="app-container" style={{ backgroundImage: `url(${NFT_DATA.imageUrl})` }}>
      <div className="overlay"></div>
      
      <div className="bento-box">
        <header className="app-header">
          <ConnectButton />
        </header>

        <main className="app-content">
          <div className="nft-preview-container">
             <img src={NFT_DATA.imageUrl} alt="NFT Preview" className="nft-image" />
          </div>
          
          <div className="nft-details">
            <h2>{NFT_DATA.name}</h2>
            <p>{NFT_DATA.description}</p>
          </div>

          <div className="mint-section">
            {currentAccount ? (
              <>
                <button
                  className="mint-button"
                  onClick={handleMint}
                  disabled={isMinting}
                >
                  {isMinting ? 'Minting...' : 'Mint NFT'}
                </button>
                {digest && (
                  <div className="transaction-success">
                    <p>Success! Transaction Digest:</p>
                    <a 
                      href={`https://suiscan.xyz/testnet/tx/${digest}`} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      {digest.slice(0, 10)}...
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="connect-prompt">
                <p>Connect your wallet to mint this exclusive NFT.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
