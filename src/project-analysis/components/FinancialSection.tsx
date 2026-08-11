import React from 'react';
import { FinancialProjections } from '../types';
import { DollarSign, TrendingUp, Users, CheckCircle2, Award } from 'lucide-react';

export const FinancialSection: React.FC<{ data: FinancialProjections }> = ({ data }) => {
  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <DollarSign size={20} /> Financial Unit Economics & Monetization
        </h2>
        <p>Revenue model, suggested pricing tiers, estimated infrastructure expenses, CAC strategy, and break-even targets.</p>
      </div>

      <div className="overview-box margin-bottom">
        <h4>
          <TrendingUp size={16} /> Monetization Strategy
        </h4>
        <b className="highlight-text">{data.monetizationModel}</b>
      </div>

      <h4 className="sub-title">Suggested Pricing Tier Architecture</h4>
      <div className="pricing-tiers-grid">
        {data.suggestedTiers.map((tier, idx) => (
          <div key={idx} className="pricing-tier-card">
            <div className="tier-card-top">
              <span className="tier-name">{tier.tierName}</span>
              <b className="price-point">{tier.pricePoint}</b>
            </div>
            <p className="tier-desc">{tier.description}</p>
            <span className="target-aud">
              <Users size={12} /> Target: {tier.targetAudience}
            </span>
          </div>
        ))}
      </div>

      <div className="financial-meta-grid">
        <div className="financial-meta-card">
          <span className="f-label">Estimated Monthly Infra Cost</span>
          <b className="f-val">{data.estMonthlyInfraCost}</b>
        </div>
        <div className="financial-meta-card">
          <span className="f-label">Token Cost Per Active User</span>
          <b className="f-val">{data.estTokenCostPerUser}</b>
        </div>
        <div className="financial-meta-card">
          <span className="f-label">Target Break-Even Point</span>
          <b className="f-val">{data.breakEvenTarget}</b>
        </div>
      </div>

      <div className="cac-box">
        <h4>
          <Award size={16} /> Customer Acquisition (CAC) Strategy
        </h4>
        <p>{data.cacStrategy}</p>
      </div>
    </div>
  );
};
