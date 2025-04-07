export interface Prescription {
  id?: number;
  patientCodeCnam: number;
  medecinId: number;
  dateCreation: Date;
  dateExpiration?: Date;
  status: PrescriptionStatus;
  type: PrescriptionType;
  contenu: string;
  commentaire?: string;
  signature?: string;
  validationCnam?: {
    validePar: number;
    dateValidation: Date;
    commentaire?: string;
  };
  // Additional properties for dashboard display
  date?: Date;
  statusClass?: string;
  medications?: string[];
  doctorName?: string;
}

export enum PrescriptionStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDEE = 'VALIDEE',
  REFUSEE = 'REFUSEE',
  EXECUTEE = 'EXECUTEE',
  EXPIREE = 'EXPIREE'
}

export enum PrescriptionType {
  MEDICAMENT = 'MEDICAMENT',
  EXAMEN = 'EXAMEN',
  HOSPITALISATION = 'HOSPITALISATION',
  SOIN = 'SOIN'
}