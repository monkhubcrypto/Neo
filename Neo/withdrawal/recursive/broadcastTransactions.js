const userWithdrawRequest = require("../../models/userWithdrawRequest");
const config = require("../../../globalConfig/Neo/config");

processWithdrawRequest();

function processWithdrawRequest() {
  userWithdrawRequest
    .find({ request_status: "pending" }, function(error, result) {
      if (error) {
        console.log(error);
        setTimeout(processWithdrawRequest, 3000);
      } else {
        if (result.length > 0) {
          let withdrawRequest = result[0];
          console.log("Withdraw request:" + withdrawRequest);

          request({
            method: "POST",
            uri: config.testnet,
            json: {
              jsonrpc: "2.0",
              method: "sendfrom",
              params: [
                "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
                config.hotWalletAddress,
                withdrawRequest.to_address,
                withdrawRequest.amount
              ],
              id: 1
            }
          })
            .then(out => {
              let txHash = out.result.txid;
              console.log(
                "Transaction ID" +
                  withdrawRequest.transaction_id +
                  "broadcasted to blockchain"
              );
              console.log("TxHash : " + txHash);

              userWithdrawRequest.findOneAndUpdate(
                { transaction_id: withdrawRequest.transaction_id },
                { request_status: "broadcasted" },
                function(error, result) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("Transaction updated as broadcasted!");
                    setTimeout(processWithdrawRequest, 3000);
                  }
                }
              );
            })
            .catch(err => {
              console.log(err);
              setTimeout(processWithdrawRequest, 3000);
            });
        } else {
          console.log("Waiting for withdrawal requests..");
          setTimeout(processWithdrawRequest, 3000);
        }
      }
    })
    .sort("createdAt")
    .limit(1);
}
