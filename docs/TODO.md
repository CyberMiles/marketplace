### TODO

- [ ] The option to set up the shipping cost for the seller.
	- the basic logic is like: when the seller creates the listing product, a json string including the information of shipping destination and respective cost in different coin addresses will be passed as parameter. Then when the buyer *buy* the product, he is required to select a destination and the payment method and the contract will calculate the total amount he has to pay for.
	- The contract current progress: the conversion from the json string to mapping is implemented in the function ``setupShippingcost``, without test yet.
	- The front end logic: Not implemented.

Especially, a sample json string used to interact between the front-end and the dapp is like:
```
{
	"dest": "Beijing",
	"cost": {
				{
					"coinAddr": 0x0000000000000000000000000000000000000000",
					"amount": 10
				},
				{
					"coinAddr": 0x0000000000000000000000000000000000000001",
					"amount": 14
				}
			}
},
{
	"dest": "Shanghai",
	"cost":{
				{
					"coinAddr": 0x0000000000000000000000000000000000000000",
					"amount": 10
				},
				{
					"coinAddr": 0x0000000000000000000000000000000000000001",
					"amount": 14
				}
			}
}

```


- [ ] PGP Key Encryption for the message exchange between the buyer and the seller.
	- The contract current logic is: in the constructor, the seller sould pass his public key as the parameter, whereas when buyer `buy` the product, buyer's public key is also passed as the parameter.
	- The front-end logic will be expected to: the shipping info updated by the buyer and all the communication between the buyer and the seller would using PGP encryption.
- [ ] Algorithm for the search engine.
	- The current front-end logic in homepage is like: two tabs in the homepage.
		-  *latest*  (the listing status items sorted by the block number) 
		- *sold*  (the BuyerLocked, Dispute, BuyerRefunded and BuyerPaid status items sorted by the block number).
	- The expected logic will be: replace the *latest* tab with *hottest* tab. The *hottest* algorithm is expected to implement by the search engine, with the order by score first, then time, and also trying to avoid listing the same product or seller. In case of the display, the very new products might be added a "New" tag.
	
