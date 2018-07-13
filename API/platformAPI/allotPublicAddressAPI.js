cont neo_allotPublicAddress = require("../../NEO/models/allotPublicAddress");

exports.allotPublicAddress_post = [

	(req,res,next) => {
		let public_address = req.body.public_address;
		let chain = req.body.chain;
		let user_id = req.body.user_id;

		if(chain === 'NEO') {
			neo_allotPublicAddressDetail = new neo_allotPublicAddress ({
				public_address:public_address,
                chain:chain,
                user_id:user_id,
			});

			neo_allotPublicAddressDetail.save(function(err){
				if(err) {
					res.status(400).send(err);
                    }
                    else{
                    res.status(201).send("Created");
                    }
				});
			break;
		}

		else {
			console.log("No support for this chain yet!");
		}
	}
]