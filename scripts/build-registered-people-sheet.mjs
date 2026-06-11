import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "/Users/nico/AI-definitivo/foroagora3def/outputs/registrados-clases/";
const outputPath = `${outputDir}foro_agora_registrados_clases.xlsx`;

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Registrados");
const attendance = workbook.worksheets.add("Asistencia");
const prep = workbook.worksheets.add("Preparacion clase");
const mailing = workbook.worksheets.add("Mailing list");
const lists = workbook.worksheets.add("Listas");

const headers = [
  "Nro",
  "Nombre completo",
  "Email",
  "Telefono / WhatsApp",
  "Edad",
  "Departamento",
  "Institucion educativa",
  "Como nos conocio",
  "Por que quiere participar",
  "Clase / modulo",
  "Registrado el",
  "Consentimiento",
  "Mailing list",
  "Asistio",
  "Confirmado",
  "Necesita seguimiento",
  "Comentario interno",
  "ID registro",
];

const attendanceHeaders = [
  "Nro",
  "Nombre completo",
  "Email",
  "Telefono / WhatsApp",
  "Clase / modulo",
  "Asistio",
  "Llego tarde",
  "Quiere certificado",
  "Comentario asistencia",
];

const prepRows = [
  ["Metrica", "Formula / uso"],
  ["Total registrados", '=COUNTIF(Registrados!B3:B1002,"?*")'],
  ["Confirmados", "=COUNTIF(Registrados!O3:O1002,TRUE)"],
  ["Asistieron", "=COUNTIF(Registrados!N3:N1002,TRUE)"],
  ["Mailing list si", "=COUNTIF(Registrados!M3:M1002,TRUE)"],
  ["Necesitan seguimiento", "=COUNTIF(Registrados!P3:P1002,TRUE)"],
  ["Promedio edad", '=IFERROR(AVERAGE(FILTER(Registrados!E3:E1002,Registrados!E3:E1002<>"")),"")'],
  ["Notas de preparacion", ""],
  ["Objetivo de la clase", ""],
  ["Materiales a llevar", ""],
  ["Preguntas frecuentes detectadas", ""],
  ["Alumnos a contactar antes", ""],
];

const departments = [
  "Montevideo",
  "Canelones",
  "Maldonado",
  "Salto",
  "Colonia",
  "Paysandu",
  "Rivera",
  "Soriano",
  "Cerro Largo",
  "San Jose",
  "Tacuarembo",
  "Rocha",
  "Florida",
  "Durazno",
  "Artigas",
  "Treinta y Tres",
  "Lavalleja",
  "Flores",
  "Rio Negro",
];

const sources = [
  "Instagram",
  "Amigo / Boca a boca",
  "Actividad abierta",
  "Mi liceo",
  "LinkedIn",
  "Google",
  "Otro",
];

const boolCols = ["L", "M", "N", "O", "P"];
const attendanceBoolCols = ["F", "G", "H"];

sheet.getRange("A1:R1").values = [["Foro Agora - registrados a clases"]];
sheet.getRange("A2:R2").values = [headers];
sheet.getRange("A3:R1002").values = Array.from({ length: 1000 }, (_, idx) => [
  idx + 1,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  false,
  false,
  false,
  false,
  false,
  "",
  "",
]);

attendance.getRange("A1:I1").values = [["Foro Agora - control de asistencia"]];
attendance.getRange("A2:I2").values = [attendanceHeaders];
attendance.getRange("A3:I1002").formulas = Array.from({ length: 1000 }, (_, idx) => {
  const row = idx + 3;
  return [
    `=IF(Registrados!B${row}<>"",Registrados!A${row},"")`,
    `=IF(Registrados!B${row}<>"",Registrados!B${row},"")`,
    `=IF(Registrados!B${row}<>"",Registrados!C${row},"")`,
    `=IF(Registrados!B${row}<>"",Registrados!D${row},"")`,
    `=IF(Registrados!B${row}<>"",Registrados!J${row},"")`,
    false,
    false,
    false,
    "",
  ];
});

prep.getRange("A1:B1").values = [["Foro Agora - preparacion de clase", ""]];
prep.getRange("A2:B13").values = prepRows;

