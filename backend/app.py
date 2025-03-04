from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv
from web3 import Account, HTTPProvider, Web3

# Load environment variables
load_dotenv()
PRIVATE_KEY = os.getenv('PRIVATE_KEY')
RPC_URL = os.getenv('RPC_URL')

# Initialize web3
w3 = Web3(HTTPProvider(RPC_URL))
if not w3.isConnected():
    raise ValueError("Web3 is not connected to the Ethereum node.")

account = Account.from_key(PRIVATE_KEY)
account_address = account.address

# Load contract config file to get main and sub contract addresses
config_path = os.path.join(os.path.dirname(__file__), './contract-config.json')
contract_config = json.load(open(config_path))
MAIN_CONTRACT_ADDRESS = contract_config.get("mainContractAddress")
SUB_CONTRACT_ADDRESS = contract_config.get("subContractAddress")

print("Account address:", account_address)
print("Main Contract address:", MAIN_CONTRACT_ADDRESS)
print("Sub Contract address (from config):", SUB_CONTRACT_ADDRESS)

# Load contract ABIs
# For MainContract
main_artifacts = json.load(open('artifacts/contracts/MainContract.sol/MainContract.json'))
main_abi = main_artifacts['abi']

# For SubContract
sub_artifacts = json.load(open('artifacts/contracts/MainContract.sol/SubContract.json'))
sub_abi = sub_artifacts['abi']

# Create contract instances
main_contract = w3.eth.contract(address=MAIN_CONTRACT_ADDRESS, abi=main_abi)
# Initialize sub_contract using the address from the config file;
# it may be updated later if needed.
sub_contract = w3.eth.contract(address=SUB_CONTRACT_ADDRESS, abi=sub_abi)

app = Flask(__name__)
app.config['DEBUG'] = True

# Enable CORS and allow your React app's origin.
CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the API"})

@app.route('/login', methods=['POST'])
def login():
    uid = request.form.get('uid') or (request.json and request.json.get('uid'))
    password = request.form.get('password') or (request.json and request.json.get('password'))
    
    # Ensure all required parameters are provided
    if not uid or not password:
        return jsonify({"success": False, "message": "uid, password are required."})
    
    print("Login attempt:", {"uid": uid, "password": password})
    
    try:
        # Verify subcontract credentials using the main contract
        contract_address, valid = main_contract.functions.verifySubContract(uid, password).call()
        print("verifySubContract returned:", contract_address, "valid:", valid)
        
        global SUB_CONTRACT_ADDRESS, sub_contract
        # Check if the subcontract exists and is valid (non-zero address)
        if valid and contract_address != "0x0000000000000000000000000000000000000000":
            SUB_CONTRACT_ADDRESS = contract_address
            sub_contract = w3.eth.contract(address=SUB_CONTRACT_ADDRESS, abi=sub_abi)
            return jsonify({"success": True, "subcontract_address": SUB_CONTRACT_ADDRESS})
        else:
            # Deploy a new subcontract via main_contract.deploySubContract
            print("Deploying new SubContract for uid:", uid)
            companyName = "ABC Company"  # Example company name

            gas_estimate = main_contract.functions.deploySubContract(uid, password, companyName).estimateGas({
            'from': account_address
            })
            tx = main_contract.functions.deploySubContract(uid, password, companyName).buildTransaction({
                'from': account_address,
                'nonce': w3.eth.get_transaction_count(account_address),
                'gas': gas_estimate + 10000,
                'gasPrice': w3.toWei('5', 'gwei')
            })
            signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
            print("New SubContract deployed at:", receipt.contractAddress)
            
            # Parse event logs for the SubContractDeployed event
            new_sub_address = None
            for log in receipt.logs:
                try:
                    parsed_log = main_contract.events.SubContractDeployed().process_log(log)
                    new_sub_address = parsed_log['args']['subContractAddress']
                    break
                except Exception as ex:
                    continue
            if not new_sub_address:
                # Fallback: verify again after deployment
                new_sub_address, _ = main_contract.functions.verifySubContract(uid, password).call()
            
            if not new_sub_address or new_sub_address == "0x0000000000000000000000000000000000000000":
                return jsonify({"success": False, "message": "Failed to deploy a valid SubContract."})
            
            # Update global subcontract address and instance
            SUB_CONTRACT_ADDRESS = new_sub_address
            sub_contract = w3.eth.contract(address=SUB_CONTRACT_ADDRESS, abi=sub_abi)
            print("New SubContract deployed to:", SUB_CONTRACT_ADDRESS)
            return jsonify({"success": True, "subcontract_address": SUB_CONTRACT_ADDRESS})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route('/store', methods=['POST'])
