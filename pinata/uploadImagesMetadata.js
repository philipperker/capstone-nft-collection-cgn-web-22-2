const pinataSDK = require('@pinata/sdk');
require('dotenv').config();
const student = require('./metadata/students');
const pinata = pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

console.log(student.length);

for (let i = 0; i < student.length; i++) {
  const fs = require('fs');
  const readableStreamForFile = fs.createReadStream(student[i].image_path);
  const options = {
    pinataMetadata: {
      name: student[i].name,
      keyvalues: {
        capstoneProject: student[i].capstone_project,
      },
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  const pinFileToIPFS = () => {
    return pinata
      .pinFileToIPFS(readableStreamForFile, options)
      .then(result => {
        return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      })
      .catch(err => {
        console.log(err);
      });
  };

  const pinJSONToIPFS = body => {
    return pinata
      .pinJSONToIPFS(body, options)
      .then(result => {
        return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getMetadata = async () => {
    const imageUrl = await pinFileToIPFS();
    const body = {
      name: student[i].name,
      external_url: student[i].external_url,
      capstone_project: student[i].capstone_project,
      github_capstone_project: student[i].github_capstone_project,
      description: student[i].description,
      image: imageUrl,
    };
    const metadata = await pinJSONToIPFS(body);
    console.log(metadata);
  };

  getMetadata();
}
