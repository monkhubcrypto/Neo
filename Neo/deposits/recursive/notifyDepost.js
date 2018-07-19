const userDeposits = require("../../models/userDeposits");
const exchangeAPI = require("../../../API/exchangeAPI/exchangeAPI");

const config = require("../../../globalConfig/Neo/config");

const globalconfig = require("../../../globalConfig/globalConfig");

notify();

function notify() {
  userDeposits.find({ exchange_notified: false }, function(error, result) {
    if (error) {
      console.log(error);
      setTimeout(notify, 3000);
    } else {
      if (result.length > 0) {
        for (let deposits of result) {
          let params = {};

          params.AMOUNT = deposits.value;
          params.CURRENCY = deposits.currency;
          params.PUBLIC_ADDRESS = deposits.to_address;

          if (deposits.confirmed == true) {
            params.STATUS = "CONFIRMED";
          } else {
            params.STATUS = deposits.block_confirmations;
          }

          params.TRANSACTION_HASH = deposits.tx_hash;
          params.TRANSACTION_URL = config.blockExplorer + depositDetail.tx_hash;

          exchangeAPI
            .notifyExchange(
              globalConfig.exchangeUrl + "/user/depositSuccess",
              reqParams
            )
            .then(result => {
              console.log(result);
              userDeposit.findOneAndUpdate(
                { tx_hash: depositDetail.tx_hash },
                { exchange_notified: true },
                function(error, result) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(
                      "Exchange notified and logged in database for id " +
                        depositDetail.tx_hash
                    );
                  }
                }
              );
            })
            .catch(error => {
              console.log(error);
            });
        }
        setTimeout(notify, 3000);
      } else {
        setTimeout(notify, 3000);
      }
    }
  });
}
