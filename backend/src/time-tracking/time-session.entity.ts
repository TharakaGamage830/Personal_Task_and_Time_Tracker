import { Task } from "src/tasks/task.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('time_sessions')
export class TimeSession {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    task_id: number;

    @Column()
    start_time: Date;

    @Column({ nullable: true })
    end_time: Date;

    @Column({ nullable: true })
    duration_seconds: number;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Task, (task) => task.time_sessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'task_id' })
    task: Task;
    
}