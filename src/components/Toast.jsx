import React, { useState, useEffect, useCallback } from 'react';
import styles from './Toast.module.css';

// Simple singleton toast via a custom event
export function showToast(msg) {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: msg }));
}

export default function Toast() {
  const [msg,     setMsg]     = useState('');
  const [visible, setVisible] = useState(false);
  const timerRef = React.useRef(null);

  const show = useCallback((e) => {
    setMsg(e.detail);
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2200);
  }, []);

  useEffect(() => {
    window.addEventListener('app-toast', show);
    return () => window.removeEventListener('app-toast', show);
  }, [show]);

  return (
    <div className={`${styles.toast} ${visible ? styles.show : ''}`}>
      {msg}
    </div>
  );
}
