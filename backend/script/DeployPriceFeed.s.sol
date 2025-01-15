//SPDX-License-identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {priceFeed} from "../src/priceFeed.sol";


contract DeployPriceFeed is Script {
    uint256 public constant DEFAULT_ANVIL_PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    function run() external returns (priceFeed){
        vm.startBroadcast(DEFAULT_ANVIL_PRIVATE_KEY);
        priceFeed price_feed = new priceFeed();
        vm.stopBroadcast();

        return price_feed;

    }
}

