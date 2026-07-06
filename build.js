import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify as minifyTerser } from 'terser';
import CleanCSS from 'clean-css';
import { minify as minifyHTML } from 'html-minifier-terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, 'dist');
const ASSETS_SRC = path.join(__dirname, 'assets');
const ASSETS_DEST = path.join(DIST_DIR, 'assets');

// Helper to recursively copy directories
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper to process files recursively
function processFiles(dir, filterExt, processor) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processFiles(fullPath, filterExt, processor);
    } else if (fullPath.endsWith(filterExt)) {
      processor(fullPath);
    }
  }
}

async function build() {
  console.log('Starting production build...');

  // 1. Clean dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR);

  // 2. Copy root files and assets
  console.log('Copying assets and root files...');
  copyDirSync(ASSETS_SRC, ASSETS_DEST);
  fs.copyFileSync(path.join(__dirname, 'manifest.json'), path.join(DIST_DIR, 'manifest.json'));

  // 3. Minify HTML
  console.log('Minifying index.html...');
  const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const minifiedHTML = await minifyHTML(htmlContent, {
    collapseWhitespace: true,
    removeComments: true,
    minifyJS: true,
    minifyCSS: true,
  });
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), minifiedHTML);

  // 4. Minify CSS
  console.log('Minifying CSS...');
  const cleanCss = new CleanCSS({ level: 2 });
  processFiles(ASSETS_DEST, '.css', (filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    const result = cleanCss.minify(source);
    fs.writeFileSync(filePath, result.styles);
  });

  // 5. Minify JS
  console.log('Minifying JS...');
  const jsFiles = [];
  processFiles(ASSETS_DEST, '.js', (filePath) => jsFiles.push(filePath));

  for (const filePath of jsFiles) {
    const source = fs.readFileSync(filePath, 'utf8');
    const result = await minifyTerser(source, {
      compress: { drop_console: true },
      format: { comments: false }
    });
    fs.writeFileSync(filePath, result.code);
  }

  console.log('Production build completed successfully in /dist.');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
