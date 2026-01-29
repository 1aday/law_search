"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import styles from './case.module.css';

interface CaseData {
  name: string;
  citation: string;
  year: number;
  court: string;
  judges: string[];
  summary: string;
  facts: string;
  issues: string[];
  holding: string;
  ratio: string;
  impact: string;
  relatedCases: string[];
  topics: string[];
}

export default function CasePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch case data from API
    fetch(`/api/cases/${slug}`)
      .then(res => res.json())
      .then(data => {
        setCaseData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load case:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className={styles.casePage}>
          <div className={styles.loading}>Loading case information...</div>
        </div>
      </Layout>
    );
  }

  if (!caseData) {
    return (
      <Layout>
        <div className={styles.casePage}>
          <div className={styles.error}>Case not found</div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{caseData.name} | Supreme Court of Canada Case Analysis</title>
        <meta name="description" content={caseData.summary} />
        <meta name="keywords" content={`${caseData.name}, ${caseData.citation}, Supreme Court of Canada, ${caseData.topics.join(', ')}`} />
        <meta property="og:title" content={`${caseData.name} - SCC Case Summary`} />
        <meta property="og:description" content={caseData.summary} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://law-search-tawny.vercel.app/cases/${slug}`} />
      </Head>
      <Layout>
        <div className={styles.casePage}>
        <article className={styles.caseArticle}>
          {/* Header */}
          <header className={styles.caseHeader}>
            <h1 className={styles.caseName}>{caseData.name}</h1>
            <div className={styles.caseMeta}>
              <span className={styles.citation}>{caseData.citation}</span>
              <span className={styles.divider}>·</span>
              <span className={styles.year}>{caseData.year}</span>
              <span className={styles.divider}>·</span>
              <span className={styles.court}>{caseData.court}</span>
            </div>
            {caseData.judges && caseData.judges.length > 0 && (
              <div className={styles.judges}>
                <strong>Panel:</strong> {caseData.judges.join(', ')}
              </div>
            )}
          </header>

          {/* Summary Box */}
          <div className={styles.summaryBox}>
            <h2>Quick Summary</h2>
            <p>{caseData.summary}</p>
          </div>

          {/* Topics */}
          {caseData.topics && caseData.topics.length > 0 && (
            <div className={styles.topics}>
              {caseData.topics.map((topic, idx) => (
                <span key={idx} className={styles.topicTag}>{topic}</span>
              ))}
            </div>
          )}

          {/* Facts */}
          <section className={styles.section}>
            <h2>Facts</h2>
            <div className={styles.content}>{caseData.facts}</div>
          </section>

          {/* Issues */}
          {caseData.issues && caseData.issues.length > 0 && (
            <section className={styles.section}>
              <h2>Legal Issues</h2>
              <ul className={styles.issueList}>
                {caseData.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Holding */}
          <section className={styles.section}>
            <h2>Holding</h2>
            <div className={styles.content}>{caseData.holding}</div>
          </section>

          {/* Ratio Decidendi */}
          <section className={styles.section}>
            <h2>Ratio Decidendi</h2>
            <div className={styles.content}>{caseData.ratio}</div>
          </section>

          {/* Impact */}
          <section className={styles.section}>
            <h2>Legal Impact</h2>
            <div className={styles.content}>{caseData.impact}</div>
          </section>

          {/* Related Cases */}
          {caseData.relatedCases && caseData.relatedCases.length > 0 && (
            <section className={styles.section}>
              <h2>Related Cases</h2>
              <ul className={styles.relatedList}>
                {caseData.relatedCases.map((caseName, idx) => (
                  <li key={idx}>{caseName}</li>
                ))}
              </ul>
            </section>
          )}

          {/* CTA */}
          <div className={styles.cta}>
            <h3>Need detailed analysis of this case?</h3>
            <p>Ask our AI research assistant for specific questions about this decision.</p>
            <button
              className={styles.ctaButton}
              onClick={() => window.location.href = '/chat'}
            >
              Research This Case
            </button>
          </div>
        </article>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarBox}>
            <h3>About This Case</h3>
            <div className={styles.sidebarContent}>
              <div className={styles.sidebarItem}>
                <strong>Court:</strong> {caseData.court}
              </div>
              <div className={styles.sidebarItem}>
                <strong>Year:</strong> {caseData.year}
              </div>
              <div className={styles.sidebarItem}>
                <strong>Citation:</strong> {caseData.citation}
              </div>
            </div>
          </div>

          <div className={styles.sidebarBox}>
            <h3>Research Tools</h3>
            <button className={styles.sidebarButton}>
              Copy Citation
            </button>
            <button className={styles.sidebarButton}>
              Export Summary
            </button>
            <button className={styles.sidebarButton}>
              Find Similar Cases
            </button>
          </div>
        </aside>
      </div>
    </Layout>
    </>
  );
}
