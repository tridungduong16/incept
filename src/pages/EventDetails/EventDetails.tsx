import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TradingHeader from '@/components/TradingHeader'
import { ROUTES, buildConfirmRoute, buildTradeRoute } from '@/constants/routes'
import { allMarkets, chartTimeframes, type CandlePoint, type MarketItem } from '@/data/tradingFlow'
import NotFound from '@/pages/NotFound'
import styles from '@/styles/tradingFlow.module.scss'
import {
  ADVANCED_ORDER_TYPES,
  QUICK_SIZE_PRESETS,
  buildTradePreview,
  createDefaultLadder,
  formatCurrency,
  supportsLadder,
  type TradeLadderLevel,
  type TradeOrderType,
} from '@/utils/tradeTicket'

// ─── Constants ────────────────────────────────────────────────────────────────

const CHART_W = 800
const CHART_H = 400
const CANDLE_GAP = 3
const PRICE_LABEL_W = 60
const TIME_LABEL_H = 28
const AVAILABLE_BALANCE = 12480

// ─── Seeded RNG (deterministic per market) ────────────────────────────────────

const seededRng = (seed: string) => {
  let s = seed.split('').reduce((acc, c) => Math.imul(acc, 31) + c.charCodeAt(0), 0x811c9dc5)
  return () => {
    s ^= s << 13
    s ^= s >> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}

// ─── Per-market candle generator ──────────────────────────────────────────────

const generateCandleData = (market: MarketItem): CandlePoint[] => {
  const rng = seededRng(market.routeId)
  const candles: CandlePoint[] = []
  const numCandles = 30

  const endPrice = market.lastPrice
  const startPrice = market.lastPrice / (1 + market.change24h / 100)
  const priceRange = market.high24h - market.low24h || 0.06
  const volatility = priceRange * 0.22

  let cur = Math.max(0.01, Math.min(0.99, startPrice))

  for (let i = 0; i < numCandles; i++) {
    const progress = i / (numCandles - 1)
    const trendNudge = (endPrice - startPrice) * progress
    const noise = (rng() - 0.48) * volatility
    const open = cur
    const rawClose = startPrice + trendNudge + noise
    const close = Math.max(0.01, Math.min(0.99, rawClose))
    const wickH = priceRange * 0.055 * (rng() + 0.4)
    const high = Math.min(0.99, Math.max(open, close) + wickH)
    const low = Math.max(0.01, Math.min(open, close) - wickH)
    const volume = Math.floor(rng() * 1400 + 300)
    const totalMins = 17 * 60 + i * 5
    const h = Math.floor(totalMins / 60)
    const m = totalMins % 60
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    candles.push({ time, open, close, high, low, volume })
    cur = close
  }

  // Snap last candle to real lastPrice
  const last = candles[candles.length - 1]
  last.close = market.lastPrice
  last.high = Math.min(0.99, Math.max(last.high, market.lastPrice))
  last.low = Math.max(0.01, Math.min(last.low, market.lastPrice))

  return candles
}

// ─── Per-market order book generator ─────────────────────────────────────────

type ObRow = { price: string; size: string; total: string }

const generateOrderBook = (market: MarketItem): { asks: ObRow[]; bids: ObRow[] } => {
  const rng = seededRng(market.routeId + ':ob')
  const p = market.lastPrice
  const tick = 0.01

  const mkRow = (price: number): ObRow => {
    const sz = Math.floor(rng() * 14000 + 3000)
    return {
      price: price.toFixed(2),
      size: sz.toLocaleString(),
      total: `$${(price * sz).toFixed(0)}`,
    }
  }

  return {
    asks: [mkRow(p + tick), mkRow(p + tick * 2), mkRow(p + tick * 3)],
    bids: [mkRow(p - tick), mkRow(p - tick * 2), mkRow(p - tick * 3)],
  }
}

// ─── Status badge colours ─────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Live: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  'Pre-market': { bg: 'rgba(56,189,248,0.12)', color: '#38bdf8' },
  Closing: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  New: { bg: 'rgba(168,85,247,0.12)', color: '#a855f7' },
}

// ─── Candlestick SVG ──────────────────────────────────────────────────────────

