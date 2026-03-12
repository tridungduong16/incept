export type LeaderboardOverviewStat = {
  label: string
  value: string
  detail: string
}

export type LeaderboardRankingRule = {
  title: string
  description: string
}

export type LeaderboardEntry = {
  rank: number
  trader: string
  handle: string
  pnl: string
  winRate: string
  sharpeLike: string
  markets: number
  followers: string
  streak: string
  topMarket: string
  thesis: string
}

export type LeaderboardSpotlight = {
  trader: string
  edge: string
  summary: string
}

export type TopTradersLeaderboardData = {
  overview: LeaderboardOverviewStat[]
  rankingRules: LeaderboardRankingRule[]
  entries: LeaderboardEntry[]
  spotlight: LeaderboardSpotlight[]
}

export type DebateRoomOverviewStat = {
  label: string
  value: string
  detail: string
}

export type DebateRoomPost = {
  author: string
  handle: string
  conviction: string
  thesis: string
  evidence: string
}

export type DebateRoomHighlight = {
  title: string
  summary: string
}

export type DebateRoomData = {
  marketTitle: string
  marketTag: string
  resolutionDate: string
  roomPrompt: string
  overview: DebateRoomOverviewStat[]
  bullCase: DebateRoomPost[]
  bearCase: DebateRoomPost[]
  moderatorNotes: DebateRoomHighlight[]
}

const topTradersLeaderboardData: TopTradersLeaderboardData = {
  overview: [
    {
      label: 'Ranked traders',
      value: '1,284',
      detail: '+9.4% active this week',
    },
    {
      label: 'Median win rate',
      value: '63.8%',
      detail: 'Across the top 250 accounts',
    },
    {
      label: 'Avg risk score',
      value: '1.74',
      detail: 'Sharpe-like score weighted by volatility',
    },
    {
      label: 'Tracked volume',
      value: '$48.2M',
      detail: 'Rolling 30-day settled and open exposure',
    },
  ],
  rankingRules: [
    {
      title: 'Performance first',
      description: 'Rankings prioritize realized P&L over the past 30 days with stronger weight on consistent returns.',
    },
    {
      title: 'Consistency weighted',
      description: 'Win rate and streaks boost traders who avoid sharp drawdowns and keep a repeatable edge.',
    },
    {
      title: 'Risk-adjusted scoring',
      description: 'A Sharpe-like score helps separate sustainable strategies from one-off outsized wins.',
    },
  ],
  entries: [
    {
      rank: 1,
      trader: 'MacroSignal',
      handle: '@macrosignal',
      pnl: '+$184,200',
      winRate: '71%',
      sharpeLike: '2.41',
      markets: 128,
      followers: '14.2K',
      streak: '11 wins',
      topMarket: 'Fed Rate Cut',
      thesis: 'Excels at macro catalysts and repricing ahead of central bank headlines.',
    },
    {
      rank: 2,
      trader: 'DeltaDesk',
      handle: '@deltadesk',
      pnl: '+$163,480',
      winRate: '68%',
      sharpeLike: '2.19',
      markets: 104,
      followers: '11.6K',
      streak: '8 wins',
      topMarket: 'BTC > $100k',
      thesis: 'Captures momentum continuation in crypto markets with tight risk management.',
    },
    {
      rank: 3,
      trader: 'PolicyEdge',
      handle: '@policyedge',
      pnl: '+$149,910',
      winRate: '66%',
      sharpeLike: '2.03',
      markets: 96,
      followers: '9.8K',
      streak: '7 wins',
      topMarket: 'AI Regulation',
      thesis: 'Strong at event-driven policy repricing when legislation odds start shifting.',
    },
    {
      rank: 4,
      trader: 'VolSurface',
      handle: '@volsurface',
      pnl: '+$132,760',
      winRate: '64%',
      sharpeLike: '1.96',
      markets: 82,
      followers: '8.1K',
      streak: '6 wins',
      topMarket: 'US Election',
      thesis: 'Trades volatility around polling inflections and debate-driven sentiment swings.',
    },
    {
      rank: 5,
      trader: 'CivicFlow',
      handle: '@civicflow',
      pnl: '+$118,540',
      winRate: '62%',
      sharpeLike: '1.84',
      markets: 76,
      followers: '6.9K',
      streak: '5 wins',
      topMarket: 'Senate Control',
      thesis: 'Builds edge by combining local polling shifts with liquidity changes across related markets.',
    },
    {
      rank: 6,
      trader: 'BasisHunter',
      handle: '@basishunter',
      pnl: '+$109,870',
      winRate: '61%',
      sharpeLike: '1.79',
      markets: 88,
      followers: '5.7K',
      streak: '4 wins',
      topMarket: 'ETH ETF Approval',
      thesis: 'Finds mispricing when correlated crypto events diverge from headline probabilities.',
    },
  ],
  spotlight: [
    {
      trader: 'MacroSignal',
      edge: 'Best macro timing',
      summary: 'Best performance when pricing lags major central bank commentary and CPI surprises.',
    },
    {
      trader: 'PolicyEdge',
      edge: 'Highest consistency',
      summary: 'Lowest drawdown in the top 10 while maintaining strong event-market hit rate.',
    },
    {
      trader: 'DeltaDesk',
      edge: 'Fastest momentum read',
      summary: 'Leads the board in profitable follow-through trades over the first two hours after breaks.',
    },
  ],
}

