const { expect } = require("chai");

describe('Donation', function()  {

	beforeEach(async function() {
		[owner, signer2, signer3] = await ethers.getSigners();
		//Owner of contract is the deployer
		Donation = await ethers.getContractFactory('Donation', owner);
		donation = await Donation.deploy();
		await donation.waitForDeployment();

		Polygon = await ethers.getContractFactory('Polygon', signer2);
		polygon = await Polygon.deploy();
		await polygon.waitForDeployment();

		//Signer 2 minted 5,000 WBTC so he owns this much
		WrappedBitcoin = await ethers.getContractFactory('WrappedBitcoin', signer2);
		wrappedBitcoin = await WrappedBitcoin.deploy()
		await wrappedBitcoin.waitForDeployment();

		//Approve 1,000 WBTC to be transferred to Donation contract
		//FROM signer 2
		await wrappedBitcoin.connect(signer2).approve(
			donation.target,
			1000
		)

		//Whitelisted WBTC in Donation contract
		await donation.allowedToken(
			'WBTC',
			wrappedBitcoin.target
		)
	})

	describe('receive', function() {
		it('transfers ether to the contract', async function() {
			//Nononwer transfers 100 ETH (native) to Donation contract
			//Anyone can do - same result with owner transferring test
			await signer2.sendTransaction({
				to: donation.target,
				value: '100'
			});
            //Verify 
			expect(//provider.getBalance to return native ETH balance
				await  ethers.provider.getBalance(donation.target)
			).to.equal('100');
		})
	})

	describe('receiveTokens', function() {
		it('transfers token to the contract', async function() {
			//By passing in a Signer. this will return a Contract which will act on behalf of that signer.
			//Calling receiveTokens with not whitelisted token will receive exception "This token is not allowed"
			//Transferred amount is less than approved amount, otherwise cannot succeed:
			//reverted with custom error 'ERC20InsufficientBalance'
			await donation.connect(signer2).receiveTokens(9,'WBTC')
            
			//check account
			expect(
				await donation.tokenDonations('WBTC')
			).to.equal('9')
            
			//check contract actually received
			expect(
				await wrappedBitcoin.balanceOf(donation.target)
			).to.equal('9')
		})
	})

	describe('ownerWithdrawEther', function() {
		it('withdraws ether from the contract', async function() {
			//signer2 donated 100 ETH
			await signer2.sendTransaction({
				to: donation.target,
				value: '100'
			});
		
        //Owner widthdraw 50 ETH
		await donation.connect(owner).ownerWithdrawEther(50)
        //which leaves 50 balance on the contract
		expect(await ethers.provider.getBalance(donation.target)).to.equal(50);
		
	    })
	})

	
	describe('ownerWithdrawTokens', function() {
		it('withdraws tokens from the contract', async function() {
			//signer2 transfers 22 WBTC to the contract
			await donation.connect(signer2).receiveTokens(22,'WBTC')
            //owner withdraws 2 WBTC from the contract
			await donation.connect(owner).ownerWithdrawTokens(2,'WBTC')
            
			//Check contract still has 20 WBTC balance
			expect(
				await wrappedBitcoin.balanceOf(donation.target)
			).to.equal('20')

			expect(
				await wrappedBitcoin.balanceOf(owner.address)
			).to.equal('2')
		})
	})



})


/*** 
 * SEND TRANSACTION FROM WALLET

require("dotenv").config();
const ethers = require('ethers');
(async () => {
    const provider = new ethers.JsonRpcProvider('QUICKNODE_HTTPS_URL');
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

      const tx = await signer.sendTransaction({
        to: '0x92d3267215Ec56542b985473E73C8417403B15ac',
        value: ethers.parseUnits('0.001', 'ether'),
      });
      console.log(tx);
})();

*/