const CandlestickChart = ({ data }: { data: CandlePoint[] }) => {
  const prices = data.flatMap((c) => [c.high, c.low])
  const minP = Math.min(...prices)
  const maxP = Math.max(...prices)
  const range = maxP - minP || 0.01
  const plotW = CHART_W - PRICE_LABEL_W
  const plotH = CHART_H - TIME_LABEL_H
  const candleW = Math.max(4, (plotW - CANDLE_GAP * data.length) / data.length)
  const toY = (price: number) => plotH - ((price - minP) / range) * plotH + 4
  const gridLines = 5
  const priceStep = range / gridLines
  const closing = data[data.length - 1].close
  const isBullish = closing >= data[0].open
  const priceColor = isBullish ? '#22c55e' : '#ef4444'

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className={styles.tvChartSvg} preserveAspectRatio="none">
      {/* Grid + price labels */}
      {Array.from({ length: gridLines + 1 }, (_, i) => {
        const price = minP + priceStep * i
        const y = toY(price)
        return (
          <g key={i}>
            <line x1={0} y1={y} x2={plotW} y2={y} stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
            <text x={plotW + 8} y={y + 4} fill="#A6B7D0" fontSize="10" fontFamily="monospace">
              {price.toFixed(2)}
            </text>
          </g>
        )
      })}

      {/* Volume bars */}
      {(() => {
        const maxVol = Math.max(...data.map((c) => c.volume))
        const volMaxH = 50
        return data.map((candle, i) => {
          const x = i * (candleW + CANDLE_GAP) + CANDLE_GAP
          const volH = (candle.volume / maxVol) * volMaxH
          const bull = candle.close >= candle.open
          return (
            <rect
              key={`v-${candle.time}`}
              x={x}
              y={plotH - volH}
              width={candleW}
              height={volH}
              fill={bull ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}
              rx="1"
            />
          )
        })
      })()}

      {/* Candles */}
      {data.map((candle, i) => {
        const x = i * (candleW + CANDLE_GAP) + CANDLE_GAP
        const bull = candle.close >= candle.open
        const color = bull ? '#22c55e' : '#ef4444'
        const bodyTop = toY(Math.max(candle.open, candle.close))
        const bodyBot = toY(Math.min(candle.open, candle.close))
        const bodyH = Math.max(1, bodyBot - bodyTop)
        const wickX = x + candleW / 2
        return (
          <g key={candle.time}>
            <line x1={wickX} y1={toY(candle.high)} x2={wickX} y2={toY(candle.low)} stroke={color} strokeWidth="1" />
            <rect x={x} y={bodyTop} width={candleW} height={bodyH} fill={color} rx="1" opacity={0.9} />
          </g>
        )
      })}

      {/* Current price line + label */}
      <line
        x1={0} y1={toY(closing)} x2={plotW} y2={toY(closing)}
        stroke={priceColor} strokeWidth="1" strokeDasharray="6 3" opacity={0.7}
      />
      <rect x={plotW} y={toY(closing) - 10} width={PRICE_LABEL_W} height={20} rx={4} fill={priceColor} />
      <text
        x={plotW + PRICE_LABEL_W / 2} y={toY(closing) + 4}
        fill="#fff" fontSize="10" fontWeight="700" fontFamily="monospace" textAnchor="middle"
      >
        {closing.toFixed(2)}
      </text>

      {/* Time labels */}
      {data
        .filter((_, i) => i % 5 === 0)
        .map((candle, i, arr) => {
          const origIdx = data.indexOf(candle)
          const x = origIdx * (candleW + CANDLE_GAP) + CANDLE_GAP + candleW / 2
          return (
            <text
              key={`t-${i}`} x={x} y={CHART_H - 4}
              fill="#A6B7D0" fontSize="9" fontFamily="monospace"
              textAnchor={i === arr.length - 1 ? 'end' : 'middle'}
            >
              {candle.time}
            </text>
          )
        })}
    </svg>
  )
}

// ─── Token Pair Selector (Binance-style) ─────────────────────────────────────

