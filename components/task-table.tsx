"use client";

import { format } from "date-fns";
import { Eye, Pencil, Archive, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task, useTaskStore } from "@/lib/store";

interface TaskTableProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onArchive: (id: string) => void;
  onUnarchive?: (id: string) => void;
}

export function TaskTable({ tasks, onView, onEdit, onArchive, onUnarchive }: TaskTableProps) {
  const projects = useTaskStore((state) => state.projects);

  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.name}</TableCell>
              <TableCell>
                {projects.find((p) => p.id === task.projectId)?.name}
              </TableCell>
              <TableCell>
                <span
                  className={`capitalize px-2 py-1 rounded-full text-sm ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : task.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {task.status}
                </span>
              </TableCell>
              <TableCell>{format(task.createdAt, "PPp")}</TableCell>
              <TableCell>{format(task.updatedAt, "PPp")}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(task)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(task)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                {task.archived && onUnarchive ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onUnarchive(task.id)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onArchive(task.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
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
      </Table>
    </div>
  );
}