// Luxc Terminal Command Handlers & Arch Linux Simulators
class CommandRegistry {
    constructor() {
        this.installedPackages = new Set(['base', 'linux', 'luxc-core', 'bash', 'coreutils', 'pacman', 'systemd', 'nano', 'cmatrix', 'neofetch']);
        this.allRepoPackages = {
            'nmap': { desc: 'Network exploration tool and security / port scanner', size: '24.5 MB' },
            'wireshark-cli': { desc: 'Network protocol analyzer (tshark)', size: '38.2 MB' },
            'metasploit': { desc: 'The world\'s most used penetration testing framework', size: '142.8 MB' },
            'hydra': { desc: 'Very fast network logon cracker supporting many protocols', size: '18.4 MB' },
            'aircrack-ng': { desc: 'Key cracker for 802.11 WEP and WPA-PSK keys', size: '12.1 MB' },
            'ghidra': { desc: 'Software reverse engineering (SRE) suite', size: '320.0 MB' },
            'sl': { desc: 'Steam Locomotive runs across your screen if you type sl', size: '1.2 MB' },
            'cowsay': { desc: 'Configurable talking cow (and a bit more)', size: '0.8 MB' },
            'fortune-mod': { desc: 'The Fortune Cookie Program from BSD Unix', size: '3.4 MB' },
            'htop': { desc: 'Interactive process viewer', size: '5.6 MB' },
            'neovim': { desc: 'Vim-fork focused on extensibility and usability', size: '32.1 MB' },
            'curl': { desc: 'Command line tool for transferring data with URLs', size: '8.4 MB' },
            'tmux': { desc: 'Terminal multiplexer', size: '2.8 MB' }
        };
    }

    // Help command
    help(args, term) {
        return `
<span class="t-green t-bold">╔══════════════════════════════════════════════════════════════════╗</span>
<span class="t-green t-bold">║            LUXC // ARCH LINUX HACKER TERMINAL HELP               ║</span>
<span class="t-green t-bold">╚══════════════════════════════════════════════════════════════════╝</span>

<span class="t-yellow t-bold">[+] ARCH LINUX SYSTEM</span>
  <span class="t-cyan">neofetch</span>         Tampilkan info sistem & spesifikasi dengan ASCII art
  <span class="t-cyan">pacman -Syu</span>      Update & upgrade paket sistem Arch Linux
  <span class="t-cyan">pacman -S &lt;pkg&gt;</span>  Install paket baru (cth: pacman -S nmap)
  <span class="t-cyan">pacman -Ss &lt;q&gt;</span>   Cari paket di repositori Arch
  <span class="t-cyan">uname -a</span>         Informasi kernel Linux Luxc
  <span class="t-cyan">htop</span> / <span class="t-cyan">top</span>        Monitor CPU, RAM & task interaktif
  <span class="t-cyan">free -h</span>          Penggunaan RAM & Swap
  <span class="t-cyan">df -h</span>            Penggunaan disk storage
  <span class="t-cyan">uptime</span>, <span class="t-cyan">date</span>     Waktu aktif sistem & tanggal

<span class="t-yellow t-bold">[+] HACKER & NETWORK TOOLS</span>
  <span class="t-cyan">cmatrix</span> / <span class="t-cyan">matrix</span> Fullscreen Matrix Digital Rain (tekan 'q' untuk keluar)
  <span class="t-cyan">nmap &lt;host&gt;</span>      Simulasi port scanner & vulnerability probe
  <span class="t-cyan">ping &lt;host&gt;</span>      Kirim ICMP packets untuk cek latency
  <span class="t-cyan">curl &lt;url&gt;</span>       Live fetch web data langsung dari server
  <span class="t-cyan">bruteforce &lt;tgt&gt;</span> Simulasi cracking password target
  <span class="t-cyan">decrypt &lt;hash&gt;</span>   Visualisasi dekripsi hash cipher
  <span class="t-cyan">ip</span> / <span class="t-cyan">ifconfig</span>    Tampilkan konfigurasi network & IP lokal mesin

<span class="t-yellow t-bold">[+] FILE SYSTEM & EDITORS</span>
  <span class="t-cyan">ls [-la]</span>         List direktori dan permissions
  <span class="t-cyan">cd &lt;path&gt;</span>        Pindah folder (cd .., cd ~, cd /etc)
  <span class="t-cyan">pwd</span>              Cetak direktori aktif saat ini
  <span class="t-cyan">cat &lt;file&gt;</span>       Baca isi teks file
  <span class="t-cyan">nano &lt;file&gt;</span>      Editor teks in-terminal (Save: Ctrl+O, Exit: Ctrl+X)
  <span class="t-cyan">mkdir &lt;dir&gt;</span>      Buat folder baru
  <span class="t-cyan">touch &lt;file&gt;</span>     Buat file kosong baru
  <span class="t-cyan">rm &lt;file&gt;</span>        Hapus file (atau rm -r untuk folder)

<span class="t-yellow t-bold">[+] SETTINGS & UTILS</span>
  <span class="t-cyan">theme &lt;name&gt;</span>     Ganti tema warna (matrix, cyan, amber, blood, purple, white)
  <span class="t-cyan">crt</span>              Nyalakan / matikan efek retro scanlines CRT
  <span class="t-cyan">audio</span> / <span class="t-cyan">sound</span>    Nyalakan / matikan suara ketikan keyboard mekanik
  <span class="t-cyan">weather &lt;city&gt;</span>   ASCII perkiraan cuaca langsung
  <span class="t-cyan">clear</span>            Bersihkan layar terminal (atau tekan Ctrl+L)
  <span class="t-cyan">history</span>          Lihat riwayat perintah
  <span class="t-cyan">sl</span>               Animasi kereta uap uap!

<span class="t-dim">Tips: Gunakan tombol [TAB] untuk autocomplete perintah dan nama file!</span>`;
    }

