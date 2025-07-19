import { useSearchParams } from 'react-router';
import styles from './task-progress.module.css';
import { getDateString, getUnitValue } from '~/utils/date';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { VIEW_BY_UNITS, VIEW_BY_UNITS_MAP } from '~/constants';
import { capitalize } from '~/utils/string';
import { useState } from 'react';
import PriodCarousel from '~/components/period-carousel/period-carousel';

const TaskProgress = () => {
  const [params] = useSearchParams();
  const taskId = params.get('id');
  const [viewByUnit, setViewByUnit] = useState(VIEW_BY_UNITS[0]);
  const [unitValue, setUnitValue] = useState(
    getUnitValue(VIEW_BY_UNITS_MAP.WEEK)
  );
  const [isViewModeChart, setIsViewModeChart] = useState(true);

  const dailyTask: any = [];

  if (!taskId) {
    return (
      <div className={styles.wrapper}>
        <p className="text-center">Task id missing</p>
      </div>
    );
  }

  const tasksResult = dailyTask.slice(0, 5);

  const getClassName = (score: number) => {
    if (score >= 75) {
      return 'excellent';
    } else if (score >= 50) {
      return 'good';
    } else if (score >= 25) {
      return 'fair';
    } else {
      return 'poor';
    }
  };

  const data = tasksResult.map((task: any) => ({
    date: getDateString(task.createdAt, true),
    score: task.score,
  }));

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{tasksResult[0]?.name}</h1>
      <div className={styles.viewByUnits}>
        <div className={styles.viewByLabel}>View by</div>
        {VIEW_BY_UNITS.map((unit) => (
          <div
            className={`${styles.viewByUnit} ${
              viewByUnit === unit ? styles.active : ''
            }`}
            key={unit}
            onClick={() => {
              setViewByUnit(unit);
              setUnitValue(getUnitValue(unit));
            }}
          >
            {capitalize(unit)}
          </div>
        ))}
      </div>
      <div className={styles.periodCarouselWrap}>
        <PriodCarousel
          value={unitValue}
          onChange={(value) => setUnitValue(value)}
        />
      </div>
      <div className={styles.viewModa}>
        <button
          className={`${styles.modeButton} ${
            isViewModeChart ? styles.active : ''
          } material-symbols-outlined`}
          onClick={() => setIsViewModeChart(true)}
        >
          show_chart
        </button>
        <button
          className={`${styles.modeButton} ${
            !isViewModeChart ? styles.active : ''
          } material-symbols-outlined`}
          onClick={() => setIsViewModeChart(false)}
        >
          {/* dehaze */}
          list
        </button>
      </div>

      {isViewModeChart ? (
        <div className={styles.chartWrap}>
          <div className={styles.yAxis}>
            <AreaChart width={35} height={302} data={data}>
              <YAxis
                width={30}
                style={{ fontSize: '.8rem' }}
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                padding={{
                  bottom: 10,
                }}
              />
              <Area dataKey="score" stroke="transparent" fill="transparent" />
            </AreaChart>
          </div>
          <div className={styles.xAxis}>
            <ResponsiveContainer
              minWidth={116 + 25 * (data.length - 1)}
              height={400}
              style={{
                marginLeft: -10,
              }}
            >
              <AreaChart data={data} margin={{ right: 15 }}>
                <CartesianGrid stroke="var(--border-color)" />
                <XAxis
                  dataKey="date"
                  height={120}
                  angle={-90}
                  style={{ fontSize: '.8rem' }}
                  textAnchor="end"
                  padding={{
                    left: 10,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    color: 'var(--text-color-soft)',
                    backgroundColor: 'var(--secondary-background)',
                    fontSize: '.8rem',
                    borderColor: 'var(--border-color)',
                  }}
                  formatter={(value: number) => {
                    return [
                      <span style={{ color: 'var(--text-color-soft)' }}>
                        Score: {value}
                      </span>,
                    ];
                  }}
                />
                <defs>
                  <linearGradient x1="0" y1="0" x2="0" y2="1" id="colorUv">
                    <stop
                      offset="0%"
                      stopColor="var(--primary-action-color)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--primary-action-color)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="linear"
                  dataKey="score"
                  stroke="var(--primary-action-color)"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <table className={styles.table}>
          <tbody>
            {tasksResult.map((t: any) => (
              <tr key={t.id}>
                <td className={`${styles.cell} ${styles.dateCell}`}>
                  <div className={styles.date}>
                    {getDateString(t.createdAt, true)}
                  </div>
                </td>
                <td className={styles.cell}>
                  <div
                    className={`${styles.scoreWrap} ${
                      styles[getClassName(t.score)]
                    }`}
                  >
                    <div className={styles.scoreText}>{t.score}</div>
                    <div className={styles.fluidBar}>
                      <div
                        className={styles.fluid}
                        style={{ width: `${t.score}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskProgress;
