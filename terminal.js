// Luxc Terminal Core Controller
class LuxcTerminal {
    constructor() {
        this.outputContainer = document.getElementById('output-container');
        this.input = document.getElementById('terminal-input');
        this.promptRow = document.getElementById('active-prompt-row');
        this.terminalBody = document.getElementById('terminal-body');
        
        // History
        this.history = JSON.parse(localStorage.getItem('luxc_history') || '[]');
        this.historyIndex = this.history.length;
        
        // State
        this.isBusy = false;
        this.isInterrupted = false;
        this.tempLineElement = null;
        this.currentEditorFile = null;

        // UI elements
        this.editorOverlay = document.getElementById('editor-overlay');
        this.editorTextarea = document.getElementById('editor-textarea');
        this.editorFilename = document.getElementById('editor-filename');
        this.htopOverlay = document.getElementById('htop-overlay');
        // Dynamic prompt display elements
        this.promptTextBefore = document.getElementById('prompt-text-before');
        this.promptCursor = document.getElementById('prompt-cursor');
        this.promptTextAfter = document.getElementById('prompt-text-after');

        this.init();
    }

    init() {
        this.bindEvents();
        this.updatePrompt();
        this.updateInputDisplay();
        this.fetchSystemInfo();
        this.printWelcomeBanner();
    }

    bindEvents() {
        // Input key and sync handling
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.input.addEventListener('input', () => this.updateInputDisplay());
        this.input.addEventListener('keyup', () => this.updateInputDisplay());
        this.input.addEventListener('select', () => this.updateInputDisplay());
        this.input.addEventListener('click', () => this.updateInputDisplay());
        
        // Global click focuses input
        document.addEventListener('click', (e) => {
            if (!this.editorOverlay.classList.contains('hidden') || !this.htopOverlay.classList.contains('hidden')) return;
            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'A') {
                this.input.focus();
                this.updateInputDisplay();
            }
        });

        // Sound toggle
        const btnSound = document.getElementById('btn-sound');
        const soundIcon = document.getElementById('sound-icon');
        const updateSoundIcon = () => {
            soundIcon.textContent = window.terminalAudio.enabled ? '🔊' : '🔇';
        };
        updateSoundIcon();
        btnSound.addEventListener('click', () => {
            const enabled = window.terminalAudio.toggle();
            updateSoundIcon();
            this.print(`<span class="t-yellow">[Audio] Mechanical Sound SFX: ${enabled ? 'ENABLED' : 'DISABLED'}</span>`);
        });

        // CRT toggle
        const btnCrt = document.getElementById('btn-crt');
        btnCrt.addEventListener('click', () => {
            document.body.classList.toggle('crt-enabled');
            const enabled = document.body.classList.contains('crt-enabled');
            this.print(`<span class="t-yellow">[Display] CRT Scanlines & Glow: ${enabled ? 'ENABLED' : 'DISABLED'}</span>`);
        });

