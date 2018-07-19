const exchangeAPI = require("../../../API/exchangeAPI/exchangeAPI");

const config = require("../../../globalConfig/Neo/config");

const userWithdrawRequest = require("../../models/userWithdrawRequest");

notifyBroadcasted();

function notifyBroadcasted() {
  userWithdrawRequest
    .find({ exchange_notified: false }, function(error, result) {
      if (error) {
        console.log(error);
        setTimeout(notifyBroadcasted, 3000);
      } else if (result.length > 0) {
        for (let tx of result) {
          params = {};

          params.AMOUNT = tx.amount;
          params.ITEM_SHORT_CODE = tx.currency;
          params.PUBLIC_ADDRESS = tx.to_address;

          if (tx.request_status === "success") {
            params.STATUS = tx.request_status;
          } else {
            params.STATUS = tx.block_confirmations;
          }
          params.TRANSACTION_HASH = tx.transaction_hash;
          params.TRANSACTION_ID = tx.transaction_id;
          params.TRANSACTION_URL = config.blockexplorerURL + tx.tx_hash;

          console.log(params);

          exchangeAPI
            .notifyExchange(
              globalConfig.exchangeURL + "user/withdrawSuccess",
              params
            )
            .then(result => {
              console.log(result);
              userWithdrawRequest.findOneAndUpdate(
                { transaction_hash: tx.transaction_hash },
                {
                  exchange_notified: true,
                  exchange_status: tx.block_confirmations
                },
                function(error, result) {
                  console.log(
                    "Exchange notified and logged in database for tx id : " +
                      tx.transaction_id
                  );
                }
              );
            })
            .catch(e => {
              console.log(e);
            });
        }
        setTimeout(notifyBroadcasted, 3000);
      } else {
        setTImeout(notifyBroadcasted, 3000);
      }
    })
    .sort("createdAt")
    .limit(1);
}
