import { Card } from './Card';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface DashboardStats {
    tasksCompletedToday: number;
    tasksCompletedWeek: number;
    totalHoursToday: string;
    totalHoursWeek: string;
}

interface StatsGridProps {
    stats: DashboardStats;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
    const statsData = [
        {
            label: 'Tasks Today',
            value: stats.tasksCompletedToday,
            icon: CheckCircle,
            color: '#22c55e'
        },
        {
            label: 'Tasks This Week',
            value: stats.tasksCompletedWeek,
            icon: TrendingUp,
            color: '#3b82f6'
        },
        {
            label: 'Hours Today',
            value: stats.totalHoursToday,
            icon: Clock,
            color: '#ef4444'
        },
        {
            label: 'Hours This Week',
            value: stats.totalHoursWeek,
            icon: Clock,
            color: '#f59e0b'
        }
    ];

    return (
        <div className="stats-grid">
            {statsData.map((stat, index) => (
                <Card key={index} className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon" style={{ color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <div className="stat-label">{stat.label}</div>
                            <div className="stat-value">{stat.value}</div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};