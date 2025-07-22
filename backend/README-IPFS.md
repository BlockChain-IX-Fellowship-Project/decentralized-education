# IPFS Integration for Decentralized Education Platform

## 🚀 Overview

This backend now includes comprehensive IPFS (InterPlanetary File System) integration for decentralized storage of course content, user profiles, and metadata. The system uses Pinata as the IPFS provider for reliable content hosting.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │   Node.js API   │    │   IPFS (Pinata) │
│                 │◄──►│   (MongoDB +    │◄──►│   (Decentralized│
└─────────────────┘    │   IPFS)         │    │   Storage)      │
                       └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   MongoDB       │
                       │   (Indexing &   │
                       │   Search)       │
                       └─────────────────┘
```

## 📁 File Structure

```
backend/src/
├── services/
│   ├── ipfsService.js          # Core IPFS operations
│   ├── courseIPFSService.js    # Course-specific IPFS operations
│   └── userIPFSService.js      # User-specific IPFS operations
├── routes/
│   └── ipfsRoutes.js           # IPFS API endpoints
├── models/
│   ├── Course.js               # Course model with IPFS fields
│   └── User.js                 # User model with IPFS fields
├── controllers/
│   └── courseController.js     # Course controller with IPFS integration
└── index.js                    # Main server with IPFS routes
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Get Pinata Credentials

1. Sign up at [Pinata](https://pinata.cloud/)
2. Create a new API key
3. Get your JWT token from the dashboard
4. Add to your `.env` file:

```env
PINATA_JWT=your_pinata_jwt_token_here
```

### 3. Environment Variables

Add these to your `.env` file:

```env
# IPFS Configuration
PINATA_JWT=your_pinata_jwt_token_here

# MongoDB Configuration
MONGO_URI=your_mongodb_connection_string

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🎯 API Endpoints

### Health Check
- `GET /health` - Main server health
- `GET /api/ipfs/health` - IPFS service health

### Basic IPFS Operations
- `POST /api/ipfs/upload` - Upload single file
- `POST /api/ipfs/upload-multiple` - Upload multiple files
- `POST /api/ipfs/upload-json` - Upload JSON data
- `GET /api/ipfs/content/:hash` - Get content from IPFS
- `POST /api/ipfs/pin/:hash` - Pin content to IPFS

### Course Operations
- `POST /api/ipfs/courses/create` - Create course metadata
- `POST /api/ipfs/courses/:courseId/content` - Upload course content
- `GET /api/ipfs/courses/metadata/:hash` - Get course metadata
- `GET /api/ipfs/courses/content/:hash` - Get course content
- `PUT /api/ipfs/courses/:courseId/metadata` - Update course metadata

### User Operations
- `POST /api/ipfs/users/profile` - Create user profile
- `PUT /api/ipfs/users/profile/:userId` - Update user profile
- `GET /api/ipfs/users/profile/:hash` - Get user profile
- `POST /api/ipfs/users/achievement` - Add user achievement
- `POST /api/ipfs/users/review` - Add user review
- `POST /api/ipfs/users/achievements` - Get user achievements

## 🔧 Usage Examples

### Upload Course Content

```javascript
// Frontend example
const uploadCourseContent = async (courseId, files) => {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(`/api/ipfs/courses/${courseId}/content`, {
    method: 'POST',
    body: formData
  });

  return response.json();
};
```

### Create Course with IPFS

```javascript
// Frontend example
const createCourse = async (courseData) => {
  const response = await fetch('/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(courseData)
  });

  return response.json();
};
```

### Get Course with IPFS Content

```javascript
// Frontend example
const getCourse = async (courseId) => {
  const response = await fetch(`/api/courses/${courseId}`);
  const result = await response.json();
  
  // result.course contains MongoDB data + IPFS metadata + IPFS content
  return result;
};
```

## 🧪 Testing

Run the IPFS integration test:

```bash
node test-ipfs.js
```

This will test:
- IPFS health check
- JSON upload and retrieval
- Course metadata creation
- User profile creation
- Achievement upload

## 📊 Data Flow

### Course Creation Flow
1. User submits course data
2. Backend creates course metadata
3. Metadata uploaded to IPFS
4. MongoDB stores course with IPFS hash
5. Course is searchable and retrievable

### Content Upload Flow
1. User uploads course files
2. Files uploaded to IPFS individually
3. Content index created and uploaded to IPFS
4. MongoDB updated with content index hash
5. Course content accessible via IPFS

### Course Retrieval Flow
1. Frontend requests course by ID
2. MongoDB provides basic course data
3. IPFS metadata retrieved using stored hash
4. IPFS content retrieved using content index hash
5. Combined data returned to frontend

## 🔒 Security Features

- File type validation
- File size limits (100MB per file)
- Rate limiting on uploads
- Input sanitization
- Error message sanitization
- CORS configuration

## 🚀 Performance Optimizations

- MongoDB indexing for fast searches
- IPFS content caching
- Parallel file uploads
- Lazy loading of IPFS content
- Fallback handling for IPFS failures

## 🔧 Troubleshooting

### Common Issues

1. **Pinata JWT not configured**
   - Error: "Pinata JWT not configured"
   - Solution: Add PINATA_JWT to .env file

2. **File upload fails**
   - Error: "IPFS upload failed"
   - Solution: Check file size and type, verify Pinata credentials

3. **Content retrieval fails**
   - Error: "IPFS retrieval failed"
   - Solution: Check IPFS hash validity, verify content is pinned

4. **MongoDB connection issues**
   - Error: "MongoDB connection failed"
   - Solution: Check MONGO_URI in .env file

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=ipfs:*
```

## 📈 Monitoring

- Health check endpoints for service monitoring
- Request logging for debugging
- Error tracking for IPFS failures
- Performance metrics for upload/retrieval times

## 🔄 Future Enhancements

- Multiple IPFS provider support
- Content deduplication
- Automatic content pinning
- IPFS node running locally
- Content versioning
- Backup and recovery systems

## 📚 Additional Resources

- [Pinata Documentation](https://docs.pinata.cloud/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License. 