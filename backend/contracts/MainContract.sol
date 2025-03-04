// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MainContract {
    struct SubContractDetails {
        string uid;
        string password;
        string companyName;
        address contractAddress;
    }

    mapping(string => SubContractDetails) public subContracts;
    address public owner;

    // Emit event when a SubContract is deployed
    event SubContractDeployed(address subContractAddress);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function deploySubContract(
        string memory _uid, 
        string memory _password, 
        string memory _companyName
    ) public onlyOwner returns (address) {
        SubContract newContract = new SubContract(_uid, _password, _companyName);
        subContracts[_uid] = SubContractDetails({
            uid: _uid,
            password: _password,
            companyName: _companyName,
            contractAddress: address(newContract)
        });
        emit SubContractDeployed(address(newContract));
        return address(newContract);
    }

    function verifySubContract(
        string memory _uid, 
        string memory _password
    ) public view returns (address, bool) {
        SubContractDetails memory details = subContracts[_uid];
        if (
            keccak256(abi.encodePacked(details.password)) == 
            keccak256(abi.encodePacked(_password))
        ) {
            return (details.contractAddress, true);
        }
        return (address(0), false);
    }
}

contract SubContract {
    string private uid;
    string private password;
    string public companyName;
    uint256 private dataCounter = 1;

    struct DataStore {
        uint256 id;
        string date;
        string alert;
        string actionRequired;
        uint256 energyConsumption;
        uint256 carbonEmission;
        uint256 efficiencyScore;
        string resolution;
    }
    mapping(uint256 => DataStore) private storedData;

    constructor(
        string memory _uid, 
        string memory _password, 
        string memory _companyName
    ) {
        uid = _uid;
        password = _password;
        companyName = _companyName;
    }

    function signIn(
        string memory _uid, 
        string memory _password
    ) public view returns (bool) {
        require(
            keccak256(abi.encodePacked(uid)) == keccak256(abi.encodePacked(_uid)),
            "Invalid UID"
        );
        require(
            keccak256(abi.encodePacked(password)) == keccak256(abi.encodePacked(_password)),
            "Invalid Password"
        );
        return true;
    }

    // Updated storeData that automatically sets alert and actionRequired based on energyConsumption (and carbonEmission)
    function storeData(
        string memory _date, 
        uint256 _energyConsumption, 
        uint256 _carbonEmission, 
        uint256 _efficiencyScore
    ) public {
        string memory _alert;
        string memory _actionRequired;
        string memory _resolution;

        if (_energyConsumption < 500) {
            _alert = "Normal operation.";
            _actionRequired = "Marked as resolved";
            _resolution = "Already Efficient.";
        } else if (_energyConsumption >= 500 && _energyConsumption < 1000) {
            _actionRequired = "Review energy usage immediately";
            _resolution = "N/A";
            // Use pseudo-randomness to choose one alert option
            uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, dataCounter))) % 2;
            if (rand == 0) {
                _alert = "Critical efficiency drop detected.";
            } else {
                _alert = "Efficiency declining, emissions rising.";
            }
        } else if (_energyConsumption >= 1000) {
            // Use pseudo-randomness to choose one alert option
            uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, dataCounter))) % 2;
            if (rand == 0) {
                _actionRequired = "Shut down non-essential systems.";
            } else {
                _actionRequired = "Initiate efficiency improvement measures.";
            }
            _alert = "Severe inefficiency, immediate action needed.";
            _resolution = "N/A";
        } else {
            _alert = "";
            _actionRequired = "";
            _resolution = "";
        }

        storedData[dataCounter] = DataStore(
            dataCounter,
            _date,
            _alert,
            _actionRequired,
            _energyConsumption,
            _carbonEmission,
            _efficiencyScore,
            _resolution
        );
        dataCounter++;
    }

    // Updated action function returns all stored fields for the record
    function action(
        uint256 _id, 
        string memory _input
    ) public returns (DataStore memory) {
        require(storedData[_id].energyConsumption > 0, "Data not found");
        storedData[_id].resolution = _input;
        return storedData[_id];
    }

    function getAllData() public view returns (DataStore[] memory) {
        DataStore[] memory allData = new DataStore[](dataCounter - 1);
        for (uint256 i = 1; i < dataCounter; i++) {
            allData[i - 1] = storedData[i];
        }
        return allData;
    }

    function getDataAboveLimit(
        uint256 _limit
    ) public view returns (DataStore[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < dataCounter; i++) {
            if (storedData[i].energyConsumption >= _limit) {
                count++;
            }
        }
        
        if (count == 0) {
            return new DataStore[](0);
        }
        
        DataStore[] memory filteredData = new DataStore[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < dataCounter; i++) {
            if (storedData[i].energyConsumption >= _limit) {
                filteredData[index] = storedData[i];
                index++;
            }
        }
        return filteredData;
    }
}
