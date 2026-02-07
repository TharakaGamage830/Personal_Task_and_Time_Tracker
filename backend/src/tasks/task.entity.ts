import { TimeSession } from "src/time-tracking/time-session.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tasks')
export class Task{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    user_id: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: false })
    is_completed: boolean;

    @Column({ default: 0 })
    total_time_seconds: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => TimeSession, (session) => session.task)
    time_sessions: TimeSession[];

}