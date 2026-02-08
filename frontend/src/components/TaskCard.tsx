import { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Play, Square, Trash2, CheckCircle, Circle, Calendar } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    description?: string;
    is_completed: boolean;
    priority: 'low' | 'medium' | 'high';
    total_time_seconds: number;
    timer_running?: boolean;
    timer_start_time?: string;
    created_at: string;
    completed_at?: string | null;
}

const priorityConfig = {
    low: { label: 'Low', color: 'priority-low', emoji: '🟢' },
    medium: { label: 'Medium', color: 'priority-medium', emoji: '🟡' },
    high: { label: 'High', color: 'priority-high', emoji: '🔴' },
};

interface TaskCardProps {
    task: Task;
    onToggleComplete: (id: number) => void;
    onDelete: (id: number) => void;
    onStartTimer: (id: number) => void;
    onStopTimer: (id: number) => void;
    onUpdate: () => void;
}

export const TaskCard = ({
    task,
    onToggleComplete,
    onDelete,
    onStartTimer,
    onStopTimer,
    onUpdate
}: TaskCardProps) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    // Calculate elapsed time when timer is running
    useEffect(() => {
        if (task.timer_running && task.timer_start_time) {
            const startTime = new Date(task.timer_start_time).getTime();

            // Update immediately
            const updateElapsed = () => {
                const now = Date.now();
                const elapsed = Math.floor((now - startTime) / 1000);
                setElapsedSeconds(elapsed);
            };

            updateElapsed();

            // Update every second
            const interval = setInterval(updateElapsed, 1000);

            return () => clearInterval(interval);
        } else {
            setElapsedSeconds(0);
        }
    }, [task.timer_running, task.timer_start_time]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleToggleComplete = async () => {
        try {
            await onToggleComplete(task.id);
            onUpdate();
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this task?')) return;
        try {
            await onDelete(task.id);
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const handleStartTimer = async () => {
        try {
            await onStartTimer(task.id);
            onUpdate();
        } catch (error) {
            alert('Could not start timer');
        }
    };

    const handleStopTimer = async () => {
        try {
            await onStopTimer(task.id);
            onUpdate();
        } catch (error) {
            console.error('Failed to stop timer:', error);
        }
    };

    // Total display time = saved total + current session elapsed
    const displayTime = task.total_time_seconds + (task.timer_running ? elapsedSeconds : 0);

    return (
        <Card className={`task-card ${priorityConfig[task.priority || 'medium'].color}`}>
            <div className="task-content">
                <div className="task-left">
                    <button onClick={handleToggleComplete} className="task-checkbox">
                        {task.is_completed ? (
                            <CheckCircle className="task-icon-complete" />
                        ) : (
                            <Circle className="task-icon-incomplete" />
                        )}
                    </button>

                    <div className="task-info">
                        <h3 className={task.is_completed ? 'task-title-completed' : ''}>
                            {task.title}
                        </h3>
                        {task.description && <p className="task-description">{task.description}</p>}

                        <div className="task-meta">
                            <div className={`task-time ${task.timer_running ? 'task-time-running' : ''}`}>
                                {task.timer_running && <span className="timer-indicator">⏱️ </span>}
                                Total: {formatTime(displayTime)}
                            </div>
                            <div className="task-dates">
                                <span className="task-date">
                                    <Calendar size={12} /> Created: {formatDate(task.created_at)}
                                </span>
                                {task.is_completed && task.completed_at && (
                                    <span className="task-date task-date-completed">
                                        ✓ Completed: {formatDate(task.completed_at)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="task-actions">
                    {!task.is_completed && (
                        <>
                            {!task.timer_running ? (
                                <Button variant="primary" onClick={handleStartTimer} className="btn-icon">
                                    <Play size={16} />
                                </Button>
                            ) : (
                                <Button variant="danger" onClick={handleStopTimer} className="btn-icon">
                                    <Square size={16} />
                                </Button>
                            )}
                        </>
                    )}
                    <Button variant="ghost" onClick={handleDelete} className="btn-icon btn-delete">
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>
        </Card>
    );
};