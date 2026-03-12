import { useState } from 'react'
import TradingHeader from '@/components/TradingHeader'
import {
  assetAllocation,
  openOrders,
  openPositions,
  portfolioEquityCurve,
  tradeHistory,
} from '@/data/tradingFlow'
import styles from '@/styles/tradingFlow.module.scss'

const CHART_W = 800
const CHART_H = 320

const EquityChart = ({ data }: { data: { time: string; value: number }[] }) => {
  const values = data.map((d) => d.value)
  const minV = Math.min(...values) * 0.998
  const maxV = Math.max(...values) * 1.002
  const range = maxV - minV || 1

  const plotW = CHART_W - 50
  const plotH = CHART_H - 30
  const step = plotW / (data.length - 1)

  const toY = (v: number) => plotH - ((v - minV) / range) * plotH + 8

  const points = data.map((d, i) => `${i * step + 8},${toY(d.value)}`).join(' ')
  const areaPoints = `${8},${plotH + 8} ${points} ${(data.length - 1) * step + 8},${plotH + 8}`

  const isPositive = data[data.length - 1].value >= data[0].value
  const lineColor = isPositive ? '#22c55e' : '#ef4444'
  const fillColor = isPositive ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'

  const gridLines = 5
  const vStep = range / gridLines

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className={styles.tvChartSvg} preserveAspectRatio="none">
      {Array.from({ length: gridLines + 1 }, (_, i) => {
        const val = minV + vStep * i
        const y = toY(val)
        return (
          <g key={i}>
            <line x1={8} y1={y} x2={plotW + 8} y2={y} stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
            <text x={plotW + 16} y={y + 3} fill="#A6B7D0" fontSize="9" fontFamily="monospace">
              ${val.toFixed(0)}
            </text>
          </g>
        )
      })}

      <polygon points={areaPoints} fill={fillColor} />
      <polyline points={points} fill="none" stroke={lineColor} strokeWidth="2" />

      {data
        .filter((_, i) => i % 3 === 0 || i === data.length - 1)
        .map((d) => {
          const idx = data.indexOf(d)
          const x = idx * step + 8
          return (
            <text key={d.time} x={x} y={CHART_H - 2} fill="#A6B7D0" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {d.time}
            </text>
          )
        })}

      {/* Current value dot */}
      {(() => {
        const last = data[data.length - 1]
        const x = (data.length - 1) * step + 8
        const y = toY(last.value)
        return (
          <>
            <circle cx={x} cy={y} r={4} fill={lineColor} />
            <circle cx={x} cy={y} r={7} fill={lineColor} opacity={0.2} />
          </>
        )
      })()}
    </svg>
  )
}

const AllocationBar = ({ items }: { items: { label: string; value: number; color: string }[] }) => (
  <div className={styles.pfAllocBar}>
    {items.map((item) => (
      <div
        key={item.label}
        className={styles.pfAllocSegment}
        style={{ width: `${item.value}%`, background: item.color }}
        title={`${item.label} ${item.value}%`}
      />
    ))}
  </div>
)

type BottomTab = 'positions' | 'orders' | 'history'

