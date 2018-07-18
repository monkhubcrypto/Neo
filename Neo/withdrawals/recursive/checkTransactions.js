const userWithdrawRequests = require("../../models/userWithdrawRequest");
const config = require("../../../config/Neo/config");

checkTxSuccess();

function checkTxSuccess(){
    userWithdrawRequests.find({request_status:'broadcasted'},function(error,result){
        if(error){
            console.log(error);
            setTimeout(checkTxSuccess,3000);
        }
        else{
            if(result.length >0){
                for(let tx of result){
                    request({
                        method:'POST',
                        uri:config.testnet,
                        json:{
                            jsonrpc:"2.0",
                            method:"getrawtransaction",
                            params:[tx.transaction_hash,1],
                            id:1
                        }
                    }).then(res=>{
                        let txData = res;
                        console.log("Block confirmations for tx " + tx.transaction_hash + "="+ txData.result.Confirmations);
                        if(txData.result.Confirmations > config.blockConfirmations){
                            request({
                                method:'POST',
                                uri:config.testnet,
                                json:{
                                    jsonrpc:"2.0",
                                    method:"getblock",
                                    params:[txData.result.Blockhash,1],
                                    id:1
                                }
                            }).then(out=>{
                                let blockNumber = out.result.index;
                                userWithdrawRequests.findOneAndUpdate({transaction_hash:tx.transaction_hash}, {request_status:'success', block_number:blockNumber},function(error,result){
                                    if(error){
                                        console.log(error);
                                    }
                                    else{
                                        console.log("Transaction updated as successful");
                                    }
                                });
                            }).catch(e=>{
                                console.log(e);
                                console.log("Bitcoin Withdrawals - Check transaction status - getblock:" + e);
                            });
                        }
                        else if(txData.result.Confirmations != tx.block_confirmations){
                            userWithdrawRequests.findOneAndUpdate({transaction_hash:tx.transaction_hash}, {block_confirmations:txData.result.Confirmations, is_exchange_notified:false, fee: txData.result.Net_fee, block_number:blockNumber},function(error,result){
                                if(error){
                                    console.log(error);
                                }
                                else{
                                    console.log("Your transaction will be confirmed after 30+ network confirmations" + block_confirmations);
                                }
                            });
                        }
                    }).catch(err=>{
                        console.log(err);
                    });
                }
                setTimeout(checkTxSuccess,3000);
            }
            else{
                console.log("No transactions to check.");
                setTimeout(checkTxSuccess,3000);
            }
        }
    });
}