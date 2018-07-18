const coldStorageDetails = require("../models/coldStorageDeposits");
const config = require("../../config/Neo/config");

checkTxSuccess();

function checkTxSuccess(){
    coldStorageDetails.find({confirmed:false}, function(error,result) {
        if(result.length >0){
            for(let tx of result){
                request({
                    method:'POST',
                    uri:config.testnet,
                    json: {
                        jsonrpc: "2.0",
                        method: "getrawtransaction",
                        params: [tx.tx_hash, 1],
                        id:"1"
                    }
                }).then(res =>{
                    let txData = res;
                    if((txData.result.Confirmations < config.blockConfirmations) && txData.result.Confirmations != tx.block_confirmations){
                        coldStorageDetails.findOneAndUpdate({tx_hash: tx.tx_hash},{block_confirmations:txData.Confirmations},function(error,result){
                            if(error){
                                console.log(error);
                            }
                        });
                    }
                    else if(txData.result.Confirmations> config.blockConfirmations){
                        request({
                            method:'POST',
                            uri:config.testnet,
                            json:{
                            jsonrpc:"2.0",
                            method:"getblock",
                            params:[txData.result.Blockhash,1],
                            id:"1"
                            }
                        }).then(out =>{
                                    let blockNumber = out.result.index;
                                    coldStorageDetails.findOneAndUpdate({tx_hash:tx.tx_hash}, {confirmed:true, block_confirmations: config.blockConfirmations+ '+',block_number:blockNumber},function(error,result){
                                        if(error){
                                            console.log(error);
                                        }

                                    });
                        }).catch(e=>{
                            console.log('Cold storage - Check transaction status - getBlock: ' + e);
                        });
                    }
                }).catch(error=>{
                    console.log('Cold storage - Check transaction status - getTransaction: ' + error);
                });
            }
            setTimeout(checkTxSuccess,3000);
        }
        else{
            console.log(error);
            setTimeout(checkTxSuccess,3000);
        }
    });
}