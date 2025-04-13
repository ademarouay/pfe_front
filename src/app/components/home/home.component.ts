// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Utilisateur } from '../../models/utilisateur';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Interfaces pour typer les requêtes/réponses Gemini (bonne pratique)
interface GeminiRequestPayload {
  contents: { parts: { text: string }[] }[];
}
interface GeminiResponsePayload {
  candidates: {
    content: {
      parts: { text: string }[];
      role: string;
    };
  }[];
  promptFeedback?: any; // Optionnel: pour gérer les retours de sécurité
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule
  ]
})
export class HomeComponent implements OnInit {
  currentYear = new Date().getFullYear();
  currentUser: Utilisateur | null = null;
  userRole: string = '';

  // --- Propriétés pour l'intégration Gemini ---
  userPrompt: string = '';           // Texte entré par l'utilisateur
  geminiResponse: string = '';       // Réponse reçue de l'API
  isLoading: boolean = false;        // Indicateur pour l'état de chargement
  errorMessage: string = '';         // Message d'erreur à afficher
  private geminiApiKey = environment.geminiApiKey; // Clé API depuis l'environnement

  // === MODIFICATION ICI ===
  // URL de l'API Gemini utilisant maintenant le modèle gemini-1.5-flash
  private geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
  // ========================