export const getTopTradersLeaderboardData = (): TopTradersLeaderboardData =>
  topTradersLeaderboardData

const debateRoomData: DebateRoomData = {
  marketTitle: 'Will the Fed cut rates before September?',
  marketTag: 'Macro Debate Room',
  resolutionDate: 'Resolution by Sep 18, 2026',
  roomPrompt: 'Debate whether softer inflation and cooling labor data are enough to trigger an earlier-than-expected rate cut.',
  overview: [
    {
      label: 'Active debaters',
      value: '184',
      detail: '62 new comments in the last hour',
    },
    {
      label: 'Bull conviction',
      value: '58%',
      detail: 'Leaning toward an earlier cut',
    },
    {
      label: 'Bear conviction',
      value: '42%',
      detail: 'Pricing in a delayed move',
    },
    {
      label: 'Linked sources',
      value: '27',
      detail: 'News, speeches, and macro releases in thread',
    },
  ],
  bullCase: [
    {
      author: 'MacroSignal',
      handle: '@macrosignal',
      conviction: 'High conviction',
      thesis: 'Inflation deceleration is broadening across services, which gives the Fed room to cut earlier than the market expects.',
      evidence: 'Last two CPI prints cooled while wage growth and job openings both softened in the same window.',
    },
    {
      author: 'CivicFlow',
      handle: '@civicflow',
      conviction: 'Medium conviction',
      thesis: 'Election-year pressure is not the driver, but weaker consumer demand could force a preemptive move to support growth.',
      evidence: 'Retail softness and lower credit usage are showing up at the same time as improved inflation trends.',
    },
    {
      author: 'YieldMap',
      handle: '@yieldmap',
      conviction: 'High conviction',
      thesis: 'Rates markets are still underpricing the probability of a cut if one more soft payroll report lands before Jackson Hole.',
      evidence: 'Front-end yields have not repriced as quickly as comparable downside surprises in prior cycles.',
    },
  ],
  bearCase: [
    {
      author: 'PolicyEdge',
      handle: '@policyedge',
      conviction: 'High conviction',
      thesis: 'Fed speakers continue to emphasize patience, and one softer inflation sequence is not enough to change the reaction function.',
      evidence: 'Recent commentary still prioritizes confidence that inflation is durably moving toward target.',
    },
    {
      author: 'VolSurface',
      handle: '@volsurface',
      conviction: 'Medium conviction',
      thesis: 'The market is overreacting to near-term data noise while ignoring sticky services inflation and still-resilient spending.',
      evidence: 'Core services components remain elevated relative to a path consistent with fast easing.',
    },
    {
      author: 'BasisHunter',
      handle: '@basishunter',
      conviction: 'Medium conviction',
      thesis: 'A risk-off growth scare could actually delay cuts if policymakers read it as temporary volatility rather than structural weakness.',
      evidence: 'Cross-asset positioning remains crowded and can unwind without forcing a policy response.',
    },
  ],
  moderatorNotes: [
    {
      title: 'Main disagreement',
      summary: 'The room is split on whether recent disinflation is durable enough to outweigh the Fed’s public preference for patience.',
    },
    {
      title: 'What bulls need',
      summary: 'Another soft payroll or CPI surprise would strengthen the case for a summer repricing higher in cut odds.',
    },
    {
      title: 'What bears need',
      summary: 'Sticky services inflation or firmer demand data would reinforce the view that September is still too early.',
    },
  ],
}

