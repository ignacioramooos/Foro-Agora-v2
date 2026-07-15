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

export const getRegistrationLimit = (classSession: ClassSession) =>
  classSession.registration_limit ?? classSession.max_capacity;

export const getRegistrationPath = (classId: string) => `/registro?class=${encodeURIComponent(classId)}`;

export const getEventAuthPath = (classId: string) => {
  const returnTo = getRegistrationPath(classId);
  return `/auth?mode=event&returnTo=${encodeURIComponent(returnTo)}`;
};

export const normalizeCedula = (value: string) => value.replace(/\D/g, "").padStart(8, "0");

export const isValidUruguayanCedula = (value: string) => {
  const digits = normalizeCedula(value);
  if (!/^\d{8}$/.test(digits)) return false;

  const factors = [2, 9, 8, 7, 6, 3, 4];
  const sum = factors.reduce((total, factor, index) => total + Number(digits[index]) * factor, 0);
  const verifier = (10 - (sum % 10)) % 10;
  return verifier === Number(digits[7]);
};
