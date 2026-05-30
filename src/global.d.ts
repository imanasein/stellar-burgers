import 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    onPointerEnterCapture?: (e: React.PointerEvent<T>) => void;
    onPointerLeaveCapture?: (e: React.PointerEvent<T>) => void;
  }
  interface RefAttributes<T> {
    onPointerEnterCapture?: (e: React.PointerEvent<T>) => void;
    onPointerLeaveCapture?: (e: React.PointerEvent<T>) => void;
  }
}

// Разрешает side-effect импорты любых index.css (например, ../../index.css)
declare module '*/index.css';

// Для обычных CSS Modules (import styles from './App.module.css')
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
