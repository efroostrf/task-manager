import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTaskStore, taskSchema, type Task } from '@/lib/store';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: Task | null;
  onClose: () => void;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  selectedTask,
  onClose,
}: TaskFormDialogProps) {
  const { projects, selectedProjectId, addTask, updateTask } = useTaskStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'archived'>>({
    resolver: zodResolver(
      taskSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        archived: true,
      }),
    ),
    defaultValues: {
      projectId: selectedProjectId || '',
      status: 'pending',
      description: '',
    },
  });

  // Update form when dialog opens
  useEffect(() => {
    if (open) {
      if (selectedTask) {
        reset({
          name: selectedTask.name,
          description: selectedTask.description,
          status: selectedTask.status,
          projectId: selectedTask.projectId,
        });
      } else {
        reset({
          name: '',
          description: '',
          status: 'pending',
          projectId: selectedProjectId || '',
        });
      }
    }
  }, [open, selectedTask, selectedProjectId, reset]);

  const onSubmit = (
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'archived'>,
  ) => {
    try {
      if (selectedTask) {
        updateTask(selectedTask.id, data);
        toast.success('Task updated successfully');
      } else {
        addTask(data);
        toast.success('Task created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('An error occurred while saving the task');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedTask ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectId">Project</Label>
            <Select
              onValueChange={value => setValue('projectId', value)}
              defaultValue={selectedTask?.projectId ?? selectedProjectId ?? ''}
              {...register('projectId')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
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
            {errors.projectId && (
              <p className="text-sm text-destructive">
                {errors.projectId.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter task name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter task description (optional)"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={value =>
                setValue('status', value as Task['status'])
              }
              defaultValue={selectedTask?.status ?? 'draft'}
              {...register('status')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedTask ? 'Update' : 'Create'} Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
