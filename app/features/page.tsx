"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import styles from './page.module.css';

export default function FeaturesPage() {
  const router = useRouter();

  const coreFeatures = [
    {
      category: "AI-Powered Analysis",
      icon: "🤖",
      features: [
        {
          name: "Instant Case Briefs",
          description: "Auto-generate comprehensive case briefs with facts, issues, ratio decidendi, and holding in seconds",
          benefit: "Skip 2-3 hours of manual briefing per case"
        },
        {
          name: "Charter Test Decoder",
          description: "Break down Oakes, section 7, section 8 tests with step-by-step application to your facts",
          benefit: "Master complex constitutional frameworks"
        },
        {
          name: "Precedent Strength Analyzer",
          description: "Evaluate how binding/persuasive a case is based on jurisdiction, recency, and citation frequency",
          benefit: "Build stronger legal arguments"
        },
        {
          name: "Counter-Argument Finder",
          description: "Automatically identify dissenting opinions and cases that distinguish or limit your precedents",
          benefit: "Anticipate opposing counsel's strategy"
        }
      ]
    },
    {
      category: "Research Efficiency",
      icon: "⚡",
      features: [
        {
          name: "Natural Language Search",
          description: "Ask questions in plain English: 'Can police search my phone at the border without a warrant?'",
          benefit: "No more complex Boolean operators"
        },
        {
          name: "Similar Fact Pattern Matching",
          description: "Find cases with analogous facts, not just similar legal issues or keywords",
          benefit: "Discover highly relevant precedents others miss"
        },
        {
          name: "Citation Network Visualization",
          description: "Interactive graph showing how cases cite, overrule, and distinguish each other",
          benefit: "Understand legal evolution at a glance"
        },
        {
          name: "Smart Excerpting",
          description: "AI highlights the most important paragraphs—key holdings, tests, and binding statements",
          benefit: "Read 20% of the decision, get 100% understanding"
        }
      ]
    },
    {
      category: "Document Production",
      icon: "📝",
      features: [
        {
          name: "One-Click Factum Export",
          description: "Export case analysis with proper citation formatting directly to Word/PDF",
          benefit: "Copy-paste ready legal writing"
        },
        {
          name: "Citation Generator",
          description: "Automatic neutral citation, SCR citation, and CanLII links in proper McGill Guide format",
          benefit: "Perfect citations every time"
        },
        {
          name: "Legal Memo Templates",
          description: "Generate structured memos with Issue/Rule/Analysis/Conclusion format pre-populated",
          benefit: "Professional documents in minutes"
        },
        {
          name: "Client-Friendly Summaries",
          description: "Convert complex legal holdings into plain language explanations for clients",
          benefit: "Better client communication"
        }
      ]
    },
    {
      category: "Advanced Research",
      icon: "🔬",
      features: [
        {
          name: "Judicial Authorship Tracking",
          description: "See which judges wrote which decisions, track judicial philosophy and voting patterns",
          benefit: "Predict judicial reasoning"
        },
        {
          name: "Legislative Context",
          description: "Automatic linking to statutes, regulations, and legislative history referenced in decisions",
          benefit: "Complete legal context"
        },
        {
          name: "Downstream Impact Analysis",
          description: "See every case that cited this decision—positive treatment, negative, or distinguished",
          benefit: "Verify precedent is still good law"
        },
        {
          name: "Practice Area Filtering",
          description: "Filter by Criminal, Constitutional, Administrative, Charter, Contract, Tort, etc.",
          benefit: "Focus on your specialty"
        }
      ]
    },
    {
      category: "Collaboration & Organization",
      icon: "👥",
      features: [
        {
          name: "Research Folders",
          description: "Organize cases by matter, client, or issue with unlimited folders and tags",
          benefit: "Never lose important research"
        },
        {
          name: "Team Sharing",
          description: "Share case analyses, notes, and folders with colleagues securely",
          benefit: "Collaborate efficiently"
        },
        {
          name: "Research Timeline",
          description: "See chronological development of legal doctrine across multiple decisions",
          benefit: "Understand how law evolved"
        },
        {
          name: "Email Digests",
          description: "Get alerts when new SCC decisions affect your saved research or practice areas",
          benefit: "Stay current effortlessly"
        }
      ]
    },
    {
      category: "Productivity Tools",
      icon: "🎯",
      features: [
        {
          name: "Audio Summaries",
          description: "Listen to AI-generated case summaries while commuting or multitasking",
          benefit: "Learn while driving/walking"
        },
        {
          name: "Compare Cases Side-by-Side",
          description: "View two or more cases in split-screen with highlighted differences/similarities",
          benefit: "Spot distinctions instantly"
        },
        {
          name: "Annotation & Highlighting",
          description: "Highlight passages, add notes, and bookmark important sections",
          benefit: "Personalized research library"
        },
        {
          name: "Quick Reference Cards",
          description: "One-page summaries of landmark cases (Oakes, Dunsmuir, Grant, etc.)",
          benefit: "Instant reference in court"
        }
      ]
    }
  ];

  const comingSoon = [
    {
      name: "AI Factum Review",
      description: "Upload your draft factum and get AI feedback on argument strength, missing precedents, and citation gaps",
      eta: "Q2 2024"
    },
    {
      name: "Oral Argument Prep",
      description: "AI generates likely judicial questions based on case facts and precedents",
      eta: "Q3 2024"
    },
    {
      name: "Provincial Court Integration",
      description: "Expand to Ontario, BC, Quebec Court of Appeal decisions with SCC cross-referencing",
      eta: "Q4 2024"
    },
    {
      name: "Legal Research API",
      description: "Integrate CaseQuery's AI into your firm's practice management software",
      eta: "2025"
    }
  ];

  return (
    <Layout>
      <div className={styles.featuresPage}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Features Built for <span>Canadian Legal Practice</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Every feature designed to solve real problems lawyers face in Supreme Court research—
              from case briefing to factum preparation to client communication.
            </p>
            <button onClick={() => router.push('/chat')} className={styles.ctaButton}>
              Try All Features Free
              <span className={styles.arrow}>→</span>
            </button>
          </div>
        </section>

        {/* Core Features */}
        {coreFeatures.map((category, idx) => (
          <section key={idx} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <span className={styles.categoryIcon}>{category.icon}</span>
              <h2 className={styles.categoryTitle}>{category.category}</h2>
            </div>
            <div className={styles.featureGrid}>
              {category.features.map((feature, fidx) => (
                <div key={fidx} className={styles.featureCard}>
                  <h3 className={styles.featureName}>{feature.name}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                  <div className={styles.featureBenefit}>
                    <span className={styles.benefitIcon}>✓</span>
                    {feature.benefit}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Coming Soon */}
        <section className={styles.comingSoon}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Coming Soon</h2>
            <p className={styles.sectionSubtitle}>
              We're constantly building new features based on lawyer feedback
            </p>
          </div>
          <div className={styles.comingSoonGrid}>
            {comingSoon.map((item, idx) => (
              <div key={idx} className={styles.comingSoonCard}>
                <div className={styles.comingSoonHeader}>
                  <h3 className={styles.comingSoonName}>{item.name}</h3>
                  <span className={styles.comingSoonEta}>{item.eta}</span>
                </div>
                <p className={styles.comingSoonDescription}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Start Using These Features Today</h2>
            <p className={styles.ctaSubtitle}>
              All core features are available now. No credit card required.
            </p>
            <button onClick={() => router.push('/chat')} className={styles.ctaButton}>
              Begin Free Research
              <span className={styles.arrow}>→</span>
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
