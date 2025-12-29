import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useState, useEffect } from 'react';
import './App.css';

// Replace with your actual package ID after deployment
const PACKAGE_ID =
  '0x6b0830bdc4639cee791d17bd87682a071db75e2a21ada1cb072744b0e8604ed7';
const MINT_TRACKER_ID =
  '0x15f1bfb748e4b5f9e68d975d8988addb1a84e3c9331575fd2f3afbbd21d62058';
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
  const suiClient = useSuiClient();
  const [digest, setDigest] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);

  useEffect(() => {
    const checkMintStatus = async () => {
      if (!currentAccount) {
        setHasMinted(false);
        return;
      }

      try {
        // 1. Get the MintTracker object to find the Table ID
        const trackerObj = await suiClient.getObject({
          id: MINT_TRACKER_ID,
          options: { showContent: true }
        });

        if (trackerObj.data?.content?.dataType === 'moveObject') {
          // @ts-ignore
          const mintersTable = trackerObj.data.content.fields.minters;
          const tableId = mintersTable.fields.id.id;

          // 2. Check if the user is in the table
          try {
            const field = await suiClient.getDynamicFieldObject({
              parentId: tableId,
              name: {
                type: 'address',
                value: currentAccount.address
              }
            });

            if (field.data) {
              setHasMinted(true);
            } else {
              setHasMinted(false);
            }
          } catch (err) {
            // Field not found means not minted
            setHasMinted(false);
          }
        }
      } catch (error) {
        console.error('Error checking mint status:', error);
      }
    };

    checkMintStatus();
  }, [currentAccount, suiClient]);

  const handleMint = () => {
    if (!currentAccount) return;
    setIsMinting(true);

    const tx = new Transaction();
    const [nft] = tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
      arguments: [tx.object(MINT_TRACKER_ID)]
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
          setHasMinted(true);
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
    <div
      className='app-container'
      style={{ backgroundImage: `url(${NFT_DATA.imageUrl})` }}
    >
      <div className='overlay'></div>

      <div className='bento-box'>
        <header className='app-header'>
          <ConnectButton />
        </header>

        <main className='app-content'>
          <div className='nft-preview-container'>
            <img
              src={NFT_DATA.imageUrl}
              alt='NFT Preview'
              className='nft-image'
            />
          </div>

          <div className='nft-details'>
            <h2>{NFT_DATA.name}</h2>
            <p>{NFT_DATA.description}</p>
          </div>

          <div className='mint-section'>
            {currentAccount ? (
              <>
                <button
                  className={`mint-button ${hasMinted ? 'already-minted' : ''}`}
                  onClick={handleMint}
                  disabled={isMinting || hasMinted}
                >
                  {isMinting
                    ? 'Minting...'
                    : hasMinted
                      ? 'Already Minted'
                      : 'Mint NFT'}
                </button>
                {digest && (
                  <div className='transaction-success'>
                    <p>Success! Transaction Digest:</p>
                    <a
                      href={`https://suiscan.xyz/testnet/tx/${digest}`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {digest.slice(0, 10)}...
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className='connect-prompt'>
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
