# ASCII Art Camera Effect

A real-time video effect that transforms your camera feed into a cyberpunk-style ASCII art portrait with Matrix-inspired falling code background.

## Features

- **Face Detection**: Automatically detects human faces using ml5.js face detection
- **ASCII Art Transformation**: Converts detected faces into dense fields of glowing ASCII characters
- **Dynamic Animation**: Characters animate and respond to movement in real-time
- **Matrix Background**: Vertically falling code streams in neon orange and amber colors
- **Cyberpunk Aesthetic**: High-contrast visuals with deep blacks and bright orange highlights
- **Responsive Design**: Adapts to different screen sizes

## How to Use

1. Open `index.html` in a modern web browser (Chrome, Firefox, or Edge recommended)
2. Allow camera access when prompted
3. Wait for the face detection model to load (you'll see a console message)
4. Move in front of your camera to see the ASCII art effect

## Technical Details

- Built with [p5.js](https://p5js.org/) for graphics rendering
- Uses [ml5.js](https://ml5js.org/) for face detection
- Real-time video processing and ASCII character mapping
- Dynamic glow effects and character animation

## Requirements

- Modern web browser with WebGL support
- Webcam or camera device
- Internet connection (for loading libraries from CDN)

## Local Development

Simply open `index.html` in your browser. For better security and CORS handling, you can use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.
