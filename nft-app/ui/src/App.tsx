import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useState } from 'react';

// Replace with your actual package ID after deployment
const PACKAGE_ID =
  '0x8c372e555afff9416c94c398da857ebc612c206df048f11e4a609602107f56d1'; // Placeholder
const MODULE_NAME = 'workshop_nft';
const FUNCTION_NAME = 'mint_nft';

function App() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const [digest, setDigest] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const handleMint = () => {
    if (!currentAccount) return;

    const tx = new Transaction();
    const [nft] = tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.string(url)
      ]
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
          alert(`NFT Minted! Digest: ${result.digest}`);
        },
        onError: (error) => {
          console.error(error);
          alert(
            'Minting failed. Make sure you have deployed the contract and updated PACKAGE_ID.'
          );
        }
      }
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Sui NFT Minter</h1>
      <ConnectButton />

      {currentAccount ? (
        <div style={{ marginTop: 20 }}>
          <div>
            <label>Name: </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='NFT Name'
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <label>Description: </label>
            <input
              type='text'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='NFT Description'
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <label>Image URL: </label>
            <input
              type='text'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder='Image URL'
            />
          </div>

          <button
            onClick={handleMint}
            style={{ marginTop: 20 }}
            disabled={!name || !description || !url}
          >
            Mint NFT
          </button>

          {digest && (
            <div style={{ marginTop: 20 }}>
              <strong>Transaction Digest:</strong> {digest}
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginTop: 20 }}>
          Please connect your wallet to mint an NFT.
        </div>
      )}
    </div>
  );
}

export default App;
