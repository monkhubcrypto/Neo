//requiring Neo npm library
const neo = require("neo-api");

const node = neo.node("http://127.0.0.1:20332");

//requiring mongoose
const mongoose = require("../../../globalConfig/mongoose");

//requiring user model
const blockData = require("../../models/blockData");
const transactions = require("../../models/transactions");
storeTransactions();

function storeTransactions() {
  blockData
    .find({ block_checked: false })
    .limit(1)
    .sort("block_number")

    .then(result => {
      let block = result[0];
      console.log(block.transactions.length);
      if (block.transactions.length !== 0) {
        let block_txn_count = 0;
        block.transactions.forEach(single_txn => {
          let tx_details = new transactions({
            tx_hash: single_txn.txid,
            block_number: block.block_number,
            total_tx: block.transactions.length,
            tx_data: single_txn
          });
          tx_details
            .save()
            .then(res => {
              console.log("Transaction successfully saved in the database");
              block_txn_count = block_txn_count + 1;
              if (block_txn_count === res.total_tx) {
                blockCheck(block.block_number);
              }
            })
            .catch(e => {
              console.log(e);
            });
        });
      } else {
        blockCheck(block.block_number);
      }
    })
    .catch(e => {
      console.log(e);
      setTimeout(storeTransactions, 3000);
    });
}

function blockCheck(block_no) {
  blockData
    .findOneAndUpdate({ block_number: block_no }, { block_checked: true })
    .then(res => {
      console.log(
        "Block checked attribute successfully updated into the database"
      );
      setTimeout(storeTransactions, 3000);
    })
    .catch(e => {
      console.log(e);
      console.log("Unable to update block check to true in the database");
      setTimeout(storeTransactions, 3000);
    });
}
