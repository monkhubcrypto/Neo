var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userDepositSchema = new Schema(
  {
    to_address: { type: String, required: true },
    block_number: { type: Number, required: true },
    value: { type: Number, required: true },
    gas: { type: Number, required: true },
    tx_hash: { type: String, required: true },
    user_id: { type: Number, required: true },
    currency: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    exchange_notified: { type: Boolean, default: false },
    sent_to_storage: { type: Boolean, default: false },
    block_confirmations: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("neo-user_deposits", userDepositSchema);
