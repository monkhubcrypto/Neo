var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userAllottedPublicAddressSchema = new Schema(
  {
    public_address: { type: String, required: true, unique: true },
    chain: { type: String, required: true },
    user_id: { type: Number, required: true }
  },
  { timestamps: true }
);


module.exports = mongoose.model(
  "neo-user_allotted_public_address",
  userAllottedPublicAddressSchema
);
