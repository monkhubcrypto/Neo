var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var transactionSchema = new Schema(
  {
    tx_hash: { type: String, required: true, unique: true },
    block_number: { type: Number, required: true },
    total_tx: { type: Number, required: true },
    tx_data: { type: Object, requirde: true },
    tx_checked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nem-transaction", transactionSchema);
