import { Utilisateur } from './utilisateur';

export interface LoginRequest {
    codeCnam: number;
    motDePasse: string;
  }
  
  export interface LoginResponse {
    token?: string;
    utilisateur: Utilisateur;
    message?: string;
  }