// services/pinataService.js
import 'dotenv/config';
import fs from 'fs';
import PinataClient from '@pinata/sdk';

// Debug: Log environment variables
console.log('PINATA_API_KEY:', process.env.PINATA_API_KEY);
console.log('PINATA_API_SECRET:', process.env.PINATA_API_SECRET);

const pinata = new PinataClient(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

const uploadToPinata = async (filePath, originalName) => {
  const readableStream = fs.createReadStream(filePath);

  const options = {
    pinataMetadata: { name: originalName },
    pinataOptions: { cidVersion: 0 },
  };

  const result = await pinata.pinFileToIPFS(readableStream, options);

  // Clean up temporary file
  fs.unlinkSync(filePath);

  return {
    ipfsHash: result.IpfsHash,
    originalName,
  };
};

export default {
  uploadToPinata,
};
