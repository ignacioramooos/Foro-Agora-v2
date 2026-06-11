const CONFIG = {
  registeredSheet: 'Registrados',
  attendanceSheet: 'Asistencia',
  prepSheet: 'Preparacion clase',
  mailingSheet: 'Mailing list',
  listsSheet: 'Listas',
  checkboxColumns: {
    Registrados: [12, 13, 14, 15, 16],
    Asistencia: [6, 7, 8],
    'Mailing list': [6, 7],
  },
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Foro Agora')
    .addItem('Configurar hoja', 'setupForoAgoraSheet')
    .addItem('Sincronizar registrados', 'syncRegistradosFromSupabase')
    .addToUi();
}

function setupForoAgoraSheet() {
  const ss = SpreadsheetApp.getActive();
  ensureSheets_(ss);
  applyCheckboxes_(ss);
  applyFilters_(ss);
  SpreadsheetApp.getUi().alert('Hoja configurada. Carga SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Propiedades del script para sincronizar.');
}

function syncRegistradosFromSupabase() {
  const props = PropertiesService.getScriptProperties();
  const supabaseUrl = props.getProperty('SUPABASE_URL');
  const serviceRoleKey = props.getProperty('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en Propiedades del script.');
  }

  const registrations = supabaseGet_(supabaseUrl, serviceRoleKey, '/rest/v1/class_registrations?select=*&order=created_at.desc');
  const classSessions = supabaseGet_(supabaseUrl, serviceRoleKey, '/rest/v1/class_sessions?select=id,title,module_number&order=module_number.asc');
  const newsletter = supabaseGet_(supabaseUrl, serviceRoleKey, '/rest/v1/newsletter_subscribers?select=email,is_active');

  const classById = new Map(classSessions.map((item) => [item.id, item]));
  const mailingByEmail = new Map(newsletter.map((item) => [String(item.email || '').toLowerCase(), Boolean(item.is_active)]));

  const rows = registrations.map((item, index) => {
    const klass = item.class_id ? classById.get(item.class_id) : null;
    const email = String(item.email || '').toLowerCase();
    return [
      index + 1,
      item.name || '',
      item.email || '',
      item.phone || '',
      item.age || '',
      item.department || '',
      item.school || '',
      item.hear_about || '',
      item.why || '',
      klass ? `${klass.title} / Clase ${klass.module_number}` : 'PROXIMAMENTE',
      item.created_at ? new Date(item.created_at) : '',
      Boolean(item.consent),
      mailingByEmail.has(email) ? mailingByEmail.get(email) : Boolean(item.consent),
      false,
      false,
      false,
      '',
      item.id || '',
    ];
  });

  const ss = SpreadsheetApp.getActive();
  ensureSheets_(ss);
  writeRegistrados_(ss, rows);
  rebuildDerivedSheets_(ss);
  applyCheckboxes_(ss);
  applyFilters_(ss);
}

function supabaseGet_(baseUrl, key, path) {
  const response = UrlFetchApp.fetch(`${baseUrl}${path}`, {
    method: 'get',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
    muteHttpExceptions: true,
  });

  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) {
    throw new Error(`Supabase ${status}: ${text}`);
  }
  return JSON.parse(text);
}

function ensureSheets_(ss) {
  [
    CONFIG.registeredSheet,
    CONFIG.attendanceSheet,
    CONFIG.prepSheet,
    CONFIG.mailingSheet,
    CONFIG.listsSheet,
  ].forEach((name) => {
    if (!ss.getSheetByName(name)) ss.insertSheet(name);
  });
}

function writeRegistrados_(ss, rows) {
  const sheet = ss.getSheetByName(CONFIG.registeredSheet);
  const headers = [
    'Nro',
    'Nombre completo',
    'Email',
    'Telefono / WhatsApp',
    'Edad',
    'Departamento',
    'Institucion educativa',
    'Como nos conocio',
    'Por que quiere participar',
    'Clase / modulo',
    'Registrado el',
    'Consentimiento',
    'Mailing list',
    'Asistio',
    'Confirmado',
    'Necesita seguimiento',
    'Comentario interno',
    'ID registro',
  ];

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).merge().setValue('Foro Agora - registrados a clases');
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
  if (rows.length) sheet.getRange(3, 1, rows.length, headers.length).setValues(rows);
  styleSheet_(sheet, headers.length);
}

function rebuildDerivedSheets_(ss) {
  const registered = ss.getSheetByName(CONFIG.registeredSheet);
  const lastRow = Math.max(registered.getLastRow(), 3);
  rebuildAttendance_(ss, lastRow);
  rebuildMailing_(ss, lastRow);
  rebuildPrep_(ss);
}

