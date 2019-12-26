// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain');

const State =
{
    Harvested: 0,
    Processed: 1,
    Packed: 2,
    ForSale: 3,
    Sold: 4,
    Shipped: 5,
    Received: 6,
    Purchased: 7
}


contract('SupplyChain', function (accounts) {

    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1;
    var upc = 1;
    const ownerID = accounts[0];
    const originFarmerID = accounts[1];
    const originFarmName = "John Doe";
    const originFarmInformation = "Yarray Valley";
    const originFarmLatitude = "-38.239770";
    const originFarmLongitude = "144.341490";
    var productID = sku + upc;
    const productNotes = "Best beans for Espresso";
    const productPrice = web3.utils.toWei('1', "ether");
    var itemState = 0;
    const distributorID = accounts[2];
    const retailerID = accounts[3];
    const consumerID = accounts[4];
    const emptyAddress = '0x00000000000000000000000000000000000000';

    ///Available Accounts
    ///==================
    ///(0) 0x4ACF5e91813f31aDF278FF22921a210972aBcCc3
    ///(1) 0x921baa64Bc77aa38B7eB4e72ab2014d2bAa8a4D5
    ///(2) 0xE46c0eEd278183666023fe7d9b2D615C782d71C1
    ///(3) 0xBbD6fd8119B97BEbC9cf4dc126FCbE51326AdF7F
    ///(4) 0x8E486ff025E7C732da23e6d84d3896F215638521
    ///(5) 0x7c8f324f0931f6a761a19F61f799D8f63C682727
    ///(6) 0x55985D10B89Cc550f66Dcbec5AfB98Aa2fE54FaD
    ///(7) 0x774ef29aA8Bcad7e1A9cFD4fCA48c8da11667d82
    ///(8) 0xbCaB6A81eB84570ea4B75D3aB750f81fEe1cb157
    ///(9) 0xBDD2E54113E9403f3a10cF7Eac771f07e1530862

    console.log("ganache-cli accounts used here...");
    console.log("Contract Owner: accounts[0] ", accounts[0]);
    console.log("Farmer: accounts[1] ", accounts[1]);
    console.log("Distributor: accounts[2] ", accounts[2]);
    console.log("Retailer: accounts[3] ", accounts[3]);
    console.log("Consumer: accounts[4] ", accounts[4]);


    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async () => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        let eventEmitted = false

        // Watch the emitted event Harvested()
        supplyChain.Harvested(() => {
            eventEmitted = true;
        });

        // Add the [1] account as a Farmer
        await supplyChain.addFarmer(originFarmerID, { from: ownerID });

        // Mark an item as Harvested by calling function harvestItem()
        await supplyChain.harvestItem(
            upc,
            originFarmerID,
            originFarmName,
            originFarmInformation,
            originFarmLatitude,
            originFarmLongitude,
            productNotes, { from: originFarmerID });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], State.Harvested, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')

    })

    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async () => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        let eventEmitted = false;
        // Watch the emitted event Processed()
        supplyChain.Processed(() => {
            eventEmitted = true;
        });

        // Mark an item as Processed by calling function processtItem()
        await supplyChain.processItem(upc, { from: originFarmerID });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], State.Processed, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')

    });

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async () => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        let eventEmitted = false;

        // Watch the emitted event Packed()
        supplyChain.Packed(() => {
            eventEmitted = true;
        });

        // Mark an item as Packed by calling function packItem()
        await supplyChain.packItem(upc, { from: originFarmerID });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], State.Packed, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')

    })

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async () => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        let eventEmitted = false;
        // Watch the emitted event ForSale()
        supplyChain.ForSale(() => {
            eventEmitted = true;
        });

        // Mark an item as ForSale by calling function sellItem()
        await supplyChain.sellItem(upc, productPrice, { from: originFarmerID });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], State.ForSale, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')

    })

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async () => {
        const supplyChain = await SupplyChain.deployed()

        // Add [2] address as a distributor
        await supplyChain.addDistributor(distributorID, { from: ownerID });

        // Declare and Initialize a variable for event
        let eventEmitted = false;

        // Watch the emitted event Sold()
        supplyChain.Sold(() => {
            eventEmitted = true;
        });

        // Mark an item as Sold by calling function buyItem()
        await supplyChain.buyItem(upc, { from: distributorID, value: productPrice });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], State.Sold, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')

    })

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async () => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        let eventEmitted = false;

        // Watch the emitted event Shipped()
        supplyChain.Shipped(() => {
            eventEmitted = true;
        });

        // Mark an item as Shipped by calling function shipItem()
        await supplyChain.shipItem(upc, { from: distributorID });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], State.Shipped, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')

    })

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async () => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        let eventEmitted = false;

        // Watch the emitted event Received()
        supplyChain.Received(() => {
            eventEmitted = true;
        });

        // Add [3] accounts as a new retailer
        await supplyChain.addRetailer(retailerID, { from: ownerID });

        // Mark an item as Received by calling function receiveItem()
        await supplyChain.receiveItem(upc, { from: retailerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')

        assert.equal(resultBufferTwo[5], State.Received, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Invalid Retailer ID')

        assert.equal(eventEmitted, true, 'Invalid event emitted')

    })

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async () => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        let eventEmitted = false;

        // Watch the emitted event Purchased()
        supplyChain.Purchased(() => {
            eventEmitted = true;
        });

        // Add [4] account as a new consumer
        await supplyChain.addConsumer(consumerID, { from: ownerID });

        // Mark an item as Purchased by calling function purchaseItem()
        await supplyChain.purchaseItem(upc, { from: consumerID, value: productPrice });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')

        assert.equal(resultBufferTwo[5], State.Purchased, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Invalid Retailer ID')
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Invalid Consumer ID')

        assert.equal(eventEmitted, true, 'Invalid event emitted')

    })

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async () => {
        const supplyChain = await SupplyChain.deployed()
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)


        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')

    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async () => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item sku')
        assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item upc')
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product ID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid product notes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid product price')
        assert.equal(resultBufferTwo[5], State.Purchased, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributor ID')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Invalid retailer ID')
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Invalid Consumer ID')


    })

});

