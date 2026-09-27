import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TreeDemoPage, FileNode } from './tree-demo';

describe('TreeDemoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeDemoPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create the tree demo component', () => {
    const fixture = TestBed.createComponent(TreeDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with workspace data and stats', () => {
    const fixture = TestBed.createComponent(TreeDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.treeData().length).toBeGreaterThan(0);
    const stats = component.workspaceStats();
    expect(stats.fileCount).toBeGreaterThan(0);
    expect(stats.folderCount).toBeGreaterThan(0);
    expect(stats.totalLines).toBeGreaterThan(0);
  });

  it('should select file node and compute lines and breadcrumbs', () => {
    const fixture = TestBed.createComponent(TreeDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const selected = component.selectedNode();
    expect(selected).toBeTruthy();
    expect(selected?.name).toBe('auth.service.ts');

    expect(component.selectedFileLines().length).toBeGreaterThan(0);
    const crumbs = component.breadcrumbs();
    expect(crumbs.length).toBeGreaterThan(1);
    expect(crumbs[crumbs.length - 1].name).toBe('auth.service.ts');
  });

  it('should filter tree nodes by search query', () => {
    const fixture = TestBed.createComponent(TreeDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.filteredTreeData().length).toBe(component.treeData().length);

    // Search for markdown files
    component.searchQuery.set('md');
    fixture.detectChanges();

    const filtered = component.filteredTreeData();
    expect(filtered.length).toBeGreaterThan(0);

    // Clear search
    component.searchQuery.set('');
    fixture.detectChanges();
    expect(component.filteredTreeData().length).toBe(component.treeData().length);
  });

  it('should create a new file node', () => {
    const fixture = TestBed.createComponent(TreeDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.openCreateNode('file');
    component.newNodeName.set('custom-test.ts');
    component.confirmCreateNode();
    fixture.detectChanges();

    expect(component.selectedNode()?.name).toBe('custom-test.ts');
    expect(component.isCreatingNode()).toBe(false);
  });

  it('should cancel node creation', () => {
    const fixture = TestBed.createComponent(TreeDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.openCreateNode('folder');
    expect(component.isCreatingNode()).toBe(true);
    component.cancelCreateNode();
    expect(component.isCreatingNode()).toBe(false);
    expect(component.newNodeName()).toBe('');
  });

  it('should delete selected node', () => {
    const fixture = TestBed.createComponent(TreeDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const targetNode = component.selectedNode();
    expect(targetNode).toBeTruthy();

    component.deleteSelectedNode();
    fixture.detectChanges();

    expect(component.selectedNode()).toBeNull();
  });

  it('should reset workspace to default state', () => {
    const fixture = TestBed.createComponent(TreeDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.searchQuery.set('random-filter');
    component.deleteSelectedNode();
    expect(component.selectedNode()).toBeNull();

    component.resetWorkspace();
    fixture.detectChanges();

    expect(component.searchQuery()).toBe('');
    expect(component.selectedNode()?.name).toBe('auth.service.ts');
  });

  it('should return correct icons and colors based on file extension', () => {
    const fixture = TestBed.createComponent(TreeDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const tsNode: FileNode = { id: '1', name: 'app.ts', type: 'file', extension: 'ts' };
    const htmlNode: FileNode = { id: '2', name: 'app.html', type: 'file', extension: 'html' };
    const folderNode: FileNode = { id: '3', name: 'core', type: 'folder' };

    expect(component.getFileIcon(tsNode)).toBe('code');
    expect(component.getFileIcon(htmlNode)).toBe('html');
    expect(component.getFileIcon(folderNode)).toBe('folder');

    expect(component.getFileIconColor(tsNode)).toBe('#3178c6');
    expect(component.getFileIconColor(folderNode)).toBe('#0284c7');
  });

  it('should correctly evaluate hasChild and childrenAccessor', () => {
    const fixture = TestBed.createComponent(TreeDemoPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const parent: FileNode = {
      id: 'f1',
      name: 'folder',
      type: 'folder',
      children: [{ id: 'sub1', name: 'test.ts', type: 'file' }],
    };
    const emptyFolder: FileNode = { id: 'f2', name: 'empty', type: 'folder', children: [] };
    const file: FileNode = { id: 'file1', name: 'file.ts', type: 'file' };

    expect(component.hasChild(0, parent)).toBe(true);
    expect(component.hasChild(0, emptyFolder)).toBe(false);
    expect(component.hasChild(0, file)).toBe(false);

    expect(component.childrenAccessor(parent).length).toBe(1);
    expect(component.childrenAccessor(file).length).toBe(0);
  });
});
