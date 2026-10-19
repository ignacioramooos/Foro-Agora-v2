import fs from "node:fs";
import {
  chapters,
  allExercises,
  devoirs,
  kholleWeeks,
  coursDocs,
  tdDocs,
  resourceDocs,
  getMathStats,
} from "../src/data.js";

const payload = {
  stats: getMathStats(),
  chapters,
  allExercises,
  devoirs,
  kholleWeeks,
  coursDocs,
  tdDocs,
  resourceDocs,
};

fs.writeFileSync("./public/math-db.json", JSON.stringify(payload));
console.log("Exported public/math-db.json. File size:", fs.statSync("./public/math-db.json").size);
