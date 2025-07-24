# Integration Guide: Frontend & Backend (Video Upload to IPFS)

## Overview
This guide explains how to connect your React frontend and Express backend for uploading videos to IPFS. It includes example code and API contract details.

---

## 1. API Endpoint (Backend)

**POST** `/api/vdo/upload`
- Accepts: `multipart/form-data` with video file and section/course info
- Returns: `{ ipfsUrl: string }` for each uploaded video

### Example Express Route (backend/src/routes/vdoUpload.js):
```js
import express from 'express';
import multer from 'multer';
import { uploadToIPFS } from '../controllers/vdoController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('video'), uploadToIPFS);

export default router;
```

### Example Controller (backend/src/controllers/vdoController.js):
```js
import { uploadFileToIPFS } from '../services/vdoService.js';

export const uploadToIPFS = async (req, res) => {
  try {
    const file = req.file;
    const ipfsResult = await uploadFileToIPFS(file.path);
    res.json({ ipfsUrl: ipfsResult.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

---

## 2. Frontend Integration (frontend/src/components/CourseForm.js)

- Use `FormData` to send video files and section info to backend.
- Example:

```js
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('title', courseTitle);
  formData.append('description', courseDescription);
  sections.forEach((section, idx) => {
    formData.append(`sections[${idx}][title]`, section.title);
    formData.append(`sections[${idx}][docUrl]`, section.docUrl);
    if (section.videoFile) {
      formData.append(`sections[${idx}][video]`, section.videoFile);
    }
  });

  const res = await fetch('http://localhost:5000/api/vdo/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  // handle response
};
```

---

## 3. CORS
Make sure your backend enables CORS for requests from your frontend:
```js
import cors from 'cors';
app.use(cors({ origin: 'http://localhost:3000' }));
```

---

## 4. Notes
- Adjust endpoint URLs as needed for your deployment.
- You can expand this guide with more API endpoints or integration details as your project grows.
