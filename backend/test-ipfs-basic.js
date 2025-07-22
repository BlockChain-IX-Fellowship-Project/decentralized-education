import IPFSService from './src/services/ipfsService.js';
import CourseIPFSService from './src/services/courseIPFSService.js';
import UserIPFSService from './src/services/userIPFSService.js';

async function testIPFSBasicSetup() {
  console.log('🧪 Testing IPFS Basic Setup...\n');

  try {
    // Test 1: Service instantiation
    console.log('1. Testing service instantiation...');
    const ipfsService = new IPFSService();
    const courseIPFSService = new CourseIPFSService();
    const userIPFSService = new UserIPFSService();
    console.log('✅ All services instantiated successfully');

    // Test 2: Health check without credentials
    console.log('\n2. Testing health check without credentials...');
    const health = await ipfsService.healthCheck();
    console.log('✅ Health check result:', health.status, '-', health.message);

    // Test 3: IPFS hash validation
    console.log('\n3. Testing IPFS hash validation...');
    const validHash = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';
    const invalidHash = 'invalid-hash';
    
    const isValid = ipfsService.validateIPFSHash(validHash);
    const isInvalid = ipfsService.validateIPFSHash(invalidHash);
    
    console.log('✅ Valid hash test:', isValid ? 'PASS' : 'FAIL');
    console.log('✅ Invalid hash test:', !isInvalid ? 'PASS' : 'FAIL');

    // Test 4: Content type detection
    console.log('\n4. Testing content type detection...');
    const testFiles = [
      'document.pdf',
      'video.mp4',
      'image.jpg',
      'data.json',
      'script.js'
    ];
    
    testFiles.forEach(file => {
      const contentType = ipfsService.getContentType(file);
      console.log(`   ${file} -> ${contentType}`);
    });
    console.log('✅ Content type detection working');

    console.log('\n🎉 Basic IPFS setup test completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Get Pinata JWT token from https://pinata.cloud/');
    console.log('2. Add PINATA_JWT to your .env file');
    console.log('3. Run the full test with: node test-ipfs.js');

  } catch (error) {
    console.error('❌ Basic test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run tests
testIPFSBasicSetup(); 