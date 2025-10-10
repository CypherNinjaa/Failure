# Face Recognition Attendance System Setup

## Overview

This system uses face-api.js for automatic student attendance tracking using facial recognition technology integrated with Cloudinary-hosted student photos.

## Requirements

1. face-api.js library (already installed via npm)
2. Pre-trained TensorFlow models
3. Student photos uploaded to Cloudinary

## Setup Instructions

### Step 1: Download Face-API Models

You need to download the pre-trained models and place them in the `public/models` directory.

1. Create the models directory:

```bash
mkdir public/models
```

2. Download the required models from face-api.js repository:
   - SSD Mobilenet V1 (face detection)
   - Face Landmark 68 (landmark detection)
   - Face Recognition (descriptor computation)

**Option A: Download manually**
Go to: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

Download these files to `public/models/`:

- `ssd_mobilenetv1_model-shard1`
- `ssd_mobilenetv1_model-shard2`
- `ssd_mobilenetv1_model-weights_manifest.json`
- `face_landmark_68_model-shard1`
- `face_landmark_68_model-weights_manifest.json`
- `face_recognition_model-shard1`
- `face_recognition_model-shard2`
- `face_recognition_model-weights_manifest.json`

**Option B: Use wget (Linux/Mac) or curl**

```bash
cd public/models

# SSD MobileNet V1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard2
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-weights_manifest.json

# Face Landmark 68
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json

# Face Recognition
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json
```

**Option C: PowerShell (Windows)**

```powershell
cd public\models

# Download all required models
$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/"
$files = @(
    "ssd_mobilenetv1_model-shard1",
    "ssd_mobilenetv1_model-shard2",
    "ssd_mobilenetv1_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_landmark_68_model-weights_manifest.json",
    "face_recognition_model-shard1",
    "face_recognition_model-shard2",
    "face_recognition_model-weights_manifest.json"
)

foreach ($file in $files) {
    Invoke-WebRequest -Uri ($baseUrl + $file) -OutFile $file
}
```

### Step 2: Verify Model Files

Your `public/models/` directory should contain:

```
public/
  models/
    ├── ssd_mobilenetv1_model-shard1
    ├── ssd_mobilenetv1_model-shard2
    ├── ssd_mobilenetv1_model-weights_manifest.json
    ├── face_landmark_68_model-shard1
    ├── face_landmark_68_model-weights_manifest.json
    ├── face_recognition_model-shard1
    ├── face_recognition_model-shard2
    └── face_recognition_model-weights_manifest.json
```

### Step 3: Ensure Students Have Photos

For face recognition to work, students must have profile photos uploaded via the Student form (stored in Cloudinary).

## How to Use

### For Teachers/Admins:

1. **Navigate to Classes List** (`/list/classes`)
2. **Click the purple camera icon** next to any class to start face recognition attendance
3. **Click "Start Camera"** to activate the webcam
4. **Students look at the camera one by one**
5. Detected students will be highlighted with green boxes and their names
6. **Click "Submit Attendance"** when all students are detected

### Features:

- ✅ **Automatic face detection** from webcam feed
- ✅ **Real-time face matching** against student database
- ✅ **Visual feedback** with bounding boxes and names
- ✅ **Multiple detection support** (though one-by-one works best)
- ✅ **Attendance saved to database** with present/absent status
- ✅ **Works with existing Cloudinary images**

### Tips for Best Results:

1. **Good lighting** - Ensure the room is well-lit
2. **Face the camera directly** - Students should look straight at the camera
3. **Remove accessories** - Glasses or masks may reduce accuracy
4. **One at a time** - Best results with one student facing camera at a time
5. **Clear photos** - Ensure student profile photos are clear frontal faces

## Troubleshooting

### Models not loading

- Check that all model files are in `public/models/`
- Check browser console for errors
- Ensure files are not corrupted

### Face not detected

- Improve lighting
- Move closer to camera
- Remove glasses/mask
- Ensure student photo is a clear frontal face

### Wrong student identified

- Threshold can be adjusted in `FaceRecognitionAttendance.tsx` (line ~100)
- Default threshold: 0.6 (lower = more strict matching)
- Consider using higher quality student photos

### Camera permission denied

- Grant camera permissions in browser
- Check browser settings
- Try a different browser

## API Endpoints

- `POST /api/face-attendance` - Submit face recognition attendance results

## Database Schema

Attendance records are stored with:

- `studentId` - Student identifier
- `date` - Attendance date (normalized to start of day)
- `present` - Boolean (true if face detected, false otherwise)

## Security Notes

- Only teachers and admins can access face recognition attendance
- Role-based access control enforced at middleware and API level
- Camera access requires user permission
- All face matching happens client-side (privacy-friendly)

## Performance Optimization

- Models load once and are cached
- Face detection runs every 1 second (configurable)
- Uses SSD MobileNet V1 for fast detection
- Batch processing available for multiple faces

## Future Enhancements

- [ ] Support for tiny face detector (faster but less accurate)
- [ ] Attendance history and analytics
- [ ] Export attendance reports
- [ ] Mobile app support
- [ ] Anti-spoofing (prevent photo attacks)
- [ ] Multi-camera support for larger classrooms

## Support

For issues or questions, please create an issue in the repository.

---

**Note**: This system works with existing Cloudinary-hosted student photos. No additional photo storage is required.
