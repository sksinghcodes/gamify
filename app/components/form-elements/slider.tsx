import React, { useEffect, useRef } from 'react';
import type { CustomChangeEvent } from './option-group';
import styles from './form-elements.module.css';
import Label, { type LabelProps } from './label';
import { classes } from '~/utils/string';
import ErrorText from '../error-text/error-text';

interface SliderProps {
  value: number | null;
  onChange: (e: CustomChangeEvent<number>) => void;
  name: string;
  className?: string;
  label?: React.ReactNode;
  labelProps?: LabelProps;
  error?: string;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  name,
  className,
  label,
  labelProps,
  error,
}) => {
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const baseRef = useRef<HTMLDivElement | null>(null);
  const safeValue = value || 0;

  useEffect(() => {
    const thumb = thumbRef.current;
    const base = baseRef.current;
    if (!thumb || !base) return;

    const updateValue = (clientX: number) => {
      const rect = base.getBoundingClientRect();
      let percent = ((clientX - rect.left - 24) / (rect.width - 48)) * 100;
      percent = Math.max(0, Math.min(100, percent));
      onChange({ target: { name, value: Math.floor(percent) } });
    };

    const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX);
    const handleTouchMove = (e: TouchEvent) =>
      updateValue(e.touches[0].clientX);

    const stopListening = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopListening);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', stopListening);
    };

    const startListeningMouse = () => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopListening);
    };

    const startListeningTouch = () => {
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', stopListening);
    };

    thumb.addEventListener('mousedown', startListeningMouse);
    thumb.addEventListener('touchstart', startListeningTouch, {
      passive: true,
    });

    return () => {
      thumb.removeEventListener('mousedown', startListeningMouse);
      thumb.removeEventListener('touchstart', startListeningTouch);
    };
  }, [onChange, name]);

  return (
    <div className={classes(styles.wrap, className)}>
      {!!label && <Label {...labelProps}>{label}</Label>}
      <div className={styles.baseWrap}>
        <div className={styles.base} ref={baseRef}>
          <div
            className={styles.fluid}
            style={{ width: `${safeValue}%` }}
          ></div>
          <div
            className={styles.thumb}
            ref={thumbRef}
            style={{ left: `calc(${safeValue}% - ${(48 * safeValue) / 100}px` }}
          >
            {value === null ? '-' : safeValue}
          </div>
        </div>
      </div>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
};

export default Slider;
