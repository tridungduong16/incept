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
    id: 'copy-trading',
    icon: 'MIRROR',
    title: 'Copy trading',
    shortLabel: 'Copy Trading',
    description: 'Mirror top traders with allocation controls, live position previews, and pause/resume guardrails.',
    status: 'Active',
    highlights: [
      'Choose a trader and size your mirror allocation.',
      'Preview copied positions before you activate the strategy.',
      'Pause or update your copy settings without losing context.',
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
    description: 'Sync high-signal markets from trusted traders into your own watchlist with overlap controls.',
    status: 'Active',
    highlights: [
      'Copy individual markets or entire watchlists from traders you trust.',
      'See overlap before you sync more names into your own list.',
      'Keep alerts on for copied markets that still need monitoring.',
    ],
  },
  {
    id: 'community-consensus',
    icon: 'CONSENSUS',
    title: 'Community consensus',
    shortLabel: 'Consensus',
    description: 'Aggregate the community’s current bias for each market.',
    status: 'Active',
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
    status: 'Active',
    highlights: [
      'Open a focused debate room for each event market.',
      'Separate bull and bear arguments so they are easy to follow.',
      'Bring news context and price data directly into the discussion.',
    ],
  },
]

export const getSocialFeatureById = (featureId: string) =>
  socialFeatures.find((feature) => feature.id === featureId)
