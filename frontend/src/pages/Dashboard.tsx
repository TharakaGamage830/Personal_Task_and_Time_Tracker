import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { StatsGrid } from '../components/StatsGrid';
import { TaskList } from '../components/TaskList';
import { CreateTaskForm } from '../components/CreateTaskForm';
import { Button } from '../components/Button';
import { Plus, LogOut, Search, Filter, ArrowUpDown } from 'lucide-react';

type StatusFilter = 'all' | 'completed' | 'incomplete';
type SortOption = 'priority' | 'date' | 'time';

const Dashboard = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [sortBy, setSortBy] = useState<SortOption>('priority');

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { stats } = useDashboardStats();
    const { tasks, loading, createTask, toggleComplete, deleteTask, startTimer, stopTimer, refetch } = useTasks();

    // Filter and sort tasks
    const filteredTasks = useMemo(() => {
        let result = [...tasks];

        // Filter by search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(task =>
                task.title.toLowerCase().includes(query) ||
                (task.description && task.description.toLowerCase().includes(query))
            );
        }

        // Filter by status
        if (statusFilter === 'completed') {
            result = result.filter(task => task.is_completed);
        } else if (statusFilter === 'incomplete') {
            result = result.filter(task => !task.is_completed);
        }

        // Sort
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        result.sort((a, b) => {
            switch (sortBy) {
                case 'priority':
                    const priorityDiff = priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
                    if (priorityDiff !== 0) return priorityDiff;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'date':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'time':
                    return b.total_time_seconds - a.total_time_seconds;
                default:
                    return 0;
            }
        });

        return result;
    }, [tasks, searchQuery, statusFilter, sortBy]);

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
                        <div className="tasks-controls">
                            {/* Search */}
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

                            {/* Filter by Status */}
                            <div className="filter-box">
                                <Filter size={16} className="filter-icon" />
                                <select
                                    className="filter-select"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                                >
                                    <option value="all">All Tasks</option>
                                    <option value="incomplete">Incomplete</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="filter-box">
                                <ArrowUpDown size={16} className="filter-icon" />
                                <select
                                    className="filter-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                >
                                    <option value="priority">Sort: Priority</option>
                                    <option value="date">Sort: Date</option>
                                    <option value="time">Sort: Time Spent</option>
                                </select>
                            </div>
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