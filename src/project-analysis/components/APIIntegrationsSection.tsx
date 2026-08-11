import React from 'react';
import { ThirdPartyAPIItem } from '../types';
import { Plug, ExternalLink } from 'lucide-react';

export const APIIntegrationsSection: React.FC<{ items: ThirdPartyAPIItem[] }> = ({ items }) => {
  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <Plug size={20} /> Recommended Third-Party APIs
        </h2>
        <p>Essential external API integrations for payments, email notifications, rate limiting, and model routing.</p>
      </div>

      <div className="apis-grid">
        {items.map((api, idx) => (
          <div key={idx} className="api-card">
            <div className="api-card-header">
              <div>
                <span className="api-category">{api.category}</span>
                <h3 className="api-name">{api.name}</h3>
              </div>
              <span className={`difficulty-badge ${api.integrationDifficulty.toLowerCase()}`}>
                {api.integrationDifficulty} Integration
              </span>
            </div>

            <p className="api-purpose">{api.purpose}</p>

            <a href={api.websiteUrl} target="_blank" rel="noreferrer" className="visit font-semibold">
              View API Documentation <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
