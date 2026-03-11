export const ADVANCED_ORDER_TYPES = [
  'Market',
  'Limit',
  'Stop Loss',
  'Take Profit',
  'OCO',
  'Trailing Stop',
] as const

export const QUICK_SIZE_PRESETS = [10, 25, 50, 100] as const

export type TradeOrderType = (typeof ADVANCED_ORDER_TYPES)[number]

export type TradeOutcome = 'YES' | 'NO'

export type TradeLadderLevel = {
  id: string
  label: string
  price: string
  allocationPct: string
}

export type TradePreview = {
  amount: number
  fee: number
  averageEntry: number
  estimatedShares: number
  potentialPayout: number
  netIfWin: number
  netIfLose: number
  breakevenPrice: number
}

export type TradeReplayItem = {
  time: string
  title: string
  detail: string
}

const FEE_RATE = 0.012

const roundCurrency = (value: number) => Math.round(value * 100) / 100

export const parseTradeNumber = (value: string, fallback = 0) => {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const formatCurrency = (value: number) => {
  const sign = value < 0 ? '-' : ''
  return `${sign}$${Math.abs(value).toFixed(2)}`
}

export const isTradeOrderType = (value: string | null): value is TradeOrderType =>
  Boolean(value && ADVANCED_ORDER_TYPES.includes(value as TradeOrderType))

export const supportsLadder = (orderType: TradeOrderType) => orderType !== 'Market'

export const createDefaultLadder = (basePrice: number): TradeLadderLevel[] => {
  const boundedBase = Math.max(0.01, Math.min(0.99, basePrice))

  return [
    {
      id: '1',
      label: 'L1',
      price: Math.max(0.01, boundedBase - 0.02).toFixed(2),
      allocationPct: '40',
    },
    {
      id: '2',
      label: 'L2',
      price: boundedBase.toFixed(2),
      allocationPct: '35',
    },
    {
      id: '3',
      label: 'L3',
      price: Math.min(0.99, boundedBase + 0.02).toFixed(2),
      allocationPct: '25',
    },
  ]
}

export const parseLadderParam = (raw: string | null, basePrice: number): TradeLadderLevel[] => {
  if (!raw) return createDefaultLadder(basePrice)

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return createDefaultLadder(basePrice)
    }

    const normalized = parsed
      .map((item, index) => ({
        id: String(item?.id ?? index + 1),
        label: String(item?.label ?? `L${index + 1}`),
        price: parseTradeNumber(String(item?.price ?? ''), basePrice).toFixed(2),
        allocationPct: parseTradeNumber(String(item?.allocationPct ?? ''), 0).toFixed(0),
      }))
      .slice(0, 3)

    return normalized.length > 0 ? normalized : createDefaultLadder(basePrice)
  } catch {
    return createDefaultLadder(basePrice)
  }
}

const getWeightedEntryPrice = (
  basePrice: number,
  orderType: TradeOrderType,
  ladderEnabled: boolean,
  ladder: TradeLadderLevel[],
) => {
  if (!supportsLadder(orderType) || !ladderEnabled) {
    return basePrice
  }

  const levels = ladder
    .map((level) => ({
      price: Math.max(0.01, Math.min(0.99, parseTradeNumber(level.price, basePrice))),
      allocation: Math.max(0, parseTradeNumber(level.allocationPct, 0)),
    }))
    .filter((level) => level.allocation > 0)

  const totalAllocation = levels.reduce((sum, level) => sum + level.allocation, 0)
  if (levels.length === 0 || totalAllocation === 0) {
    return basePrice
  }

  const weighted = levels.reduce((sum, level) => sum + level.price * level.allocation, 0) / totalAllocation
  return Math.max(0.01, Math.min(0.99, weighted))
}

export const buildTradePreview = ({
  amountInput,
  priceInput,
  orderType,
  ladderEnabled,
  ladder,
}: {
  amountInput: string
  priceInput: string
  orderType: TradeOrderType
  ladderEnabled: boolean
  ladder: TradeLadderLevel[]
}): TradePreview => {
  const amount = Math.max(0, parseTradeNumber(amountInput, 0))
  const basePrice = Math.max(0.01, Math.min(0.99, parseTradeNumber(priceInput, 0.5)))
  const averageEntry = getWeightedEntryPrice(basePrice, orderType, ladderEnabled, ladder)
  const fee = roundCurrency(amount * FEE_RATE)
  const estimatedShares = averageEntry > 0 ? amount / averageEntry : 0
  const potentialPayout = estimatedShares
  const netIfWin = roundCurrency(potentialPayout - amount - fee)
  const netIfLose = roundCurrency(-amount - fee)
  const breakevenPrice = estimatedShares > 0 ? (amount + fee) / estimatedShares : averageEntry

  return {
    amount: roundCurrency(amount),
    fee,
    averageEntry: roundCurrency(averageEntry),
    estimatedShares: Math.floor(estimatedShares),
    potentialPayout: roundCurrency(potentialPayout),
    netIfWin,
    netIfLose,
    breakevenPrice: roundCurrency(breakevenPrice),
  }
}

export const buildExecutionReplay = ({
  pair,
  marketTitle,
  orderType,
  ladderEnabled,
  ladder,
  preview,
}: {
  pair: string
  marketTitle: string
  orderType: TradeOrderType
  ladderEnabled: boolean
  ladder: TradeLadderLevel[]
  preview: TradePreview
}): TradeReplayItem[] => {
  const replay: TradeReplayItem[] = [
    {
      time: '19:28:04',
      title: 'Order submitted',
      detail: `${orderType} order entered for ${pair} on ${marketTitle} with ${formatCurrency(preview.amount)} notional.`,
    },
  ]

  if (ladderEnabled && supportsLadder(orderType)) {
    ladder.forEach((level, index) => {
      const allocation = Math.max(0, parseTradeNumber(level.allocationPct, 0))
      if (allocation <= 0) return

      replay.push({
        time: `19:28:0${index + 5}`,
        title: `${level.label} matched`,
        detail: `${allocation.toFixed(0)}% allocation filled at ${parseTradeNumber(level.price, preview.averageEntry).toFixed(2)} after resting on the book.`,
      })
    })
  } else if (orderType === 'Market') {
    replay.push({
      time: '19:28:05',
      title: 'Best ask swept',
      detail: `Order crossed the spread immediately and completed near ${preview.averageEntry.toFixed(2)} using visible liquidity.`,
    })
  } else {
    replay.push({
      time: '19:28:05',
      title: 'Order rested',
      detail: `Order waited at ${preview.averageEntry.toFixed(2)} until the book moved into the requested price.`,
    })
  }

  replay.push({
    time: '19:28:09',
    title: 'Execution complete',
    detail: `Final average entry ${preview.averageEntry.toFixed(2)} for ${preview.estimatedShares.toLocaleString()} estimated shares.`,
  })

  return replay
}
