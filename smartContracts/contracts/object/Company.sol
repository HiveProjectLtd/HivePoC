/*
 * Company
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

import "./Invoice.sol";
import "../HiveMvp.sol";
import "../helper/Operations.sol";

contract Company is Operations {
    
    struct CompanyStruct {
        address hiveProjectPOC;

        // Info
        uint country;
        bytes32 name;
        bytes32 address1;
        bytes32 address2;
        bytes32 city;
        bytes32 postalCode;
        bytes32 vatNumber;
        bytes32 businessNumber;

        // Security
        mapping (address => bool) users;
        address[] usersList;

        // Rating
        uint8 rating;
    }

    CompanyStruct company;

    // Constructor
    function Company(address owner, address hiveProjectPOC, uint country, bytes32 name, bytes32 address1, bytes32 address2, bytes32 city, bytes32 postalCode, bytes32 vatNumber, bytes32 businessNumber) public {
        company.users[owner] = true;
        company.usersList.push(owner);
        company.hiveProjectPOC = hiveProjectPOC;
        company.country = country;
        company.name = name;
        company.address1 = address1;
        company.address2 = address2;
        company.city = city;
        company.postalCode = postalCode;
        company.vatNumber = vatNumber;
        company.businessNumber = businessNumber;
    }

    /* Modifiers */
    modifier onlyOwner() {
        require(isOwner(msg.sender));
        _;
    }

    /* Security */
    // Setters
    // Add new owner to Company
    function addOwner(address user) public onlyOwner {
        company.users[user] = true;
        company.usersList.push(user);
    }

    // Remove existing owner from Company
    function revokeOwner(address user) public onlyOwner {
        company.users[user] = false;
        company.usersList = removeItem(company.usersList, user);
    }

    // Getters
    // Check if address is owner
    function isOwner(address user) public constant returns (bool) {
        return company.users[user];
    }

    // List all Company owners
    function listOwners() public constant returns(address[]) {
        return company.usersList;
    }

    // Invoices
    // Create new Invoice for company
    function createInvoice(uint _dueDate, uint _invoiceId, address _customer, uint _country, uint _amount, bytes3 _currency, uint _maxDiscount) public onlyOwner returns (address) {
        address invoice = new Invoice(_dueDate, _invoiceId, address(this), _customer, _country, _amount, _currency, _maxDiscount, company.hiveProjectPOC);

        HiveProjectPOC hive = HiveProjectPOC(company.hiveProjectPOC);
        hive.addInvoice(invoice);
        return invoice;
    }

    // Rating
    // Getters
    function getRating() public constant returns (uint8) {
        return 98;
    }

    /* Setters */
    // sets user country
    function setCountry(uint country) public onlyOwner {
        company.country = country;
    }

    // sets user name
    function setName(bytes32 name) public onlyOwner {
        company.name = name;
    }

    // sets user address1
    function setAddress1(bytes32 address1) public onlyOwner {
        company.address1 = address1;
    }

    // sets user address2
    function setAddress2(bytes32 address2) public onlyOwner {
        company.address2 = address2;
    }

    // sets user city
    function setCity(bytes32 city) public onlyOwner {
        company.city = city;
    }

    // sets user postalCode
    function setPostalCode(bytes32 postalCode) public onlyOwner {
        company.postalCode = postalCode;
    }

    // sets user vatNumber
    function setVatNumber(bytes32 vatNumber) public onlyOwner {
        company.vatNumber = vatNumber;
    }

    // sets user businessNumber
    function setBusinessNumber(bytes32 businessNumber) public onlyOwner {
        company.businessNumber = businessNumber;
    }

    /* Getters */
    // returns user country
    function getCountry() public constant returns (uint) {
        return company.country;
    }

    // returns user name
    function getName() public constant returns (bytes32) {
        return company.name;
    }

    // returns user address1
    function getAddress1() public constant returns (bytes32) {
        return company.address1;
    }

    // returns user address2
    function getAddress2() public constant returns (bytes32) {
        return company.address2;
    }

    // returns user city
    function getCity() public constant returns (bytes32) {
        return company.city;
    }

    // returns user postalCode
    function getPostalCode() public constant returns (bytes32) {
        return company.postalCode;
    }

    // returns user vatNumber
    function getVatNumber() public constant returns (bytes32) {
        return company.vatNumber;
    }

    // returns user businessNumber
    function getBusinessNumber() public constant returns (bytes32) {
        return company.businessNumber;
    }

    /** @dev  kill the contract functionality
     */
    function kill() public onlyOwner {
        selfdestruct(msg.sender);
    }
}
