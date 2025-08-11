import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pinataService from './vdoService.js';
import Certificate from '../models/Certificate.js';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();
const certificateAbi = JSON.parse(fs.readFileSync(new URL('../abi/Certificate.json', import.meta.url)));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Replace with your deployed contract address
const CERTIFICATE_CONTRACT_ADDRESS = process.env.CERTIFICATE_CONTRACT_ADDRESS;
const SEPOLIA_RPC_URL = process.env.NETWORK_URL;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

/**
 * Generate a personalized certificate PDF using the template image and dynamic data.
 * @param {Object} params
 * @param {string} params.learnerName - Name of the learner
 * @param {string} params.courseName - Name of the course
 * @param {string} params.walletAddress - Wallet address of the learner
 * @param {string} params.issueDate - Date of issue (e.g., '2025-08-02')
 * @param {string} [params.outputPath] - Output PDF path (default: 'certificate.pdf')
 */
export function generateCertificate({
  learnerName,
  courseName,
  walletAddress,
  issueDate,
  outputPath = 'certificate.pdf'
}) {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape'
  });

  const templatePath = path.join(__dirname, '../assets/certificate_template.png');
  doc.image(templatePath, 0, 0, { width: doc.page.width, height: doc.page.height });

  const pageWidth = doc.page.width;

  // CERTIFICATE title
  doc.font(path.join(__dirname, '../assets/libre-baskerville.regular.ttf'));
  doc.fontSize(50.3).fillColor('#16223A');
  const certText = 'CERTIFICATE';
  const certWidth = doc.widthOfString(certText);
  const certX = (pageWidth / 2) - (certWidth / 2);
  const certY = 90;
  doc.text(certText, certX, certY);

  // OF COMPLETION subtitle
  doc.fontSize(27.3).fillColor('#BFA640');
  const completionText = 'OF COMPLETION';
  const completionWidth = doc.widthOfString(completionText);
  const completionX = (pageWidth / 2) - (completionWidth / 2);
  const completionY = certY + 55;
  doc.text(completionText, completionX, completionY);

  // PRESENTED TO
  doc.font('Times-Roman');
  doc.fontSize(16.8).fillColor('#16223A');
  const presentedText = 'THIS CERTIFICATE IS PROUDLY PRESENTED TO:';
  const presentedWidth = doc.widthOfString(presentedText);
  const presentedX = (pageWidth / 2) - (presentedWidth / 2);
  const presentedY = completionY + 50;
  doc.text(presentedText, presentedX, presentedY);

  // Learner Name (dynamic)
  doc.font(path.join(__dirname, '../assets/EDLavonia-Regular.ttf'));
  doc.fontSize(62.9).fillColor('#222');
  const nameWidth = doc.widthOfString(learnerName);
  const nameX = (pageWidth / 2) - (nameWidth / 2);
  const nameY = presentedY + 40;
  doc.text(learnerName, nameX, nameY);

  // Main sentence (dynamic)
  doc.font('Times-Roman');
  doc.fontSize(15.7).fillColor('#16223A');
  const mainSentence = `This certificate is awarded to "${learnerName}" for successfully completing the course "${courseName}" on DELEARN. The achievement is recorded on the blockchain and is verifiable using the wallet address "${walletAddress}".\nIssued on ${issueDate}.`;
  const mainWidth = doc.widthOfString(mainSentence, {width: pageWidth - 120});
  const mainX = 60;
  const mainY = nameY + 120;
  doc.text(mainSentence, mainX, mainY, {align: 'center', width: pageWidth - 120});

  // DeLearn Team
  doc.font(path.join(__dirname, '../assets/libre-baskerville.regular.ttf'));
  doc.fontSize(18).fillColor('#BFA640');
  const teamText = 'DeLearn Team';
  const teamWidth = doc.widthOfString(teamText);
  const teamX = (pageWidth / 2) - (teamWidth / 2);
  const teamY = mainY + 141;
  doc.text(teamText, teamX, teamY);

  doc.pipe(fs.createWriteStream(outputPath));
  doc.end();
  return doc;
}

export async function createAndStoreCertificate({ learnerName, walletAddress, course, courseId }) {
  // Check for existing certificate
  const existing = await Certificate.findOne({ walletAddress, courseId });
  if (existing) {
    return { ipfsUrl: existing.downloadUrl };
  }
  const issueDate = new Date().toISOString().slice(0, 10);
  const outputPath = path.join(process.cwd(), 'uploads', `${learnerName}_${courseId}_certificate.pdf`);
  // Generate PDF (wait for finish)
  await new Promise((resolve, reject) => {
    try {
      const doc = generateCertificate({
        learnerName,
        courseName: course.title,
        walletAddress,
        issueDate,
        outputPath,
      });
      doc.on('end', resolve);
      doc.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
  // Upload to Pinata
  let ipfsHash = '';
  let ipfsUrl = '';
  try {
    const pinataResult = await pinataService.uploadToPinata(outputPath, `${learnerName}_${courseId}_certificate.pdf`);
    ipfsHash = pinataResult.ipfsHash;
    ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  } catch (err) {
    ipfsUrl = `/uploads/${learnerName}_${courseId}_certificate.pdf`;
  }
  // Save metadata in DB
  await Certificate.create({
    walletAddress,
    courseId,
    learnerName,
    issueDate,
    ipfsHash,
    downloadUrl: ipfsUrl,
  });
  return { ipfsUrl };
}

/**
 * Calls the Certificate smart contract to issue a certificate on-chain.
 * @param {string} courseId - The course ID
 * @param {string} ipfsHash - The IPFS hash of the certificate
 * @returns {Promise<string>} - The transaction hash
 */
export async function issueCertificateOnChain(courseId, ipfsHash) {
  if (!CERTIFICATE_CONTRACT_ADDRESS || !SEPOLIA_RPC_URL || !WALLET_PRIVATE_KEY) {
    throw new Error('Blockchain environment variables are not set');
  }
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    CERTIFICATE_CONTRACT_ADDRESS,
    certificateAbi,
    wallet
  );
  const tx = await contract.issueCertificate(courseId, ipfsHash);
  await tx.wait(); // Wait for confirmation
  return tx.hash;
}

/**
 * Calls the Certificate smart contract to verify a certificate on-chain.
 * @param {string} walletAddress - The user's wallet address
 * @param {string} courseId - The course ID
 * @returns {Promise<{ipfsHash: string, valid: boolean}>}
 */
export async function verifyCertificateOnChain(walletAddress, courseId) {
  if (!CERTIFICATE_CONTRACT_ADDRESS || !SEPOLIA_RPC_URL) {
    throw new Error('Blockchain environment variables are not set');
  }
  console.log('Verifying certificate on-chain for:', walletAddress, courseId);
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
  const contract = new ethers.Contract(
    CERTIFICATE_CONTRACT_ADDRESS,
    certificateAbi,
    provider
  );
  const result = await contract.verifyCertificate(walletAddress, courseId);
  console.log('verifyCertificate result:', result);
  // result is [ipfsHash, valid]
  return { ipfsHash: result.ipfsHash, valid: result.valid };
}

export default {
  generateCertificate,
  createAndStoreCertificate,
  issueCertificateOnChain,
  verifyCertificateOnChain
};
