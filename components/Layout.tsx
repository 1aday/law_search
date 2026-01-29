import React from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logo}>
                        CaseQuery
                    </div>
                    <div className={styles.tagline}>
                        Supreme Court Research
                    </div>
                </div>
            </header>
            <main className={styles.main}>{children}</main>
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    © 2024 CaseQuery
                </div>
            </footer>
        </div>
    );
};

export default Layout;
