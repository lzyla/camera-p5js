# ASCII Art Face Detection - Cyberpunk Edition

A real-time ASCII art face detection application with a cyberpunk aesthetic using pure JavaScript and Canvas API.

![ASCII Art Demo](https://github.com/user-attachments/assets/72713a98-2cd0-4461-ab1b-c4f473d135ad)

## Features

- **Live Camera Feed**: Captures video from your webcam in real-time
- **Face Detection**: Uses browser's native FaceDetector API when available to detect faces in the video stream
- **Dynamic ASCII Art**: Transforms detected faces (or entire video) into ASCII art with high-density character mapping for realistic shading and expression
- **Neon Glow Effect**: ASCII characters glow in neon orange and amber colors with multiple glow layers
- **Matrix Background**: Animated vertical orange Matrix-style code streams in the background
- **Real-time Performance**: Updates continuously as you move
- **Cyberpunk Aesthetic**: High-contrast, digital look with orange/amber color scheme
- **Demo Mode**: Automatically falls back to demo mode with animated face simulation if camera is unavailable

## How to Run

1. **Local Server**: Since this uses webcam access, you need to run it through a local server (browsers block camera access from `file://` URLs)

   Using Python:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   Using Node.js:
   ```bash
   npx http-server
   ```

   Using VS Code:
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

2. **Open Browser**: Navigate to `http://localhost:8000` (or the port your server is using)

3. **Allow Camera Access**: When prompted, allow the browser to access your camera

4. **Enjoy**: Your face will be rendered as ASCII art with a Matrix-style background!

## Technical Details

- **Pure JavaScript**: No external libraries required - uses vanilla JS and Canvas API
- **Native Face Detection**: Uses browser's Shape Detection API (FaceDetector) when available
- **ASCII Characters**: Uses a gradient from `@` (darkest) to ` ` (lightest) for shading: `@#S%?*+;:,. `
- **Character Density**: Adjustable resolution for more or less detailed ASCII representation
- **Color Scheme**: Orange (#FF8C00) and amber tones with glow effects
- **Matrix Effect**: Randomly falling characters with fading trails and dynamic updates
- **Demo Mode**: Generates animated face simulation when camera is unavailable

## Customization

You can adjust these variables in `sketch.js`:

- `charSize`: Size of ASCII characters (default: 8)
- `faceResolution`: Lower values = more detailed face (default: 6)
- `asciiChars`: String of characters used for shading
- `matrixChars`: Characters used in the Matrix rain effect

## Browser Compatibility

**Face Detection API Support:**
- Chrome/Edge 90+ (with experimental features enabled)
- Works in all modern browsers with fallback to full-frame ASCII art

**Camera Access:**
- Chrome (recommended)
- Firefox
- Edge
- Safari (may require HTTPS for camera access)

**Note**: If the Face Detection API is not available, the application will render the entire video feed as ASCII art instead of just detected faces.

## License

MIT License - See LICENSE file for details
