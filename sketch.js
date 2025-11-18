// ASCII Art Face Detection with Cyberpunk Aesthetic - Pure JavaScript Implementation
class ASCIIArtApp {
    constructor() {
        // Video element
        this.video = document.getElementById('video');
        this.status = document.getElementById('status');
        
        // Canvases
        this.matrixCanvas = document.getElementById('matrix-canvas');
        this.asciiCanvas = document.getElementById('ascii-canvas');
        this.matrixCtx = this.matrixCanvas.getContext('2d');
        this.asciiCtx = this.asciiCanvas.getContext('2d');
        
        // ASCII characters from darkest to lightest for shading
        this.asciiChars = '@#S%?*+;:,. ';
        
        // Matrix rain effect
        this.matrixChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*(){}[]<>?/\\|';
        this.matrixColumns = [];
        
        // Settings
        this.charSize = 8;
        this.faceResolution = 6;
        
        // Face detection
        this.faceDetector = null;
        this.detectedFaces = [];
        
        // Animation
        this.animationId = null;
        
        this.init();
    }
    
    async init() {
        try {
            await this.setupCanvas();
            await this.setupCamera();
            await this.setupFaceDetection();
            this.initMatrixRain();
            this.animate();
            this.status.textContent = 'Ready! Face detection active.';
            setTimeout(() => this.status.style.display = 'none', 3000);
        } catch (error) {
            console.error('Initialization error:', error);
            this.status.textContent = 'Error: ' + error.message;
        }
    }
    
    setupCanvas() {
        const setCanvasSize = () => {
            this.matrixCanvas.width = window.innerWidth;
            this.matrixCanvas.height = window.innerHeight;
            this.asciiCanvas.width = window.innerWidth;
            this.asciiCanvas.height = window.innerHeight;
            this.initMatrixRain();
        };
        
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
    }
    
