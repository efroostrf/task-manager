import { format } from 'date-fns';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTaskStore, type Task } from '@/lib/store';

interface TaskViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: Task | null;
}

const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  'on-hold': 'bg-orange-100 text-orange-800',
  cancelled: 'bg-red-100 text-red-800',
} as const;

export function TaskViewDialog({
  open,
  onOpenChange,
  selectedTask,
}: TaskViewDialogProps) {
  const { projects } = useTaskStore();

  if (!selectedTask) return null;

  const project = projects.find(p => p.id === selectedTask.projectId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Project</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              {project && (
                <div
                  className={`h-3 w-3 rounded-full bg-${project.color}-500`}
                />
              )}
              <span>{project?.name}</span>
            </div>
          </div>
          <div>
            <h3 className="font-medium">Name</h3>
            <p className="text-muted-foreground">{selectedTask.name}</p>
          </div>
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {selectedTask.description}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Status</h3>
            <span
              className={`inline-block rounded-full px-2 py-1 text-sm capitalize ${
                STATUS_STYLES[selectedTask.status]
              }`}
            >
              {selectedTask.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Created At</h3>
              <p className="text-muted-foreground">
                {selectedTask.createdAt &&
                  format(selectedTask.createdAt, 'PPp')}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Updated At</h3>
              <p className="text-muted-foreground">
                {selectedTask.updatedAt &&
                  format(selectedTask.updatedAt, 'PPp')}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