export const getDebateRoomData = (): DebateRoomData => debateRoomData

export type CopyTradingOverviewStat = {
  label: string
  value: string
  detail: string
}

export type CopyTradingPosition = {
  market: string
  side: 'Yes' | 'No'
  leaderPrice: number
  currentPrice: number
  leaderSizeUsd: number
  conviction: string
}

export type CopyTradingTrader = {
  id: string
  trader: string
  handle: string
  strategy: string
  followers: string
  return30d: string
  winRate: string
  riskScore: string
  averageHold: string
  copyAum: string
  defaultAllocation: number
  defaultMaxTradeUsd: number
  positions: CopyTradingPosition[]
  playbook: string[]
}

export type CopyTradingData = {
  overview: CopyTradingOverviewStat[]
  traders: CopyTradingTrader[]
}

const copyTradingData: CopyTradingData = {
  overview: [
    {
      label: 'Live copy accounts',
      value: '3,482',
      detail: '+11.8% active this week',
    },
    {
      label: 'Avg mirrored fill',
      value: '94%',
      detail: 'Orders executed inside user guardrails',
    },
    {
      label: 'Median allocation',
      value: '18%',
      detail: 'Of total portfolio per copied trader',
    },
    {
      label: 'Protected accounts',
      value: '81%',
      detail: 'Using max trade caps and pause rules',
    },
  ],
  traders: [
    {
      id: 'macro-signal',
      trader: 'MacroSignal',
      handle: '@macrosignal',
      strategy: 'Macro catalysts and central-bank repricing',
      followers: '14.2K',
      return30d: '+18.4%',
      winRate: '71%',
      riskScore: '2.41',
      averageHold: '2.4 days',
      copyAum: '$3.8M',
      defaultAllocation: 20,
      defaultMaxTradeUsd: 750,
      positions: [
        {
          market: 'Fed cuts before September',
          side: 'Yes',
          leaderPrice: 0.58,
          currentPrice: 0.62,
          leaderSizeUsd: 4200,
          conviction: 'High',
        },
        {
          market: 'CPI YoY below 2.8% in July',
          side: 'Yes',
          leaderPrice: 0.44,
          currentPrice: 0.49,
          leaderSizeUsd: 3200,
          conviction: 'Medium',
        },
        {
          market: 'US recession declared in 2026',
          side: 'No',
          leaderPrice: 0.64,
          currentPrice: 0.61,
          leaderSizeUsd: 2600,
          conviction: 'Medium',
        },
      ],
      playbook: [
        'Adds size ahead of scheduled macro releases instead of chasing after the headline.',
        'Keeps concentration highest in linked rates and inflation markets.',
        'Cuts mirrored exposure quickly when narrative confirmation fails to arrive.',
      ],
    },
    {
      id: 'delta-desk',
      trader: 'DeltaDesk',
      handle: '@deltadesk',
      strategy: 'Crypto momentum and event breakout flow',
      followers: '11.6K',
      return30d: '+16.1%',
      winRate: '68%',
      riskScore: '2.19',
      averageHold: '11 hours',
      copyAum: '$2.9M',
      defaultAllocation: 15,
      defaultMaxTradeUsd: 500,
      positions: [
        {
          market: 'BTC > $100k before Q4',
          side: 'Yes',
          leaderPrice: 0.51,
          currentPrice: 0.57,
          leaderSizeUsd: 5100,
          conviction: 'High',
        },
        {
          market: 'ETH ETF approval by August',
          side: 'Yes',
          leaderPrice: 0.47,
          currentPrice: 0.54,
          leaderSizeUsd: 2900,
          conviction: 'High',
        },
        {
          market: 'Solana overtakes ETH fees this month',
          side: 'No',
          leaderPrice: 0.59,
          currentPrice: 0.56,
          leaderSizeUsd: 1800,
          conviction: 'Low',
        },
      ],
      playbook: [
        'Leans into fast-moving momentum only after volume confirms the break.',
        'Uses smaller position caps for secondary altcoin markets.',
        'Rotates quickly out of names that lose relative strength within the same session.',
      ],
    },
    {
      id: 'policy-edge',
      trader: 'PolicyEdge',
      handle: '@policyedge',
      strategy: 'Policy headlines, regulation, and election-adjacent markets',
      followers: '9.8K',
      return30d: '+14.9%',
      winRate: '66%',
      riskScore: '2.03',
      averageHold: '3.8 days',
      copyAum: '$2.1M',
      defaultAllocation: 25,
      defaultMaxTradeUsd: 1000,
      positions: [
        {
          market: 'National AI regulation passes in 2026',
          side: 'Yes',
          leaderPrice: 0.39,
          currentPrice: 0.46,
          leaderSizeUsd: 3500,
          conviction: 'High',
        },
        {
          market: 'Senate flips this cycle',
          side: 'No',
          leaderPrice: 0.52,
          currentPrice: 0.49,
          leaderSizeUsd: 2800,
          conviction: 'Medium',
        },
        {
          market: 'TikTok sale closes before year end',
          side: 'Yes',
          leaderPrice: 0.33,
          currentPrice: 0.37,
          leaderSizeUsd: 1400,
          conviction: 'Medium',
        },
      ],
      playbook: [
        'Builds positions early when draft language or vote calendars change the base case.',
        'Pairs highly correlated policy markets to reduce single-headline risk.',
        'Lets copied followers run slower exits because policy repricing often unfolds over days.',
      ],
    },
  ],
}