function rebuildAttendance_(ss, lastRow) {
  const sheet = ss.getSheetByName(CONFIG.attendanceSheet);
  const headers = ['Nro', 'Nombre completo', 'Email', 'Telefono / WhatsApp', 'Clase / modulo', 'Asistio', 'Llego tarde', 'Quiere certificado', 'Comentario asistencia'];
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).merge().setValue('Foro Agora - control de asistencia');
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
  for (let row = 3; row <= lastRow; row += 1) {
    sheet.getRange(row, 1, 1, 5).setFormulas([[
      `=IF(Registrados!B${row}<>"",Registrados!A${row},"")`,
      `=IF(Registrados!B${row}<>"",Registrados!B${row},"")`,
      `=IF(Registrados!B${row}<>"",Registrados!C${row},"")`,
      `=IF(Registrados!B${row}<>"",Registrados!D${row},"")`,
      `=IF(Registrados!B${row}<>"",Registrados!J${row},"")`,
    ]]);
  }
  styleSheet_(sheet, headers.length);
}

function rebuildMailing_(ss, lastRow) {
  const sheet = ss.getSheetByName(CONFIG.mailingSheet);
  const headers = ['Nombre', 'Email', 'Telefono', 'Departamento', 'Institucion', 'Mailing list', 'Confirmado', 'Comentario'];
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).merge().setValue('Foro Agora - mailing list');
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
  for (let row = 3; row <= lastRow; row += 1) {
    sheet.getRange(row, 1, 1, headers.length).setFormulas([[
      `=IF(Registrados!M${row}=TRUE,Registrados!B${row},"")`,
      `=IF(Registrados!M${row}=TRUE,Registrados!C${row},"")`,
      `=IF(Registrados!M${row}=TRUE,Registrados!D${row},"")`,
      `=IF(Registrados!M${row}=TRUE,Registrados!F${row},"")`,
      `=IF(Registrados!M${row}=TRUE,Registrados!G${row},"")`,
      `=IF(Registrados!M${row}=TRUE,Registrados!M${row},"")`,
      `=IF(Registrados!M${row}=TRUE,Registrados!O${row},"")`,
      `=IF(Registrados!M${row}=TRUE,Registrados!Q${row},"")`,
    ]]);
  }
  styleSheet_(sheet, headers.length);
}

function rebuildPrep_(ss) {
  const sheet = ss.getSheetByName(CONFIG.prepSheet);
  const rows = [
    ['Metrica', 'Formula / uso'],
    ['Total registrados', '=COUNTIF(Registrados!B3:B1002,"?*")'],
    ['Confirmados', '=COUNTIF(Registrados!O3:O1002,TRUE)'],
    ['Asistieron', '=COUNTIF(Registrados!N3:N1002,TRUE)'],
    ['Mailing list si', '=COUNTIF(Registrados!M3:M1002,TRUE)'],
    ['Necesitan seguimiento', '=COUNTIF(Registrados!P3:P1002,TRUE)'],
    ['Promedio edad', '=IFERROR(AVERAGE(FILTER(Registrados!E3:E1002,Registrados!E3:E1002<>"")),"")'],
    ['Notas de preparacion', ''],
    ['Objetivo de la clase', ''],
    ['Materiales a llevar', ''],
    ['Preguntas frecuentes detectadas', ''],
    ['Alumnos a contactar antes', ''],
  ];
  sheet.clear();
  sheet.getRange(1, 1, 1, 2).merge().setValue('Foro Agora - preparacion de clase');
  sheet.getRange(2, 1, rows.length, 2).setValues(rows);
  styleSheet_(sheet, 2);
}

function applyCheckboxes_(ss) {
  Object.entries(CONFIG.checkboxColumns).forEach(([sheetName, columns]) => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    const numRows = Math.max(sheet.getMaxRows() - 2, 1);
    columns.forEach((column) => {
      sheet.getRange(3, column, numRows, 1).insertCheckboxes();
    });
  });
}

function applyFilters_(ss) {
  [CONFIG.registeredSheet, CONFIG.attendanceSheet, CONFIG.mailingSheet].forEach((sheetName) => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    const filter = sheet.getFilter();
    if (filter) filter.remove();
    sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), sheet.getLastColumn()).createFilter();
    sheet.setFrozenRows(2);
  });
}

function styleSheet_(sheet, columns) {
  sheet.getRange(1, 1, 1, columns).setBackground('#111827').setFontColor('#ffffff').setFontWeight('bold');
  sheet.getRange(2, 1, 1, columns).setBackground('#f3f4f6').setFontWeight('bold').setWrap(true);
  sheet.autoResizeColumns(1, columns);
}
