// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {Functions, FunctionsClient} from "./dev/functions/FunctionsClient.sol";
// import "@chainlink/contracts/src/v0.8/dev/functions/FunctionsClient.sol"; // Once published
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "./strings.sol";

/**
 * @title Functions Consumer contract
 * @notice This contract is a demonstration of using Functions.
 * @notice NOT FOR PRODUCTION USE
 */
contract FunctionsConsumer is FunctionsClient, ConfirmedOwner {
  using Functions for Functions.Request;
  using strings for *;
  
  bytes32 public latestRequestId;
  bytes public latestResponse;
  bytes public latestError;
  mapping(string => uint256) public adsWithBudget;
  string public latestAdsPaid;
  address public latestAdsCreatorPaid;

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
  event w3adsPaid(address contentCreator, uint256 payment,string adsName);
  event w3adsCreated(string adsId, uint256 adsBudget);
  /**
   * @notice Executes once when a contract is created to initialize state variables
   *
   * @param oracle - The FunctionsOracle contract
   */
  // https://github.com/protofire/solhint/issues/242
  // solhint-disable-next-line no-empty-blocks
  // constructor(address oracle) FunctionsClient(oracle) ConfirmedOwner(msg.sender) {}
  constructor(address oracle) FunctionsClient(oracle) ConfirmedOwner(msg.sender) {}

/**
   * @notice Create Advertisement
   *
   * @param adsId Ads Id
   * @param adsBudget Ads budget
   */

  function createAds(string memory adsId,uint256 adsBudget) public payable returns (string memory) {
    adsWithBudget[adsId] = adsBudget;

    emit w3adsCreated(adsId, adsBudget);

    return adsId;
  }

  /**
   * @notice Send a simple request
   *
   * @param source JavaScript source code
   * @param secrets Encrypted secrets payload
   * @param args List of arguments accessible from within the source code
   * @param subscriptionId Funtions billing subscription ID
   * @param gasLimit Maximum amount of gas used to call the client contract's `handleOracleFulfillment` function
   * @return Functions request ID
   */
  function executeRequest(
    string calldata source,
    bytes calldata secrets,
    string[] calldata args,
    uint64 subscriptionId,
    uint32 gasLimit
  ) public onlyOwner returns (bytes32) {
    Functions.Request memory req;
    req.initializeRequest(Functions.Location.Inline, Functions.CodeLanguage.JavaScript, source);
    if (secrets.length > 0) {
      req.addRemoteSecrets(secrets);
    }
    if (args.length > 0) req.addArgs(args);

    bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit);
    latestRequestId = assignedReqID;
    return assignedReqID;
  }

  /**
   * @notice Callback that is invoked once the DON has resolved the request or hit an error
   *
   * @param requestId The request ID, returned by sendRequest()
   * @param response Aggregated response from the user code
   * @param err Aggregated error from the user code or from the execution pipeline
   * Either response or error parameter will be set, but never both
   */
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    latestResponse = response;
    latestError = err;
    // Converting response to useable formate

    string memory SxTResponse = string(response);
    strings.slice memory s = SxTResponse.toSlice();
    strings.slice memory delim = ",".toSlice();
       
    //store each string in an array
    string[] memory splitResults = new string[](s.count(delim)+ 1);                  
    for (uint i = 0; i < splitResults.length; i++) {                              
        splitResults[i] = s.split(delim).toString();                              
    } 

    ( uint payment, bool hasBadBytes ) = strToUint(splitResults[0]);
    string memory adsName = splitResults[1];
    address payable creator = payable(parseAddr(splitResults[2]));

    require(adsWithBudget[adsName] - payment >= 0,"Can't pay to creator.Ads budget is completed");

    creator.transfer(payment);
    adsWithBudget[adsName] = adsWithBudget[adsName] - payment;

    latestAdsPaid = adsName;
    latestAdsCreatorPaid = creator;
    
    emit w3adsPaid(creator,payment,adsName);

    emit OCRResponse(requestId, response, err);
  }
  
  /**
   * @notice Allows the Functions oracle address to be updated
   *
   * @param oracle New oracle address
   */
  function updateOracleAddress(address oracle) public onlyOwner {
    setOracle(oracle);
  }

  function addSimulatedRequestId(address oracleAddress, bytes32 requestId) public onlyOwner {
    addExternalRequest(oracleAddress, requestId);
  }

  /**
   * @notice Allows the Functions to convert string to uint
   *
   * @param _str New string
   */
  
  function strToUint(string memory _str) internal pure returns(uint256 res, bool err) {
    
    for (uint256 i = 0; i < bytes(_str).length; i++) {
        if ((uint8(bytes(_str)[i]) - 48) < 0 || (uint8(bytes(_str)[i]) - 48) > 9) {
            return (0, false);
        }
        res += (uint8(bytes(_str)[i]) - 48) * 10**(bytes(_str).length - i - 1);
    }
    
    return (res, true);

  }

  /**
   * @notice Allows the Functions to convert string to address
   *
   * @param _a New string address
   */

  function parseAddr(string memory _a) internal pure returns (address _parsedAddress) {
    bytes memory tmp = bytes(_a);
    uint160 iaddr = 0;
    uint160 b1;
    uint160 b2;
    for (uint i = 2; i < 2 + 2 * 20; i += 2) {
        iaddr *= 256;
        b1 = uint160(uint8(tmp[i]));
        b2 = uint160(uint8(tmp[i + 1]));
        if ((b1 >= 97) && (b1 <= 102)) {
            b1 -= 87;
        } else if ((b1 >= 65) && (b1 <= 70)) {
            b1 -= 55;
        } else if ((b1 >= 48) && (b1 <= 57)) {
            b1 -= 48;
        }
        if ((b2 >= 97) && (b2 <= 102)) {
            b2 -= 87;
        } else if ((b2 >= 65) && (b2 <= 70)) {
            b2 -= 55;
        } else if ((b2 >= 48) && (b2 <= 57)) {
            b2 -= 48;
        }
        iaddr += (b1 * 16 + b2);
    }
    return address(iaddr);
}



}
