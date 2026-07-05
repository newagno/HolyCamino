import workboxBuild from 'workbox-build';

const buildSW = () => {
  return workboxBuild.injectManifest({
    swSrc: 'sw-src.js',
    swDest: 'sw.js',
    globDirectory: '.',
    globPatterns: [
      'index.html',
      'manifest.json',
      'assets/css/**/*.css',
      'assets/js/**/*.js',
      'assets/files/*.{svg,png,jpg,mp3}'
    ],
    // Avoid caching temp/dev files or SW source itself
    globIgnores: [
      'sw-src.js',
      'sw.js',
      'build-sw.js',
      'workbox-config.js',
      'node_modules/**/*',
      'package*.json',
      'tests/**/*'
    ]
  }).then(({ count, size }) => {
    console.log(`Generated sw.js, which will precache ${count} files, totaling ${(size / 1024 / 1024).toFixed(2)} MB.`);
  }).catch((err) => {
    console.error('Error generating service worker:', err);
    process.exit(1);
  });
};

buildSW();
