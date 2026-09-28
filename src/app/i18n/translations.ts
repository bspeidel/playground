import { DE, FR, type LocaleId } from './locales';

/**
 * German is the source of truth. French is typed against it, so adding a key
 * without translating it is a compile error rather than a silent fallback to
 * the key name.
 */
const de = {
  // ── Application shell ───────────────────────────────────────────────────
  'shell.a11y.toggleNav': 'Navigationsmenü umschalten',
  'shell.a11y.switchToLight': 'Zu hellem Modus wechseln',
  'shell.a11y.switchToDark': 'Zu dunklem Modus wechseln',
  'shell.a11y.language': 'Sprache wechseln',
  'shell.footer':
    'Interaktiver Angular 22 Playground • Zoneless-Änderungserkennung • Angular Material 3',

  // ── Navigation ──────────────────────────────────────────────────────────
  'nav.category.general': 'Allgemein',
  'nav.category.angular': 'Angular-Funktionen & Performance',
  'nav.category.ui': 'UI-Komponenten & Demos',
  'nav.overview': 'Übersicht',
  'nav.signals': 'Signals & Zoneless',
  'nav.defer': 'Defer (@defer)',
  'nav.api': 'API & Netzwerk',
  'nav.virtualScroll': 'Virtuelles Scrollen & Performance',
  'nav.material': 'Material 3',
  'nav.forms': 'Typisierte Formulare',
  'nav.table': 'Datentabelle & KPIs',
  'nav.kanban': 'Kanban-Board',
  'nav.charts': 'Analysen & Diagramme',
  'nav.stepper': 'Bereitstellungsassistent',
  'nav.tree': 'Datei-Explorer',

  // ── Overview ────────────────────────────────────────────────────────────
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

  // ── Overview feature cards ──────────────────────────────────────────────
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

  // ── Signals & Zoneless ──────────────────────────────────────────────────
  'signals.page.title': 'Angular Signals & Zoneless',
  'signals.page.subtitle':
    'Demonstration des granularen reaktiven Zustands, der Zoneless-Änderungserkennung und der neuen Angular 22 Primitiven (<code>linkedSignal</code> und <code>resource</code>).',

  'signals.counter.title': 'Reaktiver Zähler',
  'signals.counter.subtitle': '<code>signal()</code> &amp; <code>computed()</code>',
  'signals.counter.valueLabel': 'Wert (Signal)',
  'signals.counter.doubleLabel': 'Doppelt (computed)',
  'signals.counter.highThreshold': 'Hoher Schwellenwert erreicht (≥ 10), automatisch berechnet!',
  'signals.counter.increment': 'Inkrementieren',
  'signals.counter.decrement': 'Dekrementieren',
  'signals.counter.reset': 'Zurücksetzen',

  'signals.async.title': 'Zoneless Asynchron',
  'signals.async.subtitle': 'Aktualisierung via <code>setInterval</code> ohne Zone.js',
  'signals.async.explanation':
    'Im <strong>Zoneless</strong>-Modus erkennt Angular Signale automatisch ohne globales Abfangen asynchroner APIs durch Zone.js.',
  'signals.async.progress': 'Fortschritt : {count} / 10',
  'signals.async.start': 'Asynchronen Timer starten',
  'signals.async.reset': 'Zurücksetzen',

  'signals.plan.title': 'Angular 22 <code>linkedSignal()</code>',
  'signals.plan.subtitle': 'Modifizierbares Signal synchronisiert mit Quell-Signal',
  'signals.plan.explanation':
    'Das Signal <code>planQuantity</code> setzt sich automatisch auf das Standardkontingent des gewählten Tarifs zurück, bleibt aber direkt durch den Benutzer veränderbar.',
  'signals.plan.perUser': '/Benutzer',
  'signals.plan.licenses': 'Lizenzen (linkedSignal) :',
  'signals.plan.monthlyTotal': 'Monatliche Gesamtsumme :',

  'signals.resource.title': 'Angular 22 <code>resource()</code>',
  'signals.resource.subtitle': 'Deklaratives asynchrones Laden von Daten',
  'signals.resource.explanation':
    'Die API <code>resource()</code> verwaltet den asynchronen Lebenszyklus (Anfrage, Ladezustand, Abbruch) vollständig reaktiv.',
  'signals.resource.categoryFrameworks': 'Frameworks',
  'signals.resource.categoryTools': 'DX-Tools',
  'signals.resource.categoryPatterns': 'Patterns',
  'signals.resource.loading': 'Laden der Daten via resource()...',
  'signals.resource.reload': 'Ressource neu laden',

  'signals.cart.title': 'Reaktiver Warenkorb & Live-Filter',
  'signals.cart.subtitle': 'Granulare Zustandskontrolle einer Sammlung mit Signals',
  'signals.cart.searchLabel': 'Artikel suchen',
  'signals.cart.searchPlaceholder': 'Z. B.: T-Shirt...',
  'signals.cart.itemsLabel': 'Artikel :',
  'signals.cart.totalLabel': 'Gesamt :',
  'signals.cart.perUnit': '/ Einheit',
  'signals.cart.a11y.decreaseQuantity': 'Menge verringern',
  'signals.cart.a11y.increaseQuantity': 'Menge erhöhen',
  'signals.cart.a11y.removeItem': 'Artikel entfernen',
  'signals.cart.empty': 'Kein Artikel entspricht dem Filter.',
  'signals.cart.addHeading': 'Neuen Artikel hinzufügen',
  'signals.cart.nameLabel': 'Artikelname',
  'signals.cart.namePlaceholder': 'Z. B.: Angular-Kappe',
  'signals.cart.priceLabel': 'Preis (€)',
  'signals.cart.add': 'Hinzufügen',
  'signals.cart.item.angularTshirt': 'Angular 22 T-Shirt',
  'signals.cart.item.materialMug': 'Material 3 Mug',
  'signals.cart.item.zonelessStickers': 'Zoneless Stickers Pack',

  // ── Deferrable Views (@defer) ───────────────────────────────────────────
  'defer.page.title': 'Deferrable Views (<code>@defer</code>)',
  'defer.page.subtitle':
    'Native Performance-Optimierung von Angular zum granularen, verzögerten Laden von Komponenten.',
  'defer.interaction.title': 'Trigger : <code>on interaction</code>',
  'defer.interaction.subtitle': 'Verzögertes Laden beim Klick auf den Trigger-Button',
  'defer.interaction.placeholder': 'Der Inhalt wartet auf Benutzerinteraktion.',
  'defer.interaction.action': 'Klicken zum Laden der Komponente',
  'defer.interaction.loading': 'JavaScript-Chunk wird geladen...',
  'defer.hover.title': 'Trigger : <code>on hover</code>',
  'defer.hover.subtitle': 'Ladevorgang ausgelöst durch Überfahren mit dem Mauszeiger',
  'defer.hover.placeholder':
    'Bewegen Sie die Maus über diesen Bereich, um das sofortige Laden auszulösen!',
  'defer.hover.loading': 'Laden durch Hover ausgelöst...',
  'defer.timer.title': 'Trigger : <code>on timer(2s)</code>',
  'defer.timer.subtitle': 'Automatisches verzögertes Laden nach 2 Sekunden',
  'defer.timer.placeholder': 'Countdown von 2 Sekunden vor dem automatischen Laden...',
  'defer.timer.loading': 'Automatisches Laden nach Verzögerung...',
  'defer.heavy.title': 'Komponente bei Bedarf geladen (@defer)!',
  'defer.heavy.description':
    'Diese Komponente und ihr JavaScript-Code wurden erst heruntergeladen und instanziiert, als die Trigger-Bedingung erfüllt war.',

  // ── API-Explorer ────────────────────────────────────────────────────────
  'api.page.title': 'API-Explorer & <code>resource()</code> Netzwerk',
  'api.page.subtitle':
    'Live-Suche über die öffentliche GitHub-API zur Demonstration der nativen Netzwerk-Reaktivität von Angular 22, asynchronem Statusmanagement und automatischem Abbruch laufender Anfragen via <code>AbortSignal</code>.',
  'api.search.label': 'GitHub-Repository suchen',
  'api.search.placeholder': 'Z. B.: angular, rxjs, vite...',
  'api.sort.label': 'Sortieren nach',
  'api.sort.stars': 'Sterne (Stars)',
  'api.sort.forks': 'Forks',
  'api.sort.updated': 'Kürzlich aktualisiert',
  'api.actions.refresh': 'Aktualisieren',
  'api.quickTags.label': 'Schnellvorschläge :',
  'api.status.loading': 'Ladevorgang läuft via resource()...',
  'api.status.error': 'Anfragefehler',
  'api.status.success': 'Repositories gefunden',
  'api.metrics.aborted': 'Automatisch abgebrochene Anfragen (AbortSignal) :',
  'api.metrics.debounce': 'Eingaben werden {ms} ms entprellt',
  'api.error.title': 'Repositories konnten nicht geladen werden',
  'api.error.retry': 'Erneut versuchen',
  'api.repo.noDescription': 'Keine Beschreibung angegeben.',
  'api.repo.viewOnGithub': 'Auf GitHub ansehen',
  'api.empty.title': 'Keine Ergebnisse gefunden für "{query}"',
  'api.empty.hint': 'Versuchen Sie eine andere Suche wie "angular", "typescript" oder "material".',
} as const;

