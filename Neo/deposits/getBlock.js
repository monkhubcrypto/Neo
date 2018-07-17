//requiring Neo npm library
const neo = require("../../node_modules/neo-api");

const node = neo.node("http://127.0.0.1:20332");

//requiring mongoose
const mongoose = require("../../config/Neo/mongoose");

//requiring user model
const blockData = require("../models/blockData");

getBlockData();

function getBlockData() {
  blockData
    .find()
    .sort("-block_number")
    .limit(1)
    .then(blocks => {
      if (blocks.length === 0) {
        node
          .getBlockCount()
          .then(b_count => {
            node
              .getBlockByHeight(b_count - 1, 1)
              .then(block_data => {
                let tx = [];
                saveBlock(block_data, tx);
              })
              .catch(e => {
                console.log(e);
                setTimeout(getBlockData, 3000);
              });
          })
          .catch(e => {
            console.log(e);
            console.log("Unable to get the block count...Starting again in 3s");
            setTimeout(getBlockData, 3000);
          });
      } else {
        let seq = blocks[0].block_number;
        node
          .getBlockByHeight(seq + 1, 1)
          .then(block_data => {
            let tx = [];
            saveBlock(block_data, tx);
          })
          .catch(e => {
            console.log(e);
            console.log("No new Block Found");
            setTimeout(getBlockData, 3000);
          });
      }
    })
    .catch(e => {
      console.log(e);
      console.log("Unable to fetch blockdata from  mongodb");
      setTimeout(getBlockData, 3000);
    });
}

//function for saving the block into the database
function saveBlock(block, tx) {
  block.tx.forEach(element => {
    if (element.type === "ContractTransaction") {
      tx.push(element);
    }
  });
  console.log(tx);
  let newBlock = new blockData({
    block_number: block.index,
    transactions: tx,
    block_hash: block.hash
  });
  newBlock
    .save()
    .then(res => {
      console.log("Saved in the database");
      setTimeout(getBlockData, 3000);
    })
    .catch(err => {
      console.log(err);
      setTimeout(getBlockData, 3000);
    });
}

// { hash: '0x8f4d96f5a3c4f1a9c049e2ef441a286f8c59d17901b3f3585c3d64753fc7c9ca',
//   size: 1510,
//   version: 0,
//   previousblockhash: '0x473f822b057f7e765aad03cf4d15dc6b1c47a1807d39c1cfa1f29c6b64ed0203',
//   merkleroot: '0x920cc3e4988353490ab8e07d0ac8393fc9f8d19d185f48521522dcf3d48da8d5',
//   time: 1530266910,
//   index: 1565267,
//   nonce: '886b42dd45a14f4b',
//   nextconsensus: 'AaRDxTygdb5xYk1fku7uz7L5aTgNtn3J1w',
//   script:
//    { invocation: '401bbe83ed71c0e86b6765a71a1cd7fb092ae9dbd96cd89057ba2f12c27beb9994d07b46087609fd4cd61ce75d929e2860083ddeec65bb0557408c9f5863cdcd2e40eff153d6017b9178be55018253cf78a4789314408e927344ecdb9e3e928fec011afd89617e7b22b652dfda58cc7e8990e7c31f0d980216fbc12c3509a432264940caeee770f493388b23355c940b2f8171f01cac64216e385b53a98a906d72a3aee45e74e46db6c53d43c57ed2d9576f134678a44a97894c1b72609a8cc00aa30b4061f9094cceafed7f8ce3b8a5839ebe3e237a356776cd71226c107959a7acb6fdf69b6f88a661e0695fde088b05fdd4077ea87543b42fdbf26d4b5a4a6c74d740403e1a882c88e67fec05c80e56261dd99d25a071fe13fddd1c799781438ad430654ad2f9e40c1a1761d7a18b2623c951fdf4d4b957d6d1cdb25c979f1754994001',
//      verification: '55210209e7fd41dfb5c2f8dc72eb30358ac100ea8c72da18847befe06eade68cebfcb9210327da12b5c40200e9f65569476bbff2218da4f32548ff43b6387ec1416a231ee8210344925b6126c8ae58a078b5b2ce98de8fff15a22dac6f57ffd3b108c72a0670d121025bdf3f181f53e9696227843950deb72dcd374ded17c057159513c3d0abe20b6421026ce35b29147ad09e4afe4ec4a7319095f08198fa8babbe3c56e970b143528d2221039dafd8571a641058ccc832c5e2111ea39b09c0bde36050914384f7a48bce9bf92103c089d7122b840a4935234e82e26ae5efd0c2acb627239dc9f207311337b6f2c157ae' },
//   tx:
//    [ { txid: '0xe568e4d6fb211035a9d0905b09f74e4360e82d33f1a4dd8aaaaad9810297f878',
//        size: 10,
//        type: 'MinerTransaction',
//        version: 0,
//        attributes: [],
//        vin: [],
//        vout: [],
//        sys_fee: '0',
//        net_fee: '0',
//        scripts: [],
//        nonce: 1168199499 },
//      { txid: '0xf4e1849d656aaf34e32e7b263706ca4e98f9b9b9682c902d8e900ab25b21bcfd',
//        size: 419,
//        type: 'InvocationTransaction',
//        version: 1,
//        attributes: [Array],
//        vin: [],
//        vout: [],
//        sys_fee: '0',
//        net_fee: '0',
//        scripts: [Array],
//        script: '040065cd1d14c6c1ce38aef10fc7e9c2a94808c34ec65bc6c932145166e2cb1db1f0a1991541be7e3659ff41cfc6fa53c1087472616e7366657267f1dfcf0051ec48ec95c8d0569e0b95075d099d84f1040065cd1d14c6c1ce38aef10fc7e9c2a94808c34ec65bc6c9321443446839015c3e870796d04d2a6fa70d9a1e0ad953c1087472616e7366657267f1dfcf0051ec48ec95c8d0569e0b95075d099d84f1',
//        gas: '0' },
//      { txid: '0x9a37a82f2e9e60af8463a43cc2ea663a8bddf08ba9d1adbcd4e0d17ce6a2e96c',
//        size: 203,
//        type: 'ClaimTransaction',
//        version: 0,
//        attributes: [],
//        vin: [],
//        vout: [Array],
//        sys_fee: '0',
//        net_fee: '0',
//        scripts: [Array],
//        claims: [Array] },
//      { txid: '0xb381dcdea3dd956ceff1ad0c60505fd44e7ec6d4087f6d15501373a46302a343',
//        size: 202,
//        type: 'ContractTransaction',
//        version: 0,
//        attributes: [],
//        vin: [Array],
//        vout: [Array],
//        sys_fee: '0',
//        net_fee: '0',
//        scripts: [Array] } ],
//   confirmations: 38,
//   nextblockhash: '0x04400cbbecae37a1acab078c4aec9b73ccb1c63e8e76f0af553ac420dc399c56' }
