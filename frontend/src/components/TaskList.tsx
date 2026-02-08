import { TaskCard } from './TaskCard';

interface Task {
    id: number;
    title: string;
    description?: string;
    is_completed: boolean;
    total_time_seconds: number;
    timer_running?: boolean;
    timer_start_time?: string;
}

interface TaskListProps {
    tasks: Task[];
    loading: boolean;
    onToggleComplete: (id: number) => void;
    onDelete: (id: number) => void;
    onStartTimer: (id: number) => void;
    onStopTimer: (id: number) => void;
    onUpdate: () => void;
}

export const TaskList = ({
    tasks,
    loading,
    onToggleComplete,
    onDelete,
    onStartTimer,
    onStopTimer,
    onUpdate
}: TaskListProps) => {
    if (loading) {
        return (
            <div className="task-list-empty">
                <p>Loading tasks...</p>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="task-list-empty">
                <p>No tasks yet. Create one to get started!</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map(task => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                    onStartTimer={onStartTimer}
                    onStopTimer={onStopTimer}
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    );
};