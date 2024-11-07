'use client';

import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { TaskTableRow } from '@/components/task-table-row';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Task, useTaskStore } from '@/lib/store';

interface TaskTableProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onArchive: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskTable({
  tasks,
  onView,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
}: TaskTableProps) {
  const reorderTasks = useTaskStore(state => state.reorderTasks);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderTasks(active.id as string, over.id as string);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg bg-card shadow-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            <TableBody>
              {tasks.map(task => (
                <TaskTableRow
                  key={task.id}
                  task={task}
                  onView={onView}
                  onEdit={onEdit}
                  onArchive={onArchive}
                  onUnarchive={onUnarchive}
                  onDelete={onDelete}
                />
              ))}
              {tasks.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No tasks found. Create your first task!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </SortableContext>
        </DndContext>
      </Table>
    </div>
  );
}
