import { useState, type FormEvent } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { Plus, X } from 'lucide-react';

interface CreateTaskFormProps {
    onTaskCreated: (title: string, description?: string, priority?: 'low' | 'medium' | 'high') => void;
    onCancel: () => void;
}

export const CreateTaskForm = ({ onTaskCreated, onCancel }: CreateTaskFormProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Task title is required');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await onTaskCreated(title.trim(), description.trim() || undefined, priority);
            setTitle('');
            setDescription('');
            setPriority('medium');
        } catch (err) {
            setError('Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="create-task-form">
            <form onSubmit={handleSubmit}>
                <Input
                    autoFocus
                    label="Task Title"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    error={error}
                />
                <Input
                    label="Description (optional)"
                    placeholder="Add details..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                <div className="input-wrapper">
                    <label className="input-label">Priority</label>
                    <select
                        className="input priority-select"
                        value={priority}
                        onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                    >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                    </select>
                </div>

                <div className="form-actions">
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                        <Plus size={18} />
                        Add Task
                    </Button>
                    <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                        <X size={18} />
                        Cancel
                    </Button>
                </div>
            </form>
        </Card>
    );
};