import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCalendar, FiBook, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import styles from './AppLayout.module.css';

const navItems = [
  { label: 'MealPlanner', path: '/', icon: <FiCalendar /> },
  { label: 'Recipes', path: '/recipes', icon: <FiBook /> },
];

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('savorly-theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('savorly-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className={styles.shell}>
      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <FiBook className={styles.logoIcon} />
          </div>
          <span className={styles.brandName}>Savorly</span>
          <button className={styles.closeMobile} onClick={() => setMobileOpen(false)}>
            <FiX />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            className={styles.themeToggle}
            onClick={() => setDark(d => !d)}
            aria-label="Toggle dark mode"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
            <span>{dark ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <div className={styles.userBlock}>
            <div className={styles.avatar}>S</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>Savorly User</div>
              <div className={styles.userRole}>Home cook</div>
            </div>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setMobileOpen(true)}>
            <FiMenu />
          </button>
          <div className={styles.topbarBrand}>Savorly</div>
          <button
            className={styles.themeToggleMobile}
            onClick={() => setDark(d => !d)}
            aria-label="Toggle dark mode"
          >
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}