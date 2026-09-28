/**
 * overview demo / shell strings.
 *
 * `de` is the source of truth for this namespace. `en` and `fr` are typed
 * as `Record<NamespaceKey, string>` against it, so adding a key without
 * translating it is a compile error rather than a silent fallback.
 */
export const de = {
  'overview.hero.badge': 'Angular 22 & Material 3 Playground',
  'overview.hero.title': 'Willkommen auf Ihrem Playground',
  'overview.hero.subtitle':
    'Ein interaktiver Raum zur Erkundung der neuesten Funktionen von Angular 22: Reaktivität ohne Zone.js, Material Design 3, Signals und Deferrable Views.',
  'overview.hero.ctaSignals': 'Signals entdecken',
  'overview.hero.ctaMaterial': 'Material-Komponenten',
  'overview.sections.title': 'Experimentierbereiche',
  'overview.card.cta': 'Demo öffnen',
  'overview.runtime.title': 'Laufzeitumgebung',
  'overview.runtime.subtitle': 'Aktuelle Projektkonfiguration',
  'overview.runtime.angularCore': 'Angular Core & CLI',
  'overview.runtime.material': 'Angular Material',
  'overview.runtime.changeDetection': 'Änderungserkennung',
  'overview.runtime.zoneless': 'Zoneless (ohne Zone.js)',
  'overview.runtime.typescript': 'TypeScript',
  'overview.feature.core.title': 'Angular 22 Core & Zoneless',
  'overview.feature.core.description':
    'Zoneless-Änderungserkennung (provideZonelessChangeDetection), Signal-First-Architektur und maximale Performance.',
  'overview.feature.core.tag': 'Performance',
  'overview.feature.material.title': 'Angular Material 3',
  'overview.feature.material.description':
    'Vollständiges Material Design 3 Theming mit Azure- und Blue-Paletten, Tokens und modernen Komponenten.',
  'overview.feature.material.tag': 'UI/UX',
  'overview.feature.defer.title': 'Deferrable Views (@defer)',
  'overview.feature.defer.description':
    'Integriertes Template-Lazy-Loading mit Triggern wie Viewport, Hover, Interaction und Timer.',
  'overview.feature.defer.tag': 'Optimierung',
  'overview.feature.api.title': 'API-Explorer & resource()',
  'overview.feature.api.description':
    'Asynchrone Suche über die öffentliche GitHub-API mit AbortSignal und Fehlerbehandlung.',
  'overview.feature.api.tag': 'Netzwerk',
  'overview.feature.table.title': 'Datentabelle & Dashboard-KPIs',
  'overview.feature.table.description':
    'Interaktive MatTable mit Sortierung, Paginierung, reaktiven Signal-Filtern, Mehrfachauswahl und CSV/JSON-Export.',
  'overview.feature.table.tag': 'Daten',
  'overview.feature.kanban.title': 'Kanban-Board Drag & Drop',
  'overview.feature.kanban.description':
    'Agiles Aufgabenmanagement mit @angular/cdk/drag-drop, verbundenen Spalten, flüssiger Vorschau und Signal-Reaktivität.',
  'overview.feature.kanban.tag': 'Produktivität',
  'overview.feature.forms.title': 'Reaktive & typisierte Formulare',
  'overview.feature.forms.description':
    'Asynchrone debouncte Validierung, erweiterbare FormArray-Sammlungen, Kreuzvalidierung und Passwortstärke-Anzeige.',
  'overview.feature.forms.tag': 'Formulare',
  'overview.feature.virtualScroll.title': 'Virtuelles Scrollen & Benchmark',
  'overview.feature.virtualScroll.description':
    'Sofortiges Rendern von 50.000+ Logs mit @angular/cdk/scrolling, 99,9 % DOM-Reduzierung und 60 FPS in Zoneless.',
  'overview.feature.virtualScroll.tag': 'Performance',
  'overview.feature.charts.title': 'SVG-Visualisierung & Analysen',
  'overview.feature.charts.description':
    'Interaktives Donut-Diagramm, Geschwindigkeits-Balkendiagramm und Sparklines in nativem, reaktivem SVG ohne externe Bibliotheken.',
  'overview.feature.charts.tag': 'Visualisierung',
  'overview.feature.stepper.title': 'Cloud-Bereitstellungsassistent (Stepper)',
  'overview.feature.stepper.description':
    'Mehrstufiger MatStepper M3 Workflow: Dimensionierung, reaktive Live-Kostenberechnung, Secret-Verwaltung und CI/CD-Logs.',
  'overview.feature.stepper.tag': 'Workflow',
  'overview.feature.tree.title': 'Datei-Explorer (MatTree)',
  'overview.feature.tree.description':
    'Projekt-Baumstruktur mit MatTree M3 und childrenAccessor: Sofortfilter, Breadcrumbs, Knotenverwaltung und Code-Viewer.',
  'overview.feature.tree.tag': 'Hierarchie',
} as const;

