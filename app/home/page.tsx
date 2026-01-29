"use client";

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();
  const examplesRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    router.push('/chat');
  };

  const scrollToExamples = () => {
    examplesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const problems = [
    {
      title: "Hours of Manual Research",
      problem: "Lawyers spend 6-8 hours per case reading lengthy SCC decisions to find relevant holdings.",
      solution: "Get comprehensive case analysis in under 2 seconds. Extract ratio decidendi instantly.",
      icon: "⏱️"
    },
    {
      title: "Expensive Database Costs",
      problem: "$300-500/month for legal research databases. Small firms struggle with costs.",
      solution: "Access Supreme Court research at a fraction of traditional database costs.",
      icon: "💰"
    },
    {
      title: "Complex Charter Analysis",
      problem: "Understanding multi-part tests like Oakes requires deep precedent knowledge.",
      solution: "AI explains Charter tests, applications, and evolving interpretations clearly.",
      icon: "📊"
    },
    {
      title: "Finding Relevant Precedents",
      problem: "Locating cases that actually apply to your fact pattern is time-consuming guesswork.",
      solution: "Natural language queries find precisely relevant precedents and their applications.",
      icon: "🎯"
    }
  ];

  const features = [
    {
      title: "Instant Case Summaries",
      description: "Get ratio decidendi, key holdings, and precedential value without reading 100+ page decisions.",
      benefit: "Save 5+ hours per case",
      icon: "⚡"
    },
    {
      title: "Charter Test Explanations",
      description: "Understand Oakes, section 7 analysis, and other complex Charter frameworks with clear breakdowns.",
      benefit: "Master constitutional law",
      icon: "⚖️"
    },
    {
      title: "Dissent Analysis",
      description: "Compare majority and dissenting opinions to understand judicial reasoning and predict appeals.",
      benefit: "Strengthen arguments",
      icon: "🔍"
    },
    {
      title: "Precedent Tracking",
      description: "See how cases cite each other, overrule precedents, or distinguish fact patterns.",
      benefit: "Build stronger authority",
      icon: "📚"
    },
    {
      title: "Plain Language Answers",
      description: "Complex legal concepts explained clearly for client advisories and memoranda.",
      benefit: "Communicate effectively",
      icon: "💬"
    },
    {
      title: "Citation Formatting",
      description: "Proper SCC citation format for factums, memoranda, and legal documents.",
      benefit: "Professional accuracy",
      icon: "📝"
    }
  ];

  const useCases = [
    {
      title: "Factum Preparation",
      description: "Find supporting precedents and distinguish opposing cases quickly"
    },
    {
      title: "Legal Memoranda",
      description: "Research and analyze legal issues with comprehensive case law"
    },
    {
      title: "Client Advisory",
      description: "Explain relevant case law in clear, accessible language"
    },
    {
      title: "Academic Research",
      description: "Analyze judicial reasoning and legal doctrine development"
    },
    {
      title: "Appeal Strategy",
      description: "Identify successful appeal arguments from dissenting opinions"
    },
    {
      title: "Due Diligence",
      description: "Quickly verify legal positions with authoritative SCC precedent"
    }
  ];

  const exampleQueries = [
    "What is the Oakes test and how is it applied in Charter analysis?",
    "Explain the ratio decidendi in R. v. Morgentaler regarding section 7 rights",
    "What did the SCC hold in Reference re Secession of Quebec?",
    "How did Roncarelli v. Duplessis establish the rule of law in Canada?",
    "What is the test for section 8 Charter protection against unreasonable search?",
    "Explain the Dunsmuir framework for administrative law judicial review"
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
            Stop Reading 100-Page Decisions
            <span className={styles.heroTitleAccent}>Start Getting Answers</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Canadian lawyers waste hours reading lengthy SCC decisions. CaseQuery delivers instant case analysis,
            Charter test explanations, and precedent tracking—so you can focus on winning arguments, not research.
          </p>
          <div className={styles.heroActions}>
            <button onClick={handleGetStarted} className={styles.ctaPrimary}>
              Start Free Research
              <span className={styles.arrow}>→</span>
            </button>
            <button onClick={scrollToExamples} className={styles.ctaSecondary}>
              View Example Queries
            </button>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>5,000+</div>
              <div className={styles.statLabel}>SCC Decisions</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>&lt;2s</div>
              <div className={styles.statLabel}>Average Response</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>85%</div>
              <div className={styles.statLabel}>Time Saved</div>
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

      {/* Problems & Solutions */}
      <section className={styles.problems}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Legal Research Shouldn't Take All Day</h2>
          <p className={styles.sectionSubtitle}>
            Real problems Canadian lawyers face—and how CaseQuery solves them
          </p>
        </div>
        <div className={styles.problemGrid}>
          {problems.map((item, index) => (
            <div key={index} className={styles.problemCard}>
              <div className={styles.problemIcon}>{item.icon}</div>
              <h3 className={styles.problemTitle}>{item.title}</h3>
              <div className={styles.problemText}>
                <div className={styles.problemIssue}>
                  <span className={styles.problemLabel}>Problem:</span> {item.problem}
                </div>
                <div className={styles.problemSolution}>
                  <span className={styles.solutionLabel}>Solution:</span> {item.solution}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Everything You Need for SCC Research</h2>
          <p className={styles.sectionSubtitle}>
            Purpose-built features for Canadian legal professionals
          </p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              <div className={styles.featureBenefit}>{feature.benefit}</div>
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
                <div className={styles.useCaseMain}>
                  <span className={styles.checkmark}>✓</span>
                  <div>
                    <div className={styles.useCaseTitle}>{useCase.title}</div>
                    <div className={styles.useCaseDescription}>{useCase.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Queries */}
      <section className={styles.examples} ref={examplesRef}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Try These Queries</h2>
          <p className={styles.sectionSubtitle}>
            Click any question to see instant AI-powered analysis
          </p>
        </div>
        <div className={styles.exampleGrid}>
          {exampleQueries.map((query, index) => (
            <div
              key={index}
              className={styles.exampleCard}
              onClick={handleGetStarted}
            >
              <div className={styles.exampleIcon}>?</div>
              <div className={styles.exampleText}>{query}</div>
              <div className={styles.exampleArrow}>→</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Start Researching Smarter Today</h2>
          <p className={styles.ctaSubtitle}>
            Join Canadian lawyers who've reclaimed hours every week with AI-powered SCC research.
            No credit card required.
          </p>
          <button onClick={handleGetStarted} className={styles.ctaButton}>
            Begin Free Research
            <span className={styles.arrow}>→</span>
          </button>
          <div className={styles.ctaNote}>
            Free access to all Supreme Court of Canada decisions • No installation required
          </div>
        </div>
      </section>
    </div>
  );
}