    async setupCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                }
            });
            this.video.srcObject = stream;
            
            return new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    resolve();
                };
            });
        } catch (error) {
            // Fallback to demo mode with generated content
            console.log('Camera not available, using demo mode');
            this.useDemoMode = true;
            this.setupDemoMode();
        }
    }
    
    async setupFaceDetection() {
        // Check if Face Detection API is available
        if ('FaceDetector' in window) {
            try {
                this.faceDetector = new window.FaceDetector({
                    maxDetectedFaces: 5,
                    fastMode: true
                });
                this.status.textContent = 'Using native Face Detection API';
            } catch (e) {
                console.log('Face Detection API not available:', e);
                this.status.textContent = 'Face detection unavailable, showing full video as ASCII';
            }
        } else {
            console.log('Face Detection API not supported');
            this.status.textContent = this.useDemoMode ? 'Demo Mode - ASCII Art Preview' : 'Showing full video as ASCII art';
        }
    }
    
    setupDemoMode() {
        // Create a canvas to simulate video content
        this.demoCanvas = document.createElement('canvas');
        this.demoCanvas.width = 640;
        this.demoCanvas.height = 480;
        this.demoCtx = this.demoCanvas.getContext('2d');
        
        // Draw a gradient face-like shape
        const centerX = this.demoCanvas.width / 2;
        const centerY = this.demoCanvas.height / 2;
        
        // Create animated face regions
        this.demoTime = 0;
    }
    
    updateDemoContent() {
        if (!this.useDemoMode) return;
        
        this.demoTime += 0.05;
        const ctx = this.demoCtx;
        
        // Clear with dark background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, this.demoCanvas.width, this.demoCanvas.height);
        
        const centerX = this.demoCanvas.width / 2;
        const centerY = this.demoCanvas.height / 2;
        
        // Draw animated face-like structure
        // Head oval
        const headRadiusX = 120 + Math.sin(this.demoTime * 2) * 10;
        const headRadiusY = 150 + Math.cos(this.demoTime * 2) * 10;
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, headRadiusX);
        gradient.addColorStop(0, '#888');
        gradient.addColorStop(0.5, '#555');
        gradient.addColorStop(1, '#222');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, headRadiusX, headRadiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        const eyeY = centerY - 30;
        const eyeOffset = 40 + Math.sin(this.demoTime * 3) * 5;
        
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(centerX - eyeOffset, eyeY, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX + eyeOffset, eyeY, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.moveTo(centerX, eyeY + 30);
        ctx.lineTo(centerX - 10, eyeY + 50);
        ctx.lineTo(centerX + 10, eyeY + 50);
        ctx.fill();
        
        // Mouth - animated smile
        const mouthY = centerY + 50;
        const smileAmount = Math.sin(this.demoTime) * 10;
        
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX - 40, mouthY);
        ctx.quadraticCurveTo(centerX, mouthY + 20 + smileAmount, centerX + 40, mouthY);
        ctx.stroke();
        
        // Add some texture/details
        for (let i = 0; i < 50; i++) {
            const x = centerX + (Math.random() - 0.5) * headRadiusX * 1.5;
            const y = centerY + (Math.random() - 0.5) * headRadiusY * 1.5;
            const brightness = Math.floor(Math.random() * 50 + 100);
            
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            ctx.fillRect(x, y, 2, 2);
        }
    }
    
    initMatrixRain() {
        this.matrixColumns = [];
        const cols = Math.floor(this.matrixCanvas.width / this.charSize);
        
        for (let i = 0; i < cols; i++) {
            this.matrixColumns[i] = {
                y: Math.random() * -this.matrixCanvas.height,
                speed: Math.random() * 4 + 2,
                chars: []
            };
            
            const trailLength = Math.floor(Math.random() * 20 + 10);
            for (let j = 0; j < trailLength; j++) {
                this.matrixColumns[i].chars.push({
                    char: this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)],
                    brightness: (1 - j / trailLength) * 255
                });
            }
        }
    }
    
    drawMatrixRain() {
        this.matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.matrixCtx.fillRect(0, 0, this.matrixCanvas.width, this.matrixCanvas.height);
        
        this.matrixCtx.font = `${this.charSize}px monospace`;
        this.matrixCtx.textAlign = 'center';
        
        for (let i = 0; i < this.matrixColumns.length; i++) {
            const column = this.matrixColumns[i];
            const x = i * this.charSize + this.charSize / 2;
            
            for (let j = 0; j < column.chars.length; j++) {
                const charObj = column.chars[j];
                const y = column.y - (j * this.charSize);
                
                if (y < -this.charSize || y > this.matrixCanvas.height + this.charSize) continue;
                
                const alpha = (charObj.brightness / 255) * 0.8;
                
                // Add glow to leading characters
                if (j < 3) {
                    this.matrixCtx.shadowBlur = 10;
                    this.matrixCtx.shadowColor = `rgba(255, 140, 0, ${alpha})`;
                    this.matrixCtx.fillStyle = `rgba(255, 165, 0, ${alpha * 1.5})`;
                } else {
                    this.matrixCtx.shadowBlur = 0;
                    this.matrixCtx.fillStyle = `rgba(255, 140, 0, ${alpha})`;
                }
                
                this.matrixCtx.fillText(charObj.char, x, y);
            }
            
            column.y += column.speed;
            
            if (column.y - column.chars.length * this.charSize > this.matrixCanvas.height) {
                column.y = -this.charSize;
                column.speed = Math.random() * 4 + 2;
            }
            
            // Randomly change characters
            if (Math.random() < 0.05) {
                const randIdx = Math.floor(Math.random() * column.chars.length);
                column.chars[randIdx].char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
            }
        }
    }
    
    async detectFaces() {
        if (this.faceDetector && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            try {
                this.detectedFaces = await this.faceDetector.detect(this.video);
            } catch (e) {
                console.error('Face detection error:', e);
                this.detectedFaces = [];
            }
        }
    }
    
    drawASCIIArt() {
        this.asciiCtx.clearRect(0, 0, this.asciiCanvas.width, this.asciiCanvas.height);
        
        let tempCanvas, tempCtx;
        
        if (this.useDemoMode) {
            // Use demo content
            this.updateDemoContent();
            tempCanvas = this.demoCanvas;
            tempCtx = this.demoCtx;
        } else {
            if (this.video.readyState !== this.video.HAVE_ENOUGH_DATA) return;
            
            // Create a temporary canvas for video frame
            tempCanvas = document.createElement('canvas');
            tempCanvas.width = this.video.videoWidth;
            tempCanvas.height = this.video.videoHeight;
            tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(this.video, 0, 0);
        }
        
        this.asciiCtx.font = `${this.charSize}px monospace`;
        this.asciiCtx.textAlign = 'center';
        this.asciiCtx.textBaseline = 'middle';
        
        // If we have detected faces, only draw ASCII for those regions
        if (this.detectedFaces.length > 0) {
            for (const face of this.detectedFaces) {
                const box = face.boundingBox;
                this.drawASCIIRegion(tempCtx, tempCanvas.width, tempCanvas.height, 
                                    box.x, box.y, box.width, box.height);
            }
        } else {
            // Draw ASCII for entire frame
            this.drawASCIIRegion(tempCtx, tempCanvas.width, tempCanvas.height, 
                                0, 0, tempCanvas.width, tempCanvas.height);
        }
    }
    
    drawASCIIRegion(sourceCtx, sourceWidth, sourceHeight, x, y, w, h) {
        for (let i = 0; i < w; i += this.faceResolution) {
            for (let j = 0; j < h; j += this.faceResolution) {
                const pixelX = Math.floor(x + i);
                const pixelY = Math.floor(y + j);
                
                if (pixelX < 0 || pixelX >= sourceWidth || pixelY < 0 || pixelY >= sourceHeight) continue;
                
                const imageData = sourceCtx.getImageData(pixelX, pixelY, 1, 1);
                const pixel = imageData.data;
                
                const r = pixel[0];
                const g = pixel[1];
                const b = pixel[2];
                
                // Calculate brightness
                const brightness = (r + g + b) / 3;
                
                // Map brightness to ASCII character
                const charIndex = Math.floor((brightness / 255) * (this.asciiChars.length - 1));
                const char = this.asciiChars[charIndex];
                
                if (char === ' ') continue; // Skip spaces for performance
                
                // Calculate position on canvas
                const canvasX = (pixelX / sourceWidth) * this.asciiCanvas.width;
                const canvasY = (pixelY / sourceHeight) * this.asciiCanvas.height;
                
                const glowIntensity = brightness / 255;
                
                // Draw glow layers for neon effect
                this.asciiCtx.shadowBlur = 8;
                this.asciiCtx.shadowColor = `rgba(255, 140, 0, ${glowIntensity * 0.8})`;
                this.asciiCtx.fillStyle = `rgba(255, 165, 0, ${glowIntensity * 0.6})`;
                this.asciiCtx.fillText(char, canvasX, canvasY);
                
                // Main character in amber/orange
                this.asciiCtx.shadowBlur = 4;
                this.asciiCtx.shadowColor = `rgba(255, 140, 0, ${glowIntensity})`;
                this.asciiCtx.fillStyle = `rgba(255, ${140 + Math.floor(brightness * 0.3)}, 0, ${Math.min(brightness / 255 + 0.4, 1)})`;
                this.asciiCtx.fillText(char, canvasX, canvasY);
            }
        }
    }
    
    async animate() {
        this.drawMatrixRain();
        
        // Detect faces periodically (not every frame for performance)
        if (this.faceDetector && this.animationId % 10 === 0) {
            await this.detectFaces();
        }
        
        this.drawASCIIArt();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize the app when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new ASCIIArtApp();
});
