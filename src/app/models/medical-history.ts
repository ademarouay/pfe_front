export interface MedicalHistory {
  id?: number;
  date: Date;
  diagnosis: string;
  treatment: string;
  type: string;
  description: string;
  doctorName: string;
  facility: string;
  patientId: number;
  attachments?: string[];
}