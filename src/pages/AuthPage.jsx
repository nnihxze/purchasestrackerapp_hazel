import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import styles from './AuthPage.module.css';

// ── Small reusable field ──────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder, error, autoComplete }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${styles.fieldInput} ${error ? styles.fieldError : ''}`}
      />
      {error && <p className={styles.fieldErrMsg}>{error}</p>}
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────
function LoginForm({ onSwitch }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [errors, setErrs] = useState({});
  const [apiError, setApi] = useState('');

  function validate() {
    const e = {};
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email.trim())) e.email = 'Enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setApi('');
    const e2 = validate();
    if (Object.keys(e2).length) { setErrs(e2); return; }
    const result = login(email.trim().toLowerCase(), password);
    if (!result.ok) setApi(result.error);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {apiError && <div className={styles.alertError}>{apiError}</div>}
      <Field label="Email" type="email" value={email} onChange={v => { setEmail(v); setErrs(p => ({ ...p, email: '' })); }}
        placeholder="" autoComplete="email" error={errors.email} />
      <Field label="Password" type="password" value={password} onChange={v => { setPass(v); setErrs(p => ({ ...p, password: '' })); }}
        placeholder="" autoComplete="current-password" error={errors.password} />
      <button type="submit" className={styles.btnPrimary}>Log In</button>
      <p className={styles.switchText}>
        No account?{' '}
        <span className={styles.switchLink} onClick={onSwitch}>Register here</span>
      </p>
    </form>
  );
}

// ── REGISTER ──────────────────────────────────────────────────────
function RegisterForm({ onSwitch }) {
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConf] = useState('');
  const [errors, setErrs] = useState({});
  const [success, setSuccess] = useState(false);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email.trim())) e.email = 'Enter a valid email address.';
    if (!pass) e.pass = 'Password is required.';
    else if (pass.length < 6) e.pass = 'Password must be at least 6 characters.';
    if (pass !== confirm) e.confirm = 'Passwords do not match.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrs(e2); return; }
    const result = register(name.trim(), email.trim().toLowerCase(), pass);
    if (!result.ok) { setErrs({ [result.field]: result.error }); return; }
    setSuccess(true);
    setTimeout(onSwitch, 1400);
  }

  if (success) return <div className={styles.alertSuccess}>Account created! Redirecting to login…</div>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field label="Full Name" value={name} onChange={v => { setName(v); setErrs(p => ({ ...p, name: '' })); }}
        placeholder="" error={errors.name} />
      <Field label="Email" type="email" value={email} onChange={v => { setEmail(v); setErrs(p => ({ ...p, email: '' })); }}
        placeholder="" autoComplete="email" error={errors.email} />
      <Field label="Password" type="password" value={pass} onChange={v => { setPass(v); setErrs(p => ({ ...p, pass: '' })); }}
        placeholder="" error={errors.pass} />
      <Field label="Confirm Password" type="password" value={confirm} onChange={v => { setConf(v); setErrs(p => ({ ...p, confirm: '' })); }}
        placeholder="" error={errors.confirm} />
      <button type="submit" className={styles.btnPrimary}>Create Account</button>
      <p className={styles.switchText}>
        Already have an account?{' '}
        <span className={styles.switchLink} onClick={onSwitch}>Log in</span>
      </p>
    </form>
  );
}

// ── AUTH PAGE ─────────────────────────────────────────────────────
export default function AuthPage() {
  const [tab, setTab] = useState('login');

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect x="3" y="8" width="20" height="14" rx="3"
              fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="1.5" />
            <path d="M9 8V7a4 4 0 018 0v1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="13" cy="15" r="2" fill="#fff" />
          </svg>
        </div>

        <h1 className={styles.title}>Purchases Tracker</h1>
        <p className={styles.subtitle}>Track your orders in one place</p>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
            onClick={() => setTab('login')}
            type="button"
          >Log In</button>
          <button
            className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
            onClick={() => setTab('register')}
            type="button"
          >Register</button>
        </div>

        {tab === 'login'
          ? <LoginForm onSwitch={() => setTab('register')} />
          : <RegisterForm onSwitch={() => setTab('login')} />
        }
      </div>
    </div>
  );
}