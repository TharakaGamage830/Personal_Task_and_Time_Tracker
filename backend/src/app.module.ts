import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { TimeTrackingModule } from './time-tracking/time-tracking.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';
import { TimeSession } from './time-tracking/time-session.entity';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        // DEBUG LOGGING - CRITICAL!
        console.log('==========================================');
        console.log('🔍 DATABASE CONNECTION DEBUG:');
        console.log('DATABASE_URL exists:', !!databaseUrl);
        console.log('DATABASE_URL value:', databaseUrl ? databaseUrl.substring(0, 50) + '...' : 'NOT SET');
        console.log('NODE_ENV:', configService.get('NODE_ENV'));
        console.log('All env keys:', Object.keys(process.env).filter(k => k.includes('DATA')));
        console.log('==========================================');

        if (databaseUrl) {
          console.log('✅ Using DATABASE_URL connection');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Task, TimeSession],
            synchronize: configService.get('NODE_ENV') !== 'production',
            ssl: {
              rejectUnauthorized: false,
            },
          };
        } else {
          console.log('❌ DATABASE_URL not found, using fallback config');
          return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            entities: [User, Task, TimeSession],
            synchronize: true,
          };
        }
      },
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    TasksModule,
    TimeTrackingModule,
    DashboardModule
  ],
})
export class AppModule { }