const TokenPairSelector = ({
  currentMarket,
  variant = 'ticker',
}: {
  currentMarket: MarketItem
  variant?: 'ticker' | 'chart'
}) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({})
  const triggerClassName = variant === 'chart' ? styles.tpTriggerCompact : styles.tpTrigger
  const pairClassName = variant === 'chart' ? styles.tpPairCompact : styles.tvPairName

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return allMarkets
    return allMarkets.filter(
      (m) =>
        m.pair.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q),
    )
  }, [search])

  const handleSelect = useCallback(
    (m: MarketItem) => {
      setOpen(false)
      setSearch('')
      if (m.routeId !== currentMarket.routeId) {
        navigate(buildTradeRoute(m.routeId))
      }
    },
    [currentMarket.routeId, navigate],
  )

  const updateDropdownPosition = useCallback(() => {
    if (!containerRef.current || typeof window === 'undefined') return

    const rect = containerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const viewportPadding = 16
    const gap = 8
    const width = Math.min(420, viewportWidth - viewportPadding * 2)
    const left = Math.min(
      Math.max(rect.left, viewportPadding),
      viewportWidth - width - viewportPadding,
    )
    const spaceBelow = viewportHeight - rect.bottom - viewportPadding
    const spaceAbove = rect.top - viewportPadding
    const openAbove = spaceBelow < 280 && spaceAbove > spaceBelow
    const maxHeight = Math.max(220, Math.min(480, (openAbove ? spaceAbove : spaceBelow) - gap))

    setDropdownStyle(
      openAbove
        ? {
            position: 'fixed',
            left,
            bottom: viewportHeight - rect.top + gap,
            width,
            maxHeight,
            zIndex: 1400,
          }
        : {
            position: 'fixed',
            left,
            top: rect.bottom + gap,
            width,
            maxHeight,
            zIndex: 1400,
          },
    )
  }, [])

  useEffect(() => {
    if (!open) return
    updateDropdownPosition()
    inputRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setSearch('')
      }
    }
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node
      const clickedTrigger = containerRef.current?.contains(target)
      const clickedDropdown = dropdownRef.current?.contains(target)

      if (!clickedTrigger && !clickedDropdown) {
        setOpen(false)
        setSearch('')
      }
    }
    const onViewportChange = () => {
      updateDropdownPosition()
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    window.addEventListener('resize', onViewportChange)
    window.addEventListener('scroll', onViewportChange, true)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
      window.removeEventListener('resize', onViewportChange)
      window.removeEventListener('scroll', onViewportChange, true)
    }
  }, [open, updateDropdownPosition])

  const dropdownContent = (
    <div ref={dropdownRef} className={`${styles.tpDropdown} ${styles.tpDropdownFloating}`} style={dropdownStyle}>
      <div className={styles.tpSearchWrap}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A6B7D0" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          className={styles.tpSearchInput}
          type="text"
          placeholder="Search token or market..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.tpListHeader}>
        <span>Pair</span>
        <span>Price</span>
        <span>24h Change</span>
      </div>

      <div className={styles.tpList}>
        {filtered.length === 0 && (
          <div className={styles.tpEmpty}>No markets found</div>
        )}
        {filtered.map((m) => {
          const isActive = m.routeId === currentMarket.routeId
          const pos = m.change24h >= 0
          return (
            <button
              key={m.routeId}
              type="button"
              className={isActive ? styles.tpRowActive : styles.tpRow}
              onClick={() => handleSelect(m)}
            >
              <div className={styles.tpRowPair}>
                <span className={styles.tpRowPairName}>{m.pair}</span>
                <span className={styles.tpRowPairTitle}>{m.title}</span>
              </div>
              <span className={styles.tpRowPrice}>{m.lastPrice.toFixed(2)}</span>
              <span className={pos ? styles.deltaUp : styles.deltaDown}>
                {pos ? '+' : ''}{m.change24h.toFixed(1)}%
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className={styles.tpSelector} ref={containerRef}>
      <button
        type="button"
        className={triggerClassName}
        onClick={() => setOpen((prev) => !prev)}
      >
        <strong className={pairClassName}>{currentMarket.pair}</strong>
        <svg
          className={open ? styles.tpChevronOpen : styles.tpChevron}
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {open && typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const EventDetails = () => {
  const { eventId } = useParams()

  const [activeTimeframe, setActiveTimeframe] = useState('5m')
  const [activeOutcomeIdx, setActiveOutcomeIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<'trades' | 'timeline' | 'info'>('trades')
  const [orderType, setOrderType] = useState<TradeOrderType>('Limit')
  const [executionMode, setExecutionMode] = useState<'single' | 'ladder'>('single')
  const [amountInput, setAmountInput] = useState('100.00')

  const market = allMarkets.find((m) => m.routeId === eventId)
  const initialPrice = market?.lastPrice ?? 0.5
  const [priceInput, setPriceInput] = useState(initialPrice.toFixed(2))
  const [stopPriceInput, setStopPriceInput] = useState(Math.max(0.01, initialPrice - 0.05).toFixed(2))
  const [takePriceInput, setTakePriceInput] = useState(Math.min(0.99, initialPrice + 0.08).toFixed(2))
  const [trailingOffsetInput, setTrailingOffsetInput] = useState('0.03')
  const [ladderLevels, setLadderLevels] = useState<TradeLadderLevel[]>(() => createDefaultLadder(initialPrice))

  const candleData = useMemo(() => (market ? generateCandleData(market) : []), [eventId])
  const orderBook = useMemo(() => (market ? generateOrderBook(market) : { asks: [], bids: [] }), [eventId])

  if (!market) return <NotFound />

  const isPositive = market.change24h >= 0
  const changeStr = isPositive
    ? `+${market.change24h.toFixed(1)}%`
    : `${market.change24h.toFixed(1)}%`

  const noPrice = parseFloat((1 - market.lastPrice).toFixed(2))
  const outcomes = [
    { name: 'YES', price: market.lastPrice.toFixed(2) },
    { name: 'NO', price: noPrice.toFixed(2) },
  ]
  const activeOutcome = outcomes[activeOutcomeIdx]
  const oppositeOutcome = outcomes[activeOutcomeIdx === 0 ? 1 : 0]
  const ladderEnabled = supportsLadder(orderType) && executionMode === 'ladder'

  useEffect(() => {
    const basePrice = parseFloat(activeOutcome.price)
    setPriceInput(basePrice.toFixed(2))
    setStopPriceInput(Math.max(0.01, basePrice - 0.05).toFixed(2))
    setTakePriceInput(Math.min(0.99, basePrice + 0.08).toFixed(2))
    setTrailingOffsetInput('0.03')
    setLadderLevels(createDefaultLadder(basePrice))
  }, [activeOutcome.name, activeOutcome.price])

  useEffect(() => {
    if (!supportsLadder(orderType)) {
      setExecutionMode('single')
    }
  }, [orderType])

  const firstCandle = candleData[0]
  const lastCandle = candleData[candleData.length - 1]
  const statusStyle = STATUS_STYLE[market.status] ?? STATUS_STYLE['Live']

  const recentTrades = candleData.slice(-6).reverse()
  const tradePreview = useMemo(
    () =>
      buildTradePreview({
        amountInput,
        priceInput,
        orderType,
        ladderEnabled,
        ladder: ladderLevels,
      }),
    [amountInput, priceInput, orderType, ladderEnabled, ladderLevels],
  )

  const updateLadderLevel = useCallback(
    (id: string, field: 'price' | 'allocationPct', value: string) => {
      setLadderLevels((prev) => prev.map((level) => (level.id === id ? { ...level, [field]: value } : level)))
    },
    [],
  )

  const applyQuickSize = useCallback((preset: number) => {
    const nextAmount = (AVAILABLE_BALANCE * preset) / 100
    setAmountInput(nextAmount.toFixed(2))
  }, [])

  const confirmHref = useMemo(() => {
    const params = new URLSearchParams({
      outcome: activeOutcome.name,
      type: orderType,
      execution: executionMode,
      amount: amountInput,
      price: priceInput,
      stop: stopPriceInput,
      take: takePriceInput,
      trail: trailingOffsetInput,
      ladder: JSON.stringify(ladderLevels),
    })

    return `${buildConfirmRoute(market.routeId)}?${params.toString()}`
  }, [
    activeOutcome.name,
    amountInput,
    executionMode,
    ladderLevels,
    market.routeId,
    orderType,
    priceInput,
    stopPriceInput,
    takePriceInput,
    trailingOffsetInput,
  ])

  return (
    <div className={styles.page}>
      <TradingHeader ctaLabel="Review Order" ctaTo={confirmHref} />

      <div className={styles.tvShell}>
        {/* ── Ticker bar ── */}
        <section className={styles.tvTickerBar}>
          <div className={styles.tvPairInfo}>
            <TokenPairSelector currentMarket={market} />
            <span className={styles.tvPairTitle}>{market.title}</span>
          </div>

          <div className={styles.tvTickerStats}>
            <div className={styles.tvTickerStat}>
              <span>Price</span>
              <strong className={isPositive ? styles.deltaUp : styles.deltaDown}>
                {market.lastPrice.toFixed(2)}
              </strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>24h Change</span>
              <strong className={isPositive ? styles.deltaUp : styles.deltaDown}>{changeStr}</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>24h High</span>
              <strong>{market.high24h.toFixed(2)}</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>24h Low</span>
              <strong>{market.low24h.toFixed(2)}</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>Volume</span>
              <strong>{market.volume24h}</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>Open Interest</span>
              <strong>{market.openInterest}</strong>
            </div>
          </div>
        </section>

        {/* ── Main layout ── */}
        <section className={styles.tvLayout}>
          {/* Left: chart area */}
          <div className={styles.tvMainCol}>
            {/* Outcome + meta row */}
            <div className={styles.tvMarketRow}>
              {outcomes.map((o, i) => (
                <button
                  key={o.name}
                  type="button"
                  className={i === activeOutcomeIdx ? styles.tvMarketBtnActive : styles.tvMarketBtn}
                  onClick={() => setActiveOutcomeIdx(i)}
                >
                  <span className={styles.tvMarketBtnName}>{o.name}</span>
                  <span className={styles.tvMarketBtnPrice}>{o.price}</span>
                </button>
              ))}

              <div className={styles.tvMarketMeta}>
                <span
                  className={styles.tvStatusBadge}
                  style={{ background: statusStyle.bg, color: statusStyle.color }}
                >
                  {market.status}
                </span>
                <span className={styles.tvCategoryBadge}>{market.category}</span>
              </div>
            </div>

            {/* Chart panel */}
            <div className={styles.tvChartPanel}>
              <div className={styles.tvTimeframeRow}>
                <span className={styles.tvTimeLabel}>Market</span>
                <TokenPairSelector currentMarket={market} variant="chart" />
                <span className={styles.tvTimeLabel}>Interval</span>
                {chartTimeframes.map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    className={activeTimeframe === tf ? styles.tvTimeframeBtnActive : styles.tvTimeframeBtn}
                    onClick={() => setActiveTimeframe(tf)}
                  >
                    {tf}
                  </button>
                ))}
                <div className={styles.tvChartMeta}>
                  <span>O <strong>{firstCandle?.open.toFixed(2)}</strong></span>
                  <span>H <strong>{market.high24h.toFixed(2)}</strong></span>
                  <span>L <strong>{market.low24h.toFixed(2)}</strong></span>
                  <span>
                    C{' '}
                    <strong className={isPositive ? styles.deltaUp : styles.deltaDown}>
                      {lastCandle?.close.toFixed(2)}
                    </strong>
                  </span>
                </div>
              </div>

              <div className={styles.tvChartWrap}>
                <CandlestickChart data={candleData} />
              </div>
            </div>

            {/* Bottom panel */}
            <div className={styles.tvBottomPanel}>
              <div className={styles.tvBottomTabs}>
                {(['trades', 'timeline', 'info'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={activeTab === tab ? styles.tvBottomTabActive : styles.tvBottomTab}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === 'trades' && (
                <div className={styles.tvTimelineList}>
                  {recentTrades.map((c, i) => {
                    const bull = c.close >= c.open
                    return (
                      <div key={i} className={styles.tvTimelineRow}>
                        <span className={styles.tvTimelineBadge}>{c.time}</span>
                        <div className={styles.tvTimelineContent}>
                          <strong className={bull ? styles.deltaUp : styles.deltaDown}>
                            {bull ? 'BUY' : 'SELL'} @ {c.close.toFixed(2)}
                          </strong>
                          <p>Size: {c.volume.toLocaleString()} · {market.pair}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className={styles.tvTimelineList}>
                  <div className={styles.tvTimelineRow}>
                    <span className={styles.tvTimelineBadge}>Now</span>
                    <div className={styles.tvTimelineContent}>
                      <strong>{market.title}</strong>
                      <p>
                        Market is <em>{market.status}</em> at {market.lastPrice.toFixed(2)} · {market.category}
                      </p>
                    </div>
                  </div>
                  <div className={styles.tvTimelineRow}>
                    <span className={styles.tvTimelineBadge}>24h</span>
                    <div className={styles.tvTimelineContent}>
                      <strong>Price range</strong>
                      <p>
                        High: {market.high24h.toFixed(2)} · Low: {market.low24h.toFixed(2)} · Change: {changeStr}
                      </p>
                    </div>
                  </div>
                  <div className={styles.tvTimelineRow}>
                    <span className={styles.tvTimelineBadge}>Stats</span>
                    <div className={styles.tvTimelineContent}>
                      <strong>Volume {market.volume24h}</strong>
                      <p>Open Interest: {market.openInterest}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'info' && (
                <div className={styles.tvTimelineList}>
                  <div className={styles.tvTimelineRow}>
                    <span className={styles.tvTimelineBadge}>Pair</span>
                    <div className={styles.tvTimelineContent}>
                      <strong>{market.pair}</strong>
                      <p>{market.title}</p>
                    </div>
                  </div>
                  <div className={styles.tvTimelineRow}>
                    <span className={styles.tvTimelineBadge}>Cat</span>
                    <div className={styles.tvTimelineContent}>
                      <strong>{market.category}</strong>
                      <p>Status: {market.status} · Volume: {market.volume24h} · OI: {market.openInterest}</p>
                    </div>
                  </div>
                  <div className={styles.tvTimelineRow}>
                    <span className={styles.tvTimelineBadge}>OHLC</span>
                    <div className={styles.tvTimelineContent}>
                      <strong>
                        O {firstCandle?.open.toFixed(2)} · H {market.high24h.toFixed(2)} · L {market.low24h.toFixed(2)} · C {market.lastPrice.toFixed(2)}
                      </strong>
                      <p>Probability contract · settles at 0 or 1</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <aside className={styles.tvSideCol}>
            {/* Order book */}
            <div className={styles.tvObPanel}>
              <div className={styles.tvObHeader}>
                <strong>Order Book</strong>
              </div>
              <div className={styles.tvObColHead}>
                <span>Price</span>
                <span>Size</span>
                <span>Total</span>
              </div>
              {orderBook.asks
                .slice()
                .reverse()
                .map((row) => (
                  <div key={`a-${row.price}`} className={styles.tvObRowAsk}>
                    <span>{row.price}</span>
                    <span>{row.size}</span>
                    <span>{row.total}</span>
                  </div>
                ))}
              <div className={styles.tvObMid}>
                <strong className={isPositive ? styles.deltaUp : styles.deltaDown}>
                  {market.lastPrice.toFixed(2)}
                </strong>
                <span>mid price</span>
              </div>
              {orderBook.bids.map((row) => (
                <div key={`b-${row.price}`} className={styles.tvObRowBid}>
                  <span>{row.price}</span>
                  <span>{row.size}</span>
                  <span>{row.total}</span>
                </div>
              ))}
            </div>

            {/* Trade ticket */}
            <div className={styles.tvTradePanel}>
              <div className={styles.tvTradeTabs}>
                <button type="button" className={styles.tvBuyTabActive}>Buy / Yes</button>
                <button type="button" className={styles.tvSellTab}>Sell / No</button>
              </div>

              <div className={styles.tvTradeForm}>
                <label className={styles.tvTradeField}>
                  <span>Order Type</span>
                  <select
                    className={styles.tvTradeSelect}
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as TradeOrderType)}
                  >
                    {ADVANCED_ORDER_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                {supportsLadder(orderType) && (
                  <div className={styles.tvTradeField}>
                    <span>Execution</span>
                    <div className={styles.tvTradeSlider}>
                      <button
                        type="button"
                        className={executionMode === 'single' ? styles.tvSliderMarkActive : styles.tvSliderMark}
                        onClick={() => setExecutionMode('single')}
                      >
                        Single
                      </button>
                      <button
                        type="button"
                        className={executionMode === 'ladder' ? styles.tvSliderMarkActive : styles.tvSliderMark}
                        onClick={() => setExecutionMode('ladder')}
                      >
                        Ladder
                      </button>
                    </div>
                  </div>
                )}

                {!ladderEnabled && (
                  <label className={styles.tvTradeField}>
                    <span>{orderType === 'Market' ? 'Reference Price' : 'Entry Price'}</span>
                    <input
                      className={styles.tvTradeInput}
                      type="text"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                    />
                  </label>
                )}

                {ladderEnabled && (
                  <div className={styles.tvTradeField}>
                    <span>Position Ladder</span>
                    <div className={styles.tvLadderList}>
                      {ladderLevels.map((level) => (
                        <div key={level.id} className={styles.tvLadderRow}>
                          <span className={styles.tvLadderLabel}>{level.label}</span>
                          <input
                            className={styles.tvTradeInput}
                            type="text"
                            value={level.price}
                            onChange={(e) => updateLadderLevel(level.id, 'price', e.target.value)}
                          />
                          <input
                            className={styles.tvTradeInput}
                            type="text"
                            value={level.allocationPct}
                            onChange={(e) => updateLadderLevel(level.id, 'allocationPct', e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    <small className={styles.tvTradeHint}>Prices ladder into the position as liquidity comes in.</small>
                  </div>
                )}

                {(orderType === 'Stop Loss' || orderType === 'OCO') && (
                  <label className={styles.tvTradeField}>
                    <span>Stop Trigger</span>
                    <input
                      className={styles.tvTradeInput}
                      type="text"
                      value={stopPriceInput}
                      onChange={(e) => setStopPriceInput(e.target.value)}
                    />
                  </label>
                )}

                {(orderType === 'Take Profit' || orderType === 'OCO') && (
                  <label className={styles.tvTradeField}>
                    <span>Take Profit Trigger</span>
                    <input
                      className={styles.tvTradeInput}
                      type="text"
                      value={takePriceInput}
                      onChange={(e) => setTakePriceInput(e.target.value)}
                    />
                  </label>
                )}

                {orderType === 'Trailing Stop' && (
                  <label className={styles.tvTradeField}>
                    <span>Trailing Offset</span>
                    <input
                      className={styles.tvTradeInput}
                      type="text"
                      value={trailingOffsetInput}
                      onChange={(e) => setTrailingOffsetInput(e.target.value)}
                    />
                  </label>
                )}

                <label className={styles.tvTradeField}>
                  <span>Amount (USDT)</span>
                  <input
                    className={styles.tvTradeInput}
                    type="text"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                  />
                </label>

                <div className={styles.tvTradeSlider}>
                  {QUICK_SIZE_PRESETS.map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      className={styles.tvSliderMark}
                      onClick={() => applyQuickSize(pct)}
                    >
                      {pct === 100 ? 'Max' : `${pct}%`}
                    </button>
                  ))}
                </div>
                <small className={styles.tvTradeHint}>Available balance: {formatCurrency(AVAILABLE_BALANCE)}</small>

                <div className={styles.tvTradeSummary}>
                  <div className={styles.tvTradeRow}>
                    <span>Est. Shares</span>
                    <strong>{tradePreview.estimatedShares.toLocaleString()}</strong>
                  </div>
                  <div className={styles.tvTradeRow}>
                    <span>Avg. Entry</span>
                    <strong>{tradePreview.averageEntry.toFixed(2)}</strong>
                  </div>
                  <div className={styles.tvTradeRow}>
                    <span>Fee</span>
                    <strong>{formatCurrency(tradePreview.fee)}</strong>
                  </div>
                  <div className={styles.tvTradeRow}>
                    <span>Net If {activeOutcome.name}</span>
                    <strong className={styles.deltaUp}>{formatCurrency(tradePreview.netIfWin)}</strong>
                  </div>
                  <div className={styles.tvTradeRow}>
                    <span>P&L If {oppositeOutcome.name}</span>
                    <strong className={styles.deltaDown}>{formatCurrency(tradePreview.netIfLose)}</strong>
                  </div>
                  <div className={styles.tvTradeRow}>
                    <span>Breakeven</span>
                    <strong>{tradePreview.breakevenPrice.toFixed(2)}</strong>
                  </div>
                </div>

                <Link className={styles.tvBuyButton} to={confirmHref}>
                  Review {orderType}
                </Link>
                <Link className={styles.tvSecondaryLink} to={ROUTES.PORTFOLIO}>
                  View Open Positions
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default EventDetails
