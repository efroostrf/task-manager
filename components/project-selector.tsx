'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTaskStore } from '@/lib/store';

const COLORS = [
  { name: 'Slate', value: 'slate' },
  { name: 'Gray', value: 'gray' },
  { name: 'Zinc', value: 'zinc' },
  { name: 'Red', value: 'red' },
  { name: 'Orange', value: 'orange' },
  { name: 'Amber', value: 'amber' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Lime', value: 'lime' },
  { name: 'Green', value: 'green' },
  { name: 'Emerald', value: 'emerald' },
  { name: 'Teal', value: 'teal' },
  { name: 'Cyan', value: 'cyan' },
  { name: 'Sky', value: 'sky' },
  { name: 'Blue', value: 'blue' },
  { name: 'Indigo', value: 'indigo' },
  { name: 'Violet', value: 'violet' },
  { name: 'Purple', value: 'purple' },
  { name: 'Fuchsia', value: 'fuchsia' },
  { name: 'Pink', value: 'pink' },
  { name: 'Rose', value: 'rose' },
];

export function ProjectSelector() {
  const {
    projects,
    selectedProjectId,
    addProject,
    selectProject,
    deleteProject,
    canDeleteProject,
  } = useTaskStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState('sky');

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName.trim(), selectedColor);
      setNewProjectName('');
      setSelectedColor('sky');
      setIsOpen(false);
      toast.success('Project created successfully');
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedProjectId) {
      deleteProject(selectedProjectId);
      setIsDeleteDialogOpen(false);
      toast.success('Project deleted successfully');
    }
  };

  const canDeleteSelected =
    selectedProjectId && canDeleteProject(selectedProjectId);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedProjectId || 'all'}
        onValueChange={value => selectProject(value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map(project => (
            <SelectItem
              key={project.id}
              value={project.id}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full bg-${project.color}-500`}
                />
                {project.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add project</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {canDeleteSelected && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete project</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <Label>Project Color</Label>
              <div className="grid grid-cols-10 gap-2">
                {COLORS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    className={`h-6 w-6 rounded-full bg-${
                      color.value
                    }-500 ring-2 ring-offset-2 ${
                      selectedColor === color.value
                        ? 'ring-black'
                        : 'ring-transparent'
                    } transition-all hover:ring-black/50`}
                    onClick={() => setSelectedColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setNewProjectName('');
                  setSelectedColor('sky');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
