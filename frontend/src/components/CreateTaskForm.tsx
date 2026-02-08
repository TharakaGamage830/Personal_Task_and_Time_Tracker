import { useState, type FormEvent } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { Plus, X } from 'lucide-react';

interface CreateTaskFormProps {
    onTaskCreated: (title: string, description?: string) => void;
    onCancel: () => void;
}

export const CreateTaskForm = ({ onTaskCreated, onCancel }: CreateTaskFormProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
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
            await onTaskCreated(title.trim(), description.trim() || undefined);
            setTitle('');
            setDescription('');
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