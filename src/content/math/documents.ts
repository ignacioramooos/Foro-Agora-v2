/** Original documents in the shared Google Drive folder. */
export interface DriveDoc {
  id: string;
  title: string;
}

export const DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1A4ecHOH2OYOUjnnIWupm_WhyAN7BOn0S";

export const drivePreviewUrl = (id: string) => `https://drive.google.com/file/d/${id}/preview`;
export const driveViewUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;

/** Keyed by chapter number. */
export const coursDocs: Record<number, DriveDoc> = {
  1: { id: "1mrN0KCi-O2NHdmP9cdP-aLquhVleyE-W", title: "Cours — Chapitre 1" },
  2: { id: "1Hm8Gsw83au3b2kW4cz7h4EsXEUlW2ZTA", title: "Cours — Chapitre 2" },
  3: { id: "12frWHczuqKGnnFuFOz6nsdd83tzVjqwK", title: "Cours — Chapitre 3" },
  4: { id: "1gYJEtSM-q748BDIh8ImXpV7PP9ZSkU6m", title: "Cours — Chapitre 4" },
  5: { id: "1dDis1Em5s3ih-ipeBxOfl7Ow1ItzGlCw", title: "Cours — Chapitre 5" },
  6: { id: "17cYVX4t_dA3vqv7ygKAdeOoWvuIf853p", title: "Cours — Chapitre 6" },
};

export const tdDocs: Record<number, DriveDoc> = {
  1: { id: "1i1V6-4aVL9vMqfPeYV9WZPs3awL1V_Aj", title: "TD — Chapitre 1" },
  2: { id: "1YpWmhWXj3Fi6Mz--anNz8Q32IDPjlf3m", title: "TD — Chapitre 2" },
  3: { id: "1_3ZpCwNWP5F4-FUComyjJNkxJNo4JoFm", title: "TD — Chapitre 3" },
  4: { id: "1inpiJiq0VaYBrcdHy98oAt97zTAIZ37f", title: "TD — Chapitre 4" },
  5: { id: "1C5ejYs6Xt01uh_R9cBO06_GCfzGK0gbi", title: "TD — Chapitre 5" },
  6: { id: "1075iMd66V-tRwIqRJLqro6USEl7S3cuP", title: "TD — Chapitre 6" },
};

export const resourceDocs: (DriveDoc & { description: string })[] = [
  { id: "1gk1hylA8nFzbPXOQZ3jKWhEnf34miURm", title: "Formulaire de trigonométrie", description: "Toutes les formules de trigo à connaître." },
  { id: "1tnf4gVEXZsFrjARU-IV2IwKuORh4KKh3", title: "Méthodologie : s'exprimer, rédiger, présenter", description: "Bien rédiger une copie et présenter à l'oral." },
];
