"use strict";

const body = document.body;
const themePill = document.getElementById('themePill');
const modeOpts = document.querySelectorAll('[data-mode-opt]');

// --- Theme data ---
const themes = {
    tierra: {
        light: {
            label: 'Tierra Cálida', sub: 'Terracota · Crema',
            swatches: [{ c: '#faf5ee', b: 'rgba(0,0,0,0.1)' }, { c: '#c8956a', b: 'transparent' }, { c: '#3d2b1a', b: 'transparent' }],
            strip: ['#faf5ee', '#e8d5c0', '#c8956a', '#9b6040', '#3d2b1a']
        },
        dark: {
            label: 'Espresso', sub: 'Café · Dorado',
            swatches: [{ c: '#1c1008', b: 'rgba(255,255,255,0.1)' }, { c: '#b87843', b: 'transparent' }, { c: '#f0e0c8', b: 'rgba(0,0,0,0.1)' }],
            strip: ['#1c1008', '#3d2510', '#b87843', '#d4a870', '#f0e0c8']
        }
    },
    arena: {
        light: {
            label: 'Arena & Toffee', sub: 'Toffee · Arena',
            swatches: [{ c: '#fdf8f2', b: 'rgba(0,0,0,0.08)' }, { c: '#d4956a', b: 'transparent' }, { c: '#2e1f12', b: 'transparent' }],
            strip: ['#fdf8f2', '#ebd8c4', '#d4956a', '#8b5e3c', '#2e1f12']
        },
        dark: {
            label: 'Nogal Profundo', sub: 'Nogal · Ámbar',
            swatches: [{ c: '#13100d', b: 'rgba(255,255,255,0.1)' }, { c: '#a87d55', b: 'transparent' }, { c: '#e8d9c4', b: 'rgba(0,0,0,0.1)' }],
            strip: ['#13100d', '#2a1f15', '#a87d55', '#d4a870', '#e8d9c4']
        }
    },
    canela: {
        light: {
            label: 'Canela & Crema', sub: 'Canela · Vainilla',
            swatches: [{ c: '#fffbf5', b: 'rgba(0,0,0,0.08)' }, { c: '#e8a87c', b: 'transparent' }, { c: '#3a2415', b: 'transparent' }],
            strip: ['#fffbf5', '#f5e0c8', '#e8a87c', '#b06a3a', '#3a2415']
        },
        dark: {
            label: 'Carbón & Ámbar', sub: 'Carbón · Ámbar',
            swatches: [{ c: '#0f0d0b', b: 'rgba(255,255,255,0.1)' }, { c: '#e8a030', b: 'transparent' }, { c: '#f5e6cc', b: 'rgba(0,0,0,0.1)' }],
            strip: ['#0f0d0b', '#252015', '#e8a030', '#d4881a', '#f5e6cc']
        }
    }
};

let currentPalette = 'arena';
let currentMode = 'light';

// --- Apply theme ---
function applyTheme(palette, mode) {
    currentPalette = palette;
    currentMode = mode;

    body.setAttribute('data-palette', palette);
    body.setAttribute('data-mode', mode);

    const t = themes[palette][mode];

    // Footer pill
    themePill.textContent = `${t.label} · ${mode === 'light' ? 'Light' : 'Dark'}`;

    // Persist
    try { localStorage.setItem('ln_theme', JSON.stringify({ palette, mode })); } catch (_) { }
}

// --- Waitlist multi-step ---
const wlStep1 = document.getElementById('wlStep1');
const wlStep2 = document.getElementById('wlStep2');
const wlSuccess = document.getElementById('wlSuccess');
const wlEmail = document.getElementById('wlEmail');
const wlNext = document.getElementById('wlNext');
const wlBack = document.getElementById('wlBack');
const wlSubmit = document.getElementById('wlSubmit');
const wlHint1 = document.getElementById('wlHint1');
const wlHint2 = document.getElementById('wlHint2');
const wlOpts = document.querySelectorAll('.wl-theme-opt');
const wlModeBtns = document.querySelectorAll('[data-wl-mode]');

let wlPickedPalette = null;
let wlPickedMode = 'light';

