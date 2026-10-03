import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";

const distDir = join(process.cwd(), "dist");
const indexFile = join(distDir, "index.html");
const fallbackFile = join(distDir, "404.html");

const SITE = "https://foroagora.org";

// title must be <=60 chars; description 50-160 chars
const routeMeta = {
  nosotros:   { title: "Nosotros — Foro Agora",                 desc: "Conocé la misión, visión y valores de Foro Agora: educación financiera rigurosa, comunitaria y enfocada en el largo plazo para jóvenes uruguayos." },
  programa:   { title: "Programa — Foro Agora",                 desc: "Plan de estudios de 5 módulos: mentalidad, ecosistema financiero uruguayo, análisis fundamental, mercado y construcción de portafolio." },
  registro:   { title: "Inscripciones — Foro Agora",            desc: "Inscribite gratis a la próxima cohorte de Foro Agora. Clases presenciales de educación financiera para estudiantes en Uruguay." },
  contacto:   { title: "Contacto — Foro Agora",                 desc: "Escribinos para coordinar alianzas, charlas o consultas sobre nuestro programa de educación financiera para jóvenes uruguayos." },
  recursos:   { title: "Recursos — Foro Agora",                 desc: "Materiales y herramientas complementarias para profundizar en análisis fundamental, finanzas personales y mercados desde Uruguay." },
  glosario:   { title: "Glosario financiero — Foro Agora",      desc: "Diccionario claro y en español de términos financieros y de inversión clave, con foco en el contexto uruguayo." },
  partners:   { title: "Aliados — Foro Agora",  desc: "Conoce a quienes acompanian a Foro Agora y descubre formas de apoyar su crecimiento abierto." },
  difundir: { title: "Kit de difusion - Foro Agora", desc: "Textos y links listos para compartir Foro Agora con estudiantes, amigos, familias y referentes." },
  prensa: { title: "Prensa y media kit - Foro Agora", desc: "Informacion oficial, boilerplate, links y pautas para presentar Foro Agora en medios, eventos y alianzas." },
  brokers:    { title: "Brokers para Uruguay — Foro Agora",     desc: "Comparativa de brokers accesibles desde Uruguay para invertir en acciones y ETFs internacionales, con foco educativo." },
  ranking:    { title: "Ranking de estudiantes — Foro Agora",   desc: "Seguí el progreso de los estudiantes de Foro Agora en el simulador de portafolio y las actividades del programa." },
  impacto:    { title: "Impacto — Foro Agora",                  desc: "Resultados y métricas del impacto de Foro Agora en jóvenes uruguayos: estudiantes formados, cohortes y comunidad." },
  privacidad: { title: "Política de privacidad — Foro Agora",   desc: "Cómo tratamos tus datos personales en Foro Agora: información que recolectamos, uso y tus derechos como usuario." },
  terminos:   { title: "Términos y condiciones — Foro Agora",   desc: "Términos y condiciones de uso de la plataforma educativa de Foro Agora." },
  maths:      { title: "Maths — Foro Agora", desc: "Exercices de mathématiques pour s'entraîner chaque jour." },
  "maths/kholles": { title: "Khôlles — Maths — Foro Agora", desc: "Programme de khôlles et incontournables de chaque semaine." },
  "maths/dm": { title: "DM — Maths — Foro Agora", desc: "Devoirs maison de mathématiques." },
  "maths/dm/dm-1": { title: "DM n°1 — Maths — Foro Agora", desc: "Devoir maison n°1." },
  "maths/dm/dm-2": { title: "DM n°2 — Maths — Foro Agora", desc: "Devoir maison n°2." },
  "maths/ressources": { title: "Ressources — Maths — Foro Agora", desc: "Formulaires et méthodologie." },
  "maths/forum": { title: "Forum — Maths — Foro Agora", desc: "Forum de mathématiques pour échanger des questions, méthodes et documents." },
  "maths/index": { title: "Index des exercices — Maths — Foro Agora", desc: "Tous les exercices de mathématiques, avec recherche et filtres." },
  ...Object.fromEntries(Array.from({ length: 400 }, (_, i) => [`maths/exo/${i + 1}`, { title: `Exercice #${String(i + 1).padStart(3, "0")} — Maths — Foro Agora`, desc: "Exercice de mathématiques." }])),
  // app routes: keep simple, low priority
  auth:       { title: "Acceso — Foro Agora",                   desc: "Ingresá a tu cuenta de Foro Agora para acceder al dashboard, simulador y comunidad de estudiantes." },
  dashboard:  { title: "Dashboard — Foro Agora",                desc: "Panel personal de estudiantes de Foro Agora: progreso, portafolio simulado, comunidad y recursos." },
  admin:      { title: "Admin — Foro Agora",                    desc: "Panel de administración interno de Foro Agora." },
  profile:    { title: "Perfil — Foro Agora",                   desc: "Configurá tu perfil de estudiante en Foro Agora." },
};

if (!existsSync(indexFile)) {
  throw new Error("dist/index.html was not found. Run this script after vite build.");
}

const baseHtml = readFileSync(indexFile, "utf8");

function rewriteHead(html, { title, desc, url }) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${desc}">`)
    .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${title}">`)
    .replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${title}">`)
    .replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${desc}">`)
    .replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${desc}">`)
    .replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${url}">`);
}

for (const [route, meta] of Object.entries(routeMeta)) {
  const targetFile = join(distDir, route, "index.html");
  mkdirSync(dirname(targetFile), { recursive: true });
  const url = `${SITE}/${route}`;
  writeFileSync(targetFile, rewriteHead(baseHtml, { title: meta.title, desc: meta.desc, url }));
}

for (let chapter = 1; chapter <= 6; chapter += 1) {
  for (const tab of ["cours", "td"]) {
    const f = join(distDir, "maths", "chapitre", `chapitre-${chapter}`, tab, "index.html");
    mkdirSync(dirname(f), { recursive: true });
    writeFileSync(f, rewriteHead(baseHtml, { title: `Chapitre ${chapter} — Maths — Foro Agora`, desc: "Cours et exercices de mathématiques.", url: `${SITE}/maths/chapitre/chapitre-${chapter}/${tab}` }));
  }
  const targetFile = join(distDir, "maths", "chapitre", `chapitre-${chapter}`, "index.html");
  mkdirSync(dirname(targetFile), { recursive: true });
  writeFileSync(targetFile, rewriteHead(baseHtml, {
    title: `Chapitre ${chapter} — Maths — Foro Agora`,
    desc: "Cours et exercices de mathématiques pour s'entraîner.",
    url: `${SITE}/maths/chapitre/chapitre-${chapter}`,
  }));
}

copyFileSync(indexFile, fallbackFile);
