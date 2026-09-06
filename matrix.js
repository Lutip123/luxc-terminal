// Matrix Digital Rain Visualizer
class MatrixEffect {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // Katakana + Latin + Numbers + Symbols
        this.characters = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEF@#$%&*+-/<>~';
        this.fontSize = 16;
        this.columns = 0;
        this.drops = [];
        this.isFullMode = false;
        this.animationId = null;

        this.init();
        window.addEventListener('resize', () => this.resize());
    }

    init() {
        this.resize();
        this.start();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.floor(Math.random() * -50);
        }
    }

    start() {
        if (this.animationId) return;
        let lastTime = 0;
        const fps = 30;
        const interval = 1000 / fps;

        const loop = (timestamp) => {
            this.animationId = requestAnimationFrame(loop);
            const delta = timestamp - lastTime;
            if (delta > interval) {
                lastTime = timestamp - (delta % interval);
                this.render();
            }
        };
        this.animationId = requestAnimationFrame(loop);
    }

    render() {
        // Fade effect
        this.ctx.fillStyle = this.isFullMode ? 'rgba(0, 0, 0, 0.08)' : 'rgba(7, 13, 8, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Get current primary color from CSS variable
        const themeColor = getComputedStyle(document.body).getPropertyValue('--theme-primary').trim() || '#00ff66';

        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            // Head of the drop is bright white/light
            if (Math.random() > 0.85) {
                this.ctx.fillStyle = '#ffffff';
            } else {
                this.ctx.fillStyle = themeColor;
            }

            this.ctx.fillText(char, x, y);

            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    toggleFullMode(enable = null) {
        if (enable !== null) {
            this.isFullMode = enable;
        } else {
            this.isFullMode = !this.isFullMode;
        }

        if (this.isFullMode) {
            document.body.classList.add('matrix-mode-full');
        } else {
            document.body.classList.remove('matrix-mode-full');
        }
        return this.isFullMode;
    }
}

window.matrixEffect = new MatrixEffect('matrix-canvas');
