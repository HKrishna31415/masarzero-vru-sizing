import React from 'react';
import { QuestionnaireContainer } from './questionnaire/QuestionnaireContainer';
import { RetailNetworkPortfolio, StorageRefineryPortfolioSite } from '../store/usePortfolioStore';

export const DetailedQuestionnaire: React.FC<{ company?: string; portfolioSites?: StorageRefineryPortfolioSite[]; retailNetwork?: RetailNetworkPortfolio }> = ({ portfolioSites, retailNetwork }) => {
  return <QuestionnaireContainer portfolioSites={portfolioSites} retailNetwork={retailNetwork} />;
};
