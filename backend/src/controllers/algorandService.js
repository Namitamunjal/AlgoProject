const algosdk = require('algosdk');

// Algorand connection details (replace with your PureStake token)
const algodToken = { 'X-API-Key': process.env.PURESTAKE_API_KEY };
const algodServer = 'https://testnet-algorand.api.purestake.io/ps2';
const algodPort = '';
const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Algorand account mnemonic and address
const mnemonic = process.env.ALGORAND_MNEMONIC;
const senderAccount = algosdk.mnemonicToSecretKey(mnemonic);

// Replace with your smart contract's Application ID
const appId = YOUR_SMART_CONTRACT_APP_ID;
async function interactWithSmartContract(methodName, dataType = '', userData = '') {
    try {
        const params = await client.getTransactionParams().do();
        const note = JSON.stringify({ methodName, dataType, userData });

        // Define application arguments based on the smart contract method
        let appArgs = [];

        // Define arguments based on the method being called
        switch (methodName) {
            case 'signup':
            case 'signin':
            case 'logout':
                appArgs = [new Uint8Array(Buffer.from(methodName)), new Uint8Array(Buffer.from(userData))];
                break;

            case 'record_alert':
                appArgs = [new Uint8Array(Buffer.from(methodName)), new Uint8Array(Buffer.from(userData))];
                break;

            case 'record_data':
                appArgs = [
                    new Uint8Array(Buffer.from(dataType)), // dataType as a separate argument for `record_data`
                    new Uint8Array(Buffer.from(userData))
                ];
                break;

            default:
                throw new Error(`Invalid method name: ${methodName}`);
        }

        // Construct the transaction to call the smart contract
        const txn = algosdk.makeApplicationNoOpTxn(
            senderAccount.addr,
            params,
            appId,
            appArgs,
            note ? new Uint8Array(Buffer.from(note)) : undefined // Add optional metadata
        );

        // Sign the transaction
        const signedTxn = txn.signTxn(senderAccount.sk);
        const tx = await client.sendRawTransaction(signedTxn).do();

        console.log(`Transaction ${tx.txId} successfully recorded for method: ${methodName}`);
        return tx.txId;
    } catch (error) {
        console.error(`Error executing ${methodName}:`, error);
        throw error;
    }
}

module.exports = { interactWithSmartContract };
