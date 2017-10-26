/*
 * Investor
 * 
 * Copyright © 2017 by Hive Project Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND (express or implied).
 */

pragma solidity ^0.4.15;

import "../object/Invoice.sol";
import "../HiveMvp.sol";
import "../helper/Operations.sol";

contract Investor is Operations {
    
    struct InvestorStruct {
        address hiveProjectPOC;

        // Info
        uint country;
        bytes32 name;
        bytes32 address1;
        bytes32 address2;
        bytes32 city;
        bytes32 postalCode;

        // Security
        mapping (address => bool) users;
        address[] usersList;
    }

    InvestorStruct investor;

    // Constructor
    function Investor(address owner, address hiveProjectPOC, uint country, bytes32 name, bytes32 address1, bytes32 address2, bytes32 city, bytes32 postalCode) public {
        investor.users[owner] = true;
        investor.usersList.push(owner);
        investor.hiveProjectPOC = hiveProjectPOC;
        investor.country = country;
        investor.name = name;
        investor.address1 = address1;
        investor.address2 = address2;
        investor.city = city;
        investor.postalCode = postalCode;
    }

    // /* Modifiers */
    modifier onlyOwner() {
        require(isOwner(msg.sender));
        _;
    }

    /* Security */
    // Setters
    // Add new owner to Company
    function addOwner(address user) public onlyOwner {
        investor.users[user] = true;
        investor.usersList.push(user);
    }

    // Remove existing owner from Company
    function revokeOwner(address user) public onlyOwner {
        investor.users[user] = false;
        investor.usersList = removeItem(investor.usersList, user);
    }

    // Getters
    // Check if address is owner
    function isOwner(address user) public constant returns (bool) {
        return investor.users[user];
    }

    // List all Company owners
    function listOwners() public constant returns(address[]) {
        return investor.usersList;
    }

    /* Setters */
    // sets investor country
    function setCountry(uint country) public onlyOwner {
        investor.country = country;
    }

    // sets investor name
    function setName(bytes32 name) public onlyOwner {
        investor.name = name;
    }

    // sets investor address1
    function setAddress1(bytes32 address1) public onlyOwner {
        investor.address1 = address1;
    }

    // sets investor address2
    function setAddress2(bytes32 address2) public onlyOwner {
        investor.address2 = address2;
    }

    // sets investor city
    function setCity(bytes32 city) public onlyOwner {
        investor.city = city;
    }

    // sets investor postalCode
    function setPostalCode(bytes32 postalCode) public onlyOwner {
        investor.postalCode = postalCode;
    }

    /* Getters */
    // returns investor country
    function getCountry() public constant returns (uint) {
        return investor.country;
    }

    // returns investor name
    function getName() public constant returns (bytes32) {
        return investor.name;
    }

    // returns investor address1
    function getAddress1() public constant returns (bytes32) {
        return investor.address1;
    }

    // returns investor address2
    function getAddress2() public constant returns (bytes32) {
        return investor.address2;
    }

    // returns investor city
    function getCity() public constant returns (bytes32) {
        return investor.city;
    }

    // returns investor postalCode
    function getPostalCode() public constant returns (bytes32) {
        return investor.postalCode;
    }

    /** @dev  kill the contract functionality
     */
    function kill() public onlyOwner {
        selfdestruct(msg.sender);
    }
}
