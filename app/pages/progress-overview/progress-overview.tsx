import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import styles from './progress-overview.module.css';
import { ROUTES } from '~/constants';

const xpData = [
  { date: 'May 1', xp: 30 },
  { date: 'May 2', xp: 50 },
  { date: 'May 3', xp: 40 },
  { date: 'May 4', xp: 90 },
  { date: 'May 5', xp: 70 },
];

const completionData = [
  { day: 'Mon', completed: 3 },
  { day: 'Tue', completed: 5 },
  { day: 'Wed', completed: 2 },
  { day: 'Thu', completed: 4 },
  { day: 'Fri', completed: 5 },
];

const streaks = [true, true, false, true, true, true, false];

export const meta = () => {
  return [{ title: ROUTES.PROGRESS_OVERVIEW.title }];
};

const ProgressOverview = () => {
  return (
    <div className={styles.wrapper}>
      {/* XP Progress */}
      <section className={styles.section}>
        <h2>XP Growth</h2>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={xpData}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary-action-color)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary-action-color)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="var(--text-color-soft)" />
              <YAxis stroke="var(--text-color-soft)" />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-color)"
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="var(--primary-action-color)"
                fill="url(#xpGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Task Completion */}
      <section className={styles.section}>
        <h2>Task Completion</h2>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={completionData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-color)"
              />
              <XAxis dataKey="day" stroke="var(--text-color-soft)" />
              <YAxis stroke="var(--text-color-soft)" />
              <Tooltip />
              <Bar dataKey="completed" fill="var(--primary-action-color)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Streak Tracker */}
      <section className={styles.section}>
        <h2>Streak Tracker</h2>
        <div className={styles.streakRow}>
          {streaks.map((done, i) => (
            <div
              key={i}
              className={`${styles.streakPill} ${
                done ? styles.streakOn : styles.streakOff
              }`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProgressOverview;
