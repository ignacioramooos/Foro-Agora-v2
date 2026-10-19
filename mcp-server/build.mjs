import esbuild from "esbuild";
import { chmodSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "dist");
const outFile = join(distDir, "index.js");

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

console.log("[build] Bundling Foro Ágora Math MCP Server...");

await esbuild.build({
  entryPoints: [join(__dirname, "src/index.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile: outFile,
  banner: {
    js: `#!/usr/bin/env node\nimport { createRequire } from "module";\nconst require = createRequire(import.meta.url);\n`,
  },
  minify: false,
  sourcemap: false,
  logLevel: "info",
});

chmodSync(outFile, 0o755);
console.log(`[build] Successfully built standalone executable: ${outFile}`);
