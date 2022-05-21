const pinataSDK = require('@pinata/sdk');
require('dotenv').config();
const pinata = pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

pinata
  .testAuthentication()
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
