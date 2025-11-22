# ASCII Face Effect - Cyberpunk Matrix

A real-time video effect that transforms your face into dynamic ASCII art with a Matrix-style background. Features face detection, depth-aware character mapping, and a cyberpunk aesthetic with neon orange and amber highlights.

## Features

### 🎭 Real-Time Face Detection
- Uses ml5.js FaceMesh for accurate face tracking
- Detects facial features and expressions in real-time
- Tracks 468 facial keypoints for precise mapping

### 🔤 ASCII Art Transformation
- Dense character mapping based on brightness and depth
- 60+ ASCII characters for detailed shading
- Dynamic character animation and glitching effects
- Realistic depth perception through character density

### 🌊 Matrix-Style Background
- Vertically falling code streams
- Neon orange and fiery amber color scheme (not green!)
- 80 independent columns with varying speeds
- Randomly changing characters for authentic Matrix feel

### 🌃 Cyberpunk Aesthetic
- Deep blacks with bright orange highlights
- High-contrast digital look
- Animated scanlines
- Random glitch effects
- Glowing facial keypoints
- Vignette and border glow effects

### ⚡ Performance Optimized
- Runs at 30 FPS
- Efficient pixel processing
- Responsive canvas that adapts to window size

## How It Works

1. **Video Capture**: Captures real-time video from your webcam
2. **Face Detection**: ml5.js FaceMesh identifies and tracks your face
3. **Pixel Analysis**: Analyzes brightness of each region of your face
4. **ASCII Mapping**: Maps brightness values to ASCII characters (dark = dense, bright = sparse)
5. **Animation**: Adds wave effects, glitches, and character randomization
6. **Background**: Renders Matrix rain in unused areas
7. **Effects**: Applies cyberpunk styling with scanlines, glows, and vignette

## Installation & Usage

### Option 1: Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/camera-p5js.git
cd camera-p5js
```

2. Start a local server (required for camera access):
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

4. Allow camera access when prompted

### Option 2: Direct File Access (May Not Work)

Some browsers block camera access for local files. If you try to open `index.html` directly and it doesn't work, use Option 1 instead.

### Controls

- **'S' key**: Save a screenshot of the current frame
- The effect updates automatically as you move

## Technical Details

### Dependencies
- **p5.js (v1.7.0)**: Creative coding library for canvas rendering
- **ml5.js (latest)**: Machine learning library for face detection

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (may need HTTPS)
- Opera: ✅ Full support

### Camera Requirements
- Webcam or integrated camera
- Well-lit environment for best results
- Direct face visibility (avoid extreme angles)

### ASCII Character Set

The effect uses 60+ characters mapped by visual density:

**Dense (Dark areas)**: `@ # $ % & 8 0 B M W X Y Z`

**Medium**: `Q O C U P D K H N A G V S R F T L J I`

**Sparse**: `? ! { } [ ] ( ) | / \ < > + = * ~ ^`

**Very Sparse (Bright areas)**: `- _ : ; , . \` (space)`

### Color Palette

**Primary Orange**: `rgb(255, 102, 0)` - Main highlight color

**Secondary Orange**: `rgb(255, 136, 0)` - Face mid-tones

**Deep Orange**: `rgb(255, 68, 0)` - Shadows

**Amber**: `rgb(255, 191, 0)` - Bright highlights

**Background**: `rgb(0, 0, 0)` - Pure black

## Customization

### Change Character Size
Edit `sketch.js` line 220:
```javascript
let asciiSize = 8; // Increase for larger characters, decrease for more detail
```

### Adjust Matrix Rain Speed
Edit `sketch.js` line 77:
```javascript
speed: random(0.5, 3) // Increase max value for faster rain
```

### Modify Color Scheme
Edit the `COLORS` object in `sketch.js` (lines 29-37):
```javascript
const COLORS = {
  primary: [255, 102, 0],   // Change RGB values here
  // ... etc
};
```

### Change Animation Speed
Edit `sketch.js` line 240:
```javascript
let wave = sin(time * 2 + x * 0.1 + y * 0.1) * 2;
//             ^^^^^ Increase this value for faster animation
```

## Troubleshooting

### Camera Not Working
- Ensure you're using HTTPS or localhost
- Check browser permissions for camera access
- Try a different browser
- Make sure no other application is using the camera

### Performance Issues
- Close other browser tabs
- Reduce window size
- Increase `asciiSize` value (line 220 in sketch.js)
- Lower frame rate in setup() function

### Face Not Detected
- Ensure good lighting
- Face the camera directly
- Wait a few seconds for the model to initialize
- Check console for errors (F12)

### No Matrix Rain Showing
- Face might be taking up entire frame
- Move back from camera
- Check that `drawMatrixRain()` is being called

## Performance Notes

- **Resolution**: Video captured at 640x480 for optimal performance
- **Frame Rate**: Locked at 30 FPS
- **ASCII Grid**: ~80x60 characters for face rendering
- **Matrix Columns**: 80 columns of falling code
- **Processing**: All rendering done client-side (no server required)

## Future Enhancements

- [ ] Multiple face detection and rendering
- [ ] Custom ASCII character sets
- [ ] Color theme selector
- [ ] Video recording capability
- [ ] Mobile device support
- [ ] Adjustable detail levels
- [ ] Sound reactivity
- [ ] Additional glitch effects

## Credits

Built with:
- [p5.js](https://p5js.org/) - Creative coding framework
- [ml5.js](https://ml5js.org/) - Machine learning library
- [MediaPipe FaceMesh](https://google.github.io/mediapipe/) - Face detection model

## License

See LICENSE file for details.

## Author

Created with passion for cyberpunk aesthetics and real-time video effects.

---

**Press 'S' to save screenshots • Requires camera access • Best viewed in fullscreen**
