import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://foroagora.org";
const DEFAULT_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/G8LfEylXs5aTCnVZ1X2TMXDM9jt1/social-images/social-1778181859927-ChatGPT_Image_2_may_2026,_04_29_02_a.m..webp";

type RouteSeoMeta = {
  title: string;
  description: string;
  image?: string;
};

const defaultMeta: RouteSeoMeta = {
  title: "Foro Agora - Educacion financiera en Uruguay",
  description:
    "Clases presenciales gratuitas de analisis fundamental para estudiantes en Uruguay. Sin trading. Sin experiencia previa.",
};

const routeMeta: Record<string, RouteSeoMeta> = {
  "/": defaultMeta,
  "/instituciones": {
    title: "Charlas gratuitas para instituciones - Foro Agora",
    description:
      "Propuesta gratuita de educacion financiera para liceos, colegios, universidades y organizaciones de Uruguay.",
  },
  "/propuesta-instituciones": {
    title: "Propuesta institucional imprimible - Foro Agora",
    description:
      "Documento para coordinar charlas gratuitas de educacion financiera para jovenes: objetivo, formatos, contenidos y cuidado educativo.",
  },
  "/embajadores": {
    title: "Embajadores - Foro Agora",
    description:
      "Programa para jovenes que quieren abrir puertas, difundir educacion financiera y llevar Foro Agora a nuevas comunidades.",
  },
  "/difundir": {
    title: "Kit de difusion - Foro Agora",
    description:
      "Textos y links listos para compartir Foro Agora con estudiantes, docentes, instituciones y comunidades.",
  },
  "/partners": {
    title: "Aliados institucionales - Foro Agora",
    description:
      "Canal para instituciones, docentes, organizaciones y aliados que quieren colaborar con Foro Agora.",
  },
  "/programa": {
    title: "Programa - Foro Agora",
    description:
      "Plan de estudios gratuito sobre finanzas personales, inversion responsable, mercado uruguayo y analisis fundamental.",
  },
  "/registro": {
    title: "Inscripciones - Foro Agora",
    description:
      "Inscripcion gratuita para jovenes interesados en aprender educacion financiera y analisis fundamental en Uruguay.",
  },
  "/recursos": {
    title: "Recursos - Foro Agora",
    description:
      "Materiales educativos para aprender finanzas personales, inversion responsable y analisis fundamental.",
  },
};

const createMeta = (attr: "name" | "property", key: string) => {
  const meta = document.createElement("meta");
  meta.setAttribute(attr, key);
  return meta;
};

const createCanonical = () => {
  const link = document.createElement("link");
  link.setAttribute("rel", "canonical");
  return link;
};

const getHeadElement = (selector: string, create: () => HTMLMetaElement | HTMLLinkElement) => {
  const existing = document.head.querySelector(selector);
  if (existing) return existing;

  const element = create();
  document.head.appendChild(element);
  return element;
};

const setHeadValue = (
  selector: string,
  attrName: "content" | "href",
  value: string,
  create: () => HTMLMetaElement | HTMLLinkElement,
) => {
  getHeadElement(selector, create).setAttribute(attrName, value);
};

const RouteSeo = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname === "/" ? "/" : location.pathname.replace(/\/$/, "");
    const meta = routeMeta[pathname] ?? defaultMeta;
    const canonicalUrl = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
    const image = meta.image ?? DEFAULT_IMAGE;

    document.title = meta.title;

    setHeadValue('meta[name="description"]', "content", meta.description, () => createMeta("name", "description"));
    setHeadValue('link[rel="canonical"]', "href", canonicalUrl, createCanonical);
    setHeadValue('meta[property="og:title"]', "content", meta.title, () => createMeta("property", "og:title"));
    setHeadValue('meta[property="og:description"]', "content", meta.description, () =>
      createMeta("property", "og:description"),
    );
    setHeadValue('meta[property="og:url"]', "content", canonicalUrl, () => createMeta("property", "og:url"));
    setHeadValue('meta[property="og:image"]', "content", image, () => createMeta("property", "og:image"));
    setHeadValue('meta[name="twitter:title"]', "content", meta.title, () => createMeta("name", "twitter:title"));
    setHeadValue('meta[name="twitter:description"]', "content", meta.description, () =>
      createMeta("name", "twitter:description"),
    );
    setHeadValue('meta[name="twitter:image"]', "content", image, () => createMeta("name", "twitter:image"));
  }, [location.pathname]);

  return null;
};

export default RouteSeo;
