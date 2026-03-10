import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import TradingHeader from '@/components/TradingHeader'
import { ROUTES, buildConfirmRoute } from '@/constants/routes'
import {
  candlestickData,
  chartTimeframes,
  eventMarkets,
  eventTimeline,
  featuredEvent,
  orderBookRows,
  type CandlePoint,
} from '@/data/tradingFlow'
import NotFound from '@/pages/NotFound'
import styles from '@/styles/tradingFlow.module.scss'

const CHART_W = 800
const CHART_H = 400
const CANDLE_GAP = 3
const PRICE_LABEL_W = 60
const TIME_LABEL_H = 28

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

  const closingPrice = data[data.length - 1].close
  const openingPrice = data[0].open
  const isOverallBullish = closingPrice >= openingPrice

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      className={styles.tvChartSvg}
      preserveAspectRatio="none"
    >
      {Array.from({ length: gridLines + 1 }, (_, i) => {
        const price = minP + priceStep * i
        const y = toY(price)
        return (
          <g key={i}>
            <line
              x1={0}
              y1={y}
              x2={plotW}
              y2={y}
              stroke="rgba(255,255,255,0.04)"
              strokeDasharray="4 4"
            />
            <text x={plotW + 8} y={y + 4} fill="#6b7c9e" fontSize="10" fontFamily="monospace">
              {price.toFixed(2)}
            </text>
          </g>
        )
      })}

      {data.map((candle, i) => {
        const x = i * (candleW + CANDLE_GAP) + CANDLE_GAP
        const isBull = candle.close >= candle.open
        const color = isBull ? '#22c55e' : '#ef4444'
        const bodyTop = toY(Math.max(candle.open, candle.close))
        const bodyBot = toY(Math.min(candle.open, candle.close))
        const bodyH = Math.max(1, bodyBot - bodyTop)
        const wickX = x + candleW / 2

        return (
          <g key={candle.time}>
            <line
              x1={wickX}
              y1={toY(candle.high)}
              x2={wickX}
              y2={toY(candle.low)}
              stroke={color}
              strokeWidth="1"
            />
            <rect
              x={x}
              y={bodyTop}
              width={candleW}
              height={bodyH}
              fill={isBull ? color : color}
              rx="1"
              opacity={0.9}
            />
          </g>
        )
      })}

      {/* Current price line */}
      <line
        x1={0}
        y1={toY(closingPrice)}
        x2={plotW}
        y2={toY(closingPrice)}
        stroke={isOverallBullish ? '#22c55e' : '#ef4444'}
        strokeWidth="1"
        strokeDasharray="6 3"
        opacity={0.7}
      />
      <rect
        x={plotW}
        y={toY(closingPrice) - 10}
        width={PRICE_LABEL_W}
        height={20}
        rx={4}
        fill={isOverallBullish ? '#22c55e' : '#ef4444'}
      />
      <text
        x={plotW + PRICE_LABEL_W / 2}
        y={toY(closingPrice) + 4}
        fill="#fff"
        fontSize="10"
        fontWeight="700"
        fontFamily="monospace"
        textAnchor="middle"
      >
        {closingPrice.toFixed(2)}
      </text>

      {/* Time labels */}
      {data
        .filter((_, i) => i % 5 === 0)
        .map((candle, i, arr) => {
          const origIdx = data.indexOf(candle)
          const x = origIdx * (candleW + CANDLE_GAP) + CANDLE_GAP + candleW / 2
          return (
            <text
              key={`t-${i}`}
              x={x}
              y={CHART_H - 4}
              fill="#6b7c9e"
              fontSize="9"
              fontFamily="monospace"
              textAnchor={i === arr.length - 1 ? 'end' : 'middle'}
            >
              {candle.time}
            </text>
          )
        })}

      {/* Volume bars at the bottom */}
      {(() => {
        const maxVol = Math.max(...data.map((c) => c.volume))
        const volMaxH = 50
        return data.map((candle, i) => {
          const x = i * (candleW + CANDLE_GAP) + CANDLE_GAP
          const volH = (candle.volume / maxVol) * volMaxH
          const isBull = candle.close >= candle.open
          return (
            <rect
              key={`v-${candle.time}`}
              x={x}
              y={plotH - volH}
              width={candleW}
              height={volH}
              fill={isBull ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}
              rx="1"
            />
          )
        })
      })()}
    </svg>
  )
}

