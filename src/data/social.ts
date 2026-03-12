export type SocialFeatureStatus = 'Active' | 'Coming Soon'

export type SocialFeature = {
  id: string
  icon: string
  title: string
  shortLabel: string
  description: string
  status: SocialFeatureStatus
  highlights: string[]
}

export const socialFeatures: SocialFeature[] = [
  {
    id: 'leaderboard',
    icon: 'TOP',
    title: 'Top traders leaderboard',
    shortLabel: 'Leaderboard',
    description: 'Rank traders by P&L, win rate, and a Sharpe-like performance score.',
    status: 'Active',
    highlights: [
      'View a real-time leaderboard ranked by P&L.',
      'Compare win rate and consistency across traders.',
      'Use a Sharpe-like score to evaluate risk-adjusted performance.',
    ],
  },
  {
    id: 'public-theses',
    icon: 'THESIS',
    title: 'Public theses',
    shortLabel: 'Theses',
    description: 'Users share their reasoning for specific markets.',
    status: 'Coming Soon',
    highlights: [
      'Read bull and bear cases from other traders.',
      'Track thesis updates over time for each market.',
      'Compare published theses with subsequent price action.',
    ],
  },
  {
    id: 'copy-watchlist',
    icon: 'COPY',
    title: 'Copy watchlist',
    shortLabel: 'Watchlist',
    description: 'Follow another trader’s watchlist to discover opportunities faster.',
    status: 'Coming Soon',
    highlights: [
      'Copy watchlists from traders you trust.',
      'Get updates when new markets are added.',
      'Flag overlapping markets to keep tracking efficient.',
    ],
  },
  {
    id: 'community-consensus',
    icon: 'CONSENSUS',
    title: 'Community consensus',
    shortLabel: 'Consensus',
    description: 'Aggregate the community’s current bias for each market.',
    status: 'Coming Soon',
    highlights: [
      'Measure bullish and bearish lean across the community.',
      'Aggregate sentiment by market and event.',
      'Track how positioning shifts over time.',
    ],
  },
  {
    id: 'debate-room',
    icon: 'DEBATE',
    title: 'Debate room',
    shortLabel: 'Debate',
    description: 'A dedicated bull-vs-bear discussion space for each event.',
    status: 'Coming Soon',
    highlights: [
      'Open a focused debate room for each event market.',
      'Separate bull and bear arguments so they are easy to follow.',
      'Bring news context and price data directly into the discussion.',
    ],
  },
]

export const getSocialFeatureById = (featureId: string) =>
  socialFeatures.find((feature) => feature.id === featureId)
