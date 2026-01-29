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
      title: "Supreme Court Research",
      description: "Query Supreme Court of Canada decisions with AI-powered precision and comprehensive analysis.",
      icon: "⚖️"
    },
    {
      title: "Canadian Legal Intelligence",
      description: "Purpose-built for Canadian law with deep understanding of SCC precedent and Charter jurisprudence.",
      icon: "🍁"
    },
    {
      title: "Complete Case Analysis",
      description: "Extract ratio decidendi, dissents, and precedential value with authoritative accuracy.",
      icon: "📚"
    }
  ];

  const useCases = [
    "Constitutional Law Research",
    "Charter Rights Analysis",
    "Factum Preparation",
    "Legal Memoranda",
    "Academic Research",
    "Client Advisory"
  ];

  return (
    <div className={styles.homepage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            Supreme Court of Canada Research
          </div>
          <h1 className={styles.heroTitle}>
            Canadian Legal Research
            <span className={styles.heroTitleAccent}>Powered by Intelligence</span>
          </h1>
          <p className={styles.heroSubtitle}>
            CaseQuery delivers instant, comprehensive analysis of Supreme Court of Canada decisions.
            Built for Canadian legal professionals who demand precision in constitutional and appellate research.
          </p>
          <div className={styles.heroActions}>
            <button onClick={handleGetStarted} className={styles.ctaPrimary}>
              Start Research
              <span className={styles.arrow}>→</span>
            </button>
            <button className={styles.ctaSecondary}>
              View Example Queries
            </button>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>5,000+</div>
              <div className={styles.statLabel}>SCC Decisions</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>1982–</div>
              <div className={styles.statLabel}>Charter Era Coverage</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Citation Accuracy</div>
            </div>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.demoCard}>
            <div className={styles.demoTitle}>Live Example</div>
            <div className={styles.demoQuery}>
              What is the Oakes test in Charter analysis?
            </div>
            <div className={styles.demoResponse}>
              The <strong>Oakes test</strong> stems from <em>R. v. Oakes</em>, [1986] 1 SCR 103, establishing the framework for section 1 Charter analysis.

              <br/><br/>

              To justify a limit on Charter rights, the government must prove:
              <br/>
              1. The objective is pressing and substantial
              <br/>
              2. The means are proportional (rational connection, minimal impairment, proportionate effects)
              <span className={styles.typing}></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Canadian Legal Excellence</h2>
          <p className={styles.sectionSubtitle}>
            Purpose-built for the unique demands of Canadian appellate and constitutional research
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
          <h2 className={styles.sectionTitle}>For Every Canadian Legal Practice</h2>
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
          <h2 className={styles.ctaTitle}>Transform Your SCC Research</h2>
          <p className={styles.ctaSubtitle}>
            Join Canadian legal professionals using AI to research Supreme Court decisions with unprecedented speed and accuracy.
          </p>
          <button onClick={handleGetStarted} className={styles.ctaButton}>
            Begin Research
            <span className={styles.arrow}>→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
