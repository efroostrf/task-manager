'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTaskStore } from '@/lib/store';

export function ProjectSelector() {
  const { projects, selectedProjectId, selectProject } = useTaskStore();

  return (
    <Select
      value={selectedProjectId || 'all'}
      onValueChange={value => selectProject(value === 'all' ? null : value)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Projects</SelectItem>
        {projects.map(project => (
          <SelectItem
            key={project.id}
            value={project.id}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full bg-${project.color}-500`} />
              {project.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
