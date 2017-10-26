/*
 * Operations helper contract
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

contract Operations {
    /**
     * Remove provided item from provided array
     */
    function removeItem(address[] array, address item) internal returns(address[] value) {
        address[] memory arrayNew = new address[](array.length - 1);
        uint8 j = 0;
        for (uint i = 0; i < array.length; i++) {
            if (array[i] != item) {
                arrayNew[j] = array[i];
                j++;
            }
        }
        delete array;
        return arrayNew;
    }

    /** 
     * Remove provided item from provided array
     */
    function removeItem(address[2][] array, address[2] item) internal returns(address[2][] value) {
        address[2][] memory arrayNew = new address[2][](array.length - 1);
        uint8 j = 0;
        for (uint i = 0; i < array.length; i++) {
            if (array[i][0] != item[0] && array[i][1] != item[1]) {
                arrayNew[j] = array[i];
                j++;
            }
        }
        delete array;
        return arrayNew;
    }
}