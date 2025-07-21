import fs from 'fs';
import { Web3Storage, File } from 'web3.storage';
import path from 'path';
import Video from '../models/videoModel.js';

const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });

export const uploadVideoToIPFS = async (filePath, originalName, uploader) => {
  const fileBuffer = fs.readFileSync(filePath);
  const files = [new File([fileBuffer], originalName)];
  const cid = await client.put(files);

  const newVideo = new Video({
    fileName: path.basename(filePath),
    originalName,
    ipfsHash: cid,
    uploader
  });

  await newVideo.save();
  return newVideo;
};
