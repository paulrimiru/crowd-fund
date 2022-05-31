// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CrowdFunding {
    address public owner;
    string public name;
    string public description;
    uint public target;

    constructor(string memory projName, string memory desc, uint targ) {
        owner = msg.sender;
        name = projName;
        description = desc;
        target = targ;
    }
    
    receive() external payable {}

    fallback() external payable {}

    function getAmount() public view returns (uint) {
        return address(this).balance;
    }

    function remitAmount() public payable {
        uint balance = address(this).balance;
        require(msg.sender==owner, "Only owner can remit");
        require(target<=balance, "Target not reached");
        
        (bool sent, ) = owner.call{value: balance}("");
        require(sent, "Failed to send ether");
    }
}