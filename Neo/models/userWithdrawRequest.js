var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userWithdrawRequestSchema = new Schema({
    transaction_id:{type:String,required:true,unique:true},
    to_address:{type:String,required:true},
    amount:{type:Number,required:true},
    currency:{type:String,required:true},
    request_status:{type:String,enum:['pending,broadcasted,success'],default:"pending"},
    from_address:{type:String,default:null},
    exchange_status:{type:String,default:null},
    block_number:{type:Number,default:null},
    block_confirmations:{type:String,default:null},
    is_exchange_notified:{type:Boolean,default:true},
    transaction_hash:{type:String,default:null},
    fee:{type:String,default:null}
},  {timestamps:true}
)

module.exports = mongoose.model('neo-user_withdraw_request',userWithdrawRequestSchema); 