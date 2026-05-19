import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/storage';
import styles from './PurchaseCard.module.css';

export default function PurchaseCard({ item, onEdit }) {
  const { toggleStatus, deletePurchase } = useApp();

  function handleDelete() {
    if (window.confirm('Delete this purchase?')) deletePurchase(item.id);
  }

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        {/* Icon */}
        <div
          className={styles.icon}
          style={{ background: item.arrived ? 'var(--success-bg)' : 'var(--warn-bg)' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="5" width="14" height="10" rx="2"
              stroke={item.arrived ? 'var(--success-border)' : 'var(--warn-border)'}
              strokeWidth="1.4" />
            <path d="M6 5V4a3 3 0 016 0v1"
              stroke={item.arrived ? 'var(--success-border)' : 'var(--warn-border)'}
              strokeWidth="1.4" />
          </svg>
        </div>

        {/* Info */}
        <div className={styles.body}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{item.name}</span>
            <button
              className={`${styles.statusPill} ${item.arrived ? styles.pillArrived : styles.pillPending}`}
              onClick={() => toggleStatus(item.id)}
              title="Toggle status"
            >
              <svg width="8" height="8" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3"
                  fill={item.arrived ? 'var(--success-border)' : 'var(--warn-border)'} />
              </svg>
              {item.arrived ? 'Arrived' : 'To Receive'}
            </button>
          </div>
          <p className={styles.date}>{formatDate(item.date)}</p>
        </div>

        {/* Price */}
        <div className={styles.price}>{formatCurrency(item.price)}</div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={`${styles.btnSm} ${styles.btnEdit}`} onClick={() => onEdit(item)}>
          Edit
        </button>
        <button className={`${styles.btnSm} ${styles.btnDel}`} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
