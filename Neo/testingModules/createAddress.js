const mongoose = require("../../config/Neo/mongoose");

const adresses = require("../models/userAllottedPublicAddress");

let add = [
  "AFvpJ2LLWQS4TUzgiobMCYq9NRmBZ8ZDYM",
  "AcrRVhbmjSgjXEfM1cHRQ9np4FhBVwU3ce",
  "ARFTmhCMaJmb2hfjSq7TgxcrLMtWkUZeje",
  "AQxK2NyXsNy4Z3k8vPcWPEKafVATS53zKC",
  "AKSSNXm9Ps7Etpry4YT15VxCRMCFyjyo8T",
  "AJ7TnUtniEys2D8s6gVMa6EATfDmdqRds9",
  "AcRehRQCHvS2QdLigGVzz93FPEH1Gp3Uro",
  "ARQiwDuCYQJYk9NRmndLzFS9mfREKnEwrk",
  "APMm3wYzc5RaSGeatLDzM4HBi2SZiQiz5g",
  "AcgDiTHAy1McpVvN2HdhCZrLxP2Qy5bE6Y"
];

let n = 0;
add.forEach(adde => {
  n = n + 1;
  let singleAddressSchema = new adresses({
    public_address: adde,
    chain: "NEO",
    user_id: n
  });

  singleAddressSchema
    .save()
    .then(res => {
      console.log("saved");
    })
    .catch(err => {
      console.log(err);
    });
});
