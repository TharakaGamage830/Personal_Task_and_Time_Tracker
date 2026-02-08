import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { StatsGrid } from '../components/StatsGrid';
import { TaskList } from '../components/TaskList';
import { CreateTaskForm } from '../components/CreateTaskForm';
import { Button } from '../components/Button';
import { Plus, LogOut } from 'lucide-react';

const Dashboard = () => {
    const [isCreating, setIsCreating] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { stats } = useDashboardStats();
    const { tasks, loading, createTask, toggleComplete, deleteTask, startTimer, stopTimer, refetch } = useTasks();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreateTask = async (title: string, description?: string) => {
        await createTask(title, description);
        setIsCreating(false);
    };

    return (
        <>
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-brand">
                        <img src="/logo.png" alt="Logo" className="navbar-logo" />
                        <span className="navbar-title">Task Tracker</span>
                    </Link>

                    <div className="navbar-actions">
                        <div className="navbar-user-info">
                            <span className="navbar-user-name">{user?.name}</span>
                            <span className="navbar-user-email">{user?.email}</span>
                        </div>
                        <div className="navbar-divider"></div>
                        <Button variant="ghost" onClick={handleLogout}>
                            <LogOut size={16} />
                            Logout
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    {!isCreating && (
                        <Button variant="primary" onClick={() => setIsCreating(true)}>
                            <Plus size={20} />
                            New Task
                        </Button>
                    )}
                </div>

                {stats && <StatsGrid stats={stats} />}

                {isCreating && (
                    <CreateTaskForm
                        onTaskCreated={handleCreateTask}
                        onCancel={() => setIsCreating(false)}
                    />
                )}

                <div className="tasks-section">
                    <h2>My Tasks</h2>
                    <TaskList
                        tasks={tasks}
                        loading={loading}
                        onToggleComplete={toggleComplete}
                        onDelete={deleteTask}
                        onStartTimer={startTimer}
                        onStopTimer={stopTimer}
                        onUpdate={refetch}
                    />
                </div>
            </div>
        </>
    );
};

export default Dashboard;