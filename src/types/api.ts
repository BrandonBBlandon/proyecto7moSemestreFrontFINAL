export type SmokeStatus = "normal" | "warning" | "alarm";

export type ApiEnvelope<T> = {
  ok: boolean;
  data?: T;
  items?: T;
  message?: string;
  error?: string;
};

export type Reading = {
  id?: number;
  deviceId?: number | string;
  sensorValue?: number;
  smokeValue?: number;
  status?: SmokeStatus | string;
  riskLevel?: SmokeStatus | string;
  createdAt?: string;
  date?: string;
};

export type CurrentMonitoring = {
  current?: Reading | null;
  latestReading?: Reading | null;
  sensorValue?: number;
  smokeValue?: number;
  status?: SmokeStatus | string;
  riskLevel?: SmokeStatus | string;
  deviceId?: number | string;
  createdAt?: string;
  thresholds?: {
    warning?: number;
    alarm?: number;
  };
};

export type ReportSummary = {
  totalReadings?: number;
  totalIncidents?: number;
  alarmReadings?: number;
  warningReadings?: number;
  normalReadings?: number;
  totalAlarmSeconds?: number;
  maxSmokeValue?: number;
  avgSmokeValue?: number;
  riskLevel?: SmokeStatus | string;
};

export type DailyReport = {
  ok: boolean;
  date?: string;
  summary?: ReportSummary;
  items?: Reading[];
  message?: string;
};

export type AggregatedReportItem = ReportSummary & {
  date?: string;
};

export type RangeReport = {
  ok: boolean;
  from?: string;
  to?: string;
  items?: AggregatedReportItem[];
  summary?: ReportSummary;
  message?: string;
};

export type MonthlyReport = {
  ok: boolean;
  year?: number;
  month?: number;
  summary?: ReportSummary;
  items?: AggregatedReportItem[];
  message?: string;
};

export type HealthResponse = {
  ok?: boolean;
  status?: string;
  message?: string;
  database?: string;
};
