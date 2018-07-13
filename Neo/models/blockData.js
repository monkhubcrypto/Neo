var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blockDataSchema = new Schema({
    block_number : {type:Number,required:true},
    transactions: {type: Array, required:true},
    block_checked: {type:Boolean,required:true,default:false},
    block_hash:{type:String,required:true,unique:true}
},  {timestamps:true}   
)

module.exports = mongoose.model('neo-blockData',blockDataSchema);
