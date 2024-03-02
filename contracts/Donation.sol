pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Donation {
	address public owner;

	uint public etherDonations;

	mapping(string => uint) public tokenDonations;

	mapping(string => address) public allowedTokens;

	constructor() {
		owner = msg.sender;
	}

	function allowedToken(string calldata symbol, address tokenAddress) external onlyOwner {
		allowedTokens[symbol] = tokenAddress;
	}

	receive() external payable {
		etherDonations += msg.value;
	}

	function receiveTokens(uint amount, string calldata symbol) external {
		require(allowedTokens[symbol] != address(0), "This token is not allowed");

		IERC20(allowedTokens[symbol]).transferFrom(msg.sender, address(this), amount);

		tokenDonations[symbol] += amount;
	}

	function ownerWithdrawEther(uint amount) external onlyOwner {
		require(etherDonations >= amount, "Insufficient funds");
		payable(msg.sender).call{value: amount}("");
		etherDonations -= amount;
	}

	function ownerWithdrawTokens(uint amount, string calldata symbol) external onlyOwner {
		require(tokenDonations[symbol] >= amount, "Insufficient funds.");
		IERC20(allowedTokens[symbol]).transfer(msg.sender, amount);
		tokenDonations[symbol] -= amount;
	}

	modifier onlyOwner {
		require(msg.sender == owner, "Only onwer may call this function!");
		_;
	}
	
}