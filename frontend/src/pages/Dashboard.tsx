import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { StatsGrid } from '../components/StatsGrid';
import { TaskList } from '../components/TaskList';
import { CreateTaskForm } from '../components/CreateTaskForm';
import { Button } from '../components/Button';
import { Plus, LogOut, Search } from 'lucide-react';

const Dashboard = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { stats } = useDashboardStats();
    const { tasks, loading, createTask, toggleComplete, deleteTask, startTimer, stopTimer, refetch } = useTasks();

    // Filter tasks by search query
    const filteredTasks = useMemo(() => {
        if (!searchQuery.trim()) return tasks;
        const query = searchQuery.toLowerCase();
        return tasks.filter(task =>
            task.title.toLowerCase().includes(query) ||
            (task.description && task.description.toLowerCase().includes(query))
        );
    }, [tasks, searchQuery]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreateTask = async (title: string, description?: string, priority?: 'low' | 'medium' | 'high') => {
        await createTask(title, description, priority);
        setIsCreating(false);
    };

    return (
        <>
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-brand">
                        <img src="/logo.png" alt="Logo" className="navbar-logo" />
                        <span className="navbar-title">ANKA Task Tracker</span>
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
                    <div className="tasks-header">
                        <h2>My Tasks</h2>
                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <TaskList
                        tasks={filteredTasks}
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