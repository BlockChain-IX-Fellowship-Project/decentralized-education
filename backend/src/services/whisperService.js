import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import fs from 'fs';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Download mp4 from IPFS to local uploads folder
 * @param {string} ipfsHash - IPFS hash of the video
 * @returns {Promise<string>} - Local file path
 */
export async function downloadMp4FromIPFS(ipfsHash) {
  // Try multiple gateways for reliability
  const gateways = [
    `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
    `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
    `https://ipfs.io/ipfs/${ipfsHash}`
  ];
  const localPath = `${process.cwd()}/uploads/${ipfsHash}.mp4`;
  for (const url of gateways) {
    try {
      const writer = fs.createWriteStream(localPath);
      const response = await axios({ url, method: 'GET', responseType: 'stream' });
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      return localPath;
    } catch (err) {
      // Try next gateway if this one fails
      continue;
    }
  }
  throw new Error('Failed to download mp4 from all IPFS gateways');
}

/**
 * Extract transcript from mp4 using Whisper (Python script)
 * @param {string} videoPath - Absolute path to mp4 file
 * @param {string} ipfsHash - IPFS hash for naming the transcript file
 * @returns {Promise<string>} - Transcript text
 */
export async function extractTranscript(videoPath, ipfsHash) {
  return new Promise((resolve, reject) => {
    const pyScriptPath = path.join(__dirname, '../extract_transcript.py');
    const venvPython = path.join(__dirname, '../../whisper-venv/bin/python');
    // Use a unique transcript output path for each video
    const transcriptPath = `${process.cwd()}/uploads/${ipfsHash}_transcript.txt`;
    const py = spawn(venvPython, [pyScriptPath, videoPath, transcriptPath]);
    let transcript = '';
    let error = '';
    py.stdout.on('data', (data) => {
      transcript += data.toString();
    });
    py.stderr.on('data', (data) => {
      error += data.toString();
    });
    py.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(error || 'Transcript extraction failed'));
      } else {
        resolve(transcript.trim());
      }
    });
  });
}
