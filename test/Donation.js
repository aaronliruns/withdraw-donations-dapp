const { expect } = require("chai");

describe('Donation', function()  {

	beforeEach(async function() {
		[owner, signer2] = await ethers.getSigners();
		Donation = await ethers.getContractFactory('Donation', owner);
		donation = await Donation.deploy();
		await donation.waitForDeployment();

		Polygon = await ethers.getContractFactory('Polygon', signer2);
		polygon = await Polygon.deploy();
		await polygon.waitForDeployment();

		WrappedBitcoin = await ethers.getContractFactory('WrappedBitcoin', signer2);
		wrappedBitcoin = await WrappedBitcoin.deploy()
		await wrappedBitcoin.waitForDeployment();

		//Approve 1,000 WBTC to be transferred to Donation contract
		await wrappedBitcoin.connect(signer2).approve(
			donation.target,
			1000
		)

		//Allowed WBTC in Donation contract
		await donation.allowedToken(
			'WBTC',
			wrappedBitcoin.target
		)
	})

	describe('receive', function() {
		it('transfers ether to the contract', async function() {
			//Transfer 100 ETH (native) to Donation contract
			await signer2.sendTransaction({
				to: donation.target,
				value: '100'
			});
            //Verify 
			expect(
				await  ethers.provider.getBalance(donation.target)
			).to.equal('100');
		})
	})

	describe('receiveTokens', function() {
		it('transfers ether to the contract', async function() {
			await donation.connect(signer2).receiveTokens(9,'WBTC')

			expect(
				await donation.tokenDonations('WBTC')
			).to.equal('9')

			expect(
				await wrappedBitcoin.balanceOf(donation.target)
			).to.equal('9')
		})
	})

	describe('ownerWithdrawEther', function() {
		it('withdraws ether from the contract', async function() {
			await signer2.sendTransaction({
				to: donation.target,
				value: '100'
			});
		

		await donation.connect(owner).ownerWithdrawEther(50)

		expect(await ethers.provider.getBalance(donation.target)).to.equal(50);
		
	    })
	})

	
	describe('ownerWithdrawTokens', function() {
		it('withdraws tokens from the contract', async function() {
			await donation.connect(signer2).receiveTokens(22,'WBTC')

			await donation.connect(owner).ownerWithdrawTokens(2,'WBTC')

			expect(
				await wrappedBitcoin.balanceOf(donation.target)
			).to.equal('20')

			expect(
				await wrappedBitcoin.balanceOf(owner.address)
			).to.equal('2')
		})
	})

})