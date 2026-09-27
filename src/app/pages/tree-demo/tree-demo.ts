import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
  inject,
  ViewChild,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export type FileExtension = 'ts' | 'html' | 'scss' | 'json' | 'md' | 'svg';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: string;
  lines?: number;
  extension?: FileExtension;
  lastModified?: string;
  content?: string;
  path?: string;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  isFolder: boolean;
}

const INITIAL_WORKSPACE_DATA: FileNode[] = [
  {
    id: 'root-src',
    name: 'src',
    type: 'folder',
    path: 'src',
    children: [
      {
        id: 'src-app',
        name: 'app',
        type: 'folder',
        path: 'src/app',
        children: [
          {
            id: 'app-core',
            name: 'core',
            type: 'folder',
            path: 'src/app/core',
            children: [
              {
                id: 'core-auth',
                name: 'auth.service.ts',
                type: 'file',
                extension: 'ts',
                size: '2.8 KB',
                lines: 48,
                lastModified: 'Heute 02:40',
                path: 'src/app/core/auth.service.ts',
                content: `import { Injectable, signal, computed } from '@angular/core';

export interface UserSession {
  id: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer';
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<UserSession | null>({
    id: 'usr_849201',
    email: 'alex.dev@cloud.corp',
    role: 'admin',
    token: 'jwt_sec_991823abce019f'
  });

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');

  logout(): void {
    this._currentUser.set(null);
  }
}`,
              },
              {
                id: 'core-interceptor',
                name: 'api.interceptor.ts',
                type: 'file',
                extension: 'ts',
                size: '1.9 KB',
                lines: 34,
                lastModified: 'Gestern 18:22',
                path: 'src/app/core/api.interceptor.ts',
                content: `import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.currentUser();

  if (user?.token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: \`Bearer \${user.token}\`,
        'X-Client-App': 'Angular22-Playground'
      }
    });
    return next(authReq);
  }

  return next(req);
};`,
              },
            ],
          },
          {
            id: 'app-models',
            name: 'models',
            type: 'folder',
            path: 'src/app/models',
            children: [
              {
                id: 'model-user',
                name: 'user.model.ts',
                type: 'file',
                extension: 'ts',
                size: '1.4 KB',
                lines: 26,
                lastModified: '25. Sept. 14:10',
                path: 'src/app/models/user.model.ts',
                content: `export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  createdAt: string;
  permissions: string[];
}

export type UserRole = 'superadmin' | 'tenant_admin' | 'developer';`,
              },
            ],
          },
          {
            id: 'app-config',
            name: 'app.config.ts',
            type: 'file',
            extension: 'ts',
            size: '1.2 KB',
            lines: 22,
            lastModified: '26. Sept. 09:15',
            path: 'src/app/app.config.ts',
            content: `import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { apiInterceptor } from './core/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([apiInterceptor]))
  ]
};`,
          },
          {
            id: 'app-routes',
            name: 'app.routes.ts',
            type: 'file',
            extension: 'ts',
            size: '2.1 KB',
            lines: 38,
            lastModified: 'Heute 01:05',
            path: 'src/app/app.routes.ts',
            content: `import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview',
    loadComponent: () => import('./pages/overview/overview').then(m => m.OverviewPage)
  },
  {
    path: 'tree',
    loadComponent: () => import('./pages/tree-demo/tree-demo').then(m => m.TreeDemoPage)
  }
];`,
          },
        ],
      },
      {
        id: 'src-assets',
        name: 'assets',
        type: 'folder',
        path: 'src/assets',
        children: [
          {
            id: 'assets-logo',
            name: 'logo.svg',
            type: 'file',
            extension: 'svg',
            size: '1.1 KB',
            lines: 15,
            lastModified: '22. Sept. 11:00',
            path: 'src/assets/logo.svg',
            content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="url(#grad)" />
  <text x="50" y="58" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">AG</text>
</svg>`,
          },
          {
            id: 'assets-config',
            name: 'app-config.json',
            type: 'file',
            extension: 'json',
            size: '0.8 KB',
            lines: 18,
            lastModified: '24. Sept. 16:45',
            path: 'src/assets/app-config.json',
            content: `{
  "apiBaseUrl": "https://api.playground.corp/v1",
  "enableZoneless": true,
  "theme": "material3-azure",
  "cacheTtlSeconds": 300,
  "featureFlags": {
    "treeExplorer": true,
    "chartsSvg": true,
    "stepperWizard": true
  }
}`,
          },
        ],
      },
      {
        id: 'src-styles',
        name: 'styles.scss',
        type: 'file',
        extension: 'scss',
        size: '1.8 KB',
        lines: 32,
        lastModified: '26. Sept. 10:30',
        path: 'src/styles.scss',
        content: `@use '@angular/material' as mat;

html, body {
  height: 100%;
  margin: 0;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
}

:root {
  --mat-sys-primary: #0284c7;
  --mat-sys-surface: #ffffff;
  --mat-sys-background: #f8fafc;
}

.dark-theme {
  --mat-sys-surface: #0f172a;
  --mat-sys-background: #020617;
} `,
      },
    ],
  },
  {
    id: 'root-docs',
    name: 'docs',
    type: 'folder',
    path: 'docs',
    children: [
      {
        id: 'docs-arch',
        name: 'architecture.md',
        type: 'file',
        extension: 'md',
        size: '3.2 KB',
        lines: 65,
        lastModified: '23. Sept. 17:15',
        path: 'docs/architecture.md',
        content: `# Technische Architektur & Angular 22 Paradigmen

## Leitprinzipien
- **Zoneless Change Detection** : Native Änderungserkennung ohne zone.js (\`provideZonelessChangeDetection\`).
- **Signal-First** : Reaktiver unidirektionaler Datenfluss mit \`signal()\`, \`computed()\` und \`effect()\`.
- **Material Design 3** : Einheitliche CSS-Tokens und barrierefreie Komponenten.
- **Tree Hierarchies** : Moderne \`MatTree\`-Komponente mit \`childrenAccessor\`.`,
      },
      {
        id: 'docs-deploy',
        name: 'deploy.md',
        type: 'file',
        extension: 'md',
        size: '2.4 KB',
        lines: 42,
        lastModified: '25. Sept. 11:20',
        path: 'docs/deploy.md',
        content: `# Cloud-Bereitstellungsleitfaden

## CI/CD-Pipeline
1. Striktes ESLint-Linting (\`ng lint\`)
2. Statische Typprüfung (\`tsc --noEmit\`)
3. Jest-Unit-Tests in Zoneless-Umgebung (\`setupZonelessTestEnv\`)
4. Optimierter Produktionsbuild für GitHub Pages (\`ng build --base-href /playground/\`)`,
      },
    ],
  },
  {
    id: 'root-package',
    name: 'package.json',
    type: 'file',
    extension: 'json',
    size: '1.8 KB',
    lines: 45,
    lastModified: 'Heute 03:00',
    path: 'package.json',
    content: `{
  "name": "playground",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@angular/animations": "^22.2.0",
    "@angular/cdk": "^22.2.0",
    "@angular/common": "^22.2.0",
    "@angular/core": "^22.2.0",
    "@angular/material": "^22.2.0"
  }
}`,
  },
  {
    id: 'root-readme',
    name: 'README.md',
    type: 'file',
    extension: 'md',
    size: '4.5 KB',
    lines: 95,
    lastModified: 'Heute 02:50',
    path: 'README.md',
    content: `# Angular 22 & Material 3 Enterprise Playground

Technisches Demonstrationslabor für Angular 22 Zoneless, Material Design 3 und Angular CDK.
Autonomer Hochleistungs-Demonstrator auf GitHub Pages.`,
  },
];

@Component({
  selector: 'app-tree-demo',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule,
    MatTreeModule,
    MatSnackBarModule,
  ],
  templateUrl: './tree-demo.html',
  styleUrl: './tree-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeDemoPage {
  private readonly snackBar = inject(MatSnackBar);

  @ViewChild(MatTree) tree!: MatTree<FileNode>;

  // Root tree reactive state
  readonly treeData = signal<FileNode[]>(INITIAL_WORKSPACE_DATA);

  // Search query
  readonly searchQuery = signal<string>('');

  // Selected file or folder
  readonly selectedNode = signal<FileNode | null>(
    INITIAL_WORKSPACE_DATA[0].children![0].children![0].children![0], // auth.service.ts
  );

  // New Node dialog inline state
  readonly isCreatingNode = signal<boolean>(false);
  readonly newNodeType = signal<'file' | 'folder'>('file');
  readonly newNodeName = signal<string>('');

  // MatTree children accessor (Angular Material 18-22 modern API)
  readonly childrenAccessor = (node: FileNode): FileNode[] => node.children ?? [];

  // Predicate for expandable folder nodes
  readonly hasChild = (_: number, node: FileNode): boolean =>
    node.type === 'folder' && !!node.children && node.children.length > 0;

  // Filtered tree reactive computation
  readonly filteredTreeData = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.treeData();
    }
    return this.filterNodes(this.treeData(), query);
  });

  // Breadcrumbs reactive computation
  readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const selected = this.selectedNode();
    if (!selected) {
      return [{ id: 'root', name: 'workspace', isFolder: true }];
    }

    const pathSegments = (selected.path || selected.name).split('/');
    const items: BreadcrumbItem[] = [{ id: 'root', name: 'workspace', isFolder: true }];

    let accPath = '';
    for (let i = 0; i < pathSegments.length; i++) {
      const seg = pathSegments[i];
      accPath = accPath ? `${accPath}/${seg}` : seg;
      const isLast = i === pathSegments.length - 1;
      items.push({
        id: accPath,
        name: seg,
        isFolder: !isLast || selected.type === 'folder',
      });
    }

    return items;
  });

  // Workspace statistics computed
  readonly workspaceStats = computed(() => {
    let fileCount = 0;
    let folderCount = 0;
    let totalLines = 0;

    const traverse = (nodes: FileNode[]): void => {
      for (const node of nodes) {
        if (node.type === 'folder') {
          folderCount++;
          if (node.children) traverse(node.children);
        } else {
          fileCount++;
          totalLines += node.lines || 0;
        }
      }
    };

    traverse(this.treeData());

    return { fileCount, folderCount, totalLines };
  });

  // Split lines for file content viewer
  readonly selectedFileLines = computed<string[]>(() => {
    const node = this.selectedNode();
    if (!node || node.type !== 'file' || !node.content) {
      return [];
    }
    return node.content.split('\n');
  });

  constructor() {
    // Automatically expand tree when filtering
    effect(() => {
      const query = this.searchQuery();
      if (query && this.tree) {
        // Expand all matching nodes
        setTimeout(() => this.tree.expandAll(), 50);
      }
    });
  }

  // Node Selection
  selectNode(node: FileNode): void {
    this.selectedNode.set(node);
  }

  // File Icon helper
  getFileIcon(node: FileNode): string {
    if (node.type === 'folder') return 'folder';
    switch (node.extension) {
      case 'ts':
        return 'code';
      case 'html':
        return 'html';
      case 'scss':
        return 'palette';
      case 'json':
        return 'data_object';
      case 'md':
        return 'article';
      case 'svg':
        return 'image';
      default:
        return 'insert_drive_file';
    }
  }

  // File Color helper
  getFileIconColor(node: FileNode): string {
    if (node.type === 'folder') return '#0284c7';
    switch (node.extension) {
      case 'ts':
        return '#3178c6';
      case 'html':
        return '#ea580c';
      case 'scss':
        return '#db2777';
      case 'json':
        return '#ca8a04';
      case 'md':
        return '#0891b2';
      case 'svg':
        return '#9333ea';
      default:
        return '#64748b';
    }
  }

  // Tree Controls
  expandAll(): void {
    if (this.tree) {
      this.tree.expandAll();
    }
  }

  collapseAll(): void {
    if (this.tree) {
      this.tree.collapseAll();
    }
  }

  // Inline Node Creation
  openCreateNode(type: 'file' | 'folder'): void {
    this.newNodeType.set(type);
    this.newNodeName.set(type === 'file' ? 'new-component.ts' : 'new-feature');
    this.isCreatingNode.set(true);
  }

  cancelCreateNode(): void {
    this.isCreatingNode.set(false);
    this.newNodeName.set('');
  }

  confirmCreateNode(): void {
    const rawName = this.newNodeName().trim();
    if (!rawName) return;

    const type = this.newNodeType();
    let ext: FileExtension | undefined;
    if (type === 'file') {
      const parts = rawName.split('.');
      ext = (parts.length > 1 ? parts[parts.length - 1] : 'ts') as FileExtension;
    }

    const newNode: FileNode = {
      id: `node_${Date.now()}`,
      name: rawName,
      type,
      extension: ext,
      size: type === 'file' ? '0.4 KB' : undefined,
      lines: type === 'file' ? 8 : undefined,
      lastModified: 'Gerade eben',
      children: type === 'folder' ? [] : undefined,
      path: `src/${rawName}`,
      content:
        type === 'file'
          ? `// Erstellt über den MatTree-Explorer\nexport const ${rawName.replace(/[^a-zA-Z0-9]/g, '_')} = {\n  status: 'active',\n  timestamp: Date.now()\n};\n`
          : undefined,
    };

    // Add to selected folder or root
    const selected = this.selectedNode();
    this.treeData.update((root) => {
      if (selected && selected.type === 'folder') {
        return this.addChildToFolder(root, selected.id, newNode);
      }
      return [newNode, ...root];
    });

    this.isCreatingNode.set(false);
    this.selectedNode.set(newNode);
    this.snackBar.open(
      `${type === 'file' ? 'Neue Datei' : 'Neuer Ordner'} erfolgreich erstellt!`,
      'OK',
      {
        duration: 2500,
      },
    );
  }

  // Delete Node
  deleteSelectedNode(): void {
    const selected = this.selectedNode();
    if (!selected) return;

    this.treeData.update((root) => this.removeNodeById(root, selected.id));
    this.selectedNode.set(null);
    this.snackBar.open(`„${selected.name}“ wurde gelöscht.`, 'Schließen', { duration: 2500 });
  }

  // Reset to initial workspace
  resetWorkspace(): void {
    this.treeData.set(INITIAL_WORKSPACE_DATA);
    this.searchQuery.set('');
    this.selectedNode.set(INITIAL_WORKSPACE_DATA[0].children![0].children![0].children![0]);
    this.snackBar.open('Arbeitsbereich zurückgesetzt.', 'OK', { duration: 2500 });
  }

  // Copy code to clipboard
  copyFileContent(): void {
    const node = this.selectedNode();
    if (node?.content && navigator.clipboard) {
      navigator.clipboard.writeText(node.content);
      this.snackBar.open('Inhalt in die Zwischenablage kopiert!', 'Super', { duration: 2500 });
    }
  }

  // Download file
  downloadFile(): void {
    const node = this.selectedNode();
    if (!node || node.type !== 'file' || !node.content) return;

    const blob = new Blob([node.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = node.name;
    link.click();
    URL.revokeObjectURL(url);
    this.snackBar.open(`Download von „${node.name}“ gestartet.`, 'OK', { duration: 2500 });
  }

  // Recursive filtering helper
  private filterNodes(nodes: FileNode[], query: string): FileNode[] {
    const result: FileNode[] = [];

    for (const node of nodes) {
      if (node.type === 'folder' && node.children) {
        const filteredChildren = this.filterNodes(node.children, query);
        const folderMatches = node.name.toLowerCase().includes(query);

        if (folderMatches || filteredChildren.length > 0) {
          result.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children,
          });
        }
      } else if (node.type === 'file') {
        const nameMatches = node.name.toLowerCase().includes(query);
        const extMatches = node.extension?.toLowerCase().includes(query);
        if (nameMatches || extMatches) {
          result.push(node);
        }
      }
    }

    return result;
  }

  private addChildToFolder(nodes: FileNode[], targetId: string, newNode: FileNode): FileNode[] {
    return nodes.map((n) => {
      if (n.id === targetId && n.type === 'folder') {
        return {
          ...n,
          children: [newNode, ...(n.children || [])],
        };
      }
      if (n.children) {
        return {
          ...n,
          children: this.addChildToFolder(n.children, targetId, newNode),
        };
      }
      return n;
    });
  }

  private removeNodeById(nodes: FileNode[], targetId: string): FileNode[] {
    return nodes
      .filter((n) => n.id !== targetId)
      .map((n) => {
        if (n.children) {
          return {
            ...n,
            children: this.removeNodeById(n.children, targetId),
          };
        }
        return n;
      });
  }
}