        // Theme selector
        const themeSelect = document.getElementById('theme-select');
        themeSelect.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });

        // Fullscreen
        const btnFullscreen = document.getElementById('btn-fullscreen');
        btnFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });

        // Mobile / Quick Toolbar
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cmd = btn.getAttribute('data-cmd');
                const key = btn.getAttribute('data-key');
                if (cmd) {
                    this.input.value = cmd;
                    this.submitCommand();
                } else if (key) {
                    this.simulateKey(key);
                }
            });
        });

        // Ctrl+C button
        document.getElementById('btn-ctrl-c').addEventListener('click', () => {
            this.interrupt();
        });

        // Nano Editor buttons
        document.getElementById('editor-btn-save').addEventListener('click', () => this.saveEditor());
        document.getElementById('editor-btn-exit').addEventListener('click', () => this.closeEditor());
        this.editorTextarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && (e.key === 'o' || e.key === 'O' || e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                this.saveEditor();
            } else if (e.ctrlKey && (e.key === 'x' || e.key === 'X')) {
                e.preventDefault();
                this.closeEditor();
            }
        });

        // HTOP Close button
        document.getElementById('htop-close-btn').addEventListener('click', () => this.closeHtop());
        window.addEventListener('keydown', (e) => {
            if (!this.htopOverlay.classList.contains('hidden')) {
                if (e.key === 'q' || e.key === 'Q' || e.key === 'F10' || (e.ctrlKey && e.key === 'c')) {
                    this.closeHtop();
                }
            } else if (document.body.classList.contains('matrix-mode-full')) {
                if (e.key === 'q' || e.key === 'Q' || (e.ctrlKey && e.key === 'c') || e.key === 'Escape') {
                    window.matrixEffect.toggleFullMode(false);
                    this.print('<span class="t-green">Returned from Matrix Rain.</span>');
                }
            }
        });
    }

    setTheme(name) {
        document.body.className = `theme-${name} ${document.body.classList.contains('crt-enabled') ? 'crt-enabled' : ''}`;
        document.getElementById('theme-select').value = name;
        localStorage.setItem('luxc_theme', name);
    }

    updatePrompt() {
        const path = window.vfs.currentPath;
        const displayPath = path.startsWith('/home/luxc') ? ('~' + path.substring(10)) : path;
        const promptPathSpan = document.querySelector('.prompt-path');
        if (promptPathSpan) {
            promptPathSpan.textContent = displayPath || '/';
        }
        document.getElementById('header-title').textContent = `luxc@archlinux: ${displayPath || '/'} (bash 5.2.26)`;
    }

    async fetchSystemInfo() {
        try {
            const res = await fetch('/api/info');
            if (res.ok) {
                const data = await res.json();
                const ipDisplay = document.getElementById('ip-display');
                if (data.networkIPs && data.networkIPs.length > 0) {
                    ipDisplay.textContent = `IP: ${data.networkIPs[0].address}`;
                    ipDisplay.title = `Access from LAN: http://${data.networkIPs[0].address}:${data.port || 3000}`;
                } else {
                    ipDisplay.textContent = `IP: 127.0.0.1`;
                }

                const memDisplay = document.getElementById('mem-display');
                if (data.freeMemory && data.totalMemory) {
                    const used = parseInt(data.totalMemory) - parseInt(data.freeMemory);
                    memDisplay.textContent = `RAM: ${used}M/${data.totalMemory}`;
                }
            }
        } catch (e) {
            document.getElementById('ip-display').textContent = 'IP: 127.0.0.1';
        }
    }

    printWelcomeBanner() {
        // Check saved theme
        const savedTheme = localStorage.getItem('luxc_theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }

        const banner = `
<span class="t-green t-bold">================================================================================</span>
<span class="t-green t-bold">    ██╗     ██╗   ██╗██╗  ██╗ ██████╗       ARCH LINUX // LUXC CYBER TERMINAL</span>
<span class="t-green t-bold">    ██║     ██║   ██║╚██╗██╔╝██╔════╝       Kernel: 6.10.9-arch1-luxc (x86_64)</span>
<span class="t-green t-bold">    ██║     ██║   ██║ ╚███╔╝ ██║            Architecture: Rolling Release</span>
<span class="t-green t-bold">    ██║     ██║   ██║ ██╔██╗ ██║            Web Access: Chrome LAN Ready</span>
<span class="t-green t-bold">    ███████╗╚██████╔╝██╔╝ ██╗╚██████╗       </span>
<span class="t-green t-bold">    ╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝       Status: <span class="t-yellow">ONLINE & READY</span></span>
<span class="t-green t-bold">================================================================================</span>
<span class="t-cyan">Selamat datang di Luxc Terminal!</span> Ketik <span class="t-yellow t-bold">'help'</span> untuk panduan atau <span class="t-yellow t-bold">'neofetch'</span> untuk info sistem.
Ketik <span class="t-yellow t-bold">'pacman -Syu'</span> untuk update paket atau <span class="t-yellow t-bold">'cmatrix'</span> untuk mode matrix rain.
<span class="t-dim">--------------------------------------------------------------------------------</span>`;
        this.print(banner);
        window.terminalAudio.playBootSound();
    }

    print(content) {
        const div = document.createElement('div');
        div.className = 'terminal-line';
        div.innerHTML = content;
        this.outputContainer.appendChild(div);
        this.scrollToBottom();
    }

    printTemp(content) {
        if (!this.tempLineElement) {
            this.tempLineElement = document.createElement('div');
            this.tempLineElement.className = 'terminal-line';
            this.outputContainer.appendChild(this.tempLineElement);
        }
        this.tempLineElement.innerHTML = content;
        this.scrollToBottom();
    }

    clearTemp() {
        if (this.tempLineElement) {
            this.tempLineElement.remove();
            this.tempLineElement = null;
        }
    }

    scrollToBottom() {
        this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateInputDisplay() {
        const val = this.input.value || '';
        let pos = this.input.selectionStart;
        if (pos === null || pos === undefined || pos < 0) {
            pos = val.length;
        }

        const before = val.substring(0, pos);
        const charAtPos = val.charAt(pos);
        const cursorChar = charAtPos ? charAtPos : ' ';
        const after = val.substring(pos + 1);

        if (this.promptTextBefore) this.promptTextBefore.textContent = before;
        if (this.promptCursor) this.promptCursor.textContent = cursorChar;
        if (this.promptTextAfter) this.promptTextAfter.textContent = after;
    }

    interrupt() {
        if (this.isBusy) {
            this.isInterrupted = true;
            this.print('<span class="t-red">^C</span>');
        } else {
            this.print(`${this.getPromptPrefix()} ${this.input.value}<span class="t-red">^C</span>`);
            this.input.value = '';
            this.updateInputDisplay();
        }
    }

    getPromptPrefix() {
        const path = window.vfs.currentPath;
        const displayPath = path.startsWith('/home/luxc') ? ('~' + path.substring(10)) : path;
        return `<span class="prompt-user">luxc</span><span class="prompt-at">@</span><span class="prompt-host">archlinux</span>:<span class="prompt-path">${displayPath || '/'}</span><span class="prompt-symbol">$</span>`;
    }

    simulateKey(key) {
        if (key === 'Tab') {
            this.handleTabCompletion();
        } else if (key === 'ArrowUp') {
            this.navigateHistory(-1);
        } else if (key === 'ArrowDown') {
            this.navigateHistory(1);
        }
        this.input.focus();
        this.updateInputDisplay();
    }

    handleKeyDown(e) {
        // Mechanical typing sound
        if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
            window.terminalAudio.playKeyPress();
        }

        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            this.interrupt();
            return;
        }

        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            this.outputContainer.innerHTML = '';
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            window.terminalAudio.playEnter();
            this.submitCommand();
            return;
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            this.handleTabCompletion();
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
            return;
        }

        setTimeout(() => this.updateInputDisplay(), 0);
    }

    navigateHistory(direction) {
        if (this.history.length === 0) return;
        this.historyIndex += direction;
        if (this.historyIndex < 0) this.historyIndex = 0;
        if (this.historyIndex >= this.history.length) {
            this.historyIndex = this.history.length;
            this.input.value = '';
            this.updateInputDisplay();
            return;
        }
        this.input.value = this.history[this.historyIndex] || '';
        this.updateInputDisplay();
    }

    handleTabCompletion() {
        const raw = this.input.value;
        const parts = raw.split(' ');
        
        if (parts.length === 1) {
            // Command completion
            const partial = parts[0];
            const commands = [
                'help', 'neofetch', 'fastfetch', 'pacman', 'cmatrix', 'matrix',
                'nmap', 'ping', 'curl', 'nano', 'vim', 'htop', 'top', 'ls', 'cd',
                'pwd', 'cat', 'touch', 'mkdir', 'rm', 'theme', 'crt', 'audio',
                'clear', 'history', 'whoami', 'uname', 'free', 'df', 'date',
                'uptime', 'weather', 'sl', 'cowsay', 'fortune', 'bruteforce', 'decrypt', 'ip', 'ifconfig'
            ];
            const matches = commands.filter(c => c.startsWith(partial));
            if (matches.length === 1) {
                this.input.value = matches[0] + ' ';
                this.updateInputDisplay();
            } else if (matches.length > 1) {
                this.print(`${this.getPromptPrefix()} ${raw}`);
                this.print(matches.map(m => `<span class="t-cyan">${m}</span>`).join('   '));
            }
        } else {
            // Path / File completion
            const lastPart = parts[parts.length - 1];
            const matches = window.vfs.getCompletions(lastPart);
            if (matches.length === 1) {
                parts[parts.length - 1] = matches[0];
                this.input.value = parts.join(' ');
                this.updateInputDisplay();
            } else if (matches.length > 1) {
                this.print(`${this.getPromptPrefix()} ${raw}`);
                this.print(matches.map(m => `<span class="${m.endsWith('/') ? 't-blue' : 't-green'}">${m}</span>`).join('   '));
            }
        }
    }

    async submitCommand() {
        const commandLine = this.input.value.trim();
        this.input.value = '';
        this.updateInputDisplay();

        if (!commandLine) {
            this.print(this.getPromptPrefix());
            return;
        }

        // Add to history
        this.history.push(commandLine);
        localStorage.setItem('luxc_history', JSON.stringify(this.history));
        this.historyIndex = this.history.length;

        // Print command echo
        this.print(`${this.getPromptPrefix()} ${escapeHtml(commandLine)}`);

        // Execute command
        await this.execute(commandLine);
        this.updatePrompt();
    }

    async execute(cmdLine) {
        this.isBusy = true;
        this.isInterrupted = false;

        const tokens = cmdLine.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
        const cleanedTokens = tokens.map(t => t.replace(/^"|"$/g, ''));
        const cmd = cleanedTokens[0]?.toLowerCase();
        const args = cleanedTokens.slice(1);

        try {
            switch (cmd) {
                case 'help':
                case '?':
                    this.print(window.commandRegistry.help(args, this));
                    break;

                case 'neofetch':
                case 'fastfetch':
                    const neo = await window.commandRegistry.neofetch(args, this);
                    if (neo) this.print(neo);
                    break;

                case 'pacman':
                    const pacResult = await window.commandRegistry.pacman(args, this);
                    if (pacResult) this.print(pacResult);
                    break;

                case 'cmatrix':
                case 'matrix':
                    window.matrixEffect.toggleFullMode(true);
                    this.print('<span class="t-green">Matrix Digital Rain running... (Press <b>q</b> or <b>Ctrl+C</b> or <b>ESC</b> to return)</span>');
                    break;

                case 'nmap':
                    const nmapRes = await window.commandRegistry.nmap(args, this);
                    if (nmapRes) this.print(nmapRes);
                    break;

                case 'ping':
                    const pingRes = await window.commandRegistry.ping(args, this);
                    if (pingRes) this.print(pingRes);
                    break;

                case 'curl':
                    const curlRes = await window.commandRegistry.curl(args, this);
                    if (curlRes) this.print(curlRes);
                    break;

                case 'bruteforce':
                    const bruteRes = await window.commandRegistry.bruteforce(args, this);
                    if (bruteRes) this.print(bruteRes);
                    break;

                case 'decrypt':
                    const decRes = await window.commandRegistry.decrypt(args, this);
                    if (decRes) this.print(decRes);
                    break;

                case 'ip':
                case 'ifconfig':
                    const ipRes = await window.commandRegistry.ip(args, this);
                    if (ipRes) this.print(ipRes);
                    break;

                case 'weather':
                    const wRes = await window.commandRegistry.weather(args, this);
                    if (wRes) this.print(wRes);
                    break;

                case 'sl':
                    await window.commandRegistry.sl(args, this);
                    break;

                case 'cowsay':
                    this.print(`<pre>${escapeHtml(window.commandRegistry.cowsay(args))}</pre>`);
                    break;

                case 'fortune':
                    this.print(`<span class="t-yellow">${window.commandRegistry.fortune()}</span>`);
                    break;

                case 'nano':
                case 'vim':
                case 'vi':
                    this.openEditor(args[0] || 'untitled.txt');
                    break;

                case 'htop':
                case 'top':
                    this.openHtop();
                    break;

                case 'theme':
                    if (args.length === 0) {
                        this.print(`<span class="t-yellow">Pilihan tema:</span> matrix, cyan, amber, blood, purple, white\nContoh: <span class="t-cyan">theme cyan</span>`);
                    } else {
                        const validThemes = ['matrix', 'cyan', 'amber', 'blood', 'purple', 'white'];
                        if (validThemes.includes(args[0].toLowerCase())) {
                            this.setTheme(args[0].toLowerCase());
                            this.print(`<span class="t-green">Theme switched to '${args[0]}'.</span>`);
                        } else {
                            this.print(`<span class="t-red">Unknown theme '${args[0]}'. Available: ${validThemes.join(', ')}</span>`);
                        }
                    }
                    break;

                case 'crt':
                    document.body.classList.toggle('crt-enabled');
                    this.print(`<span class="t-yellow">CRT Effects: ${document.body.classList.contains('crt-enabled') ? 'ENABLED' : 'DISABLED'}</span>`);
                    break;

                case 'audio':
                case 'sound':
                    const aEnabled = window.terminalAudio.toggle();
                    document.getElementById('sound-icon').textContent = aEnabled ? '🔊' : '🔇';
                    this.print(`<span class="t-yellow">Audio SFX: ${aEnabled ? 'ENABLED' : 'DISABLED'}</span>`);
                    break;

                case 'ls':
                    this.cmdLs(args);
                    break;

                case 'cd':
                    this.cmdCd(args);
                    break;

                case 'pwd':
                    this.print(window.vfs.currentPath);
                    break;

                case 'cat':
                    this.cmdCat(args);
                    break;

                case 'mkdir':
                    this.cmdMkdir(args);
                    break;

                case 'touch':
                    this.cmdTouch(args);
                    break;

                case 'rm':
                    this.cmdRm(args);
                    break;

                case 'echo':
                    this.cmdEcho(args);
                    break;

                case 'whoami':
                    this.print('luxc');
                    break;

                case 'id':
                    this.print('uid=1000(luxc) gid=1000(luxc) groups=1000(luxc),998(wheel),992(docker),985(storage),984(network)');
                    break;

                case 'uname':
                    if (args.includes('-a') || args.includes('-r')) {
                        this.print('Linux luxc-arch 6.10.9-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux');
                    } else {
                        this.print('Linux');
                    }
                    break;

                case 'date':
                    this.print(new Date().toString());
                    break;

                case 'uptime':
                    this.print(` ${new Date().toLocaleTimeString()} up 4:20,  1 user,  load average: 0.15, 0.18, 0.12`);
                    break;

                case 'free':
                    this.print(`               total        used        free      shared  buff/cache   available\nMem:         8192Mi      1420Mi      5240Mi       120Mi      1532Mi      6500Mi\nSwap:        2048Mi        45Mi      2003Mi`);
                    break;

                case 'df':
                    this.print(`Filesystem      Size  Used Avail Use% Mounted on\n/dev/nvme0n1p2  460G   82G  355G  19% /\ndevtmpfs         3.9G     0  3.9G   0% /dev\ntmpfs            3.9G  124M  3.8G   4% /dev/shm\ntmpfs            3.9G     0  3.9G   0% /sys/fs/cgroup`);
                    break;

                case 'history':
                    this.print(this.history.map((h, i) => `  ${i + 1}  ${h}`).join('\n'));
                    break;

                case 'clear':
                    this.outputContainer.innerHTML = '';
                    break;

                case 'reboot':
                    this.outputContainer.innerHTML = '';
                    this.print('<span class="t-red">Broadcast message from luxc@archlinux:\nThe system will restart now!</span>');
                    await this.sleep(1000);
                    this.printWelcomeBanner();
                    break;

                case 'sudo':
                    if (args.length === 0) {
                        this.print('usage: sudo command');
                    } else {
                        this.print(`<span class="t-yellow">[sudo] password for luxc: **********</span>`);
                        await this.sleep(300);
                        this.execute(args.join(' '));
                    }
                    break;

                default:
                    window.terminalAudio.playBeep(220, 0.15);
                    this.print(`<span class="t-red">bash: ${escapeHtml(cmd)}: command not found</span>. Ketik <span class="t-yellow">'help'</span> untuk daftar perintah.`);
                    break;
            }
        } catch (err) {
            console.error(err);
            this.print(`<span class="t-red">Runtime Error: ${err.message}</span>`);
        } finally {
            this.clearTemp();
            this.isBusy = false;
        }
    }

    // Command LS
    cmdLs(args) {
        let showHidden = false;
        let detailed = false;
        let path = '.';

        for (const arg of args) {
            if (arg.startsWith('-')) {
                if (arg.includes('a')) showHidden = true;
                if (arg.includes('l')) detailed = true;
            } else {
                path = arg;
            }
        }

        const res = window.vfs.ls(path, showHidden, detailed);
        if (!res.success) {
            this.print(`<span class="t-red">${res.error}</span>`);
            return;
        }

        if (detailed) {
            let lines = [`total ${res.items.length * 4}`];
            for (const item of res.items) {
                const color = item.type === 'dir' ? 't-blue t-bold' : (item.permissions.includes('x') ? 't-green t-bold' : 't-white');
                lines.push(`${item.permissions} 1 ${item.owner} ${item.owner} ${item.size.toString().padStart(6)} ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <span class="${color}">${item.name}${item.type === 'dir' ? '/' : ''}</span>`);
            }
            this.print(lines.join('\n'));
        } else {
            const formatted = res.items.map(item => {
                const color = item.type === 'dir' ? 't-blue t-bold' : (item.permissions.includes('x') ? 't-green t-bold' : 't-white');
                return `<span class="${color}">${item.name}${item.type === 'dir' ? '/' : ''}</span>`;
            });
            this.print(formatted.join('    '));
        }
    }

    // Command CD
    cmdCd(args) {
        const path = args[0] || '~';
        const res = window.vfs.cd(path);
        if (!res.success) {
            this.print(`<span class="t-red">${res.error}</span>`);
        }
    }

    // Command CAT
    cmdCat(args) {
        if (!args[0]) {
            this.print('<span class="t-red">cat: missing file operand</span>');
            return;
        }
        const res = window.vfs.readFile(args[0]);
        if (!res.success) {
            this.print(`<span class="t-red">${res.error}</span>`);
        } else {
            this.print(escapeHtml(res.content));
        }
    }

    // Command MKDIR
    cmdMkdir(args) {
        if (!args[0]) {
            this.print('<span class="t-red">mkdir: missing operand</span>');
            return;
        }
        const res = window.vfs.mkdir(args[0]);
        if (!res.success) {
            this.print(`<span class="t-red">${res.error}</span>`);
        }
    }

    // Command TOUCH
    cmdTouch(args) {
        if (!args[0]) {
            this.print('<span class="t-red">touch: missing file operand</span>');
            return;
        }
        window.vfs.writeFile(args[0], '');
    }

    // Command RM
    cmdRm(args) {
        if (!args[0]) {
            this.print('<span class="t-red">rm: missing operand</span>');
            return;
        }
        const recursive = args.includes('-r') || args.includes('-rf');
        const target = args.find(a => !a.startsWith('-'));
        if (!target) return;

        const res = window.vfs.rm(target, recursive);
        if (!res.success) {
            this.print(`<span class="t-red">${res.error}</span>`);
        }
    }

    // Command ECHO
    cmdEcho(args) {
        const line = args.join(' ');
        if (line.includes('>')) {
            const parts = line.split('>');
            const content = parts[0].trim().replace(/^['"]|['"]$/g, '');
            const filename = parts[1].trim();
            window.vfs.writeFile(filename, content + '\n');
        } else {
            this.print(escapeHtml(line));
        }
    }

    // Nano/Vim Text Editor
    openEditor(filename) {
        this.currentEditorFile = filename;
        const readRes = window.vfs.readFile(filename);
        this.editorTextarea.value = readRes.success ? readRes.content : '';
        this.editorFilename.textContent = `File: ${filename}`;
        this.editorOverlay.classList.remove('hidden');
        this.editorTextarea.focus();
    }

    saveEditor() {
        if (this.currentEditorFile) {
            window.vfs.writeFile(this.currentEditorFile, this.editorTextarea.value);
            document.getElementById('editor-modified').textContent = '[ Wrote ' + this.editorTextarea.value.length + ' bytes ]';
            window.terminalAudio.playBeep(660, 0.08);
            setTimeout(() => {
                document.getElementById('editor-modified').textContent = '';
            }, 2000);
        }
    }

    closeEditor() {
        this.editorOverlay.classList.add('hidden');
        this.currentEditorFile = null;
        this.input.focus();
    }

    // HTOP Task Monitor Overlay
    openHtop() {
        this.htopOverlay.classList.remove('hidden');
        this.updateHtopRows();
        this.htopInterval = setInterval(() => this.updateHtopRows(), 1000);
    }

    closeHtop() {
        if (this.htopInterval) {
            clearInterval(this.htopInterval);
            this.htopInterval = null;
        }
        this.htopOverlay.classList.add('hidden');
        this.input.focus();
    }

    updateHtopRows() {
        const cpu1Pct = (15 + Math.random() * 25).toFixed(1);
        const cpu2Pct = (8 + Math.random() * 20).toFixed(1);
        document.getElementById('htop-cpu1').textContent = '|'.repeat(Math.floor(cpu1Pct / 4)) + ` ${cpu1Pct}%`;
        document.getElementById('htop-cpu2').textContent = '|'.repeat(Math.floor(cpu2Pct / 4)) + ` ${cpu2Pct}%`;

        const processes = [
            { pid: 1, user: 'root', pri: 20, ni: 0, virt: '168M', res: '12M', shr: '8M', s: 'S', cpu: '0.0', mem: '0.1', time: '0:01.42', cmd: '/sbin/init' },
            { pid: 412, user: 'root', pri: 20, ni: 0, virt: '84M', res: '8M', shr: '4M', s: 'S', cpu: '0.0', mem: '0.1', time: '0:00.12', cmd: '/usr/lib/systemd/systemd-journald' },
            { pid: 820, user: 'luxc', pri: 20, ni: 0, virt: '542M', res: '88M', shr: '42M', s: 'S', cpu: cpu1Pct, mem: '1.2', time: '0:08.54', cmd: 'node server.js (Luxc Web Server)' },
            { pid: 1045, user: 'luxc', pri: 20, ni: 0, virt: '320M', res: '45M', shr: '28M', s: 'R', cpu: cpu2Pct, mem: '0.6', time: '0:03.11', cmd: 'htop' },
            { pid: 1204, user: 'luxc', pri: 20, ni: 0, virt: '112M', res: '14M', shr: '9M', s: 'S', cpu: '0.1', mem: '0.2', time: '0:00.65', cmd: 'bash' },
            { pid: 1540, user: 'root', pri: 20, ni: 0, virt: '98M', res: '7M', shr: '5M', s: 'S', cpu: '0.0', mem: '0.1', time: '0:00.04', cmd: '/usr/bin/sshd -D' },
            { pid: 1890, user: 'luxc', pri: 20, ni: 0, virt: '45M', res: '4M', shr: '3M', s: 'S', cpu: '0.0', mem: '0.0', time: '0:00.01', cmd: 'cmatrix -b' }
        ];

        const tbody = document.getElementById('htop-process-list');
        tbody.innerHTML = processes.map(p => `
            <tr>
                <td class="t-cyan">${p.pid}</td>
                <td class="t-green">${p.user}</td>
                <td>${p.pri}</td>
                <td>${p.ni}</td>
                <td>${p.virt}</td>
                <td>${p.res}</td>
                <td>${p.shr}</td>
                <td class="t-yellow">${p.s}</td>
                <td class="t-bold ${parseFloat(p.cpu) > 10 ? 't-red' : 't-green'}">${p.cpu}</td>
                <td>${p.mem}</td>
                <td>${p.time}</td>
                <td class="t-white">${p.cmd}</td>
            </tr>
        `).join('');
    }
}

// Start terminal when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.luxcTerminal = new LuxcTerminal();
});
