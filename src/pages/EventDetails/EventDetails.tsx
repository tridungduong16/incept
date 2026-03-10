import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import TradingHeader from '@/components/TradingHeader'
import { ROUTES, buildConfirmRoute } from '@/constants/routes'
import {
  chartSeries,
  eventMarkets,
  eventTimeline,
  featuredEvent,
  openPositions,
  orderBookRows,
} from '@/data/tradingFlow'
import NotFound from '@/pages/NotFound'
import styles from '@/styles/tradingFlow.module.scss'

const EventDetails = () => {
  const { eventId } = useParams()

  if (eventId !== featuredEvent.id) {
    return <NotFound />
  }

  return (
    <div className={styles.page}>
      <TradingHeader ctaLabel="Review Order" ctaTo={buildConfirmRoute(featuredEvent.id)} />

      <div className={styles.shell}>
        <section className={styles.heroPanel}>
          <div className={styles.copyBlock}>
            <p className={styles.eyebrow}>Step 3</p>
            <h1 className={styles.title}>{featuredEvent.shortTitle} market detail.</h1>
            <p className={styles.lead}>
              User dang o event page: chon market, xem gia xac suat, doc timeline live va quyet dinh
              vao lenh.
            </p>
          </div>

          <div className={styles.heroStats}>
            <article className={styles.highlightCard}>
              <span>{featuredEvent.status}</span>
              <strong>{featuredEvent.liveClock}</strong>
              <p>Score {featuredEvent.score}</p>
            </article>
            <article className={styles.highlightCard}>
              <span>Barca win price</span>
              <strong>{featuredEvent.probability}</strong>
              <p>{featuredEvent.impliedProbability} implied probability</p>
            </article>
            <article className={styles.highlightCard}>
              <span>Spread</span>
              <strong>{featuredEvent.spread}</strong>
              <p>{featuredEvent.volume} matched volume</p>
            </article>
          </div>
        </section>

        <section className={styles.eventGrid}>
          <div className={styles.mainColumn}>
            <article className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIntro}>
                  <p className={styles.eyebrow}>Event</p>
                  <h2>{featuredEvent.title}</h2>
                </div>
                <div className={styles.inlineMeta}>
                  <span>{featuredEvent.kickoff}</span>
                  <span>{featuredEvent.venue}</span>
                </div>
              </div>

              <div className={styles.marketTabs}>
                {eventMarkets.map((market) => (
                  <button
                    key={market.name}
                    type="button"
                    className={market.active ? styles.marketTabActive : styles.marketTab}
                  >
                    <strong>{market.name}</strong>
                    <span>{market.price}</span>
                    <small>{market.volume}</small>
                  </button>
                ))}
              </div>
            </article>

            <article className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIntro}>
                  <p className={styles.eyebrow}>Chart</p>
                  <h2>Probability movement</h2>
                </div>
                <div className={styles.inlineMeta}>
                  <span>High 0.70</span>
                  <span>Low 0.42</span>
                  <span className={styles.deltaUp}>{featuredEvent.change}</span>
                </div>
              </div>

              <div className={styles.chartCanvas}>
                {chartSeries.map((point) => (
                  <div key={point.time} className={styles.chartColumn}>
                    <div
                      className={point.bullish ? styles.chartBarBull : styles.chartBarBear}
                      style={{ '--chart-height': `${point.value}%` } as CSSProperties}
                    />
                    <span>{point.time}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIntro}>
                  <p className={styles.eyebrow}>Timeline</p>
                  <h2>In-play events</h2>
                </div>
              </div>

              <div className={styles.stackList}>
                {eventTimeline.map((item) => (
                  <article key={item.minute} className={styles.timelineItem}>
                    <span>{item.minute}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </div>

          <aside className={styles.sideColumn}>
            <article className={styles.panelAlt}>
              <div className={styles.sectionIntro}>
                <p className={styles.eyebrow}>Orderbook</p>
                <h2>Live bids and asks</h2>
              </div>

              <div className={styles.orderBook}>
                <div className={styles.orderBookHead}>
                  <span>Price</span>
                  <span>Size</span>
                  <span>Total</span>
                </div>

                {orderBookRows.asks.map((row) => (
                  <div key={`${row.price}-ask`} className={`${styles.orderBookRow} ${styles.orderBookSell}`}>
                    <span>{row.price}</span>
                    <span>{row.size}</span>
                    <span>{row.total}</span>
                  </div>
                ))}

                <div className={styles.orderBookMid}>Mid 0.57</div>

                {orderBookRows.bids.map((row) => (
                  <div key={`${row.price}-bid`} className={`${styles.orderBookRow} ${styles.orderBookBuy}`}>
                    <span>{row.price}</span>
                    <span>{row.size}</span>
                    <span>{row.total}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className={styles.panelAlt}>
              <div className={styles.sectionIntro}>
                <p className={styles.eyebrow}>Trade Ticket</p>
                <h2>Barca Win</h2>
              </div>

              <div className={styles.formGrid}>
                <label className={styles.inputGroup}>
                  <span>Order Type</span>
                  <input className={styles.input} type="text" defaultValue="Market Order" />
                </label>
                <label className={styles.inputGroup}>
                  <span>Stake</span>
                  <input className={styles.input} type="text" defaultValue="$100.00" />
                </label>
              </div>

              <div className={styles.summaryList}>
                <div className={styles.summaryRow}>
                  <span>Estimated shares</span>
                  <strong>175</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Max loss</span>
                  <strong>$100.00</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Potential payout</span>
                  <strong>$175.00</strong>
                </div>
              </div>

              <div className={styles.buttonColumn}>
                <Link className={styles.primaryButton} to={buildConfirmRoute(featuredEvent.id)}>
                  Continue To Confirm
                </Link>
                <Link className={styles.secondaryButton} to={ROUTES.PORTFOLIO}>
                  View Open Positions
                </Link>
              </div>
            </article>

            <article className={styles.panelAlt}>
              <div className={styles.sectionIntro}>
                <p className={styles.eyebrow}>Position Snapshot</p>
                <h2>Existing exposure</h2>
              </div>

              <div className={styles.stackList}>
                {openPositions.slice(0, 2).map((position) => (
                  <article key={position.contract} className={styles.positionCard}>
                    <div>
                      <strong>{position.contract}</strong>
                      <p>
                        {position.side} @ {position.avgEntry}
                      </p>
                    </div>
                    <span className={styles.deltaUp}>{position.pnl}</span>
                  </article>
                ))}
              </div>
            </article>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default EventDetails