mailing.getRange("A1:H1").values = [["Foro Agora - mailing list", "", "", "", "", "", "", ""]];
mailing.getRange("A2:H2").values = [["Nombre", "Email", "Telefono", "Departamento", "Institucion", "Mailing list", "Confirmado", "Comentario"]];
mailing.getRange("A3:H1002").formulas = Array.from({ length: 1000 }, (_, idx) => {
  const row = idx + 3;
  return [
    `=IF(Registrados!M${row}=TRUE,Registrados!B${row},"")`,
    `=IF(Registrados!M${row}=TRUE,Registrados!C${row},"")`,
    `=IF(Registrados!M${row}=TRUE,Registrados!D${row},"")`,
    `=IF(Registrados!M${row}=TRUE,Registrados!F${row},"")`,
    `=IF(Registrados!M${row}=TRUE,Registrados!G${row},"")`,
    `=IF(Registrados!M${row}=TRUE,Registrados!M${row},"")`,
    `=IF(Registrados!M${row}=TRUE,Registrados!O${row},"")`,
    `=IF(Registrados!M${row}=TRUE,Registrados!Q${row},"")`,
  ];
});

lists.getRange("A1:A19").values = departments.map((department) => [department]);
lists.getRange("C1:C7").values = sources.map((source) => [source]);
lists.getRange("E1:E6").values = [["Clase 1"], ["Clase 2"], ["Clase 3"], ["Clase 4"], ["Clase 5"], ["Evento / charla"]];

const titleBySheet = new Map([
  [sheet, "Foro Agora - registrados a clases"],
  [attendance, "Foro Agora - control de asistencia"],
  [prep, "Foro Agora - preparacion de clase"],
  [mailing, "Foro Agora - mailing list"],
]);
const titleRangeBySheet = new Map([
  [sheet, "A1:R1"],
  [attendance, "A1:I1"],
  [prep, "A1:B1"],
  [mailing, "A1:H1"],
]);
const headerRangeBySheet = new Map([
  [sheet, "A2:R2"],
  [attendance, "A2:I2"],
  [prep, "A2:B2"],
  [mailing, "A2:H2"],
]);

for (const ws of [sheet, attendance, prep, mailing]) {
  const title = ws.getRange(titleRangeBySheet.get(ws));
  title.merge();
  ws.getRange("A1").values = [[titleBySheet.get(ws)]];
  title.format.fill = "#111827";
  title.format.font = { bold: true, color: "#ffffff" };
  const header = ws.getRange(headerRangeBySheet.get(ws));
  header.format.fill = "#f3f4f6";
  header.format.font = { bold: true, color: "#111827" };
  header.format.wrapText = true;
}

for (const col of boolCols) {
  sheet.getRange(`${col}3:${col}1002`).format.horizontalAlignment = "center";
}
for (const col of attendanceBoolCols) {
  attendance.getRange(`${col}3:${col}1002`).format.horizontalAlignment = "center";
}

sheet.getRange("A:A").format.columnWidthPx = 52;
sheet.getRange("B:B").format.columnWidthPx = 220;
sheet.getRange("C:D").format.columnWidthPx = 190;
sheet.getRange("E:F").format.columnWidthPx = 120;
sheet.getRange("G:H").format.columnWidthPx = 180;
sheet.getRange("I:I").format.columnWidthPx = 280;
sheet.getRange("J:K").format.columnWidthPx = 150;
sheet.getRange("L:P").format.columnWidthPx = 115;
sheet.getRange("Q:Q").format.columnWidthPx = 260;
sheet.getRange("R:R").format.columnWidthPx = 210;

attendance.getRange("A:A").format.columnWidthPx = 52;
attendance.getRange("B:E").format.columnWidthPx = 190;
attendance.getRange("F:H").format.columnWidthPx = 115;
attendance.getRange("I:I").format.columnWidthPx = 260;

prep.getRange("A:A").format.columnWidthPx = 210;
prep.getRange("B:B").format.columnWidthPx = 520;

mailing.getRange("A:E").format.columnWidthPx = 180;
mailing.getRange("F:G").format.columnWidthPx = 115;
mailing.getRange("H:H").format.columnWidthPx = 260;

lists.getRange("A:E").format.columnWidthPx = 180;

sheet.freezePanes.freezeRows(2);
attendance.freezePanes.freezeRows(2);
mailing.freezePanes.freezeRows(2);

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

console.log(outputPath);
