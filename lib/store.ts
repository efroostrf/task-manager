import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  createdAt: z.date(),
});

export const taskSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['pending', 'in-progress', 'completed']),
  createdAt: z.date(),
  updatedAt: z.date(),
  archived: z.boolean(),
});

export type Project = z.infer<typeof projectSchema>;
export type Task = z.infer<typeof taskSchema>;

interface TaskStore {
  projects: Project[];
  tasks: Task[];
  selectedProjectId: string | null;
  addProject: (name: string) => void;
  selectProject: (projectId: string | null) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'archived'>) => void;
  updateTask: (id: string, task: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  archiveTask: (id: string) => void;
  unarchiveTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      projects: [],
      tasks: [],
      selectedProjectId: null,
      addProject: (name) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              id: crypto.randomUUID(),
              name,
              createdAt: new Date(),
            },
          ],
        })),
      selectProject: (projectId) =>
        set(() => ({
          selectedProjectId: projectId,
        })),
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              updatedAt: new Date(),
              archived: false,
            },
          ],
        })),
      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updatedTask, updatedAt: new Date() }
              : task
          ),
        })),
      archiveTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, archived: true, updatedAt: new Date() }
              : task
          ),
        })),
      unarchiveTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, archived: false, updatedAt: new Date() }
              : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: 'task-store',
      partialize: (state) => ({
        projects: state.projects.map(project => ({
          ...project,
          createdAt: project.createdAt.toISOString()
        })),
        tasks: state.tasks.map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.projects = state.projects.map(project => ({
            ...project,
            createdAt: new Date(project.createdAt)
          }));
          state.tasks = state.tasks.map(task => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt)
          }));
        }
      }
    }
  )
);