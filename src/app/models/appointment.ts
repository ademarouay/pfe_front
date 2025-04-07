export interface Appointment {
  id?: number;
  date: Date;
  time: string;
  type: string;
  doctorName: string;
  location: string;
  patientId: number;
  patientName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  statusClass?: string;
  consultationCount?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}