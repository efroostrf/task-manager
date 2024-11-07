"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useTaskStore } from "@/lib/store";
import { toast } from "sonner";

export function ProjectSelector() {
  const { projects, selectedProjectId, addProject, selectProject } = useTaskStore();
  const [isOpen, setIsOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setNewProjectName("");
      setIsOpen(false);
      toast.success("Project created successfully");
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Select
        value={selectedProjectId || "all"}
        onValueChange={(value) => selectProject(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4" />
      </Button>

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
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setNewProjectName("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}