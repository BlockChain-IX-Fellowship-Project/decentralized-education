// backend/src/controllers/certificateController.js
import Course from '../models/Course.js';
import certificateService from '../services/certificateService.js';

export const enrollCertificate = async (req, res) => {
  try {
    const { learnerName, walletAddress, courseId } = req.body;
    if (!learnerName || !walletAddress || !courseId) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }
    // Use the service to handle all logic
    const { ipfsUrl } = await certificateService.createAndStoreCertificate({
      learnerName,
      walletAddress,
      course,
      courseId,
    });

    // Extract IPFS hash from the URL (if available)
    let ipfsHash = '';
    if (ipfsUrl && ipfsUrl.startsWith('https://gateway.pinata.cloud/ipfs/')) {
      ipfsHash = ipfsUrl.replace('https://gateway.pinata.cloud/ipfs/', '');
    }
    console.log('Pinata IPFS URL:', ipfsUrl);
    console.log('Extracted IPFS hash:', ipfsHash);
    // Call blockchain only if we have a valid IPFS hash
    let txHash = null;
    if (ipfsHash) {
      try {
        console.log('Attempting to call issueCertificateOnChain with:', courseId, ipfsHash);
        txHash = await certificateService.issueCertificateOnChain(courseId, ipfsHash);
        console.log('Blockchain txHash:', txHash);
      } catch (err) {
        console.error('Blockchain certificate issue error:', err);
      }
    } else {
      console.warn('No valid IPFS hash, skipping blockchain call.');
    }
    res.json({ success: true, message: 'Certificate generated.', ipfsUrl, txHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { walletAddress, courseId } = req.query;
    if (!walletAddress || !courseId) {
      return res.status(400).json({ error: 'Missing walletAddress or courseId' });
    }
    const result = await certificateService.verifyCertificateOnChain(walletAddress, courseId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