    // Neofetch with Luxc Arch ASCII Logo
    async neofetch(args, term) {
        let sysInfo = {
            hostname: 'luxc-arch',
            os: 'Arch Linux x86_64',
            kernel: '6.10.9-luxc-zen1',
            uptime: '4 hours, 20 mins',
            packages: `${this.installedPackages.size} (pacman)`,
            memory: '1420MiB / 8192MiB'
        };

        try {
            const res = await fetch('/api/info');
            if (res.ok) {
                const data = await res.json();
                sysInfo.hostname = data.hostname || sysInfo.hostname;
                const hrs = Math.floor(data.uptime / 3600);
                const mins = Math.floor((data.uptime % 3600) / 60);
                sysInfo.uptime = `${hrs} hours, ${mins} mins`;
                sysInfo.memory = `${parseInt(data.totalMemory) - parseInt(data.freeMemory)}MB / ${data.totalMemory}`;
            }
        } catch (e) {}

        const logo = [
            '<span class="t-cyan t-bold">                  -`</span>',
            '<span class="t-cyan t-bold">                 .o+`</span>',
            '<span class="t-cyan t-bold">                `ooo/</span>',
            '<span class="t-cyan t-bold">               `+oooo:</span>',
            '<span class="t-cyan t-bold">              `+oooooo:</span>',
            '<span class="t-cyan t-bold">              -+oooooo+:</span>',
            '<span class="t-cyan t-bold">            `/:-:++oooo+:</span>',
            '<span class="t-cyan t-bold">           `/++++/+++++++:</span>',
            '<span class="t-cyan t-bold">          `/++++++++++++++:</span>',
            '<span class="t-cyan t-bold">         `/+++ooooooooooooo/`</span>',
            '<span class="t-cyan t-bold">        ./ooosssso++osssssso+`</span>',
            '<span class="t-cyan t-bold">       .oossssso-````/ossssss+`</span>',
            '<span class="t-cyan t-bold">      -osssssso.      :ssssssso.</span>',
            '<span class="t-cyan t-bold">     :osssssss/        osssso+++.</span>',
            '<span class="t-cyan t-bold">    /ossssssss/        +ssssooo/-</span>',
            '<span class="t-cyan t-bold">  `/ossssso+/:-        -:/+osssso+-</span>',
            '<span class="t-cyan t-bold"> `+sso+:-`                 `.-/+oso:</span>',
            '<span class="t-cyan t-bold">`++:.                           `-/+/</span>',
            '<span class="t-cyan t-bold">.`                                 `/</span>'
        ];

        const info = [
            `<span class="t-green t-bold">luxc</span><span class="t-white">@</span><span class="t-cyan t-bold">${sysInfo.hostname}</span>`,
            '<span class="t-gray">----------------------</span>',
            `<span class="t-yellow t-bold">OS:</span> <span class="t-white">Arch Linux x86_64 // Luxc Cyber Edition</span>`,
            `<span class="t-yellow t-bold">Host:</span> <span class="t-white">Luxc Quantum Mainframe v2.0</span>`,
            `<span class="t-yellow t-bold">Kernel:</span> <span class="t-white">${sysInfo.kernel}</span>`,
            `<span class="t-yellow t-bold">Uptime:</span> <span class="t-white">${sysInfo.uptime}</span>`,
            `<span class="t-yellow t-bold">Packages:</span> <span class="t-white">${sysInfo.packages}</span>`,
            `<span class="t-yellow t-bold">Shell:</span> <span class="t-white">bash 5.2.26</span>`,
            `<span class="t-yellow t-bold">Terminal:</span> <span class="t-white">luxc-web-pty</span>`,
            `<span class="t-yellow t-bold">Theme:</span> <span class="t-white">Matrix Phosphor Green [Custom]</span>`,
            `<span class="t-yellow t-bold">CPU:</span> <span class="t-white">Luxc Neural Processor (8) @ 4.800GHz</span>`,
            `<span class="t-yellow t-bold">Memory:</span> <span class="t-white">${sysInfo.memory}</span>`,
            '',
            '<span style="color:#000;background:#ff3355;">   </span><span style="color:#000;background:#00ff66;">   </span><span style="color:#000;background:#ffcc00;">   </span><span style="color:#000;background:#3399ff;">   </span><span style="color:#000;background:#ff55aa;">   </span><span style="color:#000;background:#00f0ff;">   </span><span style="color:#000;background:#ffffff;">   </span>'
        ];

        let output = '<div class="neofetch-grid"><div class="ascii-art">';
        output += logo.join('\n');
        output += '</div><div class="neofetch-info">';
        output += info.join('\n');
        output += '</div></div>';
        return output;
    }