export type TranslationKey = keyof typeof de;

const fr: Record<TranslationKey, string> = {
  // ── Coquille applicative ────────────────────────────────────────────────
  'shell.a11y.toggleNav': 'Afficher ou masquer le menu de navigation',
  'shell.a11y.switchToLight': 'Passer en mode clair',
  'shell.a11y.switchToDark': 'Passer en mode sombre',
  'shell.a11y.language': 'Changer de langue',
  'shell.footer':
    'Playground Angular 22 interactif • Détection de changement zoneless • Angular Material 3',

  // ── Navigation ──────────────────────────────────────────────────────────
  'nav.category.general': 'Général',
  'nav.category.angular': 'Fonctionnalités Angular & Performance',
  'nav.category.ui': 'Composants UI & Démos',
  'nav.overview': "Vue d'ensemble",
  'nav.signals': 'Signals & Zoneless',
  'nav.defer': 'Defer (@defer)',
  'nav.api': 'API & Réseau',
  'nav.virtualScroll': 'Défilement virtuel & Performance',
  'nav.material': 'Material 3',
  'nav.forms': 'Formulaires typés',
  'nav.table': 'Tableau de données & KPIs',
  'nav.kanban': 'Tableau Kanban',
  'nav.charts': 'Analyses & Graphiques',
  'nav.stepper': 'Assistant de déploiement',
  'nav.tree': 'Explorateur de fichiers',

  // ── Vue d'ensemble ──────────────────────────────────────────────────────
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

  // ── Cartes de fonctionnalités ───────────────────────────────────────────
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

  // ── Signals & Zoneless ──────────────────────────────────────────────────
  'signals.page.title': 'Signals Angular & Zoneless',
  'signals.page.subtitle':
    "Démonstration de l’état réactif granulaire, de la détection de changement zoneless et des nouvelles primitives d'Angular 22 (<code>linkedSignal</code> et <code>resource</code>).",

  'signals.counter.title': 'Compteur réactif',
  'signals.counter.subtitle': '<code>signal()</code> &amp; <code>computed()</code>',
  'signals.counter.valueLabel': 'Valeur (Signal)',
  'signals.counter.doubleLabel': 'Double (computed)',
  'signals.counter.highThreshold': 'Seuil élevé atteint (≥ 10), calculé automatiquement !',
  'signals.counter.increment': 'Incrémenter',
  'signals.counter.decrement': 'Décrémenter',
  'signals.counter.reset': 'Réinitialiser',

  'signals.async.title': 'Zoneless asynchrone',
  'signals.async.subtitle': 'Mise à jour via <code>setInterval</code> sans Zone.js',
  'signals.async.explanation':
    'En mode <strong>Zoneless</strong>, Angular détecte automatiquement les Signals sans interception globale des API asynchrones par Zone.js.',
  'signals.async.progress': 'Progression : {count} / 10',
  'signals.async.start': 'Démarrer le timer asynchrone',
  'signals.async.reset': 'Réinitialiser',

  'signals.plan.title': 'Angular 22 <code>linkedSignal()</code>',
  'signals.plan.subtitle': 'Signal modifiable synchronisé avec le signal source',
  'signals.plan.explanation':
    'Le signal <code>planQuantity</code> se réinitialise automatiquement sur le quota par défaut du forfait choisi, tout en restant directement modifiable par l’utilisateur.',
  'signals.plan.perUser': '/utilisateur',
  'signals.plan.licenses': 'Licences (linkedSignal) :',
  'signals.plan.monthlyTotal': 'Total mensuel :',

  'signals.resource.title': 'Angular 22 <code>resource()</code>',
  'signals.resource.subtitle': 'Chargement de données asynchrone et déclaratif',
  'signals.resource.explanation':
    'L’API <code>resource()</code> gère entièrement de façon réactive le cycle de vie asynchrone (requête, état de chargement, annulation).',
  'signals.resource.categoryFrameworks': 'Frameworks',
  'signals.resource.categoryTools': 'Outils DX',
  'signals.resource.categoryPatterns': 'Patterns',
  'signals.resource.loading': 'Chargement des données via resource()...',
  'signals.resource.reload': 'Recharger la ressource',

  'signals.cart.title': 'Panier réactif & filtre en direct',
  'signals.cart.subtitle': 'Contrôle d’état granulaire d’une collection avec les Signals',
  'signals.cart.searchLabel': 'Rechercher un article',
  'signals.cart.searchPlaceholder': 'Ex. : T-shirt...',
  'signals.cart.itemsLabel': 'Articles :',
  'signals.cart.totalLabel': 'Total :',
  'signals.cart.perUnit': '/ unité',
  'signals.cart.a11y.decreaseQuantity': 'Diminuer la quantité',
  'signals.cart.a11y.increaseQuantity': 'Augmenter la quantité',
  'signals.cart.a11y.removeItem': 'Supprimer l’article',
  'signals.cart.empty': 'Aucun article ne correspond au filtre.',
  'signals.cart.addHeading': 'Ajouter un nouvel article',
  'signals.cart.nameLabel': 'Nom de l’article',
  'signals.cart.namePlaceholder': 'Ex. : casquette Angular',
  'signals.cart.priceLabel': 'Prix (€)',
  'signals.cart.add': 'Ajouter',
  'signals.cart.item.angularTshirt': 'T-shirt Angular 22',
  'signals.cart.item.materialMug': 'Mug Material 3',
  'signals.cart.item.zonelessStickers': 'Pack de stickers Zoneless',

  // ── Vues différables (@defer) ───────────────────────────────────────────
  'defer.page.title': 'Vues différables (<code>@defer</code>)',
  'defer.page.subtitle':
    'Optimisation de performance native d’Angular pour un chargement granulaire et différé des composants.',
  'defer.interaction.title': 'Déclencheur : <code>on interaction</code>',
  'defer.interaction.subtitle': 'Chargement différé au clic sur le bouton déclencheur',
  'defer.interaction.placeholder': 'Le contenu attend une interaction de l’utilisateur.',
  'defer.interaction.action': 'Cliquez pour charger le composant',
  'defer.interaction.loading': 'Chargement du chunk JavaScript...',
  'defer.hover.title': 'Déclencheur : <code>on hover</code>',
  'defer.hover.subtitle': 'Chargement déclenché au survol avec le pointeur de la souris',
  'defer.hover.placeholder':
    'Survolez cette zone avec la souris pour déclencher le chargement instantané !',
  'defer.hover.loading': 'Chargement déclenché au survol...',
  'defer.timer.title': 'Déclencheur : <code>on timer(2s)</code>',
  'defer.timer.subtitle': 'Chargement différé automatique après 2 secondes',
  'defer.timer.placeholder': 'Compte à rebours de 2 secondes avant le chargement automatique...',
  'defer.timer.loading': 'Chargement automatique après le délai...',
  'defer.heavy.title': 'Composant chargé à la demande (@defer) !',
  'defer.heavy.description':
    'Ce composant et son code JavaScript n’ont été téléchargés et instanciés qu’une fois la condition du déclencheur remplie.',

  // ── Explorateur d'API ───────────────────────────────────────────────────
  'api.page.title': 'Explorateur d’API & réseau avec <code>resource()</code>',
  'api.page.subtitle':
    'Recherche en direct via l’API publique GitHub pour démontrer la réactivité réseau native d’Angular 22, la gestion asynchrone des états et l’annulation automatique des requêtes en cours via <code>AbortSignal</code>.',
  'api.search.label': 'Rechercher un dépôt GitHub',
  'api.search.placeholder': 'Ex. : angular, rxjs, vite...',
  'api.sort.label': 'Trier par',
  'api.sort.stars': 'Étoiles (Stars)',
  'api.sort.forks': 'Forks',
  'api.sort.updated': 'Récemment mis à jour',
  'api.actions.refresh': 'Actualiser',
  'api.quickTags.label': 'Suggestions rapides :',
  'api.status.loading': 'Chargement en cours via resource()...',
  'api.status.error': 'Erreur de requête',
  'api.status.success': 'dépôts trouvés',
  'api.metrics.aborted': 'Requêtes annulées automatiquement (AbortSignal) :',
  'api.metrics.debounce': 'Les saisies sont débouncées de {ms} ms',
  'api.error.title': 'Impossible de charger les dépôts',
  'api.error.retry': 'Réessayer',
  'api.repo.noDescription': 'Aucune description fournie.',
  'api.repo.viewOnGithub': 'Voir sur GitHub',
  'api.empty.title': 'Aucun résultat trouvé pour « {query} »',
  'api.empty.hint':
    'Essayez une autre recherche comme « angular », « typescript » ou « material ».',
};

export const TRANSLATIONS: Record<LocaleId, Record<string, string>> = {
  [DE]: de,
  [FR]: fr,
};
