// ── USER ACCOUNTS ──────────────────────────────────────────────────
export function getUsers() {
  return JSON.parse(localStorage.getItem('pt_users') || '[]');
}

export function saveUsers(users) {
  localStorage.setItem('pt_users', JSON.stringify(users));
}

// ── SESSION ────────────────────────────────────────────────────────
export function getSession() {
  return JSON.parse(sessionStorage.getItem('pt_session') || 'null');
}

export function setSession(user) {
  sessionStorage.setItem('pt_session', JSON.stringify(user));
}

export function clearSession() {
  sessionStorage.removeItem('pt_session');
}

// ── PER-USER PURCHASE DATA ─────────────────────────────────────────
export function getUserDB(username) {
  return JSON.parse(localStorage.getItem('pt_db_' + username) || '[]');
}

export function saveUserDB(username, data) {
  localStorage.setItem('pt_db_' + username, JSON.stringify(data));
}

// ── HELPERS ────────────────────────────────────────────────────────
export function today() {
  return new Date().toISOString().split('T')[0];
}

export function formatCurrency(n) {
  return '₱' + parseFloat(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
