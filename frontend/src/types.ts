export interface Task {
    id: number;
    user_id: number;
    title: string;
    description?: string;
    is_completed: boolean;
    total_time_seconds: number;
    created_at: string;
}

export interface TimeSession {
    id: number;
    task_id: number;
    start_time: string;
    end_time?: string;
    duration_seconds?: number;
}

export interface DashboardStats {
    tasksCompletedToday: number;
    tasksCompletedWeek: number;
    totalHoursToday: string;
    totalHoursWeek: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
}