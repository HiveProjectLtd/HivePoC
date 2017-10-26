/**
 * Safe Math Smart Contract.  
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

/**
 * Provides methods to safely add, subtract and multiply uint256 numbers.
 */
library SafeMathLib {
    function times(uint a, uint b) constant public returns (uint) {
        uint c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function minus(uint a, uint b) constant public returns (uint) {
        assert(b <= a);
        return a - b;
    }

    function plus(uint a, uint b) constant public returns (uint) {
        uint c = a + b;
        assert(c>=a && c>=b);
        return c;
    }
}
