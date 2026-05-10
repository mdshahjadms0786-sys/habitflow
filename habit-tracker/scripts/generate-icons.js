import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Ensure public directory exists
mkdirSync(publicDir, { recursive: true });

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background - purple circle
  ctx.fillStyle = '#534AB7';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // White "H" letter
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.5}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('H', size / 2, size / 2);

  return canvas.toBuffer('image/png');
}

// Generate icons
const icon192 = createIcon(192);
const icon512 = createIcon(512);

writeFileSync(join(publicDir, 'icon-192.png'), icon192);
writeFileSync(join(publicDir, 'icon-512.png'), icon512);

console.log('Icons generated successfully!');
console.log('- public/icon-192.png');
console.log('- public/icon-512.png');
