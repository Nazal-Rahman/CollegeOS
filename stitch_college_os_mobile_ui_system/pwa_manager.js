// =============================================================================
// College OS Progressive Web App (PWA) Controller
// Enables Standalone Native App Mode, Fullscreen & 1-Click Install
// =============================================================================

let deferredInstallPrompt = null;

// 1. Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('[PWA] Service Worker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration note:', err);
      });
  });
}

// 2. Fullscreen Toggle Helper (Removes all browser bars, tabs, and URL fields)
export function toggleNativeFullscreen() {
  if (!document.fullscreenElement) {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => console.warn(err));
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

// Check if currently running inside standalone / native app mode
export function isStandaloneApp() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://');
}

// 3. Mount Native Android PWA Header Controls
function mountPwaControls() {
  // If already running as standalone native app, do not clutter header
  const isInstalled = isStandaloneApp();
  
  // Find top header action container
  const headerRight = document.querySelector('header .flex-shrink-0, header .gap-space-xs');
  if (!headerRight || document.getElementById('pwaControlPillGroup')) return;

  const controlGroup = document.createElement('div');
  controlGroup.id = 'pwaControlPillGroup';
  controlGroup.className = 'flex items-center gap-1.5';

  // Fullscreen Button (Works anytime in browser)
  const fsBtn = document.createElement('button');
  fsBtn.id = 'pwaFullscreenToggleBtn';
  fsBtn.title = 'Full-Screen Android App Mode (Hides browser tabs & address bar)';
  fsBtn.className = 'h-8 px-2 rounded-full bg-surface-container-high/80 hover:bg-primary-fixed hover:text-primary text-on-surface-variant text-[11px] font-label-md font-bold flex items-center gap-1 transition-all active:scale-95 shadow-2xs';
  fsBtn.innerHTML = `
    <span class="material-symbols-outlined text-[16px]">fullscreen</span>
    <span class="hidden sm:inline">App View</span>
  `;
  fsBtn.addEventListener('click', toggleNativeFullscreen);
  controlGroup.appendChild(fsBtn);

  // Install App Button (Shown if not yet installed in standalone mode)
  if (!isInstalled) {
    const installBtn = document.createElement('button');
    installBtn.id = 'pwaInstallAppBtn';
    installBtn.title = 'Install as Android Application';
    installBtn.className = 'h-8 px-2.5 rounded-full bg-primary text-on-primary text-[11px] font-label-md font-bold flex items-center gap-1 transition-all shadow-xs active:scale-95 hover:bg-primary-container';
    installBtn.innerHTML = `
      <span class="material-symbols-outlined text-[16px]">install_mobile</span>
      <span>Install App</span>
    `;

    installBtn.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const choiceResult = await deferredInstallPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] User accepted the Android install prompt');
          installBtn.remove();
        }
        deferredInstallPrompt = null;
      } else {
        // Fallback: If browser already has native banner or prompt unavailable, show guidance
        toggleNativeFullscreen();
        alert('To install College OS on Android:\n1. Tap your browser menu (⋮)\n2. Tap "Install App" or "Add to Home screen"\n\nNow running in Fullscreen Native App view!');
      }
    });

    controlGroup.appendChild(installBtn);
  }

  // Insert before profile avatar or at the beginning of actions
  headerRight.prepend(controlGroup);

  // Update fullscreen button icon on change
  document.addEventListener('fullscreenchange', () => {
    const fsIcon = fsBtn.querySelector('.material-symbols-outlined');
    if (fsIcon) {
      fsIcon.textContent = document.fullscreenElement ? 'fullscreen_exit' : 'fullscreen';
    }
  });
}

// 4. Capture beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  console.log('[PWA] beforeinstallprompt captured, ready for 1-click install');
  const installBtn = document.getElementById('pwaInstallAppBtn');
  if (installBtn) {
    installBtn.classList.remove('hidden');
    installBtn.classList.add('flex');
  }
});

window.addEventListener('appinstalled', () => {
  console.log('[PWA] College OS installed as native application');
  const installBtn = document.getElementById('pwaInstallAppBtn');
  if (installBtn) installBtn.remove();
  deferredInstallPrompt = null;
});

// 5. Direct Install Trigger helper
export async function promptInstallApp() {
  if (deferredInstallPrompt) {
    try {
      deferredInstallPrompt.prompt();
      const choiceResult = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      return choiceResult.outcome === 'accepted';
    } catch (e) {
      console.warn('[PWA] Prompt error:', e);
    }
  }
  return false;
}

document.addEventListener('DOMContentLoaded', mountPwaControls);
setTimeout(mountPwaControls, 500);

window.PwaManager = {
  toggleNativeFullscreen,
  isStandaloneApp,
  promptInstallApp
};
