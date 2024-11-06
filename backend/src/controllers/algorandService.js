const algosdk = require('algosdk');
const dotenv = require('dotenv');
dotenv.config();

// Algorand connection details for the local Docker network
const algodToken = { 'X-Algo-API-Token': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' };
const algodServer = 'http://localhost';
const algodPort = '4001';  // default port for local Algorand Docker network

const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Algorand account mnemonic and address for local testing
const mnemonic = process.env.ALGORAND_MNEMONIC;
const senderAccount = algosdk.mnemonicToSecretKey(mnemonic);
const senderAddress = algosdk.encodeAddress(senderAccount.addr.publicKey);

// Replace with your local smart contract Application ID
const appId = 1002;  // Smart contract ID deployed on localnet
async function interactWithSmartContract(methodName, dataType = '', userData = '') {
    try {
        const params = await client.getTransactionParams().do();

        // Ensure `note` is a string
        const note = typeof userData === 'string' ? userData : JSON.stringify(userData);

        // Initialize `appArgs` with explicit `Uint8Array` conversions
        let appArgs = [];
        switch (methodName) {
            case 'signup':
            case 'signin':
            case 'logout':
                appArgs = [
                    new Uint8Array(Buffer.from(methodName, 'utf-8')), 
                    new Uint8Array(Buffer.from(userData, 'utf-8'))
                ];
                break;

            case 'record_alert':
                appArgs = [
                    new Uint8Array(Buffer.from(methodName, 'utf-8')), 
                    new Uint8Array(Buffer.from(userData, 'utf-8'))
                ];
                break;

            case 'record_data':
                appArgs = [
                    new Uint8Array(Buffer.from(dataType, 'utf-8')), 
                    new Uint8Array(Buffer.from(userData, 'utf-8'))
                ];
                break;

            default:
                throw new Error(`Invalid method name: ${methodName}`);
        }

        // Construct the transaction with the updated `note`
        const txn = algosdk.makeApplicationCallTxnFromObject({
            sender: senderAddress,
            suggestedParams: params,
            appIndex: appId,  // Application ID
            onComplete: algosdk.OnApplicationComplete.NoOpOC,  // No-op transaction
            appArgs: appArgs,  // Application arguments (App Args in logs)
            note: new Uint8Array(Buffer.from(JSON.stringify(note))),  // Note field as Uint8Array
        });
        

        // Sign and send the transaction
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
