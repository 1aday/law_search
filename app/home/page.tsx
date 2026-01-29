"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/chat');
  };

  const features = [
    {
      title: "Instant Legal Research",
      description: "Query Supreme Court cases and get comprehensive answers in seconds.",
      icon: "⚡"
    },
    {
      title: "AI-Powered Analysis",
      description: "Advanced language models trained on legal precedent and case law.",
      icon: "🤖"
    },
    {
      title: "Complete Holdings",
      description: "Extract key holdings, dissents, and precedents with precision.",
      icon: "⚖️"
    }
  ];

  const useCases = [
    "Legal Research & Discovery",
    "Case Brief Preparation",
    "Precedent Analysis",
    "Academic Study",
    "Litigation Strategy",
    "Client Consultation"
  ];

  return (
    <div className={styles.homepage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            AI-Powered Legal Research
          </div>
          <h1 className={styles.heroTitle}>
            Interrogate the Law
            <span className={styles.heroTitleAccent}>with Intelligence</span>
          </h1>
          <p className={styles.heroSubtitle}>
            CaseQuery combines decades of Supreme Court precedent with cutting-edge AI
            to deliver instant, comprehensive legal research. Built for lawyers who demand precision.
          </p>
          <div className={styles.heroActions}>
            <button onClick={handleGetStarted} className={styles.ctaPrimary}>
              Start Research
              <span className={styles.arrow}>→</span>
            </button>
            <button className={styles.ctaSecondary}>
              See Example Queries
            </button>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>10,000+</div>
              <div className={styles.statLabel}>Cases Indexed</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>&lt;2s</div>
              <div className={styles.statLabel}>Avg Response Time</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Citation Accuracy</div>
            </div>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.codeWindow}>
            <div className={styles.codeHeader}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className={styles.codeContent}>
              <div className={styles.codeLine}>
                <span className={styles.prompt}>$</span>
                <span className={styles.input}>query "Brown v. Board holdings"</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cursor}>▋</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Precision Meets Intelligence</h2>
          <p className={styles.sectionSubtitle}>
            The research tool built for the modern legal practice
          </p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className={styles.useCases}>
        <div className={styles.useCasesContent}>
          <h2 className={styles.sectionTitle}>Built for Every Legal Workflow</h2>
          <div className={styles.useCaseGrid}>
            {useCases.map((useCase, index) => (
              <div key={index} className={styles.useCaseItem}>
                <span className={styles.checkmark}>✓</span>
                {useCase}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Research?</h2>
          <p className={styles.ctaSubtitle}>
            Join legal professionals using AI to work smarter, not harder.
          </p>
          <button onClick={handleGetStarted} className={styles.ctaButton}>
            Start Free Research
            <span className={styles.arrow}>→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
