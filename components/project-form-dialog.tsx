'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Project, projectSchema, useTaskStore } from '@/lib/store';

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

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
}: ProjectFormDialogProps) {
  const { addProject } = useTaskStore();
  const [selectedColor, setSelectedColor] = useState('sky');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Project, 'id' | 'createdAt'>>({
    resolver: zodResolver(projectSchema.omit({ id: true, createdAt: true })),
    defaultValues: {
      color: 'sky',
    },
  });

  useEffect(() => {
    if (open && project) {
      reset({
        name: project.name,
        color: project.color,
      });
      setSelectedColor(project.color);
    } else if (!project) {
      reset({
        name: '',
        color: 'sky',
      });
      setSelectedColor('sky');
    }
  }, [open, project, reset]);

  const onSubmit = (data: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      if (project) {
        useTaskStore.setState(state => ({
          projects: state.projects.map(p =>
            p.id === project.id
              ? {
                  ...p,
                  name: data.name,
                  color: selectedColor,
                }
              : p,
          ),
        }));
        toast.success('Project updated successfully');
      } else {
        addProject(data.name, selectedColor);
        toast.success('Project created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {project ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
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
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {project ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
