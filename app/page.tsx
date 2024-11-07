'use client';

import { Plus, Github } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ProjectSelector } from '@/components/project-selector';
import { TaskFormDialog } from '@/components/task-form-dialog';
import { TaskTable } from '@/components/task-table';
import { TaskViewDialog } from '@/components/task-view-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaskStore, type Task } from '@/lib/store';

export default function Home() {
  const { tasks, selectedProjectId, archiveTask, unarchiveTask } =
    useTaskStore();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredTasks = tasks.filter(
    task =>
      (!selectedProjectId || task.projectId === selectedProjectId) &&
      !task.archived,
  );

  const archivedTasks = tasks.filter(
    task =>
      (!selectedProjectId || task.projectId === selectedProjectId) &&
      task.archived,
  );

  const handleOpenCreateTask = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  const handleArchive = (id: string) => {
    archiveTask(id);
    toast.success('Task archived successfully');
  };

  const handleUnarchive = (id: string) => {
    unarchiveTask(id);
    toast.success('Task restored successfully');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Task Manager</h1>
            <div className="flex items-center gap-4">
              <ProjectSelector />
              <Button onClick={handleOpenCreateTask}>
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>
          </div>

          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active Tasks</TabsTrigger>
              <TabsTrigger value="archived">Archived Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <TaskTable
                tasks={filteredTasks}
                onView={task => {
                  setSelectedTask(task);
                  setIsViewOpen(true);
                }}
                onEdit={handleEdit}
                onArchive={handleArchive}
              />
            </TabsContent>

            <TabsContent value="archived">
              <TaskTable
                tasks={archivedTasks}
                onView={task => {
                  setSelectedTask(task);
                  setIsViewOpen(true);
                }}
                onEdit={handleEdit}
                onArchive={handleArchive}
                onUnarchive={handleUnarchive}
              />
            </TabsContent>
          </Tabs>

          <TaskFormDialog
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            selectedTask={selectedTask}
            onClose={handleCloseForm}
          />

          <TaskViewDialog
            open={isViewOpen}
            onOpenChange={setIsViewOpen}
            selectedTask={selectedTask}
          />
        </div>
      </div>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-6xl px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                © {new Date().getFullYear()}{' '}
                <a
                  href="https://www.yefro.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline-offset-4 hover:underline"
                >
                  Yefrosynii Kolenko
                </a>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/efroostrf/task-manager"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                <Github className="h-4 w-4" />
                <span>Source Code</span>
              </a>
              <span className="text-sm text-muted-foreground">
                Released under the{' '}
                <a
                  href="https://github.com/efroostrf/task-manager/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  MIT License
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
