# Cache Management Guide

## Common Issues

### Webpack Cache Corruption

**Symptoms**:
- ENOENT errors for `.pack.gz` files
- `unhandledRejection` errors related to webpack cache
- Slow dev server startup
- Build failures
- Files with `.gz_` extension instead of `.pack.gz`

**Root Causes**:
- Race conditions when multiple webpack processes access cache
- File system timing issues on macOS
- Cache migration between Next.js versions
- Interrupted builds or server restarts

**Solutions**:

1. **Quick Fix** - Clean cache and restart:
   ```bash
   npm run dev:nocache
   ```

2. **Full Clean** - Remove all caches:
   ```bash
   npm run clean:full
   npm run dev
   ```

3. **Manual Clean** - Delete `.next` folder:
   ```bash
   rm -rf .next
   npm run dev
   ```

---

## Available Scripts

### Cache Management
- `npm run clean` - Remove `.next` directory
- `npm run clean:cache` - Remove only webpack cache
- `npm run clean:full` - Remove `.next` and `node_modules/.cache`

### Development
- `npm run dev` - Start dev server (auto-checks cache)
- `npm run dev:clean` - Clean `.next` and start dev
- `npm run dev:fresh` - Full clean and start dev
- `npm run dev:nocache` - Clean cache only and start dev

### Build
- `npm run build` - Build for production (auto-cleans first)

---

## Best Practices

### When to Clean Cache

1. **Before switching branches** with major changes:
   ```bash
   npm run clean
   ```

2. **After pulling major updates**:
   ```bash
   npm run dev:nocache
   ```

3. **After upgrading Next.js**:
   ```bash
   npm run clean:full
   ```

4. **When experiencing cache errors**:
   ```bash
   npm run dev:fresh
   ```

### Development Workflow

1. **Normal development**: Just use `npm run dev` - cache is auto-checked
2. **After git pull**: Use `npm run dev:nocache` if you pulled significant changes
3. **Build issues**: Try `npm run clean` before reporting bugs

### Team Collaboration

- Keep Node.js version consistent (use `nvm` and `.nvmrc` file)
- Don't commit `.next` directory (it's in `.gitignore`)
- Share cache issues with team to identify patterns
- Update this doc when discovering new solutions

---

## Automated Cache Checks

The dev server automatically checks cache health on startup via `predev` script:

### What it Checks
- ✅ Existence of webpack cache directory
- ✅ Presence of partial/corrupted files (`.gz_` files)
- ✅ Missing required pack files

### What it Does
- 🧹 Automatically cleans corrupted cache
- ✅ Reports cache status in console
- 🔄 Allows dev server to start with clean cache

---

## Configuration

### Webpack Cache Settings

The project uses optimized webpack cache configuration in `next.config.ts`:

```typescript
webpack: (config, { dev }) => {
  if (dev) {
    config.cache = {
      type: 'filesystem',
      compression: 'gzip',
      hashAlgorithm: 'sha256',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      store: 'pack',
      version: '0.1.0',
    };
    
    // Prevent race conditions
    config.parallelism = 1;
  }
  return config;
}
```

### Benefits
- Prevents cache corruption via reduced parallelism
- Automatic cache invalidation after 7 days
- Version-based cache invalidation
- Optimized compression

---

## Troubleshooting

### Cache Still Corrupting

If automated cleaning doesn't help:

1. **Check Node.js version**:
   ```bash
   node --version  # Should match .nvmrc
   nvm use         # If using nvm
   ```

2. **Clear all caches**:
   ```bash
   npm run clean:full
   rm -rf ~/.npm/_cacache
   npm run dev
   ```

3. **Check disk space**:
   ```bash
   df -h .  # Ensure adequate disk space
   ```

4. **Restart your system** - Sometimes file system issues need a reboot

### Performance Issues

If dev server is slow even with cache:

1. **Check cache size**:
   ```bash
   du -sh .next/cache
   ```

2. **Consider disabling cache temporarily** for debugging:
   Edit `next.config.ts` and set `config.cache = false`

3. **Monitor webpack compilation**:
   ```bash
   npm run dev -- --turbo  # Try Turbopack (experimental)
   ```

---

## Support

### Reporting Issues

When reporting cache issues, include:

1. Error messages (full stack trace)
2. Node.js version (`node --version`)
3. Next.js version (from `package.json`)
4. Cache directory listing:
   ```bash
   ls -la .next/cache/webpack/*/
   ```

### Known Issues

- macOS file system can have timing issues with rapid cache writes
- Windows may require different rm command (use Git Bash or PowerShell)
- Docker environments may need volume mount adjustments

---

## Additional Resources

- [Next.js Caching Documentation](https://nextjs.org/docs/architecture/caching)
- [Webpack Caching Guide](https://webpack.js.org/configuration/cache/)
- Project Issue Tracker: (add your GitHub issues link)

---

Last Updated: 2025-01-20

