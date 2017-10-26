/*
 * Invoice POCO
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

import "../HiveMvp.sol";
import "../lib/SafeMathLib.sol";
import "./Company.sol";
import "./Investor.sol";

contract Invoice {
    using SafeMathLib for uint;

    struct SettlementStruct {
        address seller;
        address payer;
        uint256 offerExiresDate;
        uint256 payedOnDate;
        uint256 cost;
        uint256 takeOverAmount;
    }

    struct InvoiceStruct {
        address hiveProjectPOC;

        // Security
        address owner; // company
        address[] owners;

        // Base info
        uint256 issueDate;
        uint256 dueDate;
        uint256 invoiceId;
        uint country;

        // Companies 
        address issuer; // seller
        address customer; // payer
        address debtor; // investor

        // Value
        uint256 amount;
        bytes3 currency;
        uint256 maxDiscount;

        uint256 offerExiresDate;
        uint256 payedOnDate;
        uint256 cost;
        uint256 takeOverAmount;

        /*
         * State:
         * 0 - Pending
         * 1 - OnSale
         * 2 - Settled
        */
        uint8 state;
        bool confirmed;   

        mapping (address => SettlementStruct) settlements;
    }

    function Invoice(uint256 _dueDate, uint256 _invoiceId, address _issuer, address _customer, uint _country, uint _amount, bytes3 currency, uint _maxDiscount, address hiveProjectPOC) public {
        invoice.owner = _issuer;
        invoice.owners.push(_issuer);
        invoice.issueDate = now;
        invoice.dueDate = _dueDate;
        invoice.invoiceId = _invoiceId;
        invoice.issuer = _issuer;
        invoice.customer = _customer;
        invoice.country = _country;
        invoice.amount = _amount;
        invoice.currency = currency;
        invoice.maxDiscount = _maxDiscount;
        invoice.state = 0;

        invoice.hiveProjectPOC = hiveProjectPOC;
    }

    InvoiceStruct invoice;
    
    // Events
    event InvoiceOwnershipChanged(address _from, address _to, uint _amountPaid);
    event InvoiceClosed(uint blockNumber);

    // Actions
    function buyInvoice(address buyer) public payable {
        require(invoice.dueDate != 0);
        
        uint256 amountForTransfer = getTakeOverPrice();
        require(amountForTransfer != 0);
        
        SettlementStruct memory settlement;
        settlement.seller = invoice.owner;
        
        settlement.offerExiresDate = invoice.offerExiresDate;
        settlement.payedOnDate = now;
        settlement.takeOverAmount = invoice.takeOverAmount;

        if (buyer == invoice.customer) {
            buyInvoiceHelper(settlement, invoice.owner, buyer, invoice.amount);
            // Mark as payed/settled
            markAsSettled();
            InvoiceClosed(now);  
        } else {
            buyInvoiceHelper(settlement, invoice.owner, buyer, amountForTransfer);

            InvoiceOwnershipChanged(settlement.seller, buyer, amountForTransfer);
        }
    }

    function buyInvoiceHelper(SettlementStruct settlement, address seller, address payer, uint256 amount) private {
        // Set settlement payer
        settlement.payer = payer;
        settlement.cost = amount;

        // Mark invoice as pending
        markAsPending(seller);
        
        // Add settlement information
        invoice.settlements[seller] = settlement;

        // Change owner
        changeOwner(payer);
    }

    /* Base info */
    // Setters
    function setIssueDate(address owner, uint256 issueDate) public onlyOwner(owner) {
        invoice.issueDate = issueDate;
    }

    function setDueDate(address owner, uint256 dueDate) public onlyOwner(owner) {
        invoice.dueDate = dueDate;
    }
    
    function setInvoiceId(address owner, uint256 invoiceId) public onlyOwner(owner) {
        invoice.invoiceId = invoiceId;
    }

    function setCountry(uint country) public {
        invoice.country = country;
    }

    // Getters
    function getIssueDate() public constant returns (uint256) {
        return invoice.issueDate;
    }

    function getDueDate() public constant returns (uint256) {
        return invoice.dueDate;
    }

    function getInvoiceId() public constant returns (uint256) {
        return invoice.invoiceId;
    }

    function getCountry() public constant returns (uint) {
        return invoice.country;
    }
    
    /* Users */ 
    // Setters 
    function setIssuer(address owner, address issuer) public onlyOwner(owner) {
        invoice.issuer = issuer;
    }

    function setCustomer(address owner, address customer) public onlyOwner(owner) {
        invoice.customer = customer;
    }

    function setDebtor(address owner, address debtor) public onlyOwner(owner) {
        invoice.debtor = debtor;
    }

    // Getters 
    function getIssuer() public constant returns (address) {
        return invoice.issuer;
    }

    function getCustomer() public constant returns (address) {
        return invoice.customer;
    }

    function getDebtor() public constant returns (address) {
        return invoice.debtor;
    }

    /* Values */
    // Setters
    function setAmount(address owner, uint256 amount) public onlyOwner(owner) {
        invoice.amount = amount;
    }

    function setCurrency(address owner, bytes3 currency) public onlyOwner(owner) {
        invoice.currency = currency;
    }

    function setMaxDiscount(address owner, uint256 maxDiscount) public onlyOwner(owner) {
        invoice.maxDiscount = maxDiscount;
    }

    function setTakeOverPrice(address owner, uint256 takeOverAmount) public onlyOwner(owner) {
        invoice.takeOverAmount = takeOverAmount;
    }

    // Getters
    function getAmount() public constant returns (uint256) {
        return invoice.amount;
    }
    
    function getCurrency() public constant returns (bytes3) {
        return invoice.currency;
    }

    function getMaxDiscount() public constant returns (uint256) {
        return invoice.maxDiscount;
    }

    function getOfferExpiresDate() public constant returns (uint256) {
        return invoice.offerExiresDate;
    }

    function getTakeOverPrice() public constant returns (uint256) {
        return invoice.takeOverAmount;
    }

    function getOfferExpiresDateHistory(address _company) public constant returns (uint256) {
        return invoice.settlements[_company].offerExiresDate;
    }

    function getTakeOverPriceHistory(address _company) public constant returns (uint256) {
        return invoice.settlements[_company].takeOverAmount;
    }

    function getPayedOnDateHistory(address _company) public constant returns (uint256) {
        return invoice.settlements[_company].payedOnDate;
    }

    function getCostHistory(address _company) public constant returns (uint256) {
        return invoice.settlements[_company].cost;
    }
    /* Invoice state */
    // Setters
    // Mark invoice as pending
    function markAsPending(address owner) public onlyOwner(owner) {
        invoice.state = 0;
    }

    // Mark invoice for sale
    function markAsOnSale(address owner, uint256 offerExpiryDate, uint256 takeOverAmount) public onlyOwner(owner) notSettled {
        invoice.state = 1;
        invoice.offerExiresDate = offerExpiryDate;
        invoice.takeOverAmount = takeOverAmount;
    }

    // Mark invoice as payed/settled
    function markAsSettled() private {
        invoice.state = 2;
    }

    // Confirm invoice
    function markAsConfirmed(address payer) public onlyPayer(payer) {
        invoice.confirmed = true;
    }
    
    // Getters
    // Get current invoice state
    function getState() public constant returns (uint8) {
        return invoice.state;
    }

    // Check if invoice is confirmed
    function isConfirmed() public constant returns (bool) {
        return invoice.confirmed;
    }

    /* Security */
    // Change invoice owner
    function changeOwner(address owner, address newOwner) public onlyOwner(owner) {
        if (invoice.owner != newOwner) {
            invoice.owners.push(newOwner);
        }
        invoice.owner = newOwner;
    }

    function changeOwner(address newOwner) private {
        if (invoice.owner != newOwner) {
            invoice.owners.push(newOwner);
        }
        invoice.owner = newOwner;
    }

    // Getters
    // Get current invoice owner
    function getOwner() public constant returns (address) {
        return invoice.owner;
    }

    // List all history of invoice owners
    function listOwners() public constant returns (address[]) {
        return invoice.owners;
    }

    /* Modifiers */
    
    modifier notSettled() {
        assert(invoice.state != 2);
        _;
    }

    modifier settled() {
        assert(invoice.state == 2);
        _;
    }

    modifier notConfirmed() {
        assert(!invoice.confirmed);
        _;
    }

    modifier confirmed() {
        assert(invoice.confirmed);
        _;
    }

    modifier onlyPayer(address payer) {
        require(payer == invoice.customer || payer == invoice.customer);
        _;
    }

    modifier onlyOwner(address owner) {
        require(owner == invoice.owner || owner == invoice.owner);
        _;
    }
    
    /** @dev  kill the contract functionality
     */
    function kill(address owner) public onlyOwner(owner) {
        selfdestruct(owner);
    }
}
