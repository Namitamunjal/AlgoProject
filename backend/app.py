import os
import json
import csv
from datetime import datetime, timezone, timedelta

from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from dotenv import load_dotenv
from web3 import Account, HTTPProvider, Web3
import jwt  # PyJWT

# Load environment variables
load_dotenv()
PRIVATE_KEY = os.getenv('PRIVATE_KEY')
RPC_URL = os.getenv('RPC_URL')

# JWT configuration
JWT_SECRET = "jwt_secret_key"
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_SECONDS = 3600  # 1 hour

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
main_artifacts = json.load(open('artifacts/contracts/MainContract.sol/MainContract.json'))
main_abi = main_artifacts['abi']

sub_artifacts = json.load(open('artifacts/contracts/MainContract.sol/SubContract.json'))
sub_abi = sub_artifacts['abi']

# Create contract instances
main_contract = w3.eth.contract(address=MAIN_CONTRACT_ADDRESS, abi=main_abi)
sub_contract = w3.eth.contract(address=SUB_CONTRACT_ADDRESS, abi=sub_abi)

app = Flask(__name__)
app.config['DEBUG'] = True

# Enable CORS and allow your React app's origin.
CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the API"})

# New /verify endpoint that checks the token from the Authorization header
@app.route('/verify', methods=['GET'])
def verify():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"authenticated": False, "message": "No token provided."}), 401

    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return jsonify({"authenticated": False, "message": "Invalid token header."}), 401

    token = parts[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return jsonify({"authenticated": True, "uid": payload["uid"]})
    except jwt.ExpiredSignatureError:
        return jsonify({"authenticated": False, "message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"authenticated": False, "message": "Invalid token"}), 401

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json() or request.form
    uid = data.get('uid')
    password = data.get('password')
    
    if not uid or not password:
        return jsonify({"success": False, "message": "uid and password are required."}), 400

    print("Login attempt:", {"uid": uid, "password": password})
    
    try:
        # Verify subcontract credentials using the blockchain contract
        contract_address, valid = main_contract.functions.verifySubContract(uid, password).call()
        print("verifySubContract returned:", contract_address, "valid:", valid)
        
        global SUB_CONTRACT_ADDRESS, sub_contract
        if valid and contract_address != "0x0000000000000000000000000000000000000000":
            SUB_CONTRACT_ADDRESS = contract_address
            sub_contract = w3.eth.contract(address=SUB_CONTRACT_ADDRESS, abi=sub_abi)
        else:
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
            
            new_sub_address = None
            for log in receipt.logs:
                try:
                    parsed_log = main_contract.events.SubContractDeployed().process_log(log)
                    new_sub_address = parsed_log['args']['subContractAddress']
                    break
                except Exception as ex:
                    continue
            if not new_sub_address:
                new_sub_address, _ = main_contract.functions.verifySubContract(uid, password).call()
            
            if not new_sub_address or new_sub_address == "0x0000000000000000000000000000000000000000":
                return jsonify({"success": False, "message": "Failed to deploy a valid SubContract."}), 400
            
            SUB_CONTRACT_ADDRESS = new_sub_address
            sub_contract = w3.eth.contract(address=SUB_CONTRACT_ADDRESS, abi=sub_abi)
            print("New SubContract deployed to:", SUB_CONTRACT_ADDRESS)
        
        # Create a JWT token with a timezone-aware expiration
        payload = {
            "uid": uid,
            "exp": datetime.now(timezone.utc) + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        # Instead of setting a cookie, return the token in the JSON response
        return jsonify({
            "success": True,
            "message": "Login successful",
            "subcontract_address": SUB_CONTRACT_ADDRESS,
            "token": token
        })
    except Exception as e:
        print("Error in login:", str(e))
        return jsonify({"success": False, "message": str(e)}), 400

# New /upload-data endpoint
@app.route('/upload-data', methods=['POST'])
def upload_data():
    # Ensure a file is provided
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file part in the request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "message": "No file selected"}), 400

    # Additionally, require the active subcontract address to be provided (e.g., from the frontend)
    subcontract_address = request.form.get('subcontract_address')
    if not subcontract_address:
        # Fallback to default if not provided (not recommended if users can change contracts)
        subcontract_address = SUB_CONTRACT_ADDRESS

    try:
        # Re-instantiate the contract using the active subcontract address
        active_sub_contract = w3.eth.contract(address=subcontract_address, abi=sub_abi)
        
        # Read file content and parse as CSV
        file_data = file.read().decode('utf-8').splitlines()
        csv_reader = csv.DictReader(file_data)
        tx_hashes = []
        
        # Get the starting nonce once
        nonce = w3.eth.get_transaction_count(account_address)
        for row in csv_reader:
            # Expect headers: date, energyConsumption, carbonEmission, efficiencyScore
            date = row.get('date')
            energy_consumption = int(float(row.get('energyConsumption')))
            carbon_emission = int(float(row.get('carbonEmission')))
            efficiency_score = int(float(row.get('efficiencyScore')))
            
            # Estimate gas and build transaction for each row using the active contract instance
            gas_estimate = active_sub_contract.functions.storeData(
                date, energy_consumption, carbon_emission, efficiency_score
            ).estimateGas({'from': account_address})
            
            tx = active_sub_contract.functions.storeData(
                date, energy_consumption, carbon_emission, efficiency_score
            ).buildTransaction({
                'from': account_address,
                'nonce': nonce,
                'gas': gas_estimate + 10000,
                'gasPrice': w3.toWei('5', 'gwei')
            })
            nonce += 1
            signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
            tx_hashes.append(tx_hash.hex())
            # Optional: add a delay if needed
            # time.sleep(1)
        return jsonify({"success": True, "message": "All data stored successfully", "tx_hashes": tx_hashes})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/store', methods=['POST'])
def store():
    if not SUB_CONTRACT_ADDRESS:
        return jsonify({"success": False, "message": "Subcontract address not configured."})
    try:
        data = request.get_json() or request.form
        date = data.get('date')
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
        formatted_data = [
            {"_id": item[0], "date": item[1], "alert": item[2], "actionRequired": item[3],
             "energyConsumption": item[4], "carbonEmission": item[5], "efficiencyScore": item[6],
             "resolution": item[7]}
            for item in data_list
        ]
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
        formatted_data = [
            {"_id": item[0], "date": item[1], "alert": item[2], "actionRequired": item[3],
             "energyConsumption": item[4], "carbonEmission": item[5], "efficiencyScore": item[6],
             "resolution": item[7]}
            for item in data_list
        ]
        return jsonify({"success": True, "data": formatted_data})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
