// Virtual Linux Filesystem (VFS) for Luxc Terminal
class VirtualFileSystem {
    constructor() {
        this.currentPath = '/home/luxc';
        this.storageKey = 'luxc_arch_vfs';
        this.fs = this.load() || this.createDefaultFS();
    }

    createDefaultFS() {
        return {
            type: 'dir',
            permissions: 'drwxr-xr-x',
            owner: 'root',
            children: {
                bin: {
                    type: 'dir',
                    permissions: 'drwxr-xr-x',
                    owner: 'root',
                    children: {
                        bash: { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', content: '' },
                        ls: { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', content: '' },
                        cat: { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', content: '' },
                        pacman: { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', content: '' },
                        neofetch: { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', content: '' },
                        nano: { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', content: '' },
                        vim: { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', content: '' },
                        htop: { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', content: '' },
                        nmap: { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', content: '' },
                        cmatrix: { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', content: '' },
                        ping: { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', content: '' },
                        curl: { type: 'file', permissions: '-rwxr-xr-x', owner: 'root', content: '' }
                    }
                },
                etc: {
                    type: 'dir',
                    permissions: 'drwxr-xr-x',
                    owner: 'root',
                    children: {
                        hostname: { type: 'file', permissions: '-rw-r--r--', owner: 'root', content: 'luxc-arch\n' },
                        'os-release': {
                            type: 'file',
                            permissions: '-rw-r--r--',
                            owner: 'root',
                            content: 'NAME="Arch Linux (Luxc Edition)"\nPRETTY_NAME="Arch Linux // Luxc Kernel 6.10"\nID=arch\nBUILD_ID=rolling\nANSI_COLOR="38;2;23;147;209"\nHOME_URL="https://archlinux.org/"\n'
                        },
                        'pacman.conf': {
                            type: 'file',
                            permissions: '-rw-r--r--',
                            owner: 'root',
                            content: '[options]\nHoldPkg = pacman glibc\nArchitecture = auto\nColor\nILoveCandy\n\n[core]\nInclude = /etc/pacman.d/mirrorlist\n\n[extra]\nInclude = /etc/pacman.d/mirrorlist\n\n[multilib]\nInclude = /etc/pacman.d/mirrorlist\n\n[luxc-hacker-repo]\nSigLevel = Optional TrustAll\nServer = https://repo.luxc.sh/$arch\n'
                        },
                        motd: {
                            type: 'file',
                            permissions: '-rw-r--r--',
                            owner: 'root',
                            content: 'Welcome to Luxc Arch Linux Environment.\nAuthorized access only. All activities are monitored.\n'
                        }
                    }
                },
                home: {
                    type: 'dir',
                    permissions: 'drwxr-xr-x',
                    owner: 'root',
                    children: {
                        luxc: {
                            type: 'dir',
                            permissions: 'drwxr-xr-x',
                            owner: 'luxc',
                            children: {
                                'welcome.txt': {
                                    type: 'file',
                                    permissions: '-rw-r--r--',
                                    owner: 'luxc',
                                    content: `=====================================================
  LUXC ARCH LINUX // HACKER WEB TERMINAL
=====================================================
Selamat datang di Luxc Terminal! Terminal ini dirancang
dengan estetika Retro Hacker Green & fitur lengkap Arch Linux.

Tips Cepat:
- Ketik 'help' untuk melihat daftar seluruh perintah.
- Ketik 'neofetch' untuk info sistem & ASCII art.
- Ketik 'pacman -Syu' untuk simulasi update paket Arch.
- Ketik 'cmatrix' untuk masuk mode Matrix Rain fullscreen.
- Ketik 'nano namafile.txt' untuk membuka editor teks.
- Ketik 'nmap 192.168.1.1' untuk simulasi port scanner.
- Ketik 'theme' untuk mengganti warna terminal (cyan, amber, red, dll).
- Ketik 'audio' untuk menyalakan/mematikan efek suara mechanical keyboard.
- Gunakan tombol TAB untuk autocomplete & panah ATAS/BAWAH untuk history.
=====================================================`
                                },
                                'hacker_manifesto.txt': {
                                    type: 'file',
                                    permissions: '-rw-r--r--',
                                    owner: 'luxc',
                                    content: `The Conscience of a Hacker (The Hacker Manifesto)
by The Mentor - January 8, 1986

"This is our world now... the world of the electron and the switch,
the beauty of the baud. We make use of a service already existing
without paying for what could be dirt-cheap if it wasn't run by
profiteering gluttons, and you call us criminals.
We explore... and you call us criminals.
We seek after knowledge... and you call us criminals.
We exist without skin color, without nationality, without religious bias...
and you call us criminals.
You build atomic bombs, you wage wars, you murder, cheat, and lie to us
and try to make us believe it's for our own good, yet we're the criminals.

Yes, I am a criminal. My crime is that of curiosity.
My crime is that of judging people by what they say and think,
not what they look like.
My crime is that of outsmarting you, something that you will never forgive me for.

I am a hacker, and this is my manifesto.
You may stop this individual, but you can't stop us all...
after all, we're all alike."`
                                },
                                'targets.txt': {
                                    type: 'file',
                                    permissions: '-rw-r--r--',
                                    owner: 'luxc',
                                    content: `127.0.0.1 - Localhost Node\n192.168.1.1 - Gateway Router\n10.0.0.15 - Cyber Security Server\nmainframe.luxc.net - High Priority Target\n`
                                },
                                '.bashrc': {
                                    type: 'file',
                                    permissions: '-rw-r--r--',
                                    owner: 'luxc',
                                    content: `alias ls='ls --color=auto'\nalias ll='ls -la'\nalias grep='grep --color=auto'\nPS1='\\[\\e[32m\\]\\u\\[\\e[0m\\]@\\[\\e[36m\\]\\h\\[\\e[0m\\]:\\[\\e[33m\\]\\w\\[\\e[0m\\]\\$ '\n`
                                },
                                projects: {
                                    type: 'dir',
                                    permissions: 'drwxr-xr-x',
                                    owner: 'luxc',
                                    children: {
                                        'payload.py': {
                                            type: 'file',
                                            permissions: '-rwxr-xr-x',
                                            owner: 'luxc',
                                            content: `#!/usr/bin/env python3\n# Luxc Exploit Payload Generator\nimport sys\n\ndef execute():\n    print("[+] Infiltrating mainframe...")\n    print("[+] Luxc Root Access: GRANTED")\n\nif __name__ == "__main__":\n    execute()\n`
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                var: {
                    type: 'dir',
                    permissions: 'drwxr-xr-x',
                    owner: 'root',
                    children: {
                        log: {
                            type: 'dir',
                            permissions: 'drwxr-xr-x',
                            owner: 'root',
                            children: {
                                'pacman.log': {
                                    type: 'file',
                                    permissions: '-rw-r--r--',
                                    owner: 'root',
                                    content: '[2026-09-06T23:00:00+0700] [PACMAN] Running \'pacman -Syu\'\n[2026-09-06T23:00:05+0700] [ALPM] upgraded linux (6.9.8.arch1-1 -> 6.10.9.arch1-1)\n[2026-09-06T23:00:08+0700] [ALPM] installed luxc-core-tools (1.0.0-1)\n'
                                },
                                'auth.log': {
                                    type: 'file',
                                    permissions: '-rw-r-----',
                                    owner: 'root',
                                    content: 'Sep 06 23:10:00 luxc-arch sshd[1042]: Accepted publickey for luxc from 192.168.1.100 port 52341\n'
                                }
                            }
                        }
                    }
                },
                tmp: {
                    type: 'dir',
                    permissions: 'drwxrwxrwt',
                    owner: 'root',
                    children: {}
                },
                root: {
                    type: 'dir',
                    permissions: 'drwx------',
                    owner: 'root',
                    children: {
                        'flag.txt': {
                            type: 'file',
                            permissions: '-rw-------',
                            owner: 'root',
                            content: 'LUXC{4RCH_L1NUX_H4CK3R_M45T3R_2026}\n'
                        }
                    }
                }
            }
        };
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.fs));
        } catch (e) {
            console.error('Failed to save VFS to localStorage', e);
        }
    }

    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    reset() {
        this.fs = this.createDefaultFS();
        this.currentPath = '/home/luxc';
        this.save();
    }

    // Resolves a relative or absolute path to a clean absolute path
    resolvePath(targetPath) {
        if (!targetPath || targetPath === '.') return this.currentPath;
        if (targetPath === '~') return '/home/luxc';
        if (targetPath.startsWith('~/')) {
            targetPath = '/home/luxc/' + targetPath.substring(2);
        }

        let absoluteParts = [];
        if (targetPath.startsWith('/')) {
            absoluteParts = targetPath.split('/').filter(Boolean);
        } else {
            absoluteParts = this.currentPath.split('/').filter(Boolean).concat(targetPath.split('/').filter(Boolean));
        }

        const resolved = [];
        for (const part of absoluteParts) {
            if (part === '..') {
                if (resolved.length > 0) resolved.pop();
            } else if (part !== '.') {
                resolved.push(part);
            }
        }

        return '/' + resolved.join('/');
    }

    // Navigates and returns the node (file or dir) object at the path
    getNode(path) {
        const absPath = this.resolvePath(path);
        if (absPath === '/') return this.fs;

        const parts = absPath.split('/').filter(Boolean);
        let current = this.fs;

        for (const part of parts) {
            if (!current || current.type !== 'dir' || !current.children) return null;
            current = current.children[part];
            if (!current) return null;
        }
        return current;
    }

    // Get parent node and base name
    getParentAndName(path) {
        const absPath = this.resolvePath(path);
        const parts = absPath.split('/').filter(Boolean);
        if (parts.length === 0) return { parent: null, name: '' };
        
        const name = parts.pop();
        const parentPath = '/' + parts.join('/');
        const parent = this.getNode(parentPath);
        return { parent, name, parentPath };
    }

    // Change directory
    cd(path) {
        if (!path || path === '~') {
            this.currentPath = '/home/luxc';
            return { success: true, path: this.currentPath };
        }
        const target = this.resolvePath(path);
        const node = this.getNode(target);
        if (!node) {
            return { success: false, error: `cd: no such file or directory: ${path}` };
        }
        if (node.type !== 'dir') {
            return { success: false, error: `cd: not a directory: ${path}` };
        }
        this.currentPath = target;
        return { success: true, path: this.currentPath };
    }

    // List directory contents
    ls(path = '.', showHidden = false, detailed = false) {
        const target = this.resolvePath(path);
        const node = this.getNode(target);
        if (!node) {
            return { success: false, error: `ls: cannot access '${path}': No such file or directory` };
        }
        if (node.type === 'file') {
            return {
                success: true,
                items: [{
                    name: target.split('/').pop(),
                    type: 'file',
                    size: node.content.length,
                    owner: node.owner,
                    permissions: node.permissions
                }]
            };
        }

        const items = [];
        for (const [name, item] of Object.entries(node.children || {})) {
            if (!showHidden && name.startsWith('.')) continue;
            items.push({
                name,
                type: item.type,
                size: item.type === 'file' ? (item.content || '').length : 4096,
                owner: item.owner || 'luxc',
                permissions: item.permissions || (item.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--')
            });
        }
        return { success: true, items };
    }

    // Read file
    readFile(path) {
        const node = this.getNode(path);
        if (!node) {
            return { success: false, error: `cat: ${path}: No such file or directory` };
        }
        if (node.type === 'dir') {
            return { success: false, error: `cat: ${path}: Is a directory` };
        }
        return { success: true, content: node.content || '' };
    }

    // Create or overwrite file
    writeFile(path, content = '', owner = 'luxc') {
        const { parent, name } = this.getParentAndName(path);
        if (!parent || parent.type !== 'dir') {
            return { success: false, error: `cannot create file '${path}': No such file or directory` };
        }
        if (!parent.children) parent.children = {};

        parent.children[name] = {
            type: 'file',
            permissions: '-rw-r--r--',
            owner: owner,
            content: content
        };
        this.save();
        return { success: true };
    }

    // Create directory
    mkdir(path) {
        const { parent, name } = this.getParentAndName(path);
        if (!parent || parent.type !== 'dir') {
            return { success: false, error: `mkdir: cannot create directory '${path}': No such file or directory` };
        }
        if (!parent.children) parent.children = {};
        if (parent.children[name]) {
            return { success: false, error: `mkdir: cannot create directory '${path}': File exists` };
        }

        parent.children[name] = {
            type: 'dir',
            permissions: 'drwxr-xr-x',
            owner: 'luxc',
            children: {}
        };
        this.save();
        return { success: true };
    }

    // Remove file or directory
    rm(path, recursive = false) {
        const { parent, name } = this.getParentAndName(path);
        if (!parent || !parent.children || !parent.children[name]) {
            return { success: false, error: `rm: cannot remove '${path}': No such file or directory` };
        }
        const target = parent.children[name];
        if (target.type === 'dir' && !recursive) {
            return { success: false, error: `rm: cannot remove '${path}': Is a directory (use -r)` };
        }
        delete parent.children[name];
        this.save();
        return { success: true };
    }

    // Autocomplete helper for filenames and directories
    getCompletions(partialPath) {
        let searchDir = '.';
        let prefix = partialPath;
        if (partialPath.includes('/')) {
            const lastSlash = partialPath.lastIndexOf('/');
            searchDir = partialPath.substring(0, lastSlash) || '/';
            prefix = partialPath.substring(lastSlash + 1);
        }

        const node = this.getNode(searchDir);
        if (!node || node.type !== 'dir' || !node.children) return [];

        const matches = [];
        for (const name of Object.keys(node.children)) {
            if (name.startsWith(prefix)) {
                const isDir = node.children[name].type === 'dir';
                matches.push(name + (isDir ? '/' : ''));
            }
        }
        return matches;
    }
}

window.vfs = new VirtualFileSystem();
