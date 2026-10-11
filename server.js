const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load .env variables if present
const ENV_PATH = path.join(__dirname, '.env');
if (fs.existsSync(ENV_PATH)) {
  const envContent = fs.readFileSync(ENV_PATH, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const PORT = parseInt(process.env.PORT || '3000', 10);
const ALT_PORT = PORT + 1; // 3001 as pristine alternate port
const BASE_DIR = __dirname;
const STITCH_DIR = path.join(BASE_DIR, 'stitch_college_os_mobile_ui_system');
const DATA_DIR = path.join(BASE_DIR, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Cloudinary Credentials provided by student
const CLOUDINARY_CONFIG = {
  apiKey: process.env.CLOUDINARY_API_KEY || "168317929439692",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "-UAA-eQTMujo2MvCz4fyhTktOi4",
  keyName: process.env.CLOUDINARY_KEY_NAME || "Root",
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || "gth8uxhh"
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

// HTML injection tag for PWA standalone Android integration
const PWA_HEAD_TAGS = `
  <!-- PWA Standalone & Android Fullscreen Headers -->
  <link rel="manifest" href="/manifest.json"/>
  <meta name="mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
  <meta name="apple-mobile-web-app-title" content="College OS"/>
  <meta name="application-name" content="College OS"/>
  <link rel="icon" type="image/png" href="/logo.png"/>
  <link rel="apple-touch-icon" href="/logo.png"/>
  <script type="module" src="/pwa_manager.js"></script>
`;

function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        resolve({});
      }
    });
  });
}