// theme data for the inline picker (same strips as main)
const wlThemeData = {
    tierra: {
        light: { name: 'Tierra Cálida', sub: 'Terracota · Crema', strip: ['#faf5ee', '#e8d5c0', '#c8956a', '#9b6040', '#3d2b1a'] },
        dark: { name: 'Espresso', sub: 'Café · Dorado', strip: ['#1c1008', '#3d2510', '#b87843', '#d4a870', '#f0e0c8'] }
    },
    arena: {
        light: { name: 'Arena & Toffee', sub: 'Toffee · Arena', strip: ['#fdf8f2', '#ebd8c4', '#d4956a', '#8b5e3c', '#2e1f12'] },
        dark: { name: 'Nogal Profundo', sub: 'Nogal · Ámbar', strip: ['#13100d', '#2a1f15', '#a87d55', '#d4a870', '#e8d9c4'] }
    },
    canela: {
        light: { name: 'Canela & Crema', sub: 'Canela · Vainilla', strip: ['#fffbf5', '#f5e0c8', '#e8a87c', '#b06a3a', '#3a2415'] },
        dark: { name: 'Carbón & Ámbar', sub: 'Carbón · Ámbar', strip: ['#0f0d0b', '#252015', '#e8a030', '#d4881a', '#f5e6cc'] }
    }
};

function refreshWlStrips(mode) {
    ['tierra', 'arena', 'canela'].forEach(pal => {
        const t = wlThemeData[pal][mode];
        document.getElementById('wls-' + pal).innerHTML = t.strip.map(c => `<span style="background:${c}"></span>`).join('');
        document.getElementById('wln-' + pal).childNodes[0].textContent = t.name;
        document.getElementById('wlsub-' + pal).textContent = t.sub;
    });
}

// Step 1 → 2
wlNext.addEventListener('click', () => {
    const val = wlEmail.value.trim();
    if (!val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        wlHint1.classList.add('show');
        wlEmail.focus();
        return;
    }
    wlHint1.classList.remove('show');
    wlStep1.classList.remove('active');
    wlStep2.classList.add('active');
    // pre-select + preview current page theme
    wlPickedMode = currentMode;
    wlModeBtns.forEach(b => b.classList.toggle('active', b.dataset.wlMode === wlPickedMode));
    refreshWlStrips(wlPickedMode);
    const preCard = document.querySelector(`[data-wl-pick="${currentPalette}"]`);
    if (preCard) preCard.click();
});
wlEmail.addEventListener('keydown', e => { if (e.key === 'Enter') wlNext.click(); });

// Step 2 ← back
wlBack.addEventListener('click', () => {
    wlStep2.classList.remove('active');
    wlStep1.classList.add('active');
    wlHint2.classList.remove('show');
});

// Mode toggle inside widget
wlModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        wlPickedMode = btn.dataset.wlMode;
        wlModeBtns.forEach(b => b.classList.toggle('active', b === btn));
        refreshWlStrips(wlPickedMode);
        if (wlPickedPalette) {
            wlOpts.forEach(o => o.classList.toggle('wl-selected', o.dataset.wlPick === wlPickedPalette));
            applyTheme(wlPickedPalette, wlPickedMode);
        }
    });
});

// Theme option selection
wlOpts.forEach(opt => {
    opt.addEventListener('click', () => {
        wlPickedPalette = opt.dataset.wlPick;
        wlOpts.forEach(o => o.classList.toggle('wl-selected', o === opt));
        wlSubmit.disabled = false;
        wlHint2.classList.remove('show');
        // Live-preview on the page
        applyTheme(wlPickedPalette, wlPickedMode);
    });
});

// Submit
wlSubmit.addEventListener('click', () => {
    if (!wlPickedPalette) { wlHint2.classList.add('show'); return; }

    const t = wlThemeData[wlPickedPalette][wlPickedMode];
    const email = wlEmail.value.trim();
    const label = `${t.name} · ${wlPickedMode === 'light' ? 'Light' : 'Dark'}`;

    // Persist signup data
    try {
        localStorage.setItem('ln_signup', JSON.stringify({ email, palette: wlPickedPalette, mode: wlPickedMode }));
    } catch (_) { }

    // Show success
    wlStep2.classList.remove('active');
    wlSuccess.classList.add('active');
    document.getElementById('wlConfirmEmail').textContent = email;
    document.getElementById('wlConfirmTheme').textContent = label;
    document.getElementById('wlMiniSwatches').innerHTML =
        t.strip.slice(0, 3).map(c => `<div class="ms" style="background:${c}"></div>`).join('');
});

// --- Scroll reveal ---
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.feature-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = `opacity 0.5s ${i * 0.08}s ease, transform 0.5s ${i * 0.08}s ease, background 0.5s, border-color 0.5s, box-shadow 0.25s`;
    observer.observe(el);
});

// --- Restore saved ---
try {
    const saved = JSON.parse(localStorage.getItem('ln_theme'));
    if (saved && themes[saved.palette]?.[saved.mode]) {
        applyTheme(saved.palette, saved.mode);
    }
} catch (_) { }