export interface ClassSession {
  id: string;
  title: string;
  module_number: number;
  class_date: string;
  end_date?: string | null;
  location: string;
  max_capacity: number;
  registration_limit?: number | null;
  is_active: boolean;
  is_featured?: boolean;
  notes: string | null;
}

export const EVENT_TIME_ZONE = "America/Montevideo";
export const EVENT_LOCATION_NAME = "Instituto Nacional de la Juventud - INJU";
export const EVENT_ADDRESS = "Av. 18 de Julio 1865, 11200 Montevideo, Departamento de Montevideo";
export const EVENT_FALLBACK_DESCRIPTION =
  "El primer encuentro presencial de Foro Agora: una introducción clara y participativa al análisis de empresas y la educación financiera.";

export const formatEventDate = (value: string) =>
  new Intl.DateTimeFormat("es-UY", {
    timeZone: EVENT_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

export const formatEventTime = (value: string) =>
  new Intl.DateTimeFormat("es-UY", {
    timeZone: EVENT_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));

export const getEventEndDate = (classSession: ClassSession) =>
  classSession.end_date
    ? new Date(classSession.end_date)
    : new Date(new Date(classSession.class_date).getTime() + 2 * 60 * 60 * 1000);

export const formatEventTimeRange = (classSession: ClassSession) =>
  `${formatEventTime(classSession.class_date)} a ${formatEventTime(getEventEndDate(classSession).toISOString())}`;

const formatCalendarTimestamp = (value: Date | string) =>
  new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

const escapeCalendarText = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

const getEventLocation = () => `${EVENT_LOCATION_NAME}, ${EVENT_ADDRESS}`;

export const getGoogleCalendarUrl = (classSession: ClassSession) => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: classSession.title,
    dates: `${formatCalendarTimestamp(classSession.class_date)}/${formatCalendarTimestamp(getEventEndDate(classSession))}`,
    details: classSession.notes || EVENT_FALLBACK_DESCRIPTION,
    location: getEventLocation(),
    ctz: EVENT_TIME_ZONE,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const getAppleCalendarDataUrl = (classSession: ClassSession) => {
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Foro Agora//Encuentros//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeCalendarText(classSession.id)}@foroagora.org`,
    `DTSTAMP:${formatCalendarTimestamp(new Date())}`,
    `DTSTART:${formatCalendarTimestamp(classSession.class_date)}`,
    `DTEND:${formatCalendarTimestamp(getEventEndDate(classSession))}`,
    `SUMMARY:${escapeCalendarText(classSession.title)}`,
    `DESCRIPTION:${escapeCalendarText(classSession.notes || EVENT_FALLBACK_DESCRIPTION)}`,
    `LOCATION:${escapeCalendarText(getEventLocation())}`,
    "URL:https://foroagora.org",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(calendar)}`;
};

export const getGoogleMapsUrl = () => {
  const params = new URLSearchParams({
    api: "1",
    query: getEventLocation(),
  });
  return `https://www.google.com/maps/search/?${params.toString()}`;
};

export const getGoogleMapsEmbedUrl = () =>
  `https://www.google.com/maps?q=${encodeURIComponent(getEventLocation())}&output=embed`;

export const getRegistrationPath = (classId: string) => `/registro?class=${encodeURIComponent(classId)}`;

export const getEventAuthPath = (classId: string) => {
  const returnTo = getRegistrationPath(classId);
  return `/auth?mode=event&returnTo=${encodeURIComponent(returnTo)}`;
};

export const isEventRegistrationPath = (pathname: string, search: string) =>
  pathname === "/registro" && Boolean(new URLSearchParams(search).get("class"));

export const normalizeCedula = (value: string) => value.replace(/\D/g, "").padStart(8, "0");

export const isValidUruguayanCedula = (value: string) => {
  const digits = normalizeCedula(value);
  if (!/^\d{8}$/.test(digits)) return false;

  const factors = [2, 9, 8, 7, 6, 3, 4];
  const sum = factors.reduce((total, factor, index) => total + Number(digits[index]) * factor, 0);
  const verifier = (10 - (sum % 10)) % 10;
  return verifier === Number(digits[7]);
};
