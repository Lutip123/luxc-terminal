// Web Audio Synthesizer for Luxc Terminal
class TerminalAudio {
    constructor() {
        this.ctx = null;
        this.enabled = localStorage.getItem('luxc_sound') !== 'false'; // default true
        this.initOnUserGesture();
    }

    initContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initOnUserGesture() {
        const unlock = () => {
            this.initContext();
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('click', unlock);
        };
        window.addEventListener('keydown', unlock, { once: true });
        window.addEventListener('click', unlock, { once: true });
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('luxc_sound', this.enabled);
        if (this.enabled) {
            this.playBeep(880, 0.08); // confirmation tone
        }
        return this.enabled;
    }

    // Mechanical keyboard keypress sound
    playKeyPress() {
        if (!this.enabled || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            
            // Noise burst for mechanical click
            const bufferSize = this.ctx.sampleRate * 0.015; // 15ms
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1400 + Math.random() * 600, t);
            filter.Q.setValueAtTime(3, t);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(t);
        } catch (e) {}
    }

    // Enter / Submit Key
    playEnter() {
        if (!this.enabled || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, t);
            osc.frequency.exponentialRampToValueAtTime(120, t + 0.05);

            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.05);
        } catch (e) {}
    }

    // Beep / Alert
    playBeep(freq = 440, duration = 0.12) {
        if (!this.enabled || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + duration);
        } catch (e) {}
    }

    // Arch Linux Boot Chime
    playBootSound() {
        if (!this.enabled || !this.ctx) return;
        try {
            const notes = [220, 330, 440, 660, 880];
            notes.forEach((freq, idx) => {
                setTimeout(() => {
                    this.playBeep(freq, 0.1);
                }, idx * 70);
            });
        } catch (e) {}
    }
}

window.terminalAudio = new TerminalAudio();
