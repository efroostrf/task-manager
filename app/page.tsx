"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useTaskStore, taskSchema, type Task } from "@/lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { ProjectSelector } from "@/components/project-selector";
import { TaskTable } from "@/components/task-table";

export default function Home() {
  const { tasks, projects, selectedProjectId, addTask, updateTask, archiveTask, unarchiveTask } =
    useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Omit<Task, "id" | "createdAt" | "updatedAt" | "archived">>({
    resolver: zodResolver(
      taskSchema.omit({ id: true, createdAt: true, updatedAt: true, archived: true })
    ),
  });

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const filteredTasks = tasks.filter(
    (task) =>
      (!selectedProjectId || task.projectId === selectedProjectId) &&
      !task.archived
  );

  const archivedTasks = tasks.filter(
    (task) =>
      (!selectedProjectId || task.projectId === selectedProjectId) &&
      task.archived
  );

  const onSubmit = (
    data: Omit<Task, "id" | "createdAt" | "updatedAt" | "archived">
  ) => {
    if (selectedTask) {
      updateTask(selectedTask.id, data);
      toast.success("Task updated successfully");
    } else {
      addTask(data);
      toast.success("Task added successfully");
    }
    handleCloseForm();
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    reset({
      name: "",
      description: "",
      status: "pending",
      projectId: "",
    });
    setSelectedTask(null);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setValue("name", task.name);
    setValue("description", task.description);
    setValue("status", task.status);
    setValue("projectId", task.projectId);
    setIsFormOpen(true);
  };

  const handleArchive = (id: string) => {
    archiveTask(id);
    toast.success("Task archived successfully");
  };

  const handleUnarchive = (id: string) => {
    unarchiveTask(id);
    toast.success("Task restored successfully");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {selectedProject ? selectedProject.name : "Task Manager"}
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
              onView={(task) => {
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
              onView={(task) => {
                setSelectedTask(task);
                setIsViewOpen(true);
              }}
              onEdit={handleEdit}
              onArchive={handleArchive}
              onUnarchive={handleUnarchive}
            />
          </TabsContent>
        </Tabs>

        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedTask ? "Edit Task" : "Add New Task"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectId">Project</Label>
                <Select
                  onValueChange={(value) => setValue("projectId", value)}
                  defaultValue={selectedTask?.projectId || selectedProjectId || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("status", value as Task["status"])
                  }
                  defaultValue={selectedTask?.status || "pending"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedTask ? "Update" : "Create"} Task
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Project</h3>
                <p className="text-muted-foreground">
                  {
                    projects.find((p) => p.id === selectedTask?.projectId)?.name
                  }
                </p>
              </div>
              <div>
                <h3 className="font-medium">Name</h3>
                <p className="text-muted-foreground">{selectedTask?.name}</p>
              </div>
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedTask?.description}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <p className="text-muted-foreground capitalize">
                  {selectedTask?.status}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Created At</h3>
                  <p className="text-muted-foreground">
                    {selectedTask?.createdAt &&
                      format(selectedTask.createdAt, "PPp")}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Updated At</h3>
                  <p className="text-muted-foreground">
                    {selectedTask?.updatedAt &&
                      format(selectedTask.updatedAt, "PPp")}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}