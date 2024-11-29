"use client";
import React, { createContext, useEffect, useState, useContext } from 'react'
import { Task, TasksContextProps } from '../objects/task';

const TasksContext = createContext<TasksContextProps | undefined>(undefined);

export const TasksProvider = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const getTasksFromLocalStorage = () => {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }

    const storeTasksFromLocalStorage = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    const completedTasksPercentage = () => {
        const totalTasks = tasks.length;
        if (totalTasks === 0) return 0;
        const completedTasks = tasks.filter(task => task.status === "done").length;
        return (completedTasks / totalTasks) * 100;
    }

    useEffect(() => {
        getTasksFromLocalStorage();
    }, []);

    useEffect(() => {
        storeTasksFromLocalStorage();
    }, [tasks]);

    return (
        <TasksContext.Provider value={{ tasks, setTasks, completedTasksPercentage }}>
            {children}
        </TasksContext.Provider>
    )
}

export const useTasks = (): TasksContextProps => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
};