async function requestHandler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  let rawPath = decodeURI(req.url.split('?')[0]);
  let reqPath = rawPath.toLowerCase();

  // ==========================================
  // 1. CLOUDINARY BACKEND API ENDPOINTS
  // ==========================================
  if (reqPath === '/api/cloudinary/create-folder' && req.method === 'POST') {
    const payload = await parseJsonBody(req);
    const userId = payload.userId || 'guest';
    const folder = payload.folder || `users/${userId}/vault`;

    const userVaultDir = path.join(DATA_DIR, 'vault', userId);
    if (!fs.existsSync(userVaultDir)) {
      fs.mkdirSync(userVaultDir, { recursive: true });
    }

    console.log(`[Cloudinary API] Initialized private user folder: ${folder}`);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      folder,
      userId,
      cloudName: CLOUDINARY_CONFIG.cloudName,
      message: `Private Cloudinary folder ${folder} active`
    }));
    return;
  }

  if (reqPath === '/api/cloudinary/upload' && req.method === 'POST') {
    const payload = await parseJsonBody(req);
    const userId = payload.userId || 'guest';
    const folder = payload.folder || `users/${userId}/vault`;
    const fileName = payload.fileName || `file_${Date.now()}`;
    const dataUrl = payload.dataUrl || '';

    const userVaultDir = path.join(DATA_DIR, 'vault', userId);
    if (!fs.existsSync(userVaultDir)) {
      fs.mkdirSync(userVaultDir, { recursive: true });
    }

    // 1. Persist file locally in user's isolated storage
    if (dataUrl && dataUrl.includes(',')) {
      try {
        const base64Data = dataUrl.split(',')[1];
        const safeName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
        fs.writeFileSync(path.join(userVaultDir, safeName), Buffer.from(base64Data, 'base64'));
      } catch (err) {
        console.warn('[Cloudinary Storage] local write warning:', err);
      }
    }

    // 2. Perform live signed upload to Cloudinary REST API
    let cloudResult = null;
    if (dataUrl && CLOUDINARY_CONFIG.cloudName && CLOUDINARY_CONFIG.apiKey && CLOUDINARY_CONFIG.apiSecret) {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const toSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
        const signature = crypto.createHash('sha1').update(toSign).digest('hex');

        const form = new URLSearchParams();
        form.append('file', dataUrl);
        form.append('timestamp', String(timestamp));
        form.append('folder', folder);
        form.append('api_key', CLOUDINARY_CONFIG.apiKey);
        form.append('signature', signature);

        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`, {
          method: 'POST',
          body: form
        });
        const json = await cloudRes.json();
        if (json && (json.secure_url || json.url)) {
          cloudResult = json;
          console.log(`[Cloudinary Live] Uploaded "${fileName}" -> ${cloudResult.secure_url}`);
        } else {
          console.warn('[Cloudinary API] Response warning:', json);
        }
      } catch (cloudErr) {
        console.warn('[Cloudinary API] Network error, local fallback used:', cloudErr.message);
      }
    }

    const finalSecureUrl = (cloudResult && cloudResult.secure_url) ? cloudResult.secure_url : dataUrl;
    const finalPublicId = (cloudResult && cloudResult.public_id) ? cloudResult.public_id : `${folder}/${Date.now()}`;

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      secure_url: finalSecureUrl,
      public_id: finalPublicId,
      folder,
      fileName,
      userId,
      cloudName: CLOUDINARY_CONFIG.cloudName,
      bytes: cloudResult ? cloudResult.bytes : undefined,
      format: cloudResult ? cloudResult.format : undefined
    }));
    return;
  }

  // ==========================================
  // 2. PWA SERVICE WORKER & MANIFEST SERVING
  // ==========================================
  if (reqPath === '/manifest.json' || reqPath === '/site.webmanifest') {
    const manifestPath = path.join(BASE_DIR, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
      res.statusCode = 200;
      res.end(fs.readFileSync(manifestPath));
      return;
    }
  }

  if (reqPath === '/sw.js') {
    const swPath = path.join(BASE_DIR, 'sw.js');
    if (fs.existsSync(swPath)) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Service-Worker-Allowed', '/');
      res.statusCode = 200;
      res.end(fs.readFileSync(swPath));
      return;
    }
  }

  if (reqPath === '/pwa_manager.js') {
    const pwaPath = path.join(STITCH_DIR, 'pwa_manager.js');
    if (fs.existsSync(pwaPath)) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.statusCode = 200;
      res.end(fs.readFileSync(pwaPath));
      return;
    }
  }

  if (reqPath === '/logo.png') {
    const logoPath = path.join(BASE_DIR, 'logo.png');
    if (fs.existsSync(logoPath)) {
      res.setHeader('Content-Type', 'image/png');
      res.statusCode = 200;
      res.end(fs.readFileSync(logoPath));
      return;
    }
  }

  if (reqPath === '/icon.svg') {
    const svgPath = path.join(STITCH_DIR, 'icon.svg');
    if (fs.existsSync(svgPath)) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.statusCode = 200;
      res.end(fs.readFileSync(svgPath));
      return;
    }
  }

  if (reqPath === '/icon-192.png') {
    const p192 = path.join(BASE_DIR, 'icon-192.png');
    if (fs.existsSync(p192)) {
      res.setHeader('Content-Type', 'image/png');
      res.statusCode = 200;
      res.end(fs.readFileSync(p192));
      return;
    }
  }

  if (reqPath === '/icon-512.png') {
    const p512 = path.join(BASE_DIR, 'icon-512.png');
    if (fs.existsSync(p512)) {
      res.setHeader('Content-Type', 'image/png');
      res.statusCode = 200;
      res.end(fs.readFileSync(p512));
      return;
    }
  }

  // ==========================================
  // 3. APPLICATION PAGE ROUTES
  // ==========================================
  let targetFile = null;

  if (rawPath === '/' || reqPath === '/home' || reqPath === '/dashboard' || rawPath === '/index.html') {
    targetFile = path.join(STITCH_DIR, 'home_dashboard', 'code.html');
  } else if (reqPath === '/timetable') {
    targetFile = path.join(STITCH_DIR, 'timetable_scheduler', 'code.html');
  } else if (reqPath === '/tasks') {
    targetFile = path.join(STITCH_DIR, 'tasks_assignments', 'code.html');
  } else if (reqPath === '/vault') {
    targetFile = path.join(STITCH_DIR, 'personal_data_vault', 'code.html');
  } else if (reqPath === '/profile') {
    targetFile = path.join(STITCH_DIR, 'student_profile_settings', 'code.html');
  } else if (reqPath === '/attendance' || reqPath === '/rhythm' || reqPath === '/academic_rhythm') {
    targetFile = path.join(STITCH_DIR, 'academic_rhythm', 'code.html');
  } else if (reqPath === '/shared_firebase_cloud.js') {
    targetFile = path.join(STITCH_DIR, 'shared_firebase_cloud.js');
  } else if (reqPath === '/portal' || reqPath === '/review') {
    targetFile = path.join(BASE_DIR, 'portal.html');
  } else {
    // Check if path is relative from within stitch subdirectories
    const peerFolders = ['home_dashboard', 'timetable_scheduler', 'tasks_assignments', 'personal_data_vault', 'student_profile_settings', 'academic_rhythm'];
    for (const folder of peerFolders) {
      if (rawPath.startsWith('/' + folder + '/')) {
        targetFile = path.join(STITCH_DIR, rawPath.slice(1));
        break;
      }
    }

    if (!targetFile) {
      targetFile = path.normalize(path.join(BASE_DIR, rawPath));
    }
  }

  // Ensure security against directory traversal
  if (!targetFile.startsWith(BASE_DIR)) {
    res.statusCode = 403;
    res.end('Access Denied');
    return;
  }

  fs.stat(targetFile, (err, stats) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(`<h1>404 Not Found</h1><p>${rawPath} not found.</p><p><a href="/">Go to Home Dashboard</a></p>`);
      return;
    }

    let filePath = targetFile;
    if (stats.isDirectory()) {
      filePath = path.join(targetFile, 'code.html');
      if (!fs.existsSync(filePath)) {
        filePath = path.join(targetFile, 'index.html');
      }
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.statusCode = 500;
        res.end('Server error reading file');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
      res.statusCode = 200;

      // Inject PWA Standalone and Android meta tags into HTML files
      if (ext === '.html') {
        let htmlStr = content.toString('utf-8');
        if (!htmlStr.includes('rel="manifest"')) {
          htmlStr = htmlStr.replace('<head>', '<head>' + PWA_HEAD_TAGS);
        }
        res.end(htmlStr);
      } else {
        res.end(content);
      }
    });
  });
}

const server1 = http.createServer(requestHandler);
server1.listen(PORT, '0.0.0.0', () => {
  console.log(`[College OS] Serving on http://localhost:${PORT}`);
  console.log(`[PWA Native Mode] Standalone Android application enabled via /manifest.json`);
  console.log(`[Cloudinary Engine] Private per-user folders active via /api/cloudinary`);
  console.log(`[Home Dashboard] http://localhost:${PORT}/home`);
  console.log(`[Vault]          http://localhost:${PORT}/vault`);
  console.log(`[Attendance]     http://localhost:${PORT}/attendance`);
});

const server2 = http.createServer(requestHandler);
server2.listen(ALT_PORT, '0.0.0.0', () => {
  console.log(`[College OS] Alternate port: http://localhost:${ALT_PORT}`);
});
