//requiring Neo npm library
const neo = require("../../../node_modules/neo-api");

const node = neo.node("http://127.0.0.1:20332");

//requiring mongoose
const mongoose = require("../../../globalConfig/mongoose");

//requiring user model
const userWithdrawRequest = require("../../models/userWithdrawRequest");

const userDeposits = require("../../models/userDeposits");
const coldStorageDetails = require("../../models/coldStorageDeposits");

const config = require("../../../globalConfig/Neo/config");
const request = require("request");

transferFunds();

function transferFunds() {
  userDeposits.find(
    { confirmed: true, sent_to_cold_storage: "pending" },
    function(error, result) {
      if (error) {
        console.log(error);
        setTimeout(transferFunds, 3000);
      } else {
        if (result.length > 0) {
          let depositData = result[0];
          request(
            {
              method: "POST",
              uri: config.testnet,
              json: {
                jsonrpc: "2.0",
                method: "sendfrom",
                params: [
                  "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
                  depositData.to_address,
                  config.coldStorageAddress,
                  depositData.amount
                ],
                id: 1
              }
            },
            function(err, res, body) {
              if (err) {
                console.log(err);
                setTimeout(transferFunds, 3000);
              } else if (res.statusCode !== 200) {
                console.log(res.statusCode);
                setTimeout(transferFunds, 3000);
              } else {
                userDeposits
                  .findOneAndUpdate(
                    { tx_hash: depositData.tx_hash },
                    { sent_to_cold_storage: "broadcasted" }
                  )
                  .then(result => {
                    console.log("UserDeposits updated!");

                    let coldStorageDepositDetails = new coldStorageDetails({
                      to_address: config.coldStorageAddress,
                      amount: depositData.amount,
                      sys_fee: body.sys_fee,
                      net_fee: body.net_fee,
                      tx_hash: body.result.txid,
                      confirmation_status: true,
                      currency: "NEO"
                    });
                    coldStorageDepositDetails
                      .save()
                      .then(result => {
                        console.log("Saved transaction in cold storage db");
                        setTimeout(transferFunds, 3000);
                      })
                      .catch(e => {
                        console.log(e);
                        console.log("Failed saving");
                      });
                  })
                  .catch(e => {
                    console.log(e);
                    console.log("Cannot find hash or tx doesnt exist");
                  });
              }
            }
          );
        } else {
          console.log("All funds are sent to Cold Storage");
          setTimeout(transferFunds, 3000);
        }
      }
    }
  );
}
