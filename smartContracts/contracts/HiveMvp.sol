/**
 * Hive Project Proof of Concept
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

import "./helper/Ownable.sol";
import "./object/Company.sol";
import "./object/Investor.sol";

/**
 * @title Hive Project POC (Proof of Concept) smart contract that role is to hold all the invoices
 */
contract HiveProjectPOC is Ownable {
    uint nextInvoiceId = 0;

    address token;

    mapping (address => bool) invoices;
    address[] invoicesList;
    mapping (address => bool) companies;
    address[] companiesList;

    mapping (address => bool) investors;
    address[] investorsList;

    /** @dev  constructor
     */
    function HiveProjectPOC(address _token) public {
        token = _token;
    }

    /** Invoices */
    // Add invoice to Hive Invoices list
    function addInvoice(address invoice) public {
        invoices[invoice] = true;
        invoicesList.push(invoice);
    }

    // List all invoices in Hive
    function listInvoices() public constant returns (address[]) {
        return invoicesList;
    }

    /** Companies */
    // Register/Create new Company in Hive
    function createCompany(uint country, bytes32 name, bytes32 address1, bytes32 address2, bytes32 city, bytes32 postalCode, bytes32 vatNumber, bytes32 businessNumber) public returns (address) {
        address company = new Company(msg.sender, address(this), country, name, address1, address2, city, postalCode, vatNumber, businessNumber);
        companies[company] = true;
        companiesList.push(company);
        return company;
    }

    // List all companies registered in Hive
    function listCompanies() public constant returns (address[]) {
        return companiesList;
    }

    /** Investors */
    // Register/Create new Investor in Hive
    function createInvestors(uint country, bytes32 name, bytes32 address1, bytes32 address2, bytes32 city, bytes32 postalCode) public returns (address) {
        address investor = new Investor(msg.sender, address(this), country, name, address1, address2, city, postalCode);
        investors[investor] = true;
        investorsList.push(investor);
        return investor;
    }

    // List all investors registered in Hive
    function listInvestors() public constant returns (address[]) {
        return investorsList;
    }

    /** @dev  kill the contract functionality 
    */
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
}