export const getCopyTradingData = (): CopyTradingData => copyTradingData

export type CopyWatchlistOverviewStat = {
  label: string
  value: string
  detail: string
}

export type CopyWatchlistMarket = {
  id: string
  title: string
  category: string
  odds: number
  move24h: number
  addedAt: string
  priority: 'High' | 'Medium' | 'Low'
  thesis: string
}

export type CopyWatchlistTrader = {
  id: string
  trader: string
  handle: string
  specialty: string
  followers: string
  hitRate: string
  cadence: string
  markets: CopyWatchlistMarket[]
}

export type CopiedWatchlistMarket = CopyWatchlistMarket & {
  sourceTrader: string
  alertsEnabled: boolean
}

export type CopyWatchlistData = {
  overview: CopyWatchlistOverviewStat[]
  traders: CopyWatchlistTrader[]
  defaultCopiedMarkets: CopiedWatchlistMarket[]
}

const copyWatchlistData: CopyWatchlistData = {
  overview: [
    {
      label: 'Copied watchlists',
      value: '2,146',
      detail: '+7.2% synced in the last 7 days',
    },
    {
      label: 'Avg overlap saved',
      value: '34%',
      detail: 'Duplicate names filtered before sync',
    },
    {
      label: 'Fresh adds today',
      value: '182',
      detail: 'New markets pushed by trusted traders',
    },
    {
      label: 'Alert coverage',
      value: '88%',
      detail: 'Copied markets with active notifications',
    },
  ],
  traders: [
    {
      id: 'macro-signal',
      trader: 'MacroSignal',
      handle: '@macrosignal',
      specialty: 'Macro catalysts',
      followers: '14.2K',
      hitRate: '71%',
      cadence: '6 updates this week',
      markets: [
        {
          id: 'fed-cut-sept',
          title: 'Fed cuts before September',
          category: 'Macro',
          odds: 0.62,
          move24h: 5.4,
          addedAt: 'Added 2h ago',
          priority: 'High',
          thesis: 'Soft inflation and labor data are starting to move the base case earlier.',
        },
        {
          id: 'cpi-below-28',
          title: 'CPI YoY below 2.8% in July',
          category: 'Macro',
          odds: 0.49,
          move24h: 3.1,
          addedAt: 'Added 6h ago',
          priority: 'High',
          thesis: 'A third cooling print would likely reinforce a faster easing path.',
        },
        {
          id: 'dxy-below-100',
          title: 'DXY below 100 before Q4',
          category: 'FX',
          odds: 0.41,
          move24h: -1.8,
          addedAt: 'Added yesterday',
          priority: 'Medium',
          thesis: 'Dollar weakness becomes more credible if cuts reprice faster than peers.',
        },
      ],
    },
    {
      id: 'delta-desk',
      trader: 'DeltaDesk',
      handle: '@deltadesk',
      specialty: 'Crypto momentum',
      followers: '11.6K',
      hitRate: '68%',
      cadence: '11 updates this week',
      markets: [
        {
          id: 'btc-100k',
          title: 'BTC > $100k before Q4',
          category: 'Crypto',
          odds: 0.57,
          move24h: 7.8,
          addedAt: 'Added 45m ago',
          priority: 'High',
          thesis: 'ETF inflows and momentum continuation are compressing the path to six figures.',
        },
        {
          id: 'eth-etf-approval',
          title: 'ETH ETF approval by August',
          category: 'Crypto',
          odds: 0.54,
          move24h: 4.2,
          addedAt: 'Added 3h ago',
          priority: 'High',
          thesis: 'Policy tone has improved while positioning still lags a positive outcome.',
        },
        {
          id: 'sol-fees-eth',
          title: 'Solana overtakes ETH fees this month',
          category: 'Crypto',
          odds: 0.44,
          move24h: -2.5,
          addedAt: 'Added yesterday',
          priority: 'Low',
          thesis: 'Rotation into high-beta names creates a near-term volume spike setup.',
        },
      ],
    },
    {
      id: 'policy-edge',
      trader: 'PolicyEdge',
      handle: '@policyedge',
      specialty: 'Policy and elections',
      followers: '9.8K',
      hitRate: '66%',
      cadence: '4 updates this week',
      markets: [
        {
          id: 'ai-regulation-2026',
          title: 'National AI regulation passes in 2026',
          category: 'Policy',
          odds: 0.46,
          move24h: 6.3,
          addedAt: 'Added 90m ago',
          priority: 'High',
          thesis: 'Committee language has tightened enough to force markets higher on passage odds.',
        },
        {
          id: 'senate-flip',
          title: 'Senate flips this cycle',
          category: 'Politics',
          odds: 0.49,
          move24h: -0.9,
          addedAt: 'Added yesterday',
          priority: 'Medium',
          thesis: 'Polling remains noisy, but district-level shifts are starting to matter.',
        },
        {
          id: 'tiktok-sale',
          title: 'TikTok sale closes before year end',
          category: 'Policy',
          odds: 0.37,
          move24h: 2.2,
          addedAt: 'Added 4h ago',
          priority: 'Medium',
          thesis: 'Negotiation headlines are still too binary to ignore in event-driven baskets.',
        },
      ],
    },
  ],
  defaultCopiedMarkets: [
    {
      id: 'fed-cut-sept',
      title: 'Fed cuts before September',
      category: 'Macro',
      odds: 0.62,
      move24h: 5.4,
      addedAt: 'Synced today',
      priority: 'High',
      thesis: 'Copied from a macro specialist after multiple soft data prints.',
      sourceTrader: 'MacroSignal',
      alertsEnabled: true,
    },
    {
      id: 'ai-regulation-2026',
      title: 'National AI regulation passes in 2026',
      category: 'Policy',
      odds: 0.46,
      move24h: 6.3,
      addedAt: 'Synced yesterday',
      priority: 'High',
      thesis: 'Copied from a policy trader for longer-horizon monitoring.',
      sourceTrader: 'PolicyEdge',
      alertsEnabled: false,
    },
  ],
}