const Portfolio = () => {
  const [bottomTab, setBottomTab] = useState<BottomTab>('positions')

  const totalPnl = openPositions.reduce((sum, p) => sum + parseFloat(p.pnl.replace(/[+$,]/g, '')), 0)
  const totalMargin = openPositions.reduce((sum, p) => sum + parseFloat(p.margin.replace(/[$,]/g, '')), 0)

  return (
    <div className={styles.page}>
      <TradingHeader />

      <div className={styles.tvShell}>
        {/* Account overview ticker */}
        <section className={styles.tvTickerBar}>
          <div className={styles.tvPairInfo}>
            <strong className={styles.tvPairName}>Portfolio</strong>
            <span className={styles.tvPairTitle}>Account Overview</span>
          </div>
          <div className={styles.tvTickerStats}>
            <div className={styles.tvTickerStat}>
              <span>Total Balance</span>
              <strong>$12,480.00</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>Unrealized PnL</span>
              <strong className={styles.deltaUp}>+${totalPnl.toFixed(2)}</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>Margin Used</span>
              <strong>${totalMargin.toFixed(2)}</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>Available</span>
              <strong>${(12480 - totalMargin).toFixed(2)}</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>Open Positions</span>
              <strong>{openPositions.length}</strong>
            </div>
            <div className={styles.tvTickerStat}>
              <span>Win Rate</span>
              <strong className={styles.deltaUp}>68%</strong>
            </div>
          </div>
        </section>

        {/* Main layout */}
        <section className={styles.tvLayout}>
          {/* Left: equity chart */}
          <div className={styles.tvMainCol}>
            <div className={styles.tvChartPanel}>
              <div className={styles.tvTimeframeRow}>
                <span className={styles.tvTimeLabel}>Equity Curve</span>
                {['1W', '1M', '3M', '6M', '1Y', 'All'].map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    className={tf === '1M' ? styles.tvTimeframeBtnActive : styles.tvTimeframeBtn}
                  >
                    {tf}
                  </button>
                ))}
                <div className={styles.tvChartMeta}>
                  <span>Start <strong>$10,000</strong></span>
                  <span>Current <strong className={styles.deltaUp}>$12,480</strong></span>
                  <span>Return <strong className={styles.deltaUp}>+24.8%</strong></span>
                </div>
              </div>
              <div className={styles.tvChartWrap}>
                <EquityChart data={portfolioEquityCurve} />
              </div>
            </div>

            {/* Bottom tabs: positions / orders / history */}
            <div className={styles.tvBottomPanel}>
              <div className={styles.tvBottomTabs}>
                <button
                  type="button"
                  className={bottomTab === 'positions' ? styles.tvBottomTabActive : styles.tvBottomTab}
                  onClick={() => setBottomTab('positions')}
                >
                  Positions ({openPositions.length})
                </button>
                <button
                  type="button"
                  className={bottomTab === 'orders' ? styles.tvBottomTabActive : styles.tvBottomTab}
                  onClick={() => setBottomTab('orders')}
                >
                  Open Orders ({openOrders.length})
                </button>
                <button
                  type="button"
                  className={bottomTab === 'history' ? styles.tvBottomTabActive : styles.tvBottomTab}
                  onClick={() => setBottomTab('history')}
                >
                  Trade History
                </button>
              </div>

              {bottomTab === 'positions' && (
                <div className={styles.pfTableWrap}>
                  <table className={styles.pfTable}>
                    <thead>
                      <tr>
                        <th className={styles.pfTh}>Contract</th>
                        <th className={styles.pfTh}>Side</th>
                        <th className={styles.pfThRight}>Size</th>
                        <th className={styles.pfThRight}>Entry</th>
                        <th className={styles.pfThRight}>Mark</th>
                        <th className={styles.pfThRight}>Liq. Price</th>
                        <th className={styles.pfThRight}>Margin</th>
                        <th className={styles.pfThRight}>PnL</th>
                        <th className={styles.pfThCenter}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {openPositions.map((pos) => {
                        const isPnlPositive = pos.pnl.startsWith('+')
                        return (
                          <tr key={pos.contract} className={styles.pfRow}>
                            <td className={styles.pfTd}>
                              <strong className={styles.pfContract}>{pos.contract}</strong>
                            </td>
                            <td className={styles.pfTd}>
                              <span className={pos.side === 'Long' ? styles.pfSideLong : styles.pfSideShort}>
                                {pos.side}
                              </span>
                            </td>
                            <td className={styles.pfTdRight}>{pos.size}</td>
                            <td className={styles.pfTdRight}>{pos.avgEntry}</td>
                            <td className={styles.pfTdRight}>{pos.mark}</td>
                            <td className={styles.pfTdRight}>{pos.liqPrice}</td>
                            <td className={styles.pfTdRight}>{pos.margin}</td>
                            <td className={styles.pfTdRight}>
                              <div className={styles.pfPnlCell}>
                                <span className={isPnlPositive ? styles.deltaUp : styles.deltaDown}>{pos.pnl}</span>
                                <small className={isPnlPositive ? styles.deltaUp : styles.deltaDown}>{pos.pnlPct}</small>
                              </div>
                            </td>
                            <td className={styles.pfTdCenter}>
                              <button type="button" className={styles.pfCloseBtn}>Close</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {bottomTab === 'orders' && (
                <div className={styles.pfTableWrap}>
                  <table className={styles.pfTable}>
                    <thead>
                      <tr>
                        <th className={styles.pfTh}>Contract</th>
                        <th className={styles.pfTh}>Side</th>
                        <th className={styles.pfTh}>Type</th>
                        <th className={styles.pfThRight}>Price</th>
                        <th className={styles.pfThRight}>Size</th>
                        <th className={styles.pfThRight}>Filled</th>
                        <th className={styles.pfTh}>Expires</th>
                        <th className={styles.pfThCenter}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {openOrders.map((order) => (
                        <tr key={order.contract} className={styles.pfRow}>
                          <td className={styles.pfTd}>
                            <strong className={styles.pfContract}>{order.contract}</strong>
                          </td>
                          <td className={styles.pfTd}>
                            <span className={order.side === 'Buy' ? styles.pfSideLong : styles.pfSideShort}>
                              {order.side}
                            </span>
                          </td>
                          <td className={styles.pfTd}>{order.type}</td>
                          <td className={styles.pfTdRight}>{order.limit}</td>
                          <td className={styles.pfTdRight}>{order.size}</td>
                          <td className={styles.pfTdRight}>{order.filled}</td>
                          <td className={styles.pfTd}>{order.expires}</td>
                          <td className={styles.pfTdCenter}>
                            <button type="button" className={styles.pfCancelBtn}>Cancel</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {bottomTab === 'history' && (
                <div className={styles.pfTableWrap}>
                  <table className={styles.pfTable}>
                    <thead>
                      <tr>
                        <th className={styles.pfTh}>Time</th>
                        <th className={styles.pfTh}>Contract</th>
                        <th className={styles.pfTh}>Side</th>
                        <th className={styles.pfThRight}>Price</th>
                        <th className={styles.pfThRight}>Size</th>
                        <th className={styles.pfThRight}>Fee</th>
                        <th className={styles.pfThRight}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tradeHistory.map((trade) => (
                        <tr key={`${trade.time}-${trade.contract}`} className={styles.pfRow}>
                          <td className={styles.pfTd}>{trade.time}</td>
                          <td className={styles.pfTd}>
                            <strong className={styles.pfContract}>{trade.contract}</strong>
                          </td>
                          <td className={styles.pfTd}>
                            <span className={trade.side === 'Buy' ? styles.pfSideLong : styles.pfSideShort}>
                              {trade.side}
                            </span>
                          </td>
                          <td className={styles.pfTdRight}>{trade.price}</td>
                          <td className={styles.pfTdRight}>{trade.size}</td>
                          <td className={styles.pfTdRight}>{trade.fee}</td>
                          <td className={styles.pfTdRight}>{trade.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar: account summary + allocation */}
          <aside className={styles.tvSideCol}>
            <div className={styles.pfSummaryPanel}>
              <div className={styles.tvObHeader}>
                <strong>Account Summary</strong>
              </div>
              <div className={styles.pfSummaryList}>
                <div className={styles.pfSummaryRow}>
                  <span>Total Balance</span>
                  <strong>$12,480.00</strong>
                </div>
                <div className={styles.pfSummaryRow}>
                  <span>Unrealized PnL</span>
                  <strong className={styles.deltaUp}>+${totalPnl.toFixed(2)}</strong>
                </div>
                <div className={styles.pfSummaryRow}>
                  <span>Today&apos;s PnL</span>
                  <strong className={styles.deltaUp}>+$1,240.00</strong>
                </div>
                <div className={styles.pfSummaryDivider} />
                <div className={styles.pfSummaryRow}>
                  <span>Margin Used</span>
                  <strong>${totalMargin.toFixed(2)}</strong>
                </div>
                <div className={styles.pfSummaryRow}>
                  <span>Available Balance</span>
                  <strong>${(12480 - totalMargin).toFixed(2)}</strong>
                </div>
                <div className={styles.pfSummaryRow}>
                  <span>Margin Ratio</span>
                  <strong>{((totalMargin / 12480) * 100).toFixed(1)}%</strong>
                </div>
                <div className={styles.pfSummaryDivider} />
                <div className={styles.pfSummaryRow}>
                  <span>Total Trades</span>
                  <strong>142</strong>
                </div>
                <div className={styles.pfSummaryRow}>
                  <span>Win Rate</span>
                  <strong className={styles.deltaUp}>68%</strong>
                </div>
                <div className={styles.pfSummaryRow}>
                  <span>Avg. Return</span>
                  <strong className={styles.deltaUp}>+12.4%</strong>
                </div>
              </div>
            </div>

            <div className={styles.pfAllocPanel}>
              <div className={styles.tvObHeader}>
                <strong>Asset Allocation</strong>
              </div>
              <AllocationBar items={assetAllocation} />
              <div className={styles.pfAllocLegend}>
                {assetAllocation.map((item) => (
                  <div key={item.label} className={styles.pfAllocItem}>
                    <span className={styles.pfAllocDot} style={{ background: item.color }} />
                    <span className={styles.pfAllocLabel}>{item.label}</span>
                    <strong className={styles.pfAllocValue}>{item.value}%</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.pfTopPerformers}>
              <div className={styles.tvObHeader}>
                <strong>Top Performers</strong>
              </div>
              <div className={styles.pfPerformerList}>
                {openPositions
                  .sort((a, b) => parseFloat(b.pnlPct) - parseFloat(a.pnlPct))
                  .slice(0, 3)
                  .map((pos) => (
                    <div key={pos.contract} className={styles.pfPerformerRow}>
                      <div>
                        <strong>{pos.contract}</strong>
                        <small>{pos.side} · {pos.size} shares</small>
                      </div>
                      <div className={styles.pfPerformerPnl}>
                        <span className={styles.deltaUp}>{pos.pnl}</span>
                        <small className={styles.deltaUp}>{pos.pnlPct}</small>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default Portfolio
