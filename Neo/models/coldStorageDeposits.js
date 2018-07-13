var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var coldStorageDepositSchema = new Schema(
  {
    to_address: { type: String, required: true },
    value: { type: Number, required: true },
    gas: { type: Number, required: true },
    tx_hash: { type: String, required: true, unique: true },
    block_number: { type: Number, default: null },
    block_confirmations: { type: String, default: null },
    confirmed: { type: Boolean, default: false },
    currency: { type: String, required: true }
  },
  { timestamps: true }
);


module.exports = mongoose.model(
  "neo-cold_storage_deposits",
  coldStorageDepositSchema
);
