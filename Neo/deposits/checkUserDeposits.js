//requiring Neo npm library
const neo = require("../../node_modules/neo-api");

const node = neo.node("http://127.0.0.1:20332");

//requiring mongoose
const mongoose = require("../../config/Neo/mongoose");

//requiring user model
const userDeposit = require("../models/userDeposits");
const transactions = require("../models/transactions");
const key = require("../models/userAllottedPublicAddress");

checkUserDeposit();

function checkUserDeposit() {
  transactions
    .find({ tx_checked: false })
    .sort("createdAt")
    .limit(1)
    .exec()
    .then(result => {
      if (result.length !== 0) {
        let single_tx_data = result[0];
        let vout = single_tx_data.tx_data.vout;
        let single_tx_count = 0;
        vout.forEach(single_tx_output => {
          key
            .find({ public_address: single_tx_output.address })
            .then(doc => {
              if (doc.length > 0) {
                let userDepositDetails = new userDeposit({
                  to_address: single_tx_output.address,
                  block_number: single_tx_data.block_number,
                  tx_hash: single_tx_data.txid,
                  user_id: doc[0].user_id,
                  currency: "NEO"
                });
                userDepositDetails
                  .save()
                  .then(res => {
                    console.log("User Deposit details saved into the database");
                    single_tx_count = single_tx_count + 1;
                    toggle_tx_checked(res, single_tx_count, single_tx_data);
                  })

                  .catch(e => {
                    console.log(e);
                    console.log(
                      "Unable to save the user Deposit details into the database"
                    );
                    setTimeout(checkUserDeposit, 3000);
                  });
              }
            })
            .catch(e => {
              console.log(e);
              setTimeout(checkUserDeposit, 3000);
            });
        });
      } else {
        console.log("No transactions found");
        setTimeout(checkUserDeposit, 3000);
      }
    })
    .catch(e => {
      console.log(e);
      setTimeout(checkUserDeposit, 3000);
    });
}

function toggle_tx_checked(
  single_user_deposit,
  single_tx_count,
  single_tx_data
) {
  if (single_tx_count === single_tx_data.tx_data.vout.length) {
    transactions
      .findOneAndUpdate(
        { tx_hash: single_tx_data.tx_hash },
        { tx_checked: true },
        { new: true }
      )
      .then(doc => {
        console.log("Tx_checked attribute updated into the database");
        setTimeout(checkUserDeposit, 3000);
      })
      .catch(e => {
        console.log(e);
      });
  }
}
