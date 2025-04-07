export enum Role {
  MEDECIN = 'MEDECIN',
  PHARMACIEN = 'PHARMACIEN',
  HOPITALISATION = 'HOPITALISATION',
  LABORATOIRE = 'LABORATOIRE',
  HOPITAL = 'HOPITAL',
  CNAM = 'CNAM',
  PATIENT = 'PATIENT',
  ADMIN = 'ADMIN'
}
  
  export interface Utilisateur {
  id?: number;
  codeCnam: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  adresse: string;
  telephone: string;
  active?: boolean;
  dateCreation?: Date;
  dateNaissance?: Date;
  numeroTelephone?: string;
  signature?: string;
  specialite?: string;
  etablissement?: string;
  numeroLicence?: string;
}