'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { ProjectSelector } from '@/components/project-selector';
import { TaskFormDialog } from '@/components/task-form-dialog';
import { TaskTable } from '@/components/task-table';
import { TaskViewDialog } from '@/components/task-view-dialog';
import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaskStore, taskSchema, type Task } from '@/lib/store';

export default function Home() {
  const { tasks, projects, selectedProjectId, archiveTask, unarchiveTask } =
    useTaskStore();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { reset, setValue } = useForm<
    Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'archived'>
  >({
    resolver: zodResolver(
      taskSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        archived: true,
      }),
    ),
  });

  const selectedProject = projects.find(p => p.id === selectedProjectId);

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

  const handleCloseForm = () => {
    setIsFormOpen(false);
    reset({
      name: '',
      description: '',
      status: 'pending',
      projectId: '',
    });
    setSelectedTask(null);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setValue('name', task.name);
    setValue('description', task.description);
    setValue('status', task.status);
    setValue('projectId', task.projectId);
    setIsFormOpen(true);
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
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {selectedProject ? selectedProject.name : 'Task Manager'}
          </h1>
          <div className="flex items-center gap-4">
            <ProjectSelector />
            <Button onClick={() => setIsFormOpen(true)}>
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
  );
}
