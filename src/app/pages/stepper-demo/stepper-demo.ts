import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
  inject,
  OnDestroy,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepper, MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface EnvVariable {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
}

export interface RegionOption {
  id: string;
  name: string;
  location: string;
  flag: string;
  latencyMs: number;
  carbonScore: 'A' | 'B' | 'C';
  co2Label: string;
}

export interface ServiceTypeOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  defaultPort: number;
}

export interface DeploymentLog {
  id: number;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'ready';
  message: string;
}

@Component({
  selector: 'app-stepper-demo',
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatProgressBarModule,
    MatStepperModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './stepper-demo.html',
  styleUrl: './stepper-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperDemoPage implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private deploymentTimerId: ReturnType<typeof setTimeout> | null = null;

  // Stepper UI Controls
  readonly stepperOrientation = signal<StepperOrientation>('horizontal');
  readonly isLinear = signal<boolean>(true);

  // Available options
  readonly serviceTypes: ServiceTypeOption[] = [
    {
      id: 'webapp',
      title: 'Web App & SSR',
      description: 'Angular 22 / Node.js avec rendu hybride et CDN edge',
      icon: 'web',
      defaultPort: 4200,
    },
    {
      id: 'api',
      title: 'API & Microservice',
      description: 'Service REST / gRPC haute performance (Nest, Go, FastAPI)',
      icon: 'api',
      defaultPort: 8080,
    },
    {
      id: 'worker',
      title: 'Worker & Queue',
      description: 'Consommateur de messages asynchrone (Kafka / RabbitMQ)',
      icon: 'sync_alt',
      defaultPort: 9090,
    },
    {
      id: 'cache',
      title: 'Cache & In-Memory',
      description: 'Instance dédiée Redis / Valkey avec réplication automatique',
      icon: 'storage',
      defaultPort: 6379,
    },
  ];

  readonly regions: RegionOption[] = [
    {
      id: 'europe-west9',
      name: 'Europe Ouest (Paris)',
      location: 'France, Île-de-France',
      flag: '🇫🇷',
      latencyMs: 14,
      carbonScore: 'A',
      co2Label: '100% Énergie Bas Carbone',
    },
    {
      id: 'europe-west1',
      name: 'Europe Nord (Belgique)',
      location: 'Belgique, St. Ghislain',
      flag: '🇧🇪',
      latencyMs: 19,
      carbonScore: 'A',
      co2Label: 'Énergie Renouvelable',
    },
    {
      id: 'us-east4',
      name: 'US Est (Virginie du Nord)',
      location: 'USA, Virginia',
      flag: '🇺🇸',
      latencyMs: 82,
      carbonScore: 'B',
      co2Label: 'Standard Grid',
    },
    {
      id: 'asia-northeast1',
      name: 'Asie Est (Tokyo)',
      location: 'Japon, Tokyo',
      flag: '🇯🇵',
      latencyMs: 215,
      carbonScore: 'C',
      co2Label: 'Compensation Carbone',
    },
  ];

  // Forms
  readonly serviceForm: FormGroup = this.fb.group({
    name: [
      'payments-gateway',
      [
        Validators.required,
        Validators.pattern(/^[a-z0-9-]+$/),
        Validators.minLength(3),
        Validators.maxLength(32),
      ],
    ],
    type: ['api', Validators.required],
    region: ['europe-west9', Validators.required],
    repoUrl: ['https://github.com/enterprise/payments-api.git', [Validators.required]],
    branch: ['main', Validators.required],
  });

  // Reactive state for scaling parameters to drive computed cost
  readonly cpuCores = signal<number>(2);
  readonly ramGb = signal<number>(4);
  readonly minReplicas = signal<number>(2);
  readonly maxReplicas = signal<number>(6);
  readonly storageGb = signal<number>(50);
  readonly highAvailability = signal<boolean>(true);

  // Dynamic environment variables
  readonly envVars = signal<EnvVariable[]>([
    { id: '1', key: 'NODE_ENV', value: 'production', isSecret: false },
    { id: '2', key: 'PORT', value: '8080', isSecret: false },
    {
      id: '3',
      key: 'DATABASE_URL',
      value: 'postgresql://db_user:secure_pwd@cloud-db.internal:5432/production',
      isSecret: true,
    },
    { id: '4', key: 'LOG_LEVEL', value: 'info', isSecret: false },
  ]);

  // Deployment Simulation State
  readonly deploymentStatus = signal<'idle' | 'deploying' | 'success' | 'error'>('idle');
  readonly deploymentProgress = signal<number>(0);
  readonly deploymentLogs = signal<DeploymentLog[]>([]);
  readonly deployedEndpoint = signal<string>('');

  // Computed Pricing & Info
  readonly selectedRegion = computed(() => {
    const regId = this.serviceForm.get('region')?.value;
    return this.regions.find((r) => r.id === regId) || this.regions[0];
  });

  readonly selectedType = computed(() => {
    const typeId = this.serviceForm.get('type')?.value;
    return this.serviceTypes.find((t) => t.id === typeId) || this.serviceTypes[0];
  });

  readonly monthlyCost = computed(() => {
    const cpuRate = this.cpuCores() * 16.5; // 16.50€ / vCPU / mois
    const ramRate = this.ramGb() * 4.2; // 4.20€ / GB / mois
    const storageRate = this.storageGb() * 0.1; // 0.10€ / GB SSD / mois
    const haMultiplier = this.highAvailability() ? 1.25 : 1.0;

    const basePerInstance = cpuRate + ramRate;
    const totalCompute = basePerInstance * this.minReplicas() * haMultiplier;
    return Math.round((totalCompute + storageRate) * 100) / 100;
  });

  readonly hourlyCost = computed(() => {
    return Math.round((this.monthlyCost() / 730) * 1000) / 1000;
  });

  readonly maxMonthlyCost = computed(() => {
    const cpuRate = this.cpuCores() * 16.5;
    const ramRate = this.ramGb() * 4.2;
    const storageRate = this.storageGb() * 0.1;
    const haMultiplier = this.highAvailability() ? 1.25 : 1.0;

    const basePerInstance = cpuRate + ramRate;
    const peakCompute = basePerInstance * this.maxReplicas() * haMultiplier;
    return Math.round((peakCompute + storageRate) * 100) / 100;
  });

  readonly secretCount = computed(() => {
    return this.envVars().filter((v) => v.isSecret).length;
  });

  // Methods for Stepper Controls
  setOrientation(val: StepperOrientation): void {
    this.stepperOrientation.set(val);
  }

  toggleLinear(val: boolean): void {
    this.isLinear.set(val);
  }

  // Environment variables management
  addEnvVar(): void {
    const newVar: EnvVariable = {
      id: Date.now().toString(),
      key: '',
      value: '',
      isSecret: false,
    };
    this.envVars.update((list) => [...list, newVar]);
  }

  removeEnvVar(id: string): void {
    this.envVars.update((list) => list.filter((v) => v.id !== id));
  }

  updateEnvKey(id: string, key: string): void {
    this.envVars.update((list) =>
      list.map((v) => (v.id === id ? { ...v, key: key.toUpperCase().trim() } : v)),
    );
  }

  updateEnvValue(id: string, value: string): void {
    this.envVars.update((list) => list.map((v) => (v.id === id ? { ...v, value } : v)));
  }

  toggleSecretVisibility(id: string): void {
    this.envVars.update((list) =>
      list.map((v) => (v.id === id ? { ...v, isSecret: !v.isSecret } : v)),
    );
  }

  loadPreset(preset: 'node' | 'python' | 'go'): void {
    let presets: EnvVariable[] = [];
    if (preset === 'node') {
      presets = [
        { id: 'p1', key: 'NODE_ENV', value: 'production', isSecret: false },
        { id: 'p2', key: 'PORT', value: '3000', isSecret: false },
        { id: 'p3', key: 'LOG_LEVEL', value: 'info', isSecret: false },
        {
          id: 'p4',
          key: 'JWT_SECRET_KEY',
          value: 'k8s_vault_sec_9941a87e5b22',
          isSecret: true,
        },
      ];
    } else if (preset === 'python') {
      presets = [
        { id: 'p1', key: 'PYTHONUNBUFFERED', value: '1', isSecret: false },
        { id: 'p2', key: 'APP_MODULE', value: 'main:app', isSecret: false },
        { id: 'p3', key: 'WORKERS_COUNT', value: '4', isSecret: false },
        {
          id: 'p4',
          key: 'API_SECRET_TOKEN',
          value: 'sk_live_9a87d612e4f01b',
          isSecret: true,
        },
      ];
    } else if (preset === 'go') {
      presets = [
        { id: 'p1', key: 'GIN_MODE', value: 'release', isSecret: false },
        { id: 'p2', key: 'PORT', value: '8080', isSecret: false },
        { id: 'p3', key: 'MAX_IDLE_CONNS', value: '25', isSecret: false },
        {
          id: 'p4',
          key: 'MASTER_ENCRYPTION_KEY',
          value: 'aes256_e4c8109bf3301a9',
          isSecret: true,
        },
      ];
    }

    this.envVars.set(presets);
    this.snackBar.open(`Modèle ${preset.toUpperCase()} injecté avec succès !`, 'OK', {
      duration: 2500,
    });
  }

  // Deployment Simulation
  startDeployment(): void {
    if (this.deploymentStatus() === 'deploying') return;

    this.deploymentStatus.set('deploying');
    this.deploymentProgress.set(10);
    this.deploymentLogs.set([]);

    const serviceName = this.serviceForm.get('name')?.value || 'my-service';
    const region = this.selectedRegion().name;
    const branch = this.serviceForm.get('branch')?.value || 'main';

    const steps: { progress: number; delay: number; log: DeploymentLog }[] = [
      {
        progress: 20,
        delay: 400,
        log: {
          id: 1,
          timestamp: this.getNowTime(),
          level: 'info',
          message: `Validation de la spécification cloud & cluster Kubernetes [${region}]... OK`,
        },
      },
      {
        progress: 40,
        delay: 900,
        log: {
          id: 2,
          timestamp: this.getNowTime(),
          level: 'info',
          message: `Clonage du dépôt Git (branche '${branch}') & vérification des dépendances...`,
        },
      },
      {
        progress: 60,
        delay: 1400,
        log: {
          id: 3,
          timestamp: this.getNowTime(),
          level: 'info',
          message: `Construction de l'image conteneur OCI multi-arch (BuildKit sha256:7f4a01)... Terminé`,
        },
      },
      {
        progress: 75,
        delay: 1900,
        log: {
          id: 4,
          timestamp: this.getNowTime(),
          level: 'info',
          message: `Chiffrement et injection de ${this.envVars().length} variables d'environnement (KMS Vault)...`,
        },
      },
      {
        progress: 90,
        delay: 2400,
        log: {
          id: 5,
          timestamp: this.getNowTime(),
          level: 'info',
          message: `Provisionnement de ${this.minReplicas()} pods (${this.cpuCores()} vCPU, ${this.ramGb()} GB RAM) avec Multi-AZ...`,
        },
      },
      {
        progress: 100,
        delay: 3000,
        log: {
          id: 6,
          timestamp: this.getNowTime(),
          level: 'ready',
          message: `Health checks réussis (HTTP 200). Routeur Ingress SSL certifié Let's Encrypt actif !`,
        },
      },
    ];

    steps.forEach(({ progress, delay, log }, index) => {
      setTimeout(() => {
        if (this.deploymentStatus() !== 'deploying') return;
        this.deploymentProgress.set(progress);
        this.deploymentLogs.update((list) => [...list, log]);

        if (index === steps.length - 1) {
          const endpoint = `https://${serviceName}.cloud.playground.internal`;
          this.deployedEndpoint.set(endpoint);
          this.deploymentStatus.set('success');
          this.snackBar.open('Microservice déployé avec succès sur le cluster ! 🚀', 'Super', {
            duration: 4000,
          });
        }
      }, delay);
    });
  }

  resetAll(stepper: MatStepper): void {
    if (this.deploymentTimerId) {
      clearTimeout(this.deploymentTimerId);
    }
    this.deploymentStatus.set('idle');
    this.deploymentProgress.set(0);
    this.deploymentLogs.set([]);
    this.deployedEndpoint.set('');

    this.serviceForm.reset({
      name: 'payments-gateway',
      type: 'api',
      region: 'europe-west9',
      repoUrl: 'https://github.com/enterprise/payments-api.git',
      branch: 'main',
    });

    this.cpuCores.set(2);
    this.ramGb.set(4);
    this.minReplicas.set(2);
    this.maxReplicas.set(6);
    this.storageGb.set(50);
    this.highAvailability.set(true);

    stepper.reset();
    this.snackBar.open('Assistant et configurations réinitialisés.', 'Fermer', { duration: 2500 });
  }

  copyEndpoint(): void {
    const url = this.deployedEndpoint();
    if (url && navigator.clipboard) {
      navigator.clipboard.writeText(`curl -i ${url}/healthz`);
      this.snackBar.open('Commande cURL copiée dans le presse-papiers !', 'OK', { duration: 2500 });
    }
  }

  private getNowTime(): string {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  }

  ngOnDestroy(): void {
    if (this.deploymentTimerId) {
      clearTimeout(this.deploymentTimerId);
    }
  }
}
