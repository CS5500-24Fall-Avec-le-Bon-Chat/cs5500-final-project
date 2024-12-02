"use client";
import React from 'react'
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Button } from './button';
import { useTasks } from './TasksProvider';
import { getTasks, createTask, updateTaskStatus, deleteTask, loadDefaultTasks } from '@/lib/actions/task.action';

const TasksDisplay = (props: TasksDisplayProps) => {
    const { tasks, setTasks } = useTasks();
    const [newTaskText, setNewTaskText] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch tasks from the server
    const fetchTasksForEvent = async () => {
        try {
            await loadDefaultTasks();
            const eventTasks = await getTasks({ eventId: props.eventId });
            // Synchronize with local storage
            localStorage.setItem(`tasks-${props.eventId}`, JSON.stringify(eventTasks));
            setTasks(eventTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasksForEvent();
    }, [props.eventId]);

    useEffect(() => {
        localStorage.setItem(`tasks-${props.eventId}`, JSON.stringify(tasks));
    }, [tasks, props.eventId]);


    // Add a new task to the selected event in the server
    const addTask = async (params: AddTaskParams) => {
        try {
            const updatedTasks = await createTask(params);
            setTasks(updatedTasks.find(event => event.eventId === props.eventId)?.tasks || []);
            setNewTaskText("");
        } catch (error) {
            console.error(error);
        }
    };

    // Toggle task status within the selected event and update the server
    const toggleTaskStatus = async (params: ToggleTaskStatusParams) => {
        try {
            await updateTaskStatus(params);
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === params.id ? { ...task, status: params.status } : task
                )
            );
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    // Function to delete a task and update the server
    const deleteCurrentTask = async (params: DeleteCurrentTaskParams) => {
        try {
            await deleteTask(params);
            setTasks(prevTasks => {
                const updatedTasks = prevTasks.filter(task => task.id !== params.id);
                localStorage.setItem(`tasks-${params.eventId}`, JSON.stringify(updatedTasks));
                return updatedTasks;
            });
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }


    return (
        // {/* List of Tasks or List of Donors Column */}
        <div className={`w-5/12 p-4 ${props.show? "" : "hidden"}`}>
            <Card className="shadow-none mb-4">
                <CardHeader>
                    <CardTitle>Tasks</CardTitle>
                </CardHeader>
                <CardContent className='max-h-[49vh] min-w-[50vh] overflow-y-auto'>
                    {/* Add Task Input */}
                    <div className="flex items-center mb-4">
                        <Input
                            placeholder="Add your new tasks..."
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    addTask({ eventId: props.eventId, text: newTaskText, status: "undone" });
                                }
                            }}
                            className="mr-2"
                        />
                        <Button variant="outline" onClick={() => addTask({ eventId: props.eventId, text: newTaskText, status: "undone" })}>
                            Add
                        </Button>
                    </div>

                    <ul>
                        {tasks.map((task) => (
                            <li
                                key={task.id}
                                className="flex items-center mb-2 group relative hover:bg-gray-100 p-2 rounded"
                            >
                                <input
                                    type="checkbox"
                                    checked={task.status === "done"}
                                    onChange={() => toggleTaskStatus({ eventId: props.eventId, id: task.id, status: task.status === "done" ? "undone" : "done" })}
                                    className="mr-2"
                                />
                                <span
                                    className={
                                        task.status === "done"
                                            ? "line-through text-gray-500"
                                            : task.status === "in-progress"
                                                ? "text-gray-700"
                                                : ""
                                    }
                                >
                                    {task.text}
                                </span>
                                {/* Delete Button */}
                                <button
                                    onClick={() => deleteCurrentTask({ eventId: props.eventId, id: task.id })}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 bg-white text-red-500 px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    x
                                </button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>

    )
}

export default TasksDisplay;