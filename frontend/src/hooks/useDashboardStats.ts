import { useState, useEffect } from 'react';
import * as dashboardService from '../api/services/dashboard.service';

interface DashboardStats {
    tasksCompletedToday: number;
    tasksCompletedWeek: number;
    totalHoursToday: string;
    totalHoursWeek: string;
}

export const useDashboardStats = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return {
        stats,
        loading,
        refetch: fetchStats
    };
};