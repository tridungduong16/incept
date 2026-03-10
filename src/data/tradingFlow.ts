export const featuredEvent = {
  id: 'barca-vs-real',
  title: 'FC Barcelona vs Real Madrid',
  shortTitle: 'Barca vs Real',
  market: 'Match Winner',
  kickoff: 'Sunday, March 16 / 21:00 CET',
  venue: 'Estadi Olimpic Lluis Companys',
  liveClock: '77:12',
  score: '2 - 1',
  probability: '0.57',
  impliedProbability: '57%',
  change: '+4.2%',
  volume: '$8.4M',
  openInterest: '$3.1M',
  traders: '18.2K',
  spread: '0.56 / 0.58',
  status: 'Live',
}

export const lobbyStats = [
  { label: 'Available Balance', value: '$12,480', detail: '+$1,240 today' },
  { label: 'Open Positions', value: '06', detail: '3 football, 2 tennis, 1 politics' },
  { label: 'Pending Orders', value: '11', detail: '4 ready to fill on match spikes' },
  { label: 'Win Rate', value: '68%', detail: 'Last 30 settled markets' },
]

export const marketCategories = ['All', 'Football', 'Live Now', 'Trending', 'Settling Soon']

export const featuredMarkets = [
  {
    title: 'Barca vs Real',
    type: 'Live',
    market: 'Barca to Win',
    price: '0.57',
    change: '+4.2%',
    volume: '$8.4M',
    routeId: featuredEvent.id,
  },
  {
    title: 'Liverpool vs Arsenal',
    type: 'Pre-match',
    market: 'Over 2.5 Goals',
    price: '0.61',
    change: '+1.8%',
    volume: '$4.1M',
    routeId: 'liverpool-vs-arsenal',
  },
  {
    title: 'Inter vs Milan',
    type: 'Closing',
    market: 'Both Teams Score',
    price: '0.72',
    change: '-2.4%',
    volume: '$3.7M',
    routeId: 'inter-vs-milan',
  },
]

export const watchlistMarkets = [
  { title: 'El Clasico', contract: 'DRAW-USDT', price: '0.21', move: '-1.2%' },
  { title: 'El Clasico', contract: 'REALWIN-USDT', price: '0.22', move: '-3.0%' },
  { title: 'UCL Final', contract: 'FIRSTGOAL-HOME', price: '0.48', move: '+0.6%' },
]

export const eventMarkets = [
  { name: 'Barca Win', price: '0.57', volume: '$8.4M', active: true },
  { name: 'Draw', price: '0.21', volume: '$3.2M', active: false },
  { name: 'Real Win', price: '0.22', volume: '$3.8M', active: false },
]

export const chartSeries = [
  { time: '18:00', value: 42, bullish: false },
  { time: '18:20', value: 58, bullish: true },
  { time: '18:40', value: 64, bullish: true },
  { time: '19:00', value: 48, bullish: false },
  { time: '19:20', value: 70, bullish: true },
  { time: '19:40', value: 57, bullish: true },
]

export const orderBookRows = {
  asks: [
    { price: '0.58', size: '12,400', total: '$7,192' },
    { price: '0.59', size: '9,100', total: '$5,369' },
    { price: '0.60', size: '7,600', total: '$4,560' },
  ],
  bids: [
    { price: '0.56', size: '13,100', total: '$7,336' },
    { price: '0.55', size: '10,900', total: '$5,995' },
    { price: '0.54', size: '8,200', total: '$4,428' },
  ],
}

export const eventTimeline = [
  {
    minute: "12'",
    title: 'Barca pressure spike',
    detail: 'Probability moved from 0.46 to 0.51 after three shots in six minutes.',
  },
  {
    minute: "31'",
    title: 'Goal: Barcelona',
    detail: 'Market suspended for 8 seconds, then reopened at 0.69.',
  },
  {
    minute: "49'",
    title: 'Real Madrid equaliser threat',
    detail: 'Order book flipped heavy on the ask side; spread widened to 0.03.',
  },
  {
    minute: "72'",
    title: 'Goal: Barcelona',
    detail: 'Momentum buyers pushed the contract back above 0.57.',
  },
]

export const orderSummary = {
  side: 'Buy Yes',
  orderType: 'Market',
  stake: '$100.00',
  quantity: '175 shares',
  entry: '0.57',
  fee: '$1.20',
  maxLoss: '$100.00',
  payout: '$175.00',
  thesis: 'Barca are dominating territory, and Real are chasing the game with a stretched back line.',
}

export const openPositions = [
  {
    contract: 'BARCAWIN-USDT',
    side: 'Long',
    avgEntry: '0.57',
    mark: '0.63',
    pnl: '+$10.50',
    status: 'In profit',
  },
  {
    contract: 'DRAW-USDT',
    side: 'Short',
    avgEntry: '0.24',
    mark: '0.18',
    pnl: '+$8.40',
    status: 'Hedge active',
  },
  {
    contract: 'OVER2.5-USDT',
    side: 'Long',
    avgEntry: '0.66',
    mark: '0.84',
    pnl: '+$24.20',
    status: 'Momentum',
  },
]

export const openOrders = [
  { contract: 'REALWIN-USDT', side: 'Buy', limit: '0.19', size: '220 shares', expires: 'Good Till Event' },
  { contract: 'NEXTGOAL-BARCA', side: 'Buy', limit: '0.52', size: '60 shares', expires: '10 min' },
]

export const settlementSummary = {
  result: 'Barcelona win 2-1',
  settledAt: 'March 16, 2026 / 22:58 CET',
  contract: 'BARCAWIN-USDT',
  payoutPerShare: '$1.00',
  positionSize: '175 shares',
  totalPayout: '$175.00',
  realizedPnl: '+$73.80',
  fees: '$1.20',
}

export const nextEvents = [
  { title: 'Manchester City vs Bayern', market: 'City to qualify', price: '0.54' },
  { title: 'PSG vs Juventus', market: 'Over 3.5 goals', price: '0.37' },
  { title: 'Atletico vs Sevilla', market: 'Under 2.5 goals', price: '0.58' },
]
