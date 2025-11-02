const fs = require('fs');
const path = require('path');

const cacheDir = path.join(process.cwd(), '.next', 'cache', 'webpack');
const serverDir = path.join(process.cwd(), '.next', 'server');

function ensureNextStubs() {
  try {
    if (!fs.existsSync(serverDir)) {
      fs.mkdirSync(serverDir, { recursive: true });
    }

    const vendorChunksDir = path.join(serverDir, 'vendor-chunks');
    if (!fs.existsSync(vendorChunksDir)) {
      fs.mkdirSync(vendorChunksDir, { recursive: true });
    }

    const fontManifest = { app: {}, pages: {} };
    const middlewareManifest = {
      version: 3,
      sortedMiddleware: [],
      middleware: {},
      functions: {},
    };
    const stubs = [
      {
        file: path.join(serverDir, 'next-font-manifest.json'),
        contents: JSON.stringify(fontManifest),
      },
      {
        file: path.join(serverDir, 'next-font-manifest.js'),
        contents: `self.__NEXT_FONT_MANIFEST=${JSON.stringify(fontManifest)};`,
      },
      {
        file: path.join(serverDir, 'middleware-manifest.json'),
        contents: JSON.stringify(middlewareManifest),
      },
      {
        file: path.join(serverDir, 'pages-manifest.json'),
        contents: JSON.stringify({}),
      },
      {
        file: path.join(serverDir, 'app-paths-manifest.json'),
        contents: JSON.stringify({}),
      },
      {
        file: path.join(serverDir, 'app-path-routes-manifest.json'),
        contents: JSON.stringify({}),
      },
      {
        file: path.join(serverDir, 'app-build-manifest.json'),
        contents: JSON.stringify({ pages: {} }),
      },
      {
        file: path.join(serverDir, 'functions-config-manifest.json'),
        contents: JSON.stringify({ functions: {}, version: 1 }),
      },
      {
        file: path.join(vendorChunksDir, '@opentelemetry.js'),
        contents: 'export {};',
      },
      {
        file: path.join(vendorChunksDir, 'next.js'),
        contents: 'module.exports = {};',
      },
    ];

    for (const stub of stubs) {
      if (!fs.existsSync(stub.file)) {
        fs.writeFileSync(stub.file, stub.contents);
      }
    }
  } catch (err) {
    console.warn('⚠️  Failed to ensure Next manifests:', err);
  }
}

function checkAndCleanCache() {
  if (!fs.existsSync(cacheDir)) {
    console.log('✅ Cache directory clean');
    return true;
  }

  try {
    // Check for problematic files
    const clientCache = path.join(cacheDir, 'client-development');
    const serverCache = path.join(cacheDir, 'server-development');
    
    let hasIssues = false;
    
    [clientCache, serverCache].forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        
        // Check for .pack.gz_ files or missing expected files
        const hasPartialFiles = files.some(f => f.endsWith('.gz_'));
        const hasPackFiles = files.some(f => f.endsWith('.pack.gz'));
        
        if (hasPartialFiles || !hasPackFiles) {
          console.warn(`⚠️  Detected cache issues in ${dir}`);
          hasIssues = true;
        }
      }
    });
    
    if (hasIssues) {
      console.log('🧹 Cleaning corrupted cache...');
      fs.rmSync(cacheDir, { recursive: true, force: true });
      console.log('✅ Cache cleaned successfully');
    } else {
      console.log('✅ Cache is healthy');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error checking cache:', error);
    // If check fails, clean cache to be safe
    try {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      console.log('✅ Cache cleaned after error');
    } catch (cleanError) {
      console.error('Failed to clean cache:', cleanError);
    }
    return false;
  }
}

checkAndCleanCache();
ensureNextStubs();
