export type AIStudioFeatureStatus = 'Active' | 'Coming Soon'

export type AIStudioFeature = {
  id: string
  icon: string
  title: string
  shortLabel: string
  description: string
  status: AIStudioFeatureStatus
  highlights: string[]
}

export const aiStudioFeatures: AIStudioFeature[] = [
  {
    id: 'market-brief',
    icon: 'AI',
    title: 'AI Market Brief',
    shortLabel: 'Market Brief',
    description: 'Summarize why price just moved so traders can quickly understand market momentum.',
    status: 'Active',
    highlights: [
      'Quickly summarize the most important price moves happening now.',
      'Compress signals from volume, spread, and order flow.',
      'Give traders context before they enter a position.',
    ],
  },
  {
    id: 'news-mapping',
    icon: 'NEWS',
    title: 'News-to-market mapping',
    shortLabel: 'News Mapping',
    description: 'Attach relevant news directly to each market so impact is clear in real time.',
    status: 'Active',
    highlights: [
      'Link breaking headlines to the most relevant markets.',
      'Highlight stories with the highest potential to move price.',
      'Track the relationship between news flow and price action over time.',
    ],
  },
  {
    id: 'auto-catalysts',
    icon: 'CAT',
    title: 'Auto-generated catalysts',
    shortLabel: 'Catalysts',
    description: 'Automatically surface the factors most likely to move price in each market.',
    status: 'Active',
    highlights: [
      'Automatically identify events with the highest price impact potential.',
      'Rank catalysts by priority and severity.',
      'Refresh the catalyst list using live market data.',
    ],
  },
  {
    id: 'mispricing-scanner',
    icon: 'SCAN',
    title: 'Mispricing scanner',
    shortLabel: 'Mispricing',
    description: 'Flag high-volume markets with unusual spreads or pricing gaps to uncover opportunities.',
    status: 'Active',
    highlights: [
      'Detect markets with abnormal spreads.',
      'Compare pricing dislocations against current liquidity.',
      'Prioritize alerts for the most active contracts.',
    ],
  },
  {
    id: 'resolution-tracker',
    icon: 'SRC',
    title: 'Resolution source tracker',
    shortLabel: 'Resolution Source',
    description: 'Show the data sources used to settle markets for better transparency and trust.',
    status: 'Active',
    highlights: [
      'Expose the settlement source for each market.',
      'Track updates and changes to resolution sources.',
      'Build trust with a more transparent settlement process.',
    ],
  },
]

export const getAIStudioFeatureById = (featureId: string) =>
  aiStudioFeatures.find((feature) => feature.id === featureId)
