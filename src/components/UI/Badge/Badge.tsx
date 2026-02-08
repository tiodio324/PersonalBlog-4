import { ReactNode } from 'react';
import styles from './Badge.module.scss';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  style,
}: BadgeProps) => {
  const badgeClasses = [
    styles.badge,
    styles[variant],
    styles[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses} style={style}>
      {children}
    </span>
  );
};
