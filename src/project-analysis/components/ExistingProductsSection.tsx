import React from 'react';
import { SimilarProduct } from '../types';
import { Globe, ExternalLink, Info, Search, GitBranch, Star, Check } from 'lucide-react';

interface ExistingProductsSectionProps {
  products: SimilarProduct[];
  searchDisclaimer: string;
  existsSummary?: string;
}

export const ExistingProductsSection: React.FC<ExistingProductsSectionProps> = ({
  products,
  searchDisclaimer,
  existsSummary
}) => {
  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <Globe size={20} /> Multi-Source Web Project Discovery
        </h2>
        <p>Real-time internet search and GitHub repository discovery matching real existing software projects.</p>
      </div>

      <div className="existence-summary-card">
        <div className="existence-card-top">
          <Search size={22} className="search-status-icon" />
          <div>
            <h3>Internet Existence Evaluation</h3>
            <p className="existence-text">{existsSummary || searchDisclaimer}</p>
          </div>
        </div>
      </div>

      <div className="disclaimer-banner">
        <Info size={16} className="disclaimer-icon" />
        <div>
          <b>Web Search & Deduplication Policy:</b>
          <p>{searchDisclaimer}</p>
        </div>
      </div>

      <h3 className="section-subhead">Discovered Web Projects & Repositories ({products.length})</h3>

      {products.length === 0 ? (
        <div className="empty-products-box" style={{ padding: '30px', textAlign: 'center', background: 'var(--paper)', borderRadius: '12px', border: '1px dashed var(--line)' }}>
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            No specific existing project clone requested, or no exact repository match returned from web sources.
          </p>
        </div>
      ) : (
        <div className="similar-products-grid">
          {products.map((prod, idx) => (
            <div key={idx} className="similar-product-card" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
              <div className="product-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 className="prod-name" style={{ margin: '0 0 4px', fontSize: '17px', color: 'var(--ink)' }}>{prod.name}</h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '13px', color: 'var(--muted)' }}>
                    {prod.stars !== undefined && prod.stars > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--orange)', fontWeight: 700 }}>
                        <Star size={13} fill="currentColor" /> {prod.stars.toLocaleString()} stars
                      </span>
                    )}
                    {prod.language && <span>Lang: <b>{prod.language}</b></span>}
                    {prod.source && <span>Source: <b>{prod.source}</b></span>}
                  </div>
                </div>

                <div className="product-badges">
                  <span className={`similarity-badge ${prod.similarityLevel.toLowerCase().replace(' ', '-')}`} style={{ background: 'var(--soft)', color: 'var(--green)', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, border: '1px solid var(--line)' }}>
                    {prod.similarityPercentage}% Similarity ({prod.similarityLevel})
                  </span>
                </div>
              </div>

              <div className="prod-detail-block" style={{ marginTop: '14px' }}>
                <b style={{ fontSize: '13px', color: 'var(--ink)' }}>Why Similar (Evidence Match):</b>
                {prod.whySimilarList && prod.whySimilarList.length > 0 ? (
                  <ul style={{ margin: '6px 0 0 18px', padding: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5' }}>
                    {prod.whySimilarList.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--muted)' }}>{prod.whySimilar}</p>
                )}
              </div>

              {prod.majorDifferences && prod.majorDifferences.length > 0 && (
                <div className="prod-detail-block" style={{ marginTop: '12px' }}>
                  <b style={{ fontSize: '13px', color: 'var(--ink)' }}>Key Differences & Architecture Variations:</b>
                  <ul style={{ margin: '6px 0 0 18px', padding: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5' }}>
                    {prod.majorDifferences.map((diff, i) => (
                      <li key={i}>{diff}</li>
                    ))}
                  </ul>
                </div>
              )}

              {prod.relevantFeatures && prod.relevantFeatures.length > 0 && (
                <div className="prod-detail-block" style={{ marginTop: '12px' }}>
                  <b style={{ fontSize: '13px', color: 'var(--ink)' }}>Relevant Implemented Features:</b>
                  <div className="chips-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {prod.relevantFeatures.map((feat, i) => (
                      <span key={i} className="tag-chip" style={{ background: 'var(--soft)', fontSize: '12px' }}>
                        <Check size={11} style={{ marginRight: '4px', display: 'inline' }} /> {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--line)', display: 'flex', gap: '12px' }}>
                {prod.repositoryUrl && (
                  <a href={prod.repositoryUrl} target="_blank" rel="noreferrer" className="visit font-semibold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--green)' }}>
                    <GitBranch size={14} /> View GitHub Repository <ExternalLink size={12} />
                  </a>
                )}
                {prod.websiteUrl && prod.websiteUrl !== prod.repositoryUrl && (
                  <a href={prod.websiteUrl} target="_blank" rel="noreferrer" className="visit font-semibold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--green)' }}>
                    <Globe size={14} /> View Deployed Project <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
