import { useState, useEffect } from 'react';
import * as taskService from '../api/services/task.service';

interface Task {
    id: number;
    title: string;
    description?: string;
    is_completed: boolean;
    total_time_seconds: number;
}

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getTasks();
            setTasks(data.sort((a: Task, b: Task) => b.id - a.id));
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const createTask = async (title: string, description?: string) => {
        await taskService.createTask(title, description);
        await fetchTasks();
    };

    const toggleComplete = async (id: number) => {
        await taskService.toggleComplete(id);
        await fetchTasks();
    };

    const deleteTask = async (id: number) => {
        await taskService.deleteTask(id);
        await fetchTasks();
    };

    const startTimer = async (id: number) => {
        await taskService.startTimer(id);
    };

    const stopTimer = async (id: number) => {
        await taskService.stopTimer(id);
        await fetchTasks();
    };

    return {
        tasks,
        loading,
        createTask,
        toggleComplete,
        deleteTask,
        startTimer,
        stopTimer,
        refetch: fetchTasks
    };
};