    // Pacman Package Manager Simulator
    async pacman(args, term) {
        if (!args || args.length === 0) {
            return '<span class="t-red">error: no operation specified (use -h for help)</span>';
        }

        const flag = args[0];

        // pacman -Syu (Full Upgrade)
        if (flag === '-Syu' || flag === '-Syyu') {
            term.print('<span class="t-blue">::</span> Synchronizing package databases...');
            await term.sleep(400);
            term.print(' <span class="t-green">core</span>               134.2 KiB   450 KiB/s 00:00 [######################] 100%');
            await term.sleep(300);
            term.print(' <span class="t-green">extra</span>             1789.5 KiB  1.82 MiB/s 00:01 [######################] 100%');
            await term.sleep(300);
            term.print(' <span class="t-green">multilib</span>          142.1 KiB   890 KiB/s 00:00 [######################] 100%');
            await term.sleep(300);
            term.print(' <span class="t-green">luxc-hacker-repo</span>   84.6 KiB   500 KiB/s 00:00 [######################] 100%');
            await term.sleep(500);

            term.print('<span class="t-blue">::</span> Starting full system upgrade...');
            await term.sleep(400);
            term.print('<span class="t-bold">Packages (3)</span> linux-6.10.9-1  luxc-core-1.1.0-1  systemd-256.4-1\n');
            term.print('<span class="t-yellow">Total Download Size:</span>    124.50 MiB');
            term.print('<span class="t-yellow">Total Installed Size:</span>   410.80 MiB');
            term.print('<span class="t-yellow">Net Upgrade Size:</span>       +12.40 MiB\n');

            // Progress simulation
            term.print('<span class="t-blue">::</span> Retrieving packages...');
            for (let i = 1; i <= 10; i++) {
                await term.sleep(150);
                const pct = i * 10;
                const bars = '#'.repeat(Math.floor(pct / 5)) + '-'.repeat(20 - Math.floor(pct / 5));
                term.printTemp(` (3/3) downloading packages... [${bars}] ${pct}%`);
            }
            term.print('<span class="t-green">(3/3) downloading packages... [####################] 100%</span>');

            await term.sleep(300);
            term.print('<span class="t-blue">::</span> Checking keyring...');
            await term.sleep(200);
            term.print('<span class="t-blue">::</span> Checking package integrity...');
            await term.sleep(250);
            term.print('<span class="t-blue">::</span> Loading package files...');
            await term.sleep(300);
            term.print('<span class="t-blue">::</span> Upgrading system packages...');
            await term.sleep(400);
            term.print('<span class="t-green t-bold">(1/3) upgrading linux               [####################] 100%</span>');
            await term.sleep(300);
            term.print('<span class="t-green t-bold">(2/3) upgrading luxc-core           [####################] 100%</span>');
            await term.sleep(300);
            term.print('<span class="t-green t-bold">(3/3) upgrading systemd             [####################] 100%</span>');
            await term.sleep(300);
            term.print('<span class="t-blue">::</span> Running post-transaction hooks...');
            term.print('<span class="t-green">✔ System upgrade completed successfully! Luxc OS is up to date.</span>');
            return null;
        }

        // pacman -S <pkg>
        if (flag === '-S') {
            const pkgName = args[1];
            if (!pkgName) {
                return '<span class="t-red">error: no targets specified (use -h for help)</span>';
            }
            if (this.installedPackages.has(pkgName)) {
                return `<span class="t-yellow">warning: ${pkgName} is already installed -- reinstalling</span>`;
            }

            const repoItem = this.allRepoPackages[pkgName];
            const pkgDesc = repoItem ? repoItem.desc : `Hacker tool package for ${pkgName}`;
            const pkgSize = repoItem ? repoItem.size : '18.5 MB';

            term.print(`resolving dependencies...\nlooking for conflicting packages...\n`);
            term.print(`<span class="t-bold">Packages (1)</span> ${pkgName}-2.4.1-1\n`);
            term.print(`<span class="t-yellow">Total Download Size:</span>    ${pkgSize}`);
            term.print(`<span class="t-yellow">Total Installed Size:</span>   ${pkgSize}\n`);

            term.print(`<span class="t-blue">::</span> Proceed with installation? [Y/n] Y`);
            await term.sleep(300);
            term.print(`<span class="t-blue">::</span> Retrieving package ${pkgName}...`);
            
            for (let i = 1; i <= 10; i++) {
                await term.sleep(100);
                const pct = i * 10;
                const bars = '#'.repeat(Math.floor(pct / 5)) + '-'.repeat(20 - Math.floor(pct / 5));
                term.printTemp(` (${pkgName}) [${bars}] ${pct}%`);
            }
            term.print(`<span class="t-green">(${pkgName}) [####################] 100%</span>`);
            await term.sleep(200);
            term.print(`<span class="t-blue">::</span> Processing package changes...`);
            term.print(`<span class="t-green t-bold">(1/1) installing ${pkgName}         [####################] 100%</span>`);
            term.print(`<span class="t-blue">::</span> Running post-transaction hooks...`);
            term.print(`<span class="t-green">✔ ${pkgName} successfully installed! You can now run '${pkgName}'.</span>`);
            
            this.installedPackages.add(pkgName);
            window.vfs.writeFile(`/bin/${pkgName}`, `#!/bin/sh\n# Binary for ${pkgName}\n`, 'root');
            return null;
        }

        // pacman -Ss <query>
        if (flag === '-Ss') {
            const query = args[1] || '';
            let results = [];
            for (const [name, meta] of Object.entries(this.allRepoPackages)) {
                if (name.includes(query) || meta.desc.toLowerCase().includes(query.toLowerCase())) {
                    const status = this.installedPackages.has(name) ? '<span class="t-green">[installed]</span>' : '';
                    results.push(`<span class="t-cyan t-bold">extra/${name}</span> <span class="t-white">2.4.1-1</span> ${status}\n    ${meta.desc}`);
                }
            }
            if (results.length === 0) {
                return `<span class="t-yellow">No matching packages found in repos for '${query}'</span>`;
            }
            return results.join('\n');
        }

        // pacman -Q
        if (flag === '-Q') {
            let list = [];
            this.installedPackages.forEach(p => list.push(`<span class="t-cyan">${p}</span> <span class="t-white">latest-1</span>`));
            return list.join('\n');
        }

        return `<span class="t-yellow">pacman options: -Syu (Upgrade), -S &lt;pkg&gt; (Install), -Ss &lt;query&gt; (Search), -Q (List)</span>`;
    }