  // --- Fin Propriétés Gemini ---

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient // Injection de HttpClient pour faire les appels API
  ) {
     // Avertissement si la clé API semble manquante au démarrage
     if (!this.geminiApiKey || this.geminiApiKey === 'VOTRE_CLE_API_GEMINI_ICI') {
        console.warn("Attention : Clé API Gemini non configurée dans environment.ts. L'assistant IA pourrait ne pas fonctionner.");
     }
  }

  ngOnInit(): void {
    // Récupère l'utilisateur courant au chargement du composant
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userRole = this.currentUser.role; // Définit le rôle pour l'affichage conditionnel
    }
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige vers la page de connexion
  }

  // --- Méthode pour interroger l'API Gemini ---
  // Validation du contenu de la question
  private validatePrompt(prompt: string): { isValid: boolean; error: string } {
    const minLength = 10;
    const maxLength = 200;
    const trimmedPrompt = prompt.trim();

    // Vérifier la longueur minimale et maximale
    if (trimmedPrompt.length < minLength) {
      return { isValid: false, error: `La question doit contenir au moins ${minLength} caractères.` };
    }
    if (trimmedPrompt.length > maxLength) {
      return { isValid: false, error: `La question ne doit pas dépasser ${maxLength} caractères.` };
    }

    // Vérifier si la question est liée au domaine médical
    const medicalKeywords = [
      // Termes généraux de santé
      'santé', 'santée', 'santer', 'santai', 'médical', 'medical', 'medicale', 'médicale', 'medicalle',
      'traitement', 'traitment', 'tretement', 'traitman', 'trétement', 'traitemen',
      'symptômes', 'symptomes', 'simptomes', 'symptome', 'symptôme', 'samptome', 'sinptome', 'symtome', 'synptome',
      'maladie', 'maladi', 'malade', 'malladie', 'maladis', 'malady',
      // Symptômes spécifiques
      'toux', 'tousse', 'tousseur', 'tousseur', 'tousseur', 'tousseur', 'tousse', 'tousse',
      'maladie', 'maladi', 'malade', 'malladie', 'maladis', 'malady',
      'allergie', 'allergie', 'allergien', 'allergie', 'allergien', 'allergien',
      
      // Personnel médical et lieux de soins
      'médecin', 'medecin', 'medsin', 'medsain', 'medecyn', 'médcin', 'toubib', 'tbib',
      'docteur', 'docteure', 'dr', 'doc', 'dokteur', 'dockteur', 'docteure', 'dokter',
      'infirmier', 'infirmière', 'infirmiere', 'infirmié', 'infermier', 'infermière', 'infermyé',
      'hôpital', 'hopital', 'hospital', 'ospital', 'opital', 'hoppital', 'sbitar', 'spital',
      'clinique', 'clinik', 'klinique', 'clinik', 'klinik', 'cliniq', 'klinik',
      'urgence', 'urgences', 'urjence', 'urjance', 'urganse', 'urgensse', 'urjans',
      
      // Maladies respiratoires communes
      'asthme', 'astme', 'asmatique', 'asthmatique', 'asmathique', 'astmatik', 'rabou', 'rebou',
      'bronchite', 'bronchit', 'bronshit', 'bronchyte', 'bronkit', 'bronshite',
      'pneumonie', 'pneumoni', 'pneumony', 'pneumonit', 'pneumonnie', 'pnomoni',
      'tuberculose', 'tuberculos', 'tuberculoz', 'tuberculeuse', 'sil', 'sell',
      
      // Maladies cardiovasculaires
      'hypertension', 'hypertansion', 'hypertention', 'hypertansyon', 'pressure', 'pression',
      'cardiologie', 'kardio', 'cardiaque', 'kardiak', 'coeur', 'cœur', 'cardio', 'galb',
      'artère', 'artere', 'arteriel', 'artériel', 'arterielle', 'arteryel',
      'thrombose', 'trombose', 'tromboz', 'thromboz', 'trombos', 'thrombos',
      
      // Maladies métaboliques
      'diabète', 'diabete', 'diabetique', 'diabétique', 'diabet', 'diabett', 'diabaite', 'sokkar',
      'cholestérol', 'cholesterol', 'kolesterol', 'cholesterole', 'kolestrol', 'cholestorol',
      'thyroïde', 'thyroide', 'tyroide', 'tiroide', 'thyroid', 'tiroid',
      
      // Maladies infectieuses
      'infection', 'infexion', 'infeccion', 'infeksion', 'infecxion', 'infaction', 'khomej',
      'virus', 'viruse', 'virusse', 'viru', 'virose', 'microbe', 'mikrobe', 'miccrobe',
      'bactérie', 'bacterie', 'bactéri', 'baktérie', 'bacterri', 'bactéry', 'jarthoma',
      'hépatite', 'hepatite', 'hepatit', 'hépatit', 'hepatitis', 'hépatitis', 'kebed',
      
      // Symptômes courants
      'fièvre', 'fievre', 'fiavre', 'fiévre', 'fièv', 'fiev', 'sokhana', 'sokhona',
      'grippe', 'gripe', 'grip', 'gripp', 'grype', 'flou', 'flu',
      'rhume', 'rume', 'rhum', 'rum', 'nezla', 'nezle',
      'toux', 'tous', 'tou', 'touh', 'touss', 'tus', 'kohha', 'koha',
      'migraine', 'migrène', 'migrene', 'migréne', 'migren', 'sda3', 'sdaa',
      'douleur', 'doleur', 'douleure', 'douleu', 'doulour', 'doulere', 'waja3', 'weje3',
      
      // Examens et procédures
      'analyse', 'analise', 'analyses', 'analyz', 'analize', 'tahlil', 'tahalil',
      'radiologie', 'radiographie', 'radio', 'scanner', 'scan', 'radiologi', 'tassoir',
      'échographie', 'echographie', 'echografi', 'échografi', 'echo', 'écho', 'scanner',
      'endoscopie', 'endoscopi', 'endoskopi', 'endoscopique', 'endoskopik', 'mandhar',
      
      // Santé mentale
      'anxiété', 'anxiete', 'anxieu', 'anxieté', 'anxiette', 'wasswas', 'waswas',
      'dépression', 'depression', 'depressif', 'dépressif', 'deprime', 'iktieb',
      'insomnie', 'insonnie', 'insomni', 'insomniak', 'sommeil', 'ar9', 'ara9',
      'stress', 'stresse', 'stres', 'stréss', '9la9', 'kla9',
      
      // Médicaments et traitements
      'médicament', 'medicament', 'medoc', 'médoc', 'medicaman', 'dwa', 'dawa',
      'ordonnance', 'ordonance', 'hordonance', 'ordonanse', 'wasfa', 'ordenance',
      'traitement', 'traitment', 'tretement', 'traitman', '3ilej', 'alej',
      'prescription', 'prescripcion', 'prescrire', 'prescrit', 'prescrir', 'préscription',
      
      // Spécialités médicales
      'dermatologie', 'dermato', 'peau', 'po', 'dermatologik', 'jeld', 'jild',
      'gastro', 'gastroentérologie', 'gastroenterologie', 'estomac', 'ma3da', 'gastrique',
      'neurologie', 'neuro', 'neurolog', 'cerveau', 'mokh', 'neurologique',
      'rhumatologie', 'rhumato', 'rhumatism', 'articulation', '3dham', 'romatisme',
      
      // Maladies graves
      'cancer', 'kancer', 'cancér', 'cancere', 'kansser', 'saratan',
      'tumeur', 'tumeure', 'tumour', 'tumoeur', 'waram', 'ouaram',
      'leucémie', 'leucemie', 'leukemie', 'leucemi', 'leukemi', 'saratan dem',
      
      // Urgences médicales
      'crise', 'krize', 'krise', 'crize', 'nouba', 'azma',
      'hémorragie', 'hemorragie', 'hemoragi', 'hémoragi', 'nazif', 'nzif',
      'traumatisme', 'traumatism', 'trauma', 'traumatik', 'sadma', 'sadme',

      // Hôpitaux et cliniques de Tunisie
      'charles nicolle', 'charle nicole', 'charl nikol', 'charlnikolle', 'mestir', 'monastir',
      'sahloul', 'sahlul', 'sahlool', 'sahloule', 'sahhloul', 'sahlul',
      'fattouma bourguiba', 'fatuma bourguiba', 'fatoma borguiba', 'bourguiba', 'borguiba',
      'habib bourguiba', 'habib borguiba', 'hbib bourguiba', 'bourguiba', 'borguiba',
      'rabta', 'la rabta', 'rebta', 'larabta', 'lrabta', 'rabtaa',
      'aziza othmana', 'aziza osmana', '3ziza othmana', 'aziza othman', 'aziza osman',
      'mongi slim', 'monji slim', 'mounji slim', 'slim', 'moungi slim',
      'abderrahmen mami', 'abderrahman mami', 'ariana', '3abdrahmen mami', 'mami ariana',
      'hedi chaker', 'hadi chaker', 'hedi cheker', 'hadi cheker', 'chaker sfax',
      'habib thameur', 'habib tameur', 'hbib thameur', 'thameur tunis', 'tameur',

      // Cliniques privées tunisiennes
      'clinique carthagene', 'carthagene', 'carthagène', 'karthagene', 'carthage',
      'clinique taoufik', 'taoufikk', 'tawfik', 'taoufiq', 'clinik taoufik',
      'clinique amen', 'amen mutuelle', 'clinik amen', 'amen bank', 'amen clinique',
      'clinique hannibal', 'hanibal', 'clinik hannibal', 'annibal', 'hanibal',
      'clinique pasteur', 'pasteur', 'clinik pasteur', 'clinique pastor', 'pastor',
      'clinique soukra', 'soukra', 'clinik soukra', 'sokra', 'clinique sokra',

      // Stages et formation médicale
      'stage', 'stages', 'stagiaire', 'stagiere', 'stajyer', 'stagiare', 'staj', 'staje',
      'internat', 'interne', 'internat medecine', 'internat médecine', 'internat tbib', 'internat tebib',
      'résidanat', 'residanat', 'residana', 'rezidanat', 'resident', 'résident', 'rezidan', 'rezidant',
      'formation', 'formation medicale', 'formation médicale', 'takwin', 'formation santé', 'takwin tebib', 'takwin saha',
      'externat', 'externe', 'externat medecine', 'externat médecine', 'externe hopital', 'extern', 'extarna',
      'rotation', 'rotations', 'rotation stage', 'rotation service', 'rotation hopital', 'dawra', 'dawr',
      // Médicaments en vente libre
      'paracétamol', 'paracetamol', 'parasitamol', 'parastamol', 'doliprane', 'efferalgan', 'dafalgan', 'para', 'parastamoul',
      'ibuprofène', 'ibuprofen', 'ibuprofene', 'ibuproféne', 'ipuprofen', 'profenid', 'brufen', 'ibu', 'ibuprofan',
      'aspirine', 'aspirin', 'aspro', 'asperine', 'asipirin', 'aspirin', 'rhumafen', 'aspirou', 'aspro',
      'antalgique', 'antalgie', 'antalgik', 'antalgiques', 'antalgjik', 'msakken', 'msaken', 'mosakken',
      'antiinflammatoire', 'anti-inflammatoire', 'antiinflamatoire', 'antiinflamatwar', 'voltarene', 'voltaren', 'voltaran', 'voltar',
      
      // Antibiotiques courants
      'amoxicilline', 'amoxiciline', 'amoxicilin', 'amoxicillin', 'amoxil', 'augmentin', 'clamoxyl', 'amoxil', 'augmantin', 'ogmantin',
      'pénicilline', 'penicilline', 'peniciline', 'penicillin', 'penisilin', 'penisiline', 'piniciline', 'pensilin', 'benslin',
      'azithromycine', 'azitromycine', 'azitromicin', 'zithromax', 'azitro', 'azithro', 'zitromax', 'azitromissin', 'zitro',
      'ciprofloxacine', 'siprofloxacine', 'ciprofloxacin', 'cipro', 'ciflox', 'ciplox', 'sipro', 'siproflox', 'ciprox',
      
      // Tests et analyses médicaux
      'prise de sang', 'prisedesang', 'prisdesang', 'analyse sang', 'test sang', 'dam', 'tahlil dam', 'ta7lil dam', 'analyse dem',
      'glycémie', 'glycemie', 'glycemi', 'glysimi', 'taux sucre', 'taux de sucre', 'sokkor', 'sokor', 'ta7lil sokkor',
      'cholestérol', 'cholesterol', 'cholestorol', 'taux cholesterol', 'cholest', 'taux gras', 'kolesterol', 'cholest', 'choles',
      'créatinine', 'creatinine', 'creatinin', 'créatinin', 'fonction rénale', 'reins', 'koli', 'kilwa', 'ta7lil kilwa',
      'hémoglobine', 'hemoglobine', 'hemoglob', 'taux fer', 'fer sang', 'globules rouges', '7did', 'ta7lil 7did', 'korayat 7omr',
      'numération', 'numeration', 'NFS', 'FNS', 'formule sang', 'formule sanguine', 'ta7lil dem kamel', 'ta7lil complet', 'FNS complete',
      'test urine', 'analyse urine', 'urines', 'test pipi', 'analyse pipi', 'boul', 'ta7lil boul', 'analyse bawl', 'pipi test',
      'test covid', 'test corona', 'pcr', 'antigénique', 'antigenique', 'covid test', 'test korona', 'pcr test', 'ta7lil korona'
    ];
    const containsMedicalTerm = medicalKeywords.some(keyword => 
      trimmedPrompt.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!containsMedicalTerm) {
      return { isValid: false, error: 'Veuillez poser une question en rapport avec le domaine médical.' };
    }

    return { isValid: true, error: '' };
  }

  askGemini(): void {
    // Validation : ne pas envoyer si le prompt est vide ou si la clé API manque
    if (!this.userPrompt || this.userPrompt.trim().length === 0) {
      this.errorMessage = "Veuillez saisir une question avant d'envoyer.";
      return;
    }

    // Valider le contenu de la question
    const validation = this.validatePrompt(this.userPrompt);
    if (!validation.isValid) {
      this.errorMessage = validation.error;
      return;
    }
    if (!this.geminiApiKey || this.geminiApiKey === 'VOTRE_CLE_API_GEMINI_ICI') {
         this.errorMessage = "Erreur de configuration : La clé API pour l'assistant IA n'est pas définie.";
         this.isLoading = false; // Assurez-vous que le chargement est désactivé
         return; // Arrêter l'exécution
    }

    // Réinitialiser l'état avant l'appel
    this.isLoading = true;
    this.geminiResponse = '';
    this.errorMessage = '';

    // Préparer les en-têtes et le corps de la requête POST
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestBody: GeminiRequestPayload = {
      contents: [{ parts: [{ text: this.userPrompt.trim() }] }]
      // Possibilité d'ajouter des safetySettings ou generationConfig ici
    };

    // Effectuer l'appel HTTP POST vers la nouvelle URL
    this.http.post<GeminiResponsePayload>(this.geminiApiUrl, requestBody, { headers }).pipe(
      // Traitement de la réponse réussie
      map(response => {
        // Extraction SÛRE du texte de la réponse
        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        // Vérifier aussi les blocages de sécurité
        if (response?.promptFeedback?.blockReason) {
             console.warn(`Gemini a bloqué la réponse. Raison: ${response.promptFeedback.blockReason}`);
             throw new Error(`Votre demande n'a pas pu être traitée car elle a été bloquée pour des raisons de sécurité (${response.promptFeedback.blockReason}). Veuillez reformuler.`);
        }
        if (typeof text === 'string') {
          return text; // Retourne le texte si trouvé et valide
        } else {
          console.error('Réponse Gemini reçue mais texte manquant ou invalide:', response);
          throw new Error('L\'assistant IA a renvoyé une réponse dans un format inattendu.'); // Erreur qui sera traitée par catchError
        }
      }),
      // Gestion centralisée des erreurs (HTTP ou erreurs lancées par map)
      catchError((error: HttpErrorResponse | Error) => {
        console.error('Erreur détaillée interceptée:', error);
        let userMessage = 'Une erreur technique est survenue.'; // Message par défaut

        if (error instanceof HttpErrorResponse) {
            // Erreur HTTP
            const apiError = error?.error?.error?.message; // Message spécifique de l'API Google
            if (error.status === 0) {
                userMessage = "Connexion impossible au service de l'assistant IA. Vérifiez votre réseau.";
            } else if (apiError) {
                userMessage = `Erreur de l'assistant IA: ${apiError}`;
            } else {
                 // Tenter d'afficher plus d'infos si possible pour 404 ou autres erreurs HTTP
                userMessage = `Erreur HTTP ${error.status} (${error.statusText || 'Erreur inconnue'}) lors de la communication avec l'assistant IA. Vérifiez l'URL de l'API ou l'activation du service dans Google Cloud.`;
            }
        } else if (error instanceof Error) {
            // Erreur lancée manuellement (ex: format invalide, blocage sécurité)
            userMessage = error.message;
        }

        // Retourne une nouvelle erreur observable pour le bloc 'error' de subscribe
        return throwError(() => new Error(userMessage));
      })
    ).subscribe({
      // Callback en cas de succès final
      next: (response) => {
        this.geminiResponse = response; // Met à jour la propriété pour l'affichage
        this.isLoading = false;         // Arrête l'indicateur de chargement
      },
      // Callback en cas d'erreur finale (après catchError)
      error: (err) => {
        this.errorMessage = err.message; // Affiche le message d'erreur formaté
        this.isLoading = false;         // Arrête l'indicateur de chargement
      }
    });
  }
  
}