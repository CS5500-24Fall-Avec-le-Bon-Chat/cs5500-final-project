"use server"
import path from "path";
import fs from "fs/promises";
import { json } from "stream/consumers";
import { parseJsonFile } from "next/dist/build/load-jsconfig";

let defaultTasks: any[] = [];
let tasksLoaded = false;

export const loadDefaultTasks = async () => {
    try {
        const filePath = path.resolve(process.cwd(), './public/defaultTasks.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        defaultTasks = JSON.parse(fileContent);
        tasksLoaded = true;
        console.log('Default tasks loaded:', JSON.stringify(defaultTasks, null, 2));
    } catch (error) {
        console.error('Error loading default tasks:', error);
    }
}

export const saveDefaultTasks = async () => {
    try {
        const filePath = path.resolve(process.cwd(), './public/defaultTasks.json');
        const fileContent = JSON.stringify(defaultTasks, null, 2);
        await fs.writeFile(filePath, fileContent, 'utf-8');
        console.log('Default tasks loaded:', JSON.stringify(defaultTasks, null, 2));

    } catch (error) {
        console.error('Error saving default tasks:', error);
    }
}

export const getTasks = async (params: GetTaskParams) => {
    try {
        if (!tasksLoaded) {
            await loadDefaultTasks();
        }
        const { eventId } = params;
        // find the event with the given eventId
        const event = defaultTasks.find(event => event.eventId === eventId);
        if (!event) {
            throw new Error('Event not found');
        }
        return event.tasks;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error getting tasks:', error.message);
        }
        console.error('Error getting tasks:', error);
        return [];
    }
}


export const createTask = async (params: CreateTaskParam) => {
    try {
        if (!tasksLoaded) {
            await loadDefaultTasks();
        }

        const { eventId, text, status } = params;
        console.log('Received params:', eventId, text, status);
        if (!eventId || !text || !status) {
            throw new Error('Invalid input');
        }
        // find the event with the given eventId
        const event = defaultTasks.find(event => event.eventId === params.eventId);
        if (!event) {
            throw new Error('Event not found');
        }
        // add the new task to the event
        event.tasks.push({
            id: event.tasks.length + 1,
            text: params.text,
            status: params.status
        });
        // save the updated tasks
        await saveDefaultTasks();

        return defaultTasks;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating task:', error.message);
        }
        console.error('Error creating task:', error);
        return [];
    }
}

export const updateTaskStatus = async (params: UpdateTaskStatusParam) => {
    try {
        if (!tasksLoaded) {
            await loadDefaultTasks();
        }
        const { eventId, id,status } = params;


        if (!eventId || !id || !status) {
            throw new Error('Invalid input');
        }
        // find the event with the given eventId
        const event = defaultTasks.find(event => event.eventId === params.eventId);
        if (!event) {
            throw new Error('Event not found');
        }
        // find the task with the given id
        const task = event.tasks.find(task => task.id === params.id);
        if (!task) {
            throw new Error('Task not found');
        }
        // update the task
        task.status = params.status;
        // save the updated tasks
        await saveDefaultTasks();

        return defaultTasks;
        
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating task:', error.message);
        }
        console.error('Error updating task:', error);
        return [];
    }
}

export const deleteTask = async (params: DeleteTaskParam) => {
    try {
        if (!tasksLoaded) {
            await loadDefaultTasks();
        }
        const { eventId, id: taskId } = params;
        if (!eventId || !taskId) {
            throw new Error('Invalid input');
        }
        // find the event with the given eventId
        const event = defaultTasks.find(event => event.eventId === eventId);
        if (!event) {
            throw new Error('Event not found');
        }
        // delete the task with the given taskId
        event.tasks = event.tasks.filter(task => task.id !== taskId);
        // save the updated tasks
        await saveDefaultTasks();

        return event.tasks;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting task:', error.message);
        }
        console.error('Error deleting task:', error);
        return [];
    }
}
