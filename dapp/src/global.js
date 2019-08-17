import Global from "@/global.js";
import appLogo from "./assets/imgs/app@3x.jpg";
import appQrcode from "./assets/imgs/appQrcode.png";
import Vue from "vue";
import VueAnalytics from "vue-analytics";
import Contracts from "@/contracts.js";
import ES from "@/modules/es-ss.js";
import config from "../vue.config.js";
import router from "./router";

Vue.use(VueAnalytics, {
  id: "UA-120065893-20"
});

export default {
  popularTags: ["white", "test", "girl", "long tag tag long tag", "long tag tag long tag"],
  abiShaList:
    "0xf2d55a1e2ceaf0e1511115e100490464fcb8d62993860c1251bd0c56fa16df9a",
  eeEndpoint: "https://marketplace.search.secondstate.io/api/es_search",
  submitESEndpoint: "https://marketplace.search.secondstate.io",
  USDaddr: "0x08bcb145e174e59e033d2d9c4bc4d0fe49a82613",
  USDunit: "USDO",
  USDBuyLink:
    "http://stripe-stablecoin.ufn3g4prnu.ap-northeast-1.elasticbeanstalk.com/checkout?currency=usd&contract_addr=",
  escrowPeriod: 60 * 60 * 24 * 21,
  chainId: 19,
  HttpProvider: "https://testnet-rpc.cybermiles.io:8545",
  DAOaddr: "0x9EE2DFA53038B4d2BBcefCD3517f21384490cBB1",
  ProductName: "Market Place",
  USDOsupportEmail: "usdo@supernodecapital.com",
  badGuys: [
    "0x5dDC817cf4Ed5EE01E3CabAa4689787Ff5618768"
  ]
};

