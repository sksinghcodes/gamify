import styles from './stratefy-info.module.css';

interface StrategyInfoProps {
  for29thFebOnly: boolean;
}

const StrategyInfo: React.FC<StrategyInfoProps> = ({ for29thFebOnly }) => {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h3 className={styles.subheading}>Why this matters</h3>
        {for29thFebOnly ? (
          <p className={styles.paragraph}>
            February has 28 days in non-leap years and 29 days in leap years.
          </p>
        ) : (
          <>
            <p className={styles.paragraph}>
              Not all months include every date:
            </p>
            <ul className={styles.list}>
              <li>
                February has 28 days in non-leap years and 29 days in leap
                years.
              </li>
              <li>April, June, September, and November have only 30 days.</li>
            </ul>
          </>
        )}
      </section>

      <section className={styles.section}>
        <h3 className={styles.subheading}>What are your options?</h3>
        <div className={styles.optionDes}>
          <strong>Skip the month</strong>
          <p className={styles.optionDescription}>
            {for29thFebOnly
              ? 'The event will not occur in February during non-leap years.'
              : 'The event will not occur in months that don’t contain the selected date.'}
          </p>
        </div>
        <div className={styles.optionDes}>
          <strong>Move to last date</strong>
          <p className={styles.optionDescription}>
            {for29thFebOnly
              ? 'The event will automatically shift to February 28 in non-leap years.'
              : 'The event will automatically shift to the closest valid date in that month (e.g. 30 → 28 in February).'}
          </p>
        </div>
      </section>

      {!for29thFebOnly && (
        <section className={styles.section}>
          <h3 className={styles.subheading}>Example</h3>
          <p className={styles.paragraph}>
            If you select <strong>29</strong> and the current month is{' '}
            <strong>February</strong>:
          </p>
          <ul className={styles.list}>
            <li>
              <strong>Skip the month:</strong> The event will not occur in
              February.
            </li>
            <li>
              <strong>Move to last valid date:</strong> The event will occur on
              February 28 (or 29 in a leap year).
            </li>
          </ul>
        </section>
      )}
    </div>
  );
};

export default StrategyInfo;
