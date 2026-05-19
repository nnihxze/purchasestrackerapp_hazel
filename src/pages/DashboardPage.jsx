import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/storage';
import PurchaseCard  from '../components/PurchaseCard';
import PurchaseModal from '../components/PurchaseModal';
import styles from './DashboardPage.module.css';

const FILTERS = ['all', 'pending', 'arrived'];

export default function DashboardPage() {
  const {
    currentUser, purchases, logout,
    totalSpent, arrivedCount, pendingCount,
  } = useApp();

  const [modal,  setModal]  = useState(null);   // null | 'add' | item-object
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...purchases]
      .filter(p => {
        if (filter === 'arrived') return p.arrived;
        if (filter === 'pending') return !p.arrived;
        return true;
      })
      .filter(p => !q || p.name.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [purchases, filter, search]);

  const counts = {
    all:     purchases.length,
    pending: pendingCount,
    arrived: arrivedCount,
  };

  const filterLabel = { all: 'All', pending: 'To Receive', arrived: 'Arrived' };

  return (
    <div className={styles.page}>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <p className={styles.greeting}>Welcome back</p>
            <p className={styles.userName}>{currentUser?.name || currentUser?.username}</p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={`${styles.btnIcon} ${styles.btnAdd}`}
              onClick={() => setModal('add')}
              title="Add purchase"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3v12M3 9h12" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              className={`${styles.btnIcon} ${styles.btnLogout}`}
              onClick={logout}
              title="Log out"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3"
                  stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M10 11l3-3-3-3M13 8H6"
                  stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <p className={styles.statLabel}>Total Spent</p>
            <p className={styles.statValue}>{formatCurrency(totalSpent)}</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statLabel}>Orders</p>
            <p className={styles.statValue}>{purchases.length}</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statLabel}>Arrived</p>
            <p className={styles.statValue}>{arrivedCount}</p>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div className={styles.content}>
        {/* Search */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="4" stroke="#999" strokeWidth="1.4"/>
              <path d="M11 11l2.5 2.5" stroke="#999" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by item name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.searchClear} onClick={() => setSearch('')}>&#x2715;</button>
          )}
        </div>

        {/* Filters */}
        <div className={styles.filterBar}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.filtBtn} ${filter === f ? styles.filtActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {filterLabel[f]} ({counts[f]})
            </button>
          ))}
        </div>

        <p className={styles.sectionLabel}>Purchase List</p>

        {/* List */}
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ opacity: 0.18 }}>
              <rect x="8" y="14" width="36" height="28" rx="5" stroke="#1A1A2E" strokeWidth="2"/>
              <path d="M18 14V12a8 8 0 0116 0v2" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className={styles.emptyTitle}>
              {search || filter !== 'all' ? 'No matches found' : 'No purchases yet'}
            </p>
            <p className={styles.emptySub}>
              {search || filter !== 'all'
                ? 'Try a different search or filter'
                : 'Tap + to add your first entry'}
            </p>
          </div>
        ) : (
          filtered.map(item => (
            <PurchaseCard key={item.id} item={item} onEdit={() => setModal(item)} />
          ))
        )}
      </div>

      {/* ── FAB ── */}
      <div className={styles.fab}>
        <button onClick={() => setModal('add')}>+ Add Purchase</button>
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <PurchaseModal
          item={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
