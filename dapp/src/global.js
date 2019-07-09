export default {
  popularTags: ["white", "test", "girl"],
  USDaddr: "0xce9a6ec5f153b87ad0f05915c85dbd3a0f6ed99a",
  USDunit: "SMC",
  escrowPeriod: 600
};

function createHandler(contract, obj, bin, fromUser, that) {
  var data =
    "0x" +
    contract.new.getData(
      obj.title,
      obj.desc,
      obj.tags,
      obj.categories,
      obj.imageUrls,
      obj.contact,
      obj.escrowPeriod,
      obj.crc20,
      obj.amount, // the OPB is 2 decimals,
      { data: bin }
    );
  contract.new(
    [
      obj.title,
      obj.desc,
      obj.tags,
      obj.categories,
      obj.imageUrls,
      obj.contact,
      obj.escrowPeriod,
      obj.crc20,
      obj.amount
    ],
    {
      from: fromUser,
      data: data,
      gas: "9999000",
      gasPrice: 2000000000
    },
    function(e, instance) {
      if (e) {
        console.log(e);
      } else {
        let filter = window.web3.cmt.filter("latest");
        var confirmed = false;
        filter.watch(function(error, blockhash) {
          if (!error) {
            var txhash = instance.transactionHash;
            console.log(blockhash, txhash, instance);
            window.web3.cmt.getBlock(blockhash, function(e, r) {
              if (r.transactions.indexOf(txhash) != -1) {
                confirmed = true;
              }
              // console.log(confirmed, blockhash, txhash, r.transactions);
              //The filter will watch when the state is changing. As the trasaction has been mined, the instance.address is still undefined. So we need to wait for .instance.address state changed.
              if (instance.address != undefined && confirmed) {
                confirmed = false; // make sure only execute onece
                console.log(filter.stopWatching());
                console.log("stop and redirect"); //???
                that.$router.push({
                  path: `/listing/${instance.address}`
                });
              }
            });
          }
        });
      }
    }
  );
}

function relistHandler(instance, reloc = "") {
  instance.resume(
    {
      gas: "400000",
      gasPrice: 0
    },
    function(e, txhash) {
      web3Callback(e, txhash, reloc)
    }
  );
}

function unlistHandler(that, instance, reloc = "") {
  that
    .$swal({
      title: "Are you sure?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unlist it!"
    })
    .then(result => {
      if (result.value) {
        unlist(instance, reloc);
      }
    });
}

function unlist(instance, reloc) {
  instance.pause(
    {
      gas: "400000",
      gasPrice: 0
    },
    function(e, txhash) {
      web3Callback(e, txhash, reloc);
    }
  );
}

function closeByBuyerHandler(instance, reloc = "") {
  instance.closeByBuyer(
    {
      gas: "400000",
      gasPrice: 0
    },
    function(e, txhash) {
      web3Callback(e, txhash, reloc);
    }
  );
}

function closeBySellerHandler(instance, reloc = "") {
  instance.closeBySeller(
    {
      gas: "400000",
      gasPrice: 0
    },
    function(e, txhash) {
      web3Callback(e, txhash, reloc);
    }
  );
}

function refundHandler(instance, reloc = "") {
  instance.refund(
    {
      gas: "400000",
      gasPrice: 0
    },
    function(e, txhash) {
      web3Callback(e, txhash, reloc);
    }
  );
}

function disputeHandler(instance, reloc = "") {
  instance.dispute(
    "",
    {
      gas: "400000",
      gasPrice: 0
    },
    function(e, txhash) {
      web3Callback(e, txhash, reloc);
    }
  );
}

function remarkHandler(instance, text, reloc = "") {
  instance.pushMsg(
    text,
    {
      gas: "400000",
      gasPrice: 0
    },
    function(e, txhash) {
      web3Callback(e, txhash, reloc);
    }
  );
}

function web3Callback(e, txhash, reloc) {
  if (e) {
    console.log(e);
  } else {
    var filter = window.web3.cmt.filter("latest");
    filter.watch(function(error, blockhash) {
      if (!error) {
        console.log(blockhash, txhash);
        window.web3.cmt.getBlock(blockhash, function(e, r) {
          console.log(blockhash, txhash, r.transactions);
          if (txhash.indexOf(r.transactions) != -1) {
            filter.stopWatching();
            if (reloc != undefined) {
              location.href = reloc;
            } else {
              location.reload(true);
            }
          }
        });
      }
    });
  }
}

function makeQuery(statusArr, userAddress) {
  var queryPayload = {
    query: {
      bool: {
        must: [
          {
            match: {
              abiShaList:
                "0xca44fb82aad28d1d2c373a2934e8bc280cd418352b2c0e077d8dd715112434f1"
            }
          },
          {
            match: {
              "functionDataList.0.functionData.info.8": userAddress
            }
          },
          {
            bool: {
              should: []
            }
          }
        ]
      }
    }
  };
  statusArr.forEach(function(status) {
    queryPayload.query.bool.must["2"].bool.should.push({
      match: {
        "functionDataList.0.functionData.info.0": status
      }
    });
  });
  return queryPayload;
}

function queryOptions(query) {
  return {
    method: "POST",
    headers: { "content-type": "application/json" },
    data: JSON.stringify(query),
    url: "https://cmt-testnet.search.secondstate.io/api/es_search"
  };
}

function compare(prop) {
  return function(obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  };
}

export {
  createHandler,
  unlistHandler,
  relistHandler,
  closeByBuyerHandler,
  closeBySellerHandler,
  remarkHandler,
  refundHandler,
  disputeHandler,
  makeQuery,
  queryOptions,
  compare
};