    // Nmap Port Scanner Simulator
    async nmap(args, term) {
        const target = args[0] || '127.0.0.1';
        term.print(`<span class="t-cyan">Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-06 23:20</span>`);
        term.print(`Initiating SYN Stealth Scan against <span class="t-yellow t-bold">${target}</span>`);
        
        await term.sleep(500);
        term.print(`Scanning ${target} [1000 ports]...`);
        for (let i = 1; i <= 5; i++) {
            await term.sleep(180);
            term.printTemp(`Scanning ${target} ... ${i * 20}% done`);
        }

        await term.sleep(300);
        return `
Nmap scan report for <span class="t-yellow t-bold">${target}</span>
Host is up (0.0021s latency).
Not shown: 994 closed tcp ports (reset)

<span class="t-bold">PORT     STATE SERVICE     VERSION</span>
<span class="t-green">22/tcp   open</span>  ssh         OpenSSH 9.8 (protocol 2.0)
<span class="t-green">80/tcp   open</span>  http        nginx/1.26.1
<span class="t-green">443/tcp  open</span>  https       nginx/1.26.1 (SSL: TLSv1.3)
<span class="t-green">3000/tcp open</span>  ppp         <span class="t-yellow t-bold">Luxc Hacker Web Terminal v1.0</span>
<span class="t-green">8080/tcp open</span>  http-proxy  Squid Proxy 5.9
<span class="t-green">9001/tcp open</span>  tor-orport  Tor Relay / Onion Gateway

MAC Address: 02:42:0A:00:00:01 (Luxc Virtual Interface)
Device type: general purpose
Running: Linux 6.X
OS CPE: cpe:/o:linux:linux_kernel:6.10
Network Distance: 1 hop

<span class="t-green">Nmap done: 1 IP address (1 host up) scanned in 1.45 seconds</span>`;
    }

