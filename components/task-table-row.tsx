'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import {
  Eye,
  Pencil,
  Archive,
  RotateCcw,
  Trash2,
  GripVertical,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { type Task, useTaskStore } from '@/lib/store';

interface TaskTableRowProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onArchive: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  'on-hold': 'bg-orange-100 text-orange-800',
  cancelled: 'bg-red-100 text-red-800',
} as const;

export function TaskTableRow({
  task,
  onView,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
}: TaskTableRowProps) {
  const projects = useTaskStore(state => state.projects);
  const project = projects.find(p => p.id === task.projectId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-grab hover:bg-muted active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
          <span className="font-medium">{task.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {project && (
            <div className={`h-3 w-3 rounded-full bg-${project.color}-500`} />
          )}
          {project?.name}
        </div>
      </TableCell>
      <TableCell>
        <span
          className={`inline-block rounded-full px-2 py-1 text-sm capitalize ${
            STATUS_STYLES[task.status]
          }`}
        >
          {task.status}
        </span>
      </TableCell>
      <TableCell>{format(task.createdAt, 'PPp')}</TableCell>
      <TableCell>{format(task.updatedAt, 'PPp')}</TableCell>
      <TableCell className="text-right">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onView(task)}>
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View task</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit task</TooltipContent>
          </Tooltip>

          {task.archived && onUnarchive ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onUnarchive(task.id)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Restore task</TooltipContent>
              </Tooltip>

              {onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(task.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete permanently</TooltipContent>
                </Tooltip>
              )}
            </>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onArchive(task.id)}
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive task</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
}
