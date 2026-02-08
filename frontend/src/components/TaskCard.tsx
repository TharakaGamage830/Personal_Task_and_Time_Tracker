import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Play, Square, Trash2, CheckCircle, Circle } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    description?: string;
    is_completed: boolean;
    total_time_seconds: number;
}

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
    const [isRunning, setIsRunning] = useState(false);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    const handleToggleComplete = async () => {
        try {
            await onToggleComplete(task.id);
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
            setIsRunning(true);
        } catch (error) {
            alert('Could not start timer (another timer might be running)');
        }
    };

    const handleStopTimer = async () => {
        try {
            await onStopTimer(task.id);
            setIsRunning(false);
            onUpdate();
        } catch (error) {
            console.error('Failed to stop timer:', error);
        }
    };

    return (
        <Card className="task-card">
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
                        <div className="task-time">
                            Total: {formatTime(task.total_time_seconds)}
                        </div>
                    </div>
                </div>

                <div className="task-actions">
                    {!task.is_completed && (
                        <>
                            {!isRunning ? (
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