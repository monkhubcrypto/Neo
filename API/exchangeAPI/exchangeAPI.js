var request = require('request');

// var depositData = {
//     "AMOUNT": 200,
//     "PUBLIC_KEY": "2MsXZiM9EzE2sx6pAYCNzPSA7m94CgxeUgx",
//     "STATUS": "0",
//     "CURRENCY":"BTC",
//     "TRANSACTION_HASH": "0x12345123",
//     "TRANSACTION_URL": "testURL12341231",
//     // "UUID":'1231234asdas'
//   }

// notifyExchange('http://52.65.12.152:8080/user/depositSuccess',depositData);

exports.notifyExchange=function notifyExchange(url,params){
    return new Promise ((resolve,reject)=>{       
        request(
            {   
                method: 'POST', 
                uri: url,
                json:params
            },  
            function (error, response, body) {
                if(error){
                    reject(error)
                }
                else if (response.statusCode==200){
                    console.log("Exchange Response " + response.statusCode );
                    resolve("API request sent")
                }
                else{
                    console.log("Exchange Response " + response.statusCode );
                    reject(body);
                }
            }
        );
    });
}