function createHandler(contract, obj, bin, fromUser, that) {
  if (
    Global.badGuys
      .map(obj => obj.toLowerCase())
      .indexOf(fromUser.toLowerCase()) !== -1
  ) {
    return;
  }
  var redirected = false;
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
      obj.crc20_2,
      obj.amount_2,
      Global.DAOaddr,
      Global.USDaddr,
      "", //TODO: JSON_SHIPPING_COST. It should fetch from user input in the future.
      "", //TODO: SELLER PGP KEY. It should fetch from user input in the future.
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
      obj.amount,
      obj.crc20_2,
      obj.amount_2,
      Global.DAOaddr,
      Global.USDaddr,
      "", //TODO: JSON_SHIPPING_COST. It should fetch from user input in the future.
      "" //TODO: SELLER PGP KEY. It should fetch from user input in the future.
    ],
    {
      from: fromUser,
      data: data,
      gas: "99990000",
      gasPrice: 2000000000
    },
    function(e, instance) {
      if (e) {
        goDebug({
          txHash: instance.transactionHash,
          callMethod: "null",
          error: e
        });
      } else {
        var txhash = instance.transactionHash;
        if (!redirected) {
          that.$router.push({
            path: `/creating/${txhash}`
          });
          redirected = true;
        } else {
          //try to be more reliable, submit abi explictly
          let esss = new ES(Global.submitESEndpoint);
          var abi = JSON.stringify(Contracts.Listing.abi);
          var abiSubmission = esss.submitAbi(abi, txhash);
          abiSubmission
            .then(function(result) {
              console.log("Result is " + result);
            })
            .catch(function() {
              console.log("Error");
            });
          //submission end
        }
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
      web3Callback(e, txhash, reloc);
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

function goDebug(debugInfo) {
  let connector = "";
  if (router.mode == "hash") connector = "#/";
  else if (router.mode == "history") connector = "";

  console.log(Object.keys(debugInfo))
  let debugURL =
    window.location.origin +
    config.publicPath +
    connector +
    "debug?errorURL=" +
    window.location.href +
    "&txHash=" +
    debugInfo.txhash +
    "&callMethod=" +
    debugInfo.callMethod +
    "&error=" +
    debugInfo.e;
  location.href = debugURL;
}

function web3Callback(e, txhash, reloc) {
  if (e) {
    goDebug({
      txhash: txhash,
      callMethod: "null",
      e: e
    });
  } else {
    var getReceipt = function() {
      try {
        window.web3.cmt.getTransactionReceipt(txhash, function(e, receipt) {
          if (e) {
            goDebug({
              txhash: "null",
              callMethod: "getTransactionReceipt",
              e: e
            });
          } else {
            if (receipt == null) setTimeout(getReceipt, 100);
            else {
              if (receipt.status == 0x1) {
                if (reloc != undefined && reloc != "") {
                  var router = reloc.router;
                  router.push(reloc.href);
                } else {
                  location.reload(true);
                }
              } else {
                alert("TX FAILED.");
              }
            }
          }
        });
      } catch (e) {
        setTimeout(getReceipt, 100);
        console.log("wait");
      }
    };
    getReceipt();
  }
}

function makeQuery(statusArr, sellerAddress = null, buyerAddress = null) {
  var queryPayload = {
    query: {
      bool: {
        must: [
          {
            bool: {
              should: []
            }
          },
          {
            match: {
              abiShaList: Global.abiShaList
            }
          },
          {
            match: {
              "functionDataList.0.functionData.DAO_ADDR": Global.DAOaddr
            }
          }
        ]
      }
    }
  };
  if (sellerAddress != null) {
    queryPayload.query.bool.must.push({
      match: {
        "functionDataList.0.functionData.info.8": sellerAddress
      }
    });
  } else if (buyerAddress != null) {
    queryPayload.query.bool.must.push({
      match: {
        "functionDataList.0.functionData.info.9": buyerAddress
      }
    });
  }
  statusArr.forEach(function(status) {
    queryPayload.query.bool.must["0"].bool.should.push({
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
    url: Global.eeEndpoint
  };
}

function compare(prop) {
  return function(obj1, obj2) {
    const props = prop.split(".");
    var val1 = obj1;
    var val2 = obj2;
    props.forEach(function(key) {
      val1 = val1[key];
      val2 = val2[key];
    });
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

function computePayment(item) {
  var amount = "";
  var unit = "";
  if (item.functionData.buyerInfo[8].toLowerCase() == Global.USDaddr) {
    unit = Global.USDunit;
    amount = (parseInt(item.functionData.buyerInfo[9]) / 100).toString();
  } else if (
    item.functionData.buyerInfo[8] ==
    "0x0000000000000000000000000000000000000000"
  ) {
    unit = "CMT";
    amount = window.web3.fromWei(item.functionData.buyerInfo[9]);
  }
  return amount + " " + unit;
}

function web3Pass(that, targetUrl = null) {
  try {
    window.web3.cmt;
    if (window.web3.currentProvider.host !== Global.HttpProvider) return true;
    else throw "NoWeb3";
  } catch (e) {
    if (_isMobile())
      that
        .$swal({
          html:
            "<strong>Please use CyberMiles APP to finish your order</strong>",
          // text: 'Modal with a custom image.',
          imageUrl: appLogo,
          imageWidth: 48,
          imageHeight: 48,
          animation: false,
          width: 300,
          confirmButtonText: `Use ${Global.ProductName} in App`
        })
        .then(function(result) {
          if (result.value) {
            if (targetUrl !== null) {
              let connector = "";
              if (router.mode == "hash") connector = "#/";
              else if (router.mode == "history") connector = "";

              if (targetUrl.slice(0, 1) == "/") targetUrl = targetUrl.slice(1);
              that.$router.push(
                `/download/reloc?=${window.location.origin +
                  config.publicPath +
                  connector +
                  targetUrl}`
              );
            } else
              that.$router.push(`/download/reloc?=${window.location.href}`);
            // const webBrowser = new Browser.AppLink();
            // webBrowser.openBrowser();
          }
        });
    else
      that
        .$swal({
          html:
            "<b>Download and scan the bar code with CyberMiles APP to finish your order</b>",
          // text: 'Modal with a custom image.',
          imageUrl: appQrcode,
          imageWidth: 200,
          imageHeight: 200,
          animation: false,
          width: 400,
          confirmButtonText: "Download CyberMiles APP"
        })
        .then(function(result) {
          if (result.value) location.href = "https://app.cybermiles.io";
        });
    return false;
  }
}

function _isMobile() {
  let flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
  return flag;
}

function refactorListingTitle(uri) {
  return uri.replace(/ /g, "-").replace(/\+|%|\/|\?|#|&|=/g, "");
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
  compare,
  computePayment,
  web3Pass,
  web3Callback,
  goDebug,
  refactorListingTitle
};
