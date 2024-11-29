export interface Task {
    id: number;
    text: string;
    status: "undone" | "in-progress" | "done";
}

export interface TasksContextProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    completedTasksPercentage: () => number;
}


