import type { ComponentType } from 'react'
import CommunityConsensus from './CommunityConsensus'
import CopyTrading from './CopyTrading'
import CopyWatchlist from './CopyWatchlist'
import DebateRoom from './DebateRoom'
import TopTradersLeaderboard from './TopTradersLeaderboard'

export const socialFeatureRegistry: Record<string, ComponentType> = {
  'community-consensus': CommunityConsensus,
  'copy-trading': CopyTrading,
  'copy-watchlist': CopyWatchlist,
  'debate-room': DebateRoom,
  leaderboard: TopTradersLeaderboard,
}

export {
  CommunityConsensus,
  CopyTrading,
  CopyWatchlist,
  DebateRoom,
  TopTradersLeaderboard,
}