export type NamespaceKey = keyof typeof de;

export const en: Record<NamespaceKey, string> = {
  'overview.hero.badge': 'Angular 22 & Material 3 Playground',
  'overview.hero.title': 'Welcome to Your Playground',
  'overview.hero.subtitle':
    'An interactive space for exploring the latest Angular 22 features: reactivity without Zone.js, Material Design 3, Signals, and deferrable views.',
  'overview.hero.ctaSignals': 'Explore Signals',
  'overview.hero.ctaMaterial': 'Material Components',
  'overview.sections.title': 'Experimentation Areas',
  'overview.card.cta': 'Open Demo',
  'overview.runtime.title': 'Runtime Environment',
  'overview.runtime.subtitle': 'Current Project Configuration',
  'overview.runtime.angularCore': 'Angular Core & CLI',
  'overview.runtime.material': 'Angular Material',
  'overview.runtime.changeDetection': 'Change Detection',
  'overview.runtime.zoneless': 'Zoneless (without Zone.js)',
  'overview.runtime.typescript': 'TypeScript',
  'overview.feature.core.title': 'Angular 22 Core & Zoneless',
  'overview.feature.core.description':
    'Zoneless change detection (provideZonelessChangeDetection), signal-first architecture, and maximum performance.',
  'overview.feature.core.tag': 'Performance',
  'overview.feature.material.title': 'Angular Material 3',
  'overview.feature.material.description':
    'Complete Material Design 3 theming with Azure and Blue palettes, tokens, and modern components.',
  'overview.feature.material.tag': 'UI/UX',
  'overview.feature.defer.title': 'Deferrable Views (@defer)',
  'overview.feature.defer.description':
    'Built-in template lazy loading with triggers like viewport, hover, interaction, and timer.',
  'overview.feature.defer.tag': 'Optimization',
  'overview.feature.api.title': 'API Explorer & resource()',
  'overview.feature.api.description':
    'Asynchronous search via the public GitHub API with AbortSignal and error handling.',
  'overview.feature.api.tag': 'Network',
  'overview.feature.table.title': 'Data Table & Dashboard KPIs',
  'overview.feature.table.description':
    'Interactive MatTable with sorting, pagination, reactive signal filters, multi-selection, and CSV/JSON export.',
  'overview.feature.table.tag': 'Data',
  'overview.feature.kanban.title': 'Kanban Drag & Drop',
  'overview.feature.kanban.description':
    'Agile task management with @angular/cdk/drag-drop, linked columns, smooth previews, and signal reactivity.',
  'overview.feature.kanban.tag': 'Productivity',
  'overview.feature.forms.title': 'Reactive & Typed Forms',
  'overview.feature.forms.description':
    'Asynchronous validation with debounce, extensible FormArray collections, cross-field validation, and a password strength indicator.',
  'overview.feature.forms.tag': 'Forms',
  'overview.feature.virtualScroll.title': 'Virtual Scrolling & Benchmark',
  'overview.feature.virtualScroll.description':
    'Instant rendering of 50,000+ logs with @angular/cdk/scrolling, 99.9% DOM reduction, and 60 FPS in zoneless mode.',
  'overview.feature.virtualScroll.tag': 'Performance',
  'overview.feature.charts.title': 'SVG Visualization & Analytics',
  'overview.feature.charts.description':
    'Interactive donut chart, speed bar chart, and sparklines in native, reactive SVG with no external libraries.',
  'overview.feature.charts.tag': 'Visualization',
  'overview.feature.stepper.title': 'Cloud Deployment Assistant (Stepper)',
  'overview.feature.stepper.description':
    'Multi-stage MatStepper M3 workflow: sizing, reactive live cost calculation, secret management, and CI/CD logs.',
  'overview.feature.stepper.tag': 'Workflow',
  'overview.feature.tree.title': 'File Explorer (MatTree)',
  'overview.feature.tree.description':
    'Project tree with MatTree M3 and childrenAccessor: instant filter, breadcrumbs, node management, and code viewer.',
  'overview.feature.tree.tag': 'Hierarchy',
};

