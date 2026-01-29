'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Layout.module.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logo} onClick={() => router.push('/home')}>
                        CaseQuery
                    </div>
                    <nav className={styles.nav}>
                        <button
                            className={pathname === '/chat' ? styles.navItemActive : styles.navItem}
                            onClick={() => router.push('/chat')}
                        >
                            Research
                        </button>
                    </nav>
                </div>
            </header>
            <main className={styles.main}>{children}</main>
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <span>© 2024 CaseQuery</span>
                    <span className={styles.footerDivider}>·</span>
                    <span>AI-Powered Legal Research</span>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
