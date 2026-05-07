import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const distDir = join(process.cwd(), "dist");
const indexFile = join(distDir, "index.html");

const appRoutes = [
  "admin",
  "auth",
  "brokers",
  "contacto",
  "dashboard",
  "glosario",
  "impacto",
  "nosotros",
  "partners",
  "privacidad",
  "profile",
  "programa",
  "ranking",
  "recursos",
  "registro",
  "terminos",
];

if (!existsSync(indexFile)) {
  throw new Error("dist/index.html was not found. Run this script after vite build.");
}

for (const route of appRoutes) {
  const targetFile = join(distDir, route, "index.html");
  mkdirSync(dirname(targetFile), { recursive: true });
  copyFileSync(indexFile, targetFile);
}
