import { classes } from '~/utils/string';
import styles from './info-text.module.css';

interface InfoText extends React.HTMLAttributes<HTMLDivElement> {
  info: string;
  disabled?: boolean;
}

const InfoText: React.FC<InfoText> = (props) => {
  const { info, disabled, ...divProps } = props;
  return (
    <div
      {...divProps}
      className={classes(
        divProps.className,
        styles.infoWrap,
        disabled && styles.disabled
      )}
    >
      <div className={classes(styles.infoIcon, 'material-symbols-outlined')}>
        info
      </div>
      <div className={styles.infoText}>{info}</div>
    </div>
  );
};

export default InfoText;
