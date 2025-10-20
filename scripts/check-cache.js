const fs = require('fs');
const path = require('path');

const cacheDir = path.join(process.cwd(), '.next', 'cache', 'webpack');

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