export const fr: Record<NamespaceKey, string> = {
  'overview.hero.badge': 'Playground Angular 22 & Material 3',
  'overview.hero.title': 'Bienvenue sur votre Playground',
  'overview.hero.subtitle':
    "Un espace interactif pour explorer les dernières fonctionnalités d'Angular 22 : réactivité sans Zone.js, Material Design 3, Signals et vues différables.",
  'overview.hero.ctaSignals': 'Découvrir les Signals',
  'overview.hero.ctaMaterial': 'Composants Material',
  'overview.sections.title': "Espaces d'expérimentation",
  'overview.card.cta': 'Ouvrir la démo',
  'overview.runtime.title': "Environnement d'exécution",
  'overview.runtime.subtitle': 'Configuration actuelle du projet',
  'overview.runtime.angularCore': 'Angular Core & CLI',
  'overview.runtime.material': 'Angular Material',
  'overview.runtime.changeDetection': 'Détection de changement',
  'overview.runtime.zoneless': 'Zoneless (sans Zone.js)',
  'overview.runtime.typescript': 'TypeScript',
  'overview.feature.core.title': 'Angular 22 Core & Zoneless',
  'overview.feature.core.description':
    'Détection de changement zoneless (provideZonelessChangeDetection), architecture signal-first et performances maximales.',
  'overview.feature.core.tag': 'Performance',
  'overview.feature.material.title': 'Angular Material 3',
  'overview.feature.material.description':
    'Thème Material Design 3 complet avec palettes Azure et Blue, tokens et composants modernes.',
  'overview.feature.material.tag': 'UI/UX',
  'overview.feature.defer.title': 'Vues différables (@defer)',
  'overview.feature.defer.description':
    'Chargement paresseux intégré au template avec déclencheurs viewport, hover, interaction et timer.',
  'overview.feature.defer.tag': 'Optimisation',
  'overview.feature.api.title': "Explorateur d'API & resource()",
  'overview.feature.api.description':
    "Recherche asynchrone via l'API publique GitHub avec AbortSignal et gestion des erreurs.",
  'overview.feature.api.tag': 'Réseau',
  'overview.feature.table.title': 'Tableau de données & KPIs de dashboard',
  'overview.feature.table.description':
    'MatTable interactive avec tri, pagination, filtres réactifs par signals, sélection multiple et export CSV/JSON.',
  'overview.feature.table.tag': 'Données',
  'overview.feature.kanban.title': 'Kanban Drag & Drop',
  'overview.feature.kanban.description':
    'Gestion agile des tâches avec @angular/cdk/drag-drop, colonnes connectées, aperçu fluide et réactivité par signals.',
  'overview.feature.kanban.tag': 'Productivité',
  'overview.feature.forms.title': 'Formulaires réactifs & typés',
  'overview.feature.forms.description':
    'Validation asynchrone avec debounce, collections FormArray extensibles, validation croisée et indicateur de robustesse du mot de passe.',
  'overview.feature.forms.tag': 'Formulaires',
  'overview.feature.virtualScroll.title': 'Défilement virtuel & Benchmark',
  'overview.feature.virtualScroll.description':
    'Rendu instantané de 50 000+ logs avec @angular/cdk/scrolling, 99,9 % de réduction du DOM et 60 FPS en zoneless.',
  'overview.feature.virtualScroll.tag': 'Performance',
  'overview.feature.charts.title': 'Visualisation SVG & analyses',
  'overview.feature.charts.description':
    'Diagramme en anneau, histogramme et sparklines en SVG natif et réactif, sans bibliothèque externe.',
  'overview.feature.charts.tag': 'Visualisation',
  'overview.feature.stepper.title': 'Assistant de déploiement cloud (Stepper)',
  'overview.feature.stepper.description':
    'Workflow MatStepper M3 multi-étapes : dimensionnement, calcul de coût réactif, gestion des secrets et logs CI/CD.',
  'overview.feature.stepper.tag': 'Workflow',
  'overview.feature.tree.title': 'Explorateur de fichiers (MatTree)',
  'overview.feature.tree.description':
    'Arborescence de projet avec MatTree M3 et childrenAccessor : filtre instantané, fil d’Ariane, gestion des nœuds et visionneuse de code.',
  'overview.feature.tree.tag': 'Hiérarchie',
};