const EventDetails = () => {
  const { eventId } = useParams()
  const [activeTimeframe, setActiveTimeframe] = useState('5m')
  const [activeMarketIdx, setActiveMarketIdx] = useState(0)

  if (eventId !== featuredEvent.id) {
    return <NotFound />
  }

  const activeMarket = eventMarkets[activeMarketIdx]

  return (
    <div className={styles.page}>
      <TradingHeader ctaLabel="Review Order" ctaTo={buildConfirmRoute(featuredEvent.id)} />

      <div className={styles.tvShell}>
        {/* Compact top bar with pair info */}
        <section className={styles.tvTickerBar}>
          <div className={styles.tvPairInfo}>
            <strong className={styles.tvPairName}>
              {activeMarket.name.toUpperCase().replace(/\s/g, '')}-USDT
            </strong>
            <span className={styles.tvPairTitle}>{featuredEvent.title}</span>
          </div>
          <div className={styles.tvTickerStats}>
            <div className={styles.tvTickerStat}>
              <span>Price</span>
              <strong className={styles.deltaUp}>{activeMarket.price}</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>24h Change</span>
              <strong className={styles.deltaUp}>{featuredEvent.change}</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>24h High</span>
              <strong>0.70</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>24h Low</span>
              <strong>0.42</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>Volume</span>
              <strong>{featuredEvent.volume}</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>Open Interest</span>
              <strong>{featuredEvent.openInterest}</strong>
            </div>
          </div>
        </section>

        {/* Main trading layout: chart + sidebar */}
        <section className={styles.tvLayout}>
          {/* Left: chart area */}
          <div className={styles.tvMainCol}>
            {/* Market selector tabs */}
            <div className={styles.tvMarketRow}>
              {eventMarkets.map((m, i) => (
                <button
                  key={m.name}
                  type="button"
                  className={i === activeMarketIdx ? styles.tvMarketBtnActive : styles.tvMarketBtn}
                  onClick={() => setActiveMarketIdx(i)}
                >
                  <span className={styles.tvMarketBtnName}>{m.name}</span>
                  <span className={styles.tvMarketBtnPrice}>{m.price}</span>
                </button>
              ))}
            </div>

            {/* Chart panel */}
            <div className={styles.tvChartPanel}>
              {/* Timeframe selector */}
              <div className={styles.tvTimeframeRow}>
                <span className={styles.tvTimeLabel}>Interval</span>
                {chartTimeframes.map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    className={
                      activeTimeframe === tf ? styles.tvTimeframeBtnActive : styles.tvTimeframeBtn
                    }
                    onClick={() => setActiveTimeframe(tf)}
                  >
                    {tf}
                  </button>
                ))}
                <div className={styles.tvChartMeta}>
                  <span>O <strong>0.57</strong></span>
                  <span>H <strong>0.70</strong></span>
                  <span>L <strong>0.42</strong></span>
                  <span>C <strong className={styles.deltaUp}>0.57</strong></span>
                </div>
              </div>

              {/* Candlestick chart */}
              <div className={styles.tvChartWrap}>
                <CandlestickChart data={candlestickData} />
              </div>
            </div>

            {/* Timeline below chart */}
            <div className={styles.tvBottomPanel}>
              <div className={styles.tvBottomTabs}>
                <button type="button" className={styles.tvBottomTabActive}>Trades</button>
                <button type="button" className={styles.tvBottomTab}>Timeline</button>
                <button type="button" className={styles.tvBottomTab}>Info</button>
              </div>
              <div className={styles.tvTimelineList}>
                {eventTimeline.map((item) => (
                  <div key={item.minute} className={styles.tvTimelineRow}>
                    <span className={styles.tvTimelineBadge}>{item.minute}</span>
                    <div className={styles.tvTimelineContent}>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar: orderbook + trade */}
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
              {orderBookRows.asks
                .slice()
                .reverse()
                .map((row) => (
                  <div key={`${row.price}-a`} className={styles.tvObRowAsk}>
                    <span>{row.price}</span>
                    <span>{row.size}</span>
                    <span>{row.total}</span>
                  </div>
                ))}
              <div className={styles.tvObMid}>
                <strong className={styles.deltaUp}>{activeMarket.price}</strong>
                <span>≈ ${(parseFloat(activeMarket.price) * 1).toFixed(2)}</span>
              </div>
              {orderBookRows.bids.map((row) => (
                <div key={`${row.price}-b`} className={styles.tvObRowBid}>
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
                  <select className={styles.tvTradeSelect}>
                    <option>Market</option>
                    <option>Limit</option>
                  </select>
                </label>
                <label className={styles.tvTradeField}>
                  <span>Price</span>
                  <input className={styles.tvTradeInput} type="text" defaultValue={activeMarket.price} />
                </label>
                <label className={styles.tvTradeField}>
                  <span>Amount (USDT)</span>
                  <input className={styles.tvTradeInput} type="text" defaultValue="100.00" />
                </label>

                <div className={styles.tvTradeSlider}>
                  {[0, 25, 50, 75, 100].map((pct) => (
                    <button key={pct} type="button" className={styles.tvSliderMark}>
                      {pct}%
                    </button>
                  ))}
                </div>

                <div className={styles.tvTradeSummary}>
                  <div className={styles.tvTradeRow}>
                    <span>Est. Shares</span>
                    <strong>175</strong>
                  </div>
                  <div className={styles.tvTradeRow}>
                    <span>Max Loss</span>
                    <strong>$100.00</strong>
                  </div>
                  <div className={styles.tvTradeRow}>
                    <span>Payout</span>
                    <strong className={styles.deltaUp}>$175.00</strong>
                  </div>
                </div>

                <Link className={styles.tvBuyButton} to={buildConfirmRoute(featuredEvent.id)}>
                  Buy {activeMarket.name}
                </Link>
                <Link className={styles.tvSecondaryLink} to={ROUTES.PORTFOLIO}>
                  Open Positions
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
