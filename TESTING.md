# Manual Test Plan for ASCII Art Face Detection

## Test Environment
- Browser: Chrome, Firefox, Edge, or Safari
- Server: Any HTTP server (Python, Node.js, or VS Code Live Server)
- Camera: Optional (demo mode available)

## Test Cases

### 1. Page Load and Initialization
**Steps:**
1. Start local server
2. Navigate to http://localhost:8000
3. Observe initialization status

**Expected:**
- Page loads without errors
- Status message shows "Initializing..."
- Background shows Matrix rain effect with orange characters

### 2. Camera Access (if available)
**Steps:**
1. Allow camera access when prompted
2. Observe the video feed

**Expected:**
- Camera feed is captured
- Status shows "Ready! Face detection active." or similar
- ASCII art renders the video/face in real-time

### 3. Face Detection
**Steps:**
1. Position face in front of camera
2. Move face around
3. Try multiple faces if possible

**Expected:**
- ASCII art follows face movement in real-time
- Characters accurately represent facial shading
- Neon orange/amber glow effect visible on ASCII characters

### 4. Demo Mode (no camera)
**Steps:**
1. Deny camera access or test in environment without camera
2. Observe fallback behavior

**Expected:**
- Status shows "Demo Mode - ASCII Art Preview"
- Animated face simulation appears in ASCII art
- Face animates (eyes blink, mouth moves)
- No errors in console

### 5. Matrix Background Effect
**Steps:**
1. Observe background throughout testing
2. Watch for animation

**Expected:**
- Vertical streams of orange characters falling
- Characters change randomly
- Smooth animation without flickering
- Glow effect on leading characters

### 6. Visual Quality
**Checks:**
- ASCII characters have orange (#FF8C00) and amber tones
- Glow/shadow effects are visible
- High contrast cyberpunk aesthetic
- Smooth real-time updates (no lag)

### 7. Responsive Behavior
**Steps:**
1. Resize browser window
2. Observe canvas adaptation

**Expected:**
- Canvas resizes to fill viewport
- Matrix rain reinitializes for new dimensions
- ASCII art scales appropriately
- No layout breaking

## Performance Expectations
- Frame rate: ~30-60 FPS
- ASCII updates: Real-time with minimal lag
- Matrix rain: Smooth animation
- CPU usage: Moderate (browser-dependent)

## Browser Compatibility Notes

| Browser | Camera | Face Detection | Matrix Effect | ASCII Art |
|---------|--------|----------------|---------------|-----------|
| Chrome  | ✅     | ✅*            | ✅            | ✅        |
| Firefox | ✅     | ❌ (fallback)  | ✅            | ✅        |
| Edge    | ✅     | ✅*            | ✅            | ✅        |
| Safari  | ✅**   | ❌ (fallback)  | ✅            | ✅        |

*Face Detection API requires experimental features enabled in Chrome/Edge
**Safari may require HTTPS for camera access

## Known Issues
- Face Detection API not widely supported yet (graceful fallback implemented)
- Performance may vary based on camera resolution and device capability
- Some browsers may require HTTPS for camera access