def store():
    if not SUB_CONTRACT_ADDRESS:
        return jsonify({"success": False, "message": "Subcontract address not configured."})
    
    try:
        data = request.get_json() or request.form
        date = data.get('date')
        # Convert numeric fields: first to float then to int (this will truncate decimals)
        energy_consumption = int(float(data.get('energyConsumption')))
        carbon_emission = int(float(data.get('carbonEmission')))
        efficiency_score = int(float(data.get('efficiencyScore')))

        gas_estimate = sub_contract.functions.storeData(date, energy_consumption, carbon_emission, efficiency_score).estimateGas({
            'from': account_address
        })
        tx = sub_contract.functions.storeData(date, energy_consumption, carbon_emission, efficiency_score).buildTransaction({
            'from': account_address,
            'nonce': w3.eth.get_transaction_count(account_address),
            'gas': gas_estimate + 10000,
            'gasPrice': w3.toWei('5', 'gwei')
        })
        
        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return jsonify({"success": True, "tx_hash": tx_hash.hex()})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route('/action', methods=['POST'])
def action():
    if not SUB_CONTRACT_ADDRESS:
        return jsonify({"success": False, "message": "Subcontract address not configured."})
    
    try:
        data_id = request.form.get('id') or (request.json and request.json.get('id'))
        input_string = request.form.get('input') or (request.json and request.json.get('input'))

        if not data_id or not input_string:
            return jsonify({"success": False, "message": "Invalid input data."})
        
        gas_estimate = sub_contract.functions.action(data_id, input_string).estimateGas({
            'from': account_address
        })
        tx = sub_contract.functions.action(data_id, input_string).buildTransaction({
            'from': account_address,
            'nonce': w3.eth.get_transaction_count(account_address),
            'gas': gas_estimate + 10000,
            'gasPrice': w3.toWei('5', 'gwei')
        })
        
        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return jsonify({"success": True, "tx_hash": tx_hash.hex()})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route('/getAllData', methods=['GET'])
def get_all_data():
    if not SUB_CONTRACT_ADDRESS:
        return jsonify({"success": False, "message": "Subcontract address not configured."})
    
    try:
        data_list = sub_contract.functions.getAllData().call()
        formatted_data = [{"_id": item[0], "date": item[1], "alert": item[2], "actionRequired": item[3], "energyConsumption": item[4], "carbonEmission": item[5], "efficiencyScore": item[6], "resolution": item[7]} for item in data_list]
        return jsonify({"success": True, "data": formatted_data})
    
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route('/getDataAboveLimit', methods=['POST'])
def get_data_above_limit():
    if not SUB_CONTRACT_ADDRESS:
        return jsonify({"success": False, "message": "Subcontract address not configured."})
    
    try:
        limit = int(request.form.get('limit') or (request.json and request.json.get('limit')))

        data_list = sub_contract.functions.getDataAboveLimit(limit).call()
        formatted_data = [{"_id": item[0], "date": item[1], "alert": item[2], "actionRequired": item[3], "energyConsumption": item[4], "carbonEmission": item[5], "efficiencyScore": item[6], "resolution": item[7]} for item in data_list]

        return jsonify({"success": True, "data": formatted_data})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
