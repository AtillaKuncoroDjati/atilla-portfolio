import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

export async function buildMotion() {
  await build({
    entryPoints: [fileURLToPath(new URL('./motion-vendor.js', import.meta.url))],
    outfile: fileURLToPath(new URL('../public/vendor/motion.js', import.meta.url)),
    bundle: true, format: 'esm', platform: 'browser', target: 'es2022',
    minify: true, legalComments: 'eof',
  });
}