export const getCopyWatchlistData = (): CopyWatchlistData => copyWatchlistData

export type CommunityConsensusOverviewStat = {
  label: string
  value: string
  detail: string
}

export type CommunityConsensusMarket = {
  id: string
  title: string
  category: string
  bullPct: number
  bearPct: number
  neutralPct: number
  participants: number
  shift24h: number
  shift7d: number
  marketPrice: number
}

export type CommunityConsensusTimeframe = '24h' | '7d' | '30d'

export type CommunityConsensusData = {
  overview: CommunityConsensusOverviewStat[]
  markets: CommunityConsensusMarket[]
  categories: string[]
  timeframes: CommunityConsensusTimeframe[]
}

const communityConsensusData: CommunityConsensusData = {
  overview: [
    {
      label: 'Markets tracked',
      value: '412',
      detail: '+24 new this week',
    },
    {
      label: 'Avg participants',
      value: '2,840',
      detail: 'Per market per day',
    },
    {
      label: 'Strong consensus',
      value: '68%',
      detail: 'Markets with &gt;60% bull or bear',
    },
    {
      label: 'Position shifts',
      value: '1.2%',
      detail: 'Median 24h swing in lean',
    },
  ],
  categories: ['All', 'Macro', 'Crypto', 'Politics', 'Policy', 'Sports', 'Science & Tech'],
  timeframes: ['24h', '7d', '30d'],
  markets: [
    {
      id: 'fed-cut-sept',
      title: 'Fed cuts before September',
      category: 'Macro',
      bullPct: 58,
      bearPct: 32,
      neutralPct: 10,
      participants: 3420,
      shift24h: 4.2,
      shift7d: -2.1,
      marketPrice: 0.62,
    },
    {
      id: 'btc-100k',
      title: 'BTC > $100k before Q4',
      category: 'Crypto',
      bullPct: 71,
      bearPct: 18,
      neutralPct: 11,
      participants: 5180,
      shift24h: 6.8,
      shift7d: 12.4,
      marketPrice: 0.57,
    },
    {
      id: 'cpi-below-28',
      title: 'CPI YoY below 2.8% in July',
      category: 'Macro',
      bullPct: 52,
      bearPct: 38,
      neutralPct: 10,
      participants: 2890,
      shift24h: 1.9,
      shift7d: 5.3,
      marketPrice: 0.49,
    },
    {
      id: 'eth-etf-approval',
      title: 'ETH ETF approval by August',
      category: 'Crypto',
      bullPct: 64,
      bearPct: 24,
      neutralPct: 12,
      participants: 4120,
      shift24h: 3.1,
      shift7d: 8.7,
      marketPrice: 0.54,
    },
    {
      id: 'ai-regulation-2026',
      title: 'National AI regulation passes in 2026',
      category: 'Policy',
      bullPct: 44,
      bearPct: 42,
      neutralPct: 14,
      participants: 2650,
      shift24h: -2.4,
      shift7d: 7.1,
      marketPrice: 0.46,
    },
    {
      id: 'senate-flip',
      title: 'Senate flips this cycle',
      category: 'Politics',
      bullPct: 49,
      bearPct: 47,
      neutralPct: 4,
      participants: 3890,
      shift24h: -0.8,
      shift7d: -3.2,
      marketPrice: 0.49,
    },
    {
      id: 'us-recession-2026',
      title: 'US recession declared in 2026',
      category: 'Macro',
      bullPct: 22,
      bearPct: 69,
      neutralPct: 9,
      participants: 3120,
      shift24h: 2.1,
      shift7d: -4.6,
      marketPrice: 0.39,
    },
    {
      id: 'sol-fees-eth',
      title: 'Solana overtakes ETH fees this month',
      category: 'Crypto',
      bullPct: 38,
      bearPct: 51,
      neutralPct: 11,
      participants: 1980,
      shift24h: -5.2,
      shift7d: -9.4,
      marketPrice: 0.44,
    },
    {
      id: 'tiktok-sale',
      title: 'TikTok sale closes before year end',
      category: 'Policy',
      bullPct: 35,
      bearPct: 55,
      neutralPct: 10,
      participants: 2240,
      shift24h: 1.2,
      shift7d: 4.8,
      marketPrice: 0.37,
    },
  ],
}

export const getCommunityConsensusData = (): CommunityConsensusData => communityConsensusData
