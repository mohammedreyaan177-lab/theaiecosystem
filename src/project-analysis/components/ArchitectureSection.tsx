import React from 'react';
import { ArchitectureNode } from '../types';
import { Network, ArrowRight } from 'lucide-react';

export const ArchitectureSection: React.FC<{ nodes: ArchitectureNode[] }> = ({ nodes }) => {
  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <Network size={20} /> Recommended Technical Architecture
        </h2>
        <p>System diagram mapping frontend tiers, API gateways, database storage, and AI inference layers.</p>
      </div>

      <div className="architecture-flow-wrapper">
        <div className="arch-nodes-grid">
          {nodes.map((node, idx) => (
            <div key={node.id} className="arch-node-card">
              <div className="arch-node-top">
                <span className="arch-layer-badge">{node.layer}</span>
                <span className="arch-node-num">#{idx + 1}</span>
              </div>
              <h3 className="arch-node-title">{node.name}</h3>
              <p className="arch-node-desc">{node.description}</p>
              
              {node.connectedTo.length > 0 && (
                <div className="arch-connections">
                  <span className="connect-label">
                    Routes to <ArrowRight size={12} />
                  </span>
                  <div className="connect-tags">
                    {node.connectedTo.map((targetId) => {
                      const targetNode = nodes.find((n) => n.id === targetId);
                      return (
                        <span key={targetId} className="tag-chip font-medium">
                          {targetNode ? targetNode.name : targetId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
