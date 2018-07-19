let config = require("../../../globalConfig/Neo/config");

let userDeposits = require("../../models/userDeposits");

var neo = require("neo-api");
var node = neo.node("http://127.0.0.1:20332");

checkBlockConfirmations();

function checkBlockConfirmations() {
  userDeposits.find({ confirmed: false }, function(error, result) {
    if (error) {
      console.log(error);
      setTimeout(checkBlockConfirmations, 3000);
    } else {
      if (result.length > 0) {
        for (let depositData of result) {
          node
            .getrawtransaction(depositData.tx_hash)
            .then(result => {
              let txdata = result;
              let blockconfirmations = txdata.confirmations;
              if (blockconfirmations > 29) {
                userDeposits.findOneAndUpdate(
                  { tx_hash: depositData.tx_hash },
                  {
                    confirmed: true,
                    blockconfirmations: "30+",
                    exchange_notified: false
                  },
                  function(error, result) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log(
                        "Deposit data confirmed after " +
                          blockconfirmations +
                          "confirmations"
                      );
                    }
                  }
                );
              } else if (
                depositData.block_confirmations != blockconfirmations
              ) {
                userDeposits.findOneAndUpdate(
                  { tx_hash: depositData.tx_hash },
                  {
                    block_confirmations: blockconfirmations,
                    exchange_notified: false
                  },
                  function(error, result) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log(
                        "Your deposit will be confirmed after 30 network confirmations"
                      );
                    }
                  }
                );
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
        setTimeout(checkBlockConfirmations, 3000);
      } else {
        setTimeout(checkBlockConfirmations, 3000);
      }
    }
  });
}