    // Ping Simulator
    async ping(args, term) {
        const host = args[0];
        if (!host) {
            return '<span class="t-red">ping: usage error: Destination address required</span>';
        }

        term.print(`PING ${host} (${host}) 56(84) bytes of data.`);
        let count = 4;
        let times = [];

        for (let i = 1; i <= count; i++) {
            if (term.isInterrupted) break;
            await term.sleep(500);
            const rtt = (12 + Math.random() * 18).toFixed(2);
            times.push(parseFloat(rtt));
            term.print(`64 bytes from ${host}: icmp_seq=${i} ttl=64 time=${rtt} ms`);
        }

        if (times.length > 0) {
            const min = Math.min(...times).toFixed(2);
            const max = Math.max(...times).toFixed(2);
            const avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2);
            term.print(`\n--- ${host} ping statistics ---`);
            term.print(`${times.length} packets transmitted, ${times.length} received, 0% packet loss`);
            term.print(`rtt min/avg/max = ${min}/${avg}/${max} ms`);
        }
        return null;
    }

    // Bruteforce / Decrypt Cyber Mini Game
    async bruteforce(args, term) {
        const target = args[0] || 'MAINFRAME_ROOT_ACCESS';
        term.print(`<span class="t-red t-bold">[!] INITIALIZING BRUTEFORCE ENGINE ON: ${target}</span>`);
        term.print(`[+] Loading dictionary: /usr/share/wordlists/rockyou.txt (14,344,392 passwords)...`);
        await term.sleep(600);

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
        const passwordTarget = 'LUXC_ROOT_2026';
        let cracked = '';

        for (let charIndex = 0; charIndex < passwordTarget.length; charIndex++) {
            for (let attempt = 0; attempt < 8; attempt++) {
                if (term.isInterrupted) return '<span class="t-red">[-] Bruteforce aborted by user.</span>';
                await term.sleep(40);
                const randomChar = chars[Math.floor(Math.random() * chars.length)];
                term.printTemp(`[#] Cracking hash: <span class="t-green">${cracked}</span><span class="t-yellow">${randomChar}</span>... [Threads: 64 | 482,912 k/s]`);
            }
            cracked += passwordTarget[charIndex];
        }

        await term.sleep(300);
        return `
<span class="t-green t-bold">========================================================</span>
<span class="t-green t-bold">[+] KEY FOUND! TARGET PASSWORD CRACKED SUCCESSFULLY:</span>
<span class="t-yellow t-bold">    Password: ${passwordTarget}</span>
<span class="t-cyan t-bold">    Hash:     e99a18c428cb38d5f260853678922e03 (MD5)</span>
<span class="t-white t-bold">    Privilege: SYSTEM ADMINISTRATOR // ROOT GRANTED</span>
<span class="t-green t-bold">========================================================</span>`;
    }

    // Decrypt cipher visualizer
    async decrypt(args, term) {
        const cipherText = args.join(' ') || '536563726574204c7578632050617373776f7264';
        term.print(`[+] Analyzing encrypted string: <span class="t-yellow">${cipherText}</span>`);
        await term.sleep(400);
        term.print(`[+] Entropy detected: 4.82 bits/byte (High randomness)`);
        await term.sleep(400);

        const decoded = "Access Granted: Luxc Master Override Active";
        for (let i = 0; i < 15; i++) {
            if (term.isInterrupted) return null;
            await term.sleep(70);
            let scrambled = '';
            for (let j = 0; j < decoded.length; j++) {
                scrambled += String.fromCharCode(33 + Math.floor(Math.random() * 90));
            }
            term.printTemp(`[~] Mutating keys: <span class="t-cyan">${scrambled}</span>`);
        }

        await term.sleep(200);
        return `<span class="t-green t-bold">[✔] Decryption Finished:</span> "<span class="t-white">${decoded}</span>"`;
    }

    // Live curl / fetch
    async curl(args, term) {
        if (!args || args.length === 0) {
            return '<span class="t-red">curl: try \'curl --help\' for more information</span>';
        }
        const url = args[0];
        term.print(`Connecting to ${url}...`);

        try {
            const res = await fetch(`/api/curl?url=${encodeURIComponent(url)}`);
            if (!res.ok) {
                const errData = await res.json();
                return `<span class="t-red">curl: (7) ${errData.error || 'Failed to connect'}</span>`;
            }
            const data = await res.json();
            return `<span class="t-dim">&lt; HTTP/1.1 ${data.status} ${data.statusText}</span>\n\n${escapeHtml(data.data)}`;
        } catch (e) {
            return `<span class="t-red">curl: (6) Could not resolve host: ${url}</span>`;
        }
    }

    // IP Address Info
    async ip(args, term) {
        try {
            const res = await fetch('/api/info');
            if (res.ok) {
                const data = await res.json();
                let output = `<span class="t-bold">1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN</span>\n    inet <span class="t-yellow">127.0.0.1/8</span> scope host lo\n`;
                if (data.networkIPs && data.networkIPs.length > 0) {
                    data.networkIPs.forEach((net, idx) => {
                        output += `<span class="t-bold">${idx + 2}: ${net.interface}: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 state UP</span>\n    inet <span class="t-green t-bold">${net.address}/24</span> brd 192.168.1.255 scope global dynamic\n    access at: <span class="t-yellow t-bold">http://${net.address}:${data.port || 3000}</span>\n`;
                    });
                }
                if (data.clientIp) {
                    output += `\n<span class="t-cyan">Client Remote IP:</span> <span class="t-white">${data.clientIp}</span>`;
                }
                return output;
            }
        } catch (e) {}

        return `1: lo: <LOOPBACK,UP> inet 127.0.0.1/8\n2: eth0: <BROADCAST,MULTICAST,UP> inet 192.168.1.15/24`;
    }

    // Weather report
    async weather(args, term) {
        const city = args[0] || '';
        term.print(`Fetching weather data for ${city || 'current location'}...`);
        try {
            const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=3`);
            if (res.ok) {
                const text = await res.text();
                return `<span class="t-cyan t-bold">${text}</span>`;
            }
        } catch (e) {}
        return `<span class="t-cyan">⛅ Jakarta: 🌦 +29°C 💨 12km/h (Simulated)</span>`;
    }

    // Steam Locomotive Animation
    async sl(args, term) {
        const frames = [
            `
                 (  ) (@@) ( )  (@)  ()    @@    O     @     O     @
             (@@@)
         (    )
      (@@@@)
    (   )
   ====        ________                ___________
 _D _|  Configuration  [ 2026 ]       | LUXC ARCH |
| LUXC |_______ _____|_______|________|___________|
|___|__________[_____]_______|________|___________|
   /oo~~~oooo       oo          oo         oo
            `,
            `
                   (  ) (@@) ( )  (@)  ()    @@    O     @     O
               (@@@)
           (    )
        (@@@@)
      (   )
     ====        ________                ___________
   _D _|  Configuration  [ 2026 ]       | LUXC ARCH |
  | LUXC |_______ _____|_______|________|___________|
  |___|__________[_____]_______|________|___________|
     /oo~~~oooo       oo          oo         oo
            `
        ];

        for (let i = 0; i < 6; i++) {
            term.printTemp(`<span class="t-yellow">${frames[i % 2]}</span>`);
            await term.sleep(250);
        }
        return null;
    }

    // Cowsay
    cowsay(args) {
        const text = args.join(' ') || 'Luxc Arch Linux is the best!';
        const len = text.length;
        const top = ' ' + '_'.repeat(len + 2);
        const bot = ' ' + '-'.repeat(len + 2);
        return `
${top}
< ${text} >
${bot}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
    }

    // Fortune
    fortune() {
        const quotes = [
            "\"There is no spoon... only root access.\" - Anonymous",
            "\"An idiot admires complexity, a genius admires simplicity.\" - Terry Davis",
            "\"Talk is cheap. Show me the code.\" - Linus Torvalds",
            "\"If you think cryptography is the solution to your problem, then you don't understand your problem.\" - Peter G. Neumann",
            "\"I use Arch btw.\" - Luxc Hacker",
            "\"The quieter you become, the more you are able to hear.\" - Kali Motto"
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.commandRegistry = new CommandRegistry();
