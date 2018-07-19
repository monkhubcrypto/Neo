var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userWithdrawRequestSchema = new Schema(
  {
    tx_id: { type: String, required: true, unique: true },
    to_address: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "broadcasted", "success"],
      default: "pending"
    },
    chain: { type: String, required: true },

    exchange_notified: { type: Boolean, default: false },
    tx_hash: { type: String, default: null },
    fee: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "neo-user_withdraw_request",
  userWithdrawRequestSchema
);
