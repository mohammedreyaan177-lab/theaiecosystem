import React from 'react';
import { SimilarProduct } from '../types';
import { Globe, ExternalLink, Info, Search, CheckCircle2 } from 'lucide-react';

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
          <Globe size={20} /> Internet & Existing Product Search
        </h2>
        <p>Live web research evaluating whether similar software products, SaaS tools, or GitHub repositories exist online.</p>
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
          <b>Research & Non-Existence Disclaimer:</b>
          <p>{searchDisclaimer}</p>
        </div>
      </div>

      <h3 className="section-subhead">Related Internet Products Discovered ({products.length})</h3>

      {products.length === 0 ? (
        <div className="empty-products-box">
          <p>No highly similar products were identified in the sources searched.</p>
        </div>
      ) : (
        <div className="similar-products-grid">
          {products.map((prod, idx) => (
            <div key={idx} className="similar-product-card">
              <div className="product-card-top">
                <div>
                  <h3 className="prod-name">{prod.name}</h3>
                  <a href={prod.websiteUrl} target="_blank" rel="noreferrer" className="prod-link">
                    {prod.websiteUrl.replace(/^https?:\/\//, '')} <ExternalLink size={12} />
                  </a>
                </div>
                <div className="product-badges">
                  <span className={`similarity-badge ${prod.similarityLevel.toLowerCase().replace(' ', '-')}`}>
                    {prod.similarityLevel} Similarity ({prod.similarityPercentage}%)
                  </span>
                </div>
              </div>

              <div className="prod-detail-block">
                <b>Why Similar:</b>
                <p>{prod.whySimilar}</p>
              </div>

              <div className="prod-detail-block">
                <b>Major Differences:</b>
                <ul>
                  {prod.majorDifferences.map((diff, i) => (
                    <li key={i}>{diff}</li>
                  ))}
                </ul>
              </div>

              <div className="prod-detail-block">
                <b>Relevant Discovered Features:</b>
                <div className="chips-wrap">
                  {prod.relevantFeatures.map((feat, i) => (
                    <span key={i} className="tag-chip">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
