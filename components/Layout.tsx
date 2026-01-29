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
                    <h1>
                        <span>Case</span>
                        <strong>Query</strong>
                    </h1>
                    <div className={styles.tagline}>
                        Interrogate · Uncover · Navigate
                    </div>
                </div>
            </header>
            <main className={styles.main}>{children}</main>
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <p>© 2024 CaseQuery</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
