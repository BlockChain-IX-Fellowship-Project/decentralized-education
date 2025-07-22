import axios from 'axios';
import FormData from 'form-data';

class IPFSService {
  constructor() {
    this.pinataJWT = process.env.PINATA_JWT;
    this.ipfsGateway = 'https://gateway.pinata.cloud/ipfs/';
    
    if (!this.pinataJWT) {
      console.warn('⚠️  PINATA_JWT not found. IPFS uploads will fail.');
    }
  }

  async uploadFile(fileBuffer, fileName, metadata = {}) {
    try {
      if (!this.pinataJWT) {
        throw new Error('Pinata JWT not configured');
      }

      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: fileName,
        contentType: this.getContentType(fileName)
      });

      if (Object.keys(metadata).length > 0) {
        formData.append('pinataMetadata', JSON.stringify(metadata));
      }

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.pinataJWT}`,
            ...formData.getHeaders()
          }
        }
      );

      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        gatewayUrl: `${this.ipfsGateway}${response.data.IpfsHash}`,
        size: response.data.PinSize,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  }

  async uploadJSON(data, name = 'metadata.json') {
    try {
      const jsonBuffer = Buffer.from(JSON.stringify(data, null, 2));
      return await this.uploadFile(jsonBuffer, name, {
        name: name,
        keyvalues: {
          type: 'metadata',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw new Error(`JSON upload failed: ${error.message}`);
    }
  }

  async getContent(ipfsHash) {
    try {
      const response = await axios.get(`${this.ipfsGateway}${ipfsHash}`, {
        timeout: 30000
      });
      return {
        success: true,
        data: response.data,
        contentType: response.headers['content-type']
      };
    } catch (error) {
      console.error('Error retrieving from IPFS:', error);
      throw new Error(`IPFS retrieval failed: ${error.message}`);
    }
  }

  getContentType(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const contentTypes = {
      'json': 'application/json',
      'pdf': 'application/pdf',
      'mp4': 'video/mp4',
      'jpg': 'image/jpeg',
      'png': 'image/png'
    };
    return contentTypes[ext] || 'application/octet-stream';
  }

  validateIPFSHash(hash) {
    const ipfsHashRegex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$|^bafy[a-z2-7]{55}$/;
    return ipfsHashRegex.test(hash);
  }

  async healthCheck() {
    try {
      if (!this.pinataJWT) {
        return { status: 'warning', message: 'Pinata JWT not configured' };
      }
      return { status: 'healthy', message: 'IPFS service is working' };
    } catch (error) {
      return { status: 'error', message: `IPFS service error: ${error.message}` };
    }
  }
}

export default IPFSService;
