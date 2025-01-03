//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {AggregatorV3Interface} from "./AggregatorV3Interface.sol";

contract priceFeed{

    address private ETH_TO_USD = 0x694AA1769357215DE4FAC081bf1f309aDC325306;
    address private BTC_TO_USD = 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43;
    uint256 private constant ADDITIONAL_FEED_PRECISION = 1e10;
    uint256 private constant PRECISION = 1e18;

    uint256 public ETH_PRICE;
    uint256 public BTC_PRICE;

    AggregatorV3Interface internal price_feed;

    function EthPrice() public returns(uint256){
        price_feed = AggregatorV3Interface(ETH_TO_USD);
        (, int price, , ,) = price_feed.latestRoundData();
        
        uint256 updated = Accurate(price);
        ETH_PRICE = updated;
        return updated;
    }

    function Accurate(int price) private pure returns(uint256){
        return (uint256(price) * ADDITIONAL_FEED_PRECISION);
    }

    function BtcPrice() public returns (uint256){
        price_feed = AggregatorV3Interface(BTC_TO_USD);
        (, int price, , ,) = price_feed.latestRoundData();

        uint256 normalized = Accurate(price);
        BTC_PRICE = normalized;
        return normalized;
    }

}