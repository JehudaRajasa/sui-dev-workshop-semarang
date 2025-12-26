# Hello World on Sui

This project is a basic introduction to Sui Move, based on the [Sui Developer Getting Started Guide](https://docs.sui.io/guides/developer/getting-started/hello-world).

## Prerequisites

- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) installed.
- An active address with gas (Testnet).

## Project Structure

- `Move.toml`: The manifest file defining the package and dependencies.
- `sources/`: Contains the Move source code.
- `tests/`: Contains test scripts for the Move module.

## How to Use

### 1. Build the Package

Navigate to the project directory and run:

```bash
sui move build
```

### 2. Publish the Package

Next, ensure that your client is configured for Testnet. Run:

```bash
sui client active-env
```

and it should return `testnet`.

Then, make sure you have enough SUI tokens to publish to Testnet (usually requires 0.01 SUI). You can check your balance with:

```bash
sui client balance
```

Finally, deploy the contract to the network:

```bash
sui client publish
```

### 3. Interact

After publishing, you will receive a **Package ID**. You can use the Sui Explorer or CLI to interact with the module.

For example:

```bash
sui client call --package <PACKAGE_ID> --module greeting --function new
```

To see the published Greeting object:

```bash
sui client object <OBJECT_ID>
```
