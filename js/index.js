// index.js

// Import both the default init function (WASM initialization) and named exports
import init, { init_app, start, WebMarkdownParser } from '../pkg/app.js';

export { WebMarkdownParser };

// Setup copy buttons and dark mode toggle after DOM is ready
function setupMarkdownFeatures() {
    // Setup copy buttons for code blocks
    document.addEventListener('click', async (e) => {
        const copyBtn = e.target.closest('.copy-code-btn');
        if (copyBtn) {
            const codeBlock = copyBtn.closest('.code-block');
            if (codeBlock) {
                const code = codeBlock.querySelector('code');
                if (code) {
                    try {
                        await navigator.clipboard.writeText(code.textContent);
                        copyBtn.classList.add('copied');
                        copyBtn.querySelector('.copy-text').textContent = 'Copied!';
                        
                        setTimeout(() => {
                            copyBtn.classList.remove('copied');
                            copyBtn.querySelector('.copy-text').textContent = 'Copy';
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy:', err);
                    }
                }
            }
        }
    });

    // Setup dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('dark-mode', isDark ? 'enabled' : 'disabled');
        });
    }

    // Restore dark mode preference
    const darkModePreference = localStorage.getItem('dark-mode');
    if (darkModePreference === 'enabled' || 
        (darkModePreference === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('dark-mode') === null) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });
}

async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    try {
        const swUrl = new URL('../sw.js', import.meta.url);
        await navigator.serviceWorker.register(swUrl, { scope: './' });
        console.log('Service worker terdaftar:', swUrl.toString());
    } catch (error) {
        console.warn('Gagal mendaftarkan service worker:', error);
    }
}

export async function run() {
    try {
        console.log('Memulai aplikasi Chat...');
        
        // 1. Tunggu sampai DOM sepenuhnya dimuat
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        console.log('DOM siap, memuat WASM...');

        // Daftarkan service worker untuk offline fallback
        registerServiceWorker();
        
        // 2. Initialize WASM first - this is REQUIRED before calling any other WASM functions
        console.log('Menginisialisasi WASM...');
        await init();
        console.log('WASM berhasil diinisialisasi');
        
        // 3. Setup markdown features (copy buttons, dark mode)
        setupMarkdownFeatures();
        
        // 4. Now call init_app - WASM is ready to use
        console.log('Memanggil init_app...');
        const app = init_app();
        console.log('Aplikasi dibuat:', app);
        
        // Simpan di global untuk debugging
        window.chatApp = app;
        
        // 5. Hide loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        
        return app;
        
    } catch (error) {
        console.error('Error saat menjalankan aplikasi:', error);
        
        // Tampilkan pesan error yang user-friendly
        showError(error.message);
        throw error;
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 10000;
        max-width: 400px;
    `;
    
    errorDiv.innerHTML = `
        <h4 style="margin: 0 0 10px 0;">Error Memuat Aplikasi</h4>
        <p style="margin: 0 0 10px 0;">${message}</p>
        <button onclick="location.reload()" style="
            background: white;
            color: #f44336;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        ">Coba Lagi</button>
    `;
    
    document.body.appendChild(errorDiv);
}

// Jalankan aplikasi ketika file di-load
console.log('index.js dimuat, menjalankan aplikasi...');
run().catch(console.error);
