'use client';

import { Download, Menu, Upload, Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ProjectFormDialog } from '@/components/project-form-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Project, type Task, useTaskStore } from '@/lib/store';

export function StoreMenu() {
  const [, setImporting] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const store = useTaskStore();
  const selectedProject = store.projects.find(
    p => p.id === store.selectedProjectId,
  );

  const handleExport = () => {
    try {
      const data = {
        projects: store.projects,
        tasks: store.tasks,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `task-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setImporting(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const text = await file.text();
      const data = JSON.parse(text) as {
        projects: Project[];
        tasks: Task[];
      };

      // Basic validation
      if (
        !data.projects ||
        !data.tasks ||
        !Array.isArray(data.projects) ||
        !Array.isArray(data.tasks)
      ) {
        throw new Error('Invalid file format');
      }

      // Convert date strings back to Date objects
      const projects = data.projects.map(project => ({
        ...project,
        createdAt: new Date(project.createdAt),
      }));

      const tasks = data.tasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));

      // Update store
      useTaskStore.setState({ projects, tasks });
      toast.success('Data imported successfully');
    } catch (error) {
      toast.error('Failed to import data');
    } finally {
      setImporting(false);
      // Reset input
      // event.target.value = '';
    }
  };

  const handleDeleteProject = () => {
    if (!store.selectedProjectId) return;

    if (!store.canDeleteProject(store.selectedProjectId)) {
      toast.error('Cannot delete project with existing tasks');
      return;
    }

    store.deleteProject(store.selectedProjectId);
    toast.success('Project deleted successfully');
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setIsProjectFormOpen(true);
  };

  const handleEditProject = () => {
    setEditingProject(selectedProject ?? null);
    setIsProjectFormOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleNewProject}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!selectedProject}
            onClick={handleEditProject}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Project
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              !selectedProject || !store.canDeleteProject(selectedProject.id)
            }
            onClick={handleDeleteProject}
          >
            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
            Delete Project
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={e => {
              e.preventDefault();
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json';
              input.onchange = event =>
                handleImport(
                  event as unknown as React.ChangeEvent<HTMLInputElement>,
                );
              input.click();
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProjectFormDialog
        open={isProjectFormOpen}
        onOpenChange={setIsProjectFormOpen}
        project={editingProject ?? undefined}
      />
    </>
  );
}
