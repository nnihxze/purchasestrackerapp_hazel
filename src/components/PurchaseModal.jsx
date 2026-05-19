import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { today } from '../utils/storage';
import styles from './PurchaseModal.module.css';

const EMPTY = { name: '', price: '', date: today(), arrived: false };

export default function PurchaseModal({ item, onClose }) {
  const { addPurchase, updatePurchase, deletePurchase } = useApp();
  const isEdit = !!item;

  const [form,   setForm]   = useState(isEdit ? { ...item, price: String(item.price) } : EMPTY);
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);

  useEffect(() => {
    setTimeout(() => nameRef.current?.focus(), 80);
  }, []);

  // close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  }

  function validate() {
    const e = {};
    const name  = form.name.trim();
    const price = parseFloat(form.price);
    if (!name)           e.name  = 'Item name cannot be empty.';
    else if (name.length < 2) e.name = 'Name must be at least 2 characters.';
    if (form.price === '' || isNaN(price)) e.price = 'Please enter a valid price.';
    else if (price < 0)  e.price = 'Price cannot be negative.';
    if (!form.date)      e.date  = 'Please select a date.';
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const data = { name: form.name.trim(), price: parseFloat(form.price), date: form.date, arrived: form.arrived };
    if (isEdit) updatePurchase(item.id, data);
    else        addPurchase(data);
    onClose();
  }

  function handleDelete() {
    if (!window.confirm('Delete this purchase?')) return;
    deletePurchase(item.id);
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.sheet}>
        <div className={styles.handle} />

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? 'Edit Purchase' : 'Add Purchase'}</h2>
          <button className={styles.btnClose} onClick={onClose} aria-label="Close">&#x2715;</button>
        </div>

        {/* Body */}
        <div className={styles.body}>

          {/* Item Name */}
          <div className={styles.field}>
            <label className={styles.label}>Item Name</label>
            <input
              ref={nameRef}
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputErr : ''}`}
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Grocery, Headphones…"
            />
            {errors.name && <p className={styles.errMsg}>{errors.name}</p>}
          </div>

          {/* Price */}
          <div className={styles.field}>
            <label className={styles.label}>Price (₱)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className={`${styles.input} ${errors.price ? styles.inputErr : ''}`}
              value={form.price}
              onChange={e => set('price', e.target.value)}
              placeholder="0.00"
            />
            {errors.price && <p className={styles.errMsg}>{errors.price}</p>}
          </div>

          {/* Date */}
          <div className={styles.field}>
            <label className={styles.label}>Date</label>
            <input
              type="date"
              className={`${styles.input} ${errors.date ? styles.inputErr : ''}`}
              value={form.date}
              onChange={e => set('date', e.target.value)}
            />
            {errors.date && <p className={styles.errMsg}>{errors.date}</p>}
          </div>

          {/* Status */}
          <div className={styles.field}>
            <label className={styles.label}>Delivery Status</label>
            <div className={styles.statusPicker}>
              <label className={`${styles.statusOpt} ${!form.arrived ? styles.selPending : ''}`}>
                <input
                  type="radio"
                  name="status"
                  checked={!form.arrived}
                  onChange={() => set('arrived', false)}
                />
                <div>
                  <p className={styles.optLabel} style={{ color: !form.arrived ? 'var(--warn-text)' : 'var(--text-sec)' }}>
                    To Receive
                  </p>
                  <p className={styles.optSub} style={{ color: !form.arrived ? 'var(--warn-border)' : 'var(--text-muted)' }}>
                    Waiting for delivery
                  </p>
                </div>
              </label>
              <label className={`${styles.statusOpt} ${form.arrived ? styles.selArrived : ''}`}>
                <input
                  type="radio"
                  name="status"
                  checked={form.arrived}
                  onChange={() => set('arrived', true)}
                />
                <div>
                  <p className={styles.optLabel} style={{ color: form.arrived ? 'var(--success-text)' : 'var(--text-sec)' }}>
                    Arrived
                  </p>
                  <p className={styles.optSub} style={{ color: form.arrived ? 'var(--success-border)' : 'var(--text-muted)' }}>
                    Item received
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.btnSave} onClick={handleSave}>
            {isEdit ? 'Save Changes' : 'Add Purchase'}
          </button>
          {isEdit && (
            <button className={styles.btnDelete} onClick={handleDelete}>
              Delete this purchase
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
