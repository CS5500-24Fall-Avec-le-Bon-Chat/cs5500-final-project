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

export const createEventForTasks = async (params: CreateEventForTasksParam) => {
    try {
        if (!tasksLoaded) {
            await loadDefaultTasks();
        }

        // Check if the event already exists
        let event = defaultTasks.find(event => event.eventId === params.eventId);
        if (!event) {
            // Create a new event if it doesn't exist
            event = { eventId: params.eventId, tasks: [] };
            defaultTasks.push(event);
            console.log('New event created:', JSON.stringify(event, null, 2));
            await saveDefaultTasks(); // Save updated tasks only when new event is created
        }

        return event;
    } catch (error) {
        console.error('Error creating event for tasks:', error instanceof Error ? error.message : error);
        throw new Error('Failed to create event for tasks');
    }
}


export const createTask = async (params: CreateTaskParam) => {
    try {
        if (!tasksLoaded) {
            await loadDefaultTasks();
        }

        const { eventId, text, status } = params;

        // Validate input parameters
        if (!eventId || !text || !status) {
            throw new Error('Invalid input: All fields are required (eventId, text, status)');
        }

        // Ensure the event exists or create it
        let event = defaultTasks.find(event => event.eventId === eventId);
        if (!event) {
            event = await createEventForTasks({ eventId }); // Create the event if not found
        }

        // Add a new task to the event
        const newTask = {
            id: event.tasks.length + 1, // Assign unique task ID
            text,
            status,
        };
        event.tasks.push(newTask);

        // Save the updated tasks list
        await saveDefaultTasks();

        console.log('Task created successfully:', JSON.stringify(newTask, null, 2));
        return defaultTasks; // Return the updated default task for confirmation
    } catch (error) {
        console.error('Error creating task:', error instanceof Error ? error.message : error);
        throw new Error('Failed to create task');
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
