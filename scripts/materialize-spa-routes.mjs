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
  partners:   { title: "Aliados institucionales — Foro Agora",  desc: "Conocé a las instituciones que acompañan a Foro Agora y descubrí cómo sumarse al proyecto educativo." },
  instituciones: { title: "Charlas gratuitas para instituciones - Foro Agora", desc: "Propuesta gratuita de educacion financiera para liceos, colegios, universidades y organizaciones de Uruguay." },
  "propuesta-instituciones": { title: "Propuesta institucional imprimible - Foro Agora", desc: "Documento para coordinar charlas gratuitas de educacion financiera para jovenes: objetivo, formatos, contenidos y cuidado educativo." },
  embajadores: { title: "Embajadores - Foro Agora", desc: "Programa para jovenes que quieren abrir puertas, difundir educacion financiera y llevar Foro Agora a nuevas comunidades." },
  brokers:    { title: "Brokers para Uruguay — Foro Agora",     desc: "Comparativa de brokers accesibles desde Uruguay para invertir en acciones y ETFs internacionales, con foco educativo." },
  ranking:    { title: "Ranking de estudiantes — Foro Agora",   desc: "Seguí el progreso de los estudiantes de Foro Agora en el simulador de portafolio y las actividades del programa." },
  impacto:    { title: "Impacto — Foro Agora",                  desc: "Resultados y métricas del impacto de Foro Agora en jóvenes uruguayos: estudiantes formados, cohortes y comunidad." },
  privacidad: { title: "Política de privacidad — Foro Agora",   desc: "Cómo tratamos tus datos personales en Foro Agora: información que recolectamos, uso y tus derechos como usuario." },
  terminos:   { title: "Términos y condiciones — Foro Agora",   desc: "Términos y condiciones de uso de la plataforma educativa de Foro Agora." },
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

copyFileSync(indexFile, fallbackFile);
