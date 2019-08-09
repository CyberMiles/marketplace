# MarketPlace
<img src="https://img.shields.io/badge/framework-Vue.js-green"> 
<img src="https://img.shields.io/badge/lang-EN-blue">

Marketplace is a decentrailized E-Commerce platform based on CyberMiles Blockchain, which is aimed at buidling a secure and annoymous C2C trading system, supporting the CMT and other types of tokens based on CyberMiles Blockchain. The platform also integrates many awesome features provided by the [smart contract search engine](https://github.com/second-state/smart-contract-search-engine), allowing users to browser the products efficiently.

## Getting Started

### Download CyberMiles Wallet

Since this platform is based on CyberMiles Blockchain, to interact with which, the first thing you need to do is to download the CyberMiles Wallet.

- [Mobile App](https://app.cybermiles.io/)
- [Chrome Extension](https://chrome.google.com/webstore/detail/venus/hmiddckbbijmdkamphkgkelnjjdkicck)

### Run Marketplace in Local

```
git clone git@github.com:CyberMiles/marketplace.git
cd marketplace/dapp
npm install
npm run serve
```
Output might look like:
```
......
 App running at:
  - Local:   http://localhost:8080/ 
  - Network: http://192.168.1.101:8080/

```
Now the MarketPlace platform has successfully run in your localhost.


> If you want to **deploy marketplace in your customized server**, please refer to [Vue CLI project deployment](https://cli.vuejs.org/guide/deployment.html).

## Customized Config

There are some customized config options in [global.js]() when running the platform.

| Variable Name    | Description |
|------------------|-------------|
| popularTags      | The tags set as popular tags, which display in the home page. |
| abiShaList | The sha3 hash of the abi of the product contrat. (Refer to [es-ss.js library](https://github.com/second-state/es-ss.js#sha-an-abi) for more infomation of smart contract search engine api) |
|eeEndpoint|  The api used to fetch items from the search engine provider. (Refer to [es-ss.js library](https://github.com/second-state/es-ss.js#sha-an-abi) for more infomation of smart contract search engine api)|
|submitESEndpoint| The smart contract search engine provider. (Refer to [es-ss.js library](https://github.com/second-state/es-ss.js#sha-an-abi) for more infomation of smart contract search engine api)|
|USDaddr| The static token address. |
|USDunit| The name of the static tokens.|
|USDBuyLink| The link teaching users how to buy static coins. |
|escrowPeriod| The time duration for the tokens in escrow. |
|HttpProvider| The public http provider used to interact with the CyberMiles Blockchain, when there's no web3 injected to the browser.|
|DAOaddr| The customized DAO account address accepted by the platform, who has the power to deal with the dispute, for example.|
|ProductName| The customized name of the platform, which display in the title of web pages.|

### You might want to change the contract (Listing.lity)......

After your updates of contract, do remember to:
1. Compile the new contract and make sure the correctness of your changes.
2. Use the new abi and the bytecode in ``/marketplace/dapp/src/contracts.js``.
3. Calculate the new abiSha using es-ss.js and submit it to the search engine. (Refer to [es-ss.js library](https://github.com/second-state/es-ss.js#sha-an-abi) for more infomation of smart contract search engine api)
4. Replace the variable ``abiShaList`` in``/marketplace/dapp/src/global.js`` with the new calculated abiSha.
5. Modify the front-end logic related to your updated function in the contract.


## In-Depth of the Platform

Each single product in this platform is an individual contract deployed in CyberMiles Blockchain, that is to say, when seller create a listing, what his exact behavior is to deploy a new contract on the CyberMiles Blockchain. Then the other product-related actions (eg. *buy*, *dispute*) are all called at the address of this contract. 

Different actions called on the contract programatically would make the purchase process updated semantically. According to the semantic meaning of different purchase progress, we design some different contract status respectivel. 

!(FlowChart of Purchasing)[https://github.com/CyberMiles/marketplace/tree/master/docs/MPflowchart.png]

There's 3 parties in this trading system.

- Seller: the owner of the contract.
- Buyer: the buyer. Note that one contract is able to have at most only one buyer.
- DAO: the account address who has the power to deal with the dispute, for example.

The initial status of the contract is **Listing** as the seller deploys it. Seller can switch the contract between the *Listing* and *Unlisting*, where **Unlisting** suggests the buyer is not able to buy it temporarily. The DAO can set the product with *Listing* or *Unlisting* status to **Processing** manually, which means all the actions is not able to run unless the DAO set the *Processing* status back to *Listing*.

When someone calls *Buy* on the product contract, then that person is remarked as the buyer in the contract which slides into the **BuyerLocked** status respectively. It's worth mentioning in this status, the fund from the buyer is locked in the contract for some specific escrow duration, which is set up in the constructor of the contract.

Within the *BuyerLocked* status, if the buyer:
- Do nothing: after the escrow duration, anyone has the permission to transfer the fund from the contract to the seller and then the contract ends up with **BuyerPaid** status, which means whatever the funds eventually flows to the seller side.
- Raise dispute: contract will be set as the **Dispute** status, which means the fund in the contract will be locked until the dispute is resolved by DAO, who can either set judge buyer wins or the seller wins, with contract flowing to *BuyerPaid* and *BuyerRefunded* status respectively. **BuyerRefunded** means whatever the funds eventually flows to the buyer side.
- Call *Receive*: with buyer confirming recipt, the fund in the contract can flow to the buyer side immediately, making the contract to the *BuyerPaid* status.

While the *BuyerLocked* and *Dispute* status, the seller has the ability to refund to the buyer for some business reason (Eg. the destination is out of shipping region).

## More

- [ToDos](https://github.com/CyberMiles/marketplace/tree/master/docs/TODO.md)