import { Link } from 'react-router-dom'
import TradingHeader from '@/components/TradingHeader'
import { ROUTES, buildEventRoute } from '@/constants/routes'
import { featuredMarkets, lobbyStats, marketCategories, watchlistMarkets } from '@/data/tradingFlow'
import styles from '@/styles/tradingFlow.module.scss'

const MarketsLobby = () => {
  return (
    <div className={styles.page}>
      <TradingHeader ctaLabel="View Portfolio" ctaTo={ROUTES.PORTFOLIO} />

      <div className={styles.shell}>
        <section className={styles.heroPanel}>
          <div className={styles.copyBlock}>
            <p className={styles.eyebrow}>Step 2</p>
            <h1 className={styles.title}>Trading lobby after login.</h1>
            <p className={styles.lead}>
              Day la noi user scan market nhu Binance homepage: balance, watchlist, live markets,
              volume va CTA de nhay vao tung event.
            </p>
          </div>
        </section>

        <section className={styles.statsGrid}>
          {lobbyStats.map((stat) => (
            <article key={stat.label} className={styles.statCard}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </article>
          ))}
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Filters</p>
              <h2>Browse by category</h2>
            </div>
            <div className={styles.chipRow}>
              {marketCategories.map((category, index) => (
                <button
                  key={category}
                  type="button"
                  className={index === 0 ? styles.chipActive : styles.chip}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.dashboardGrid}>
          <article className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIntro}>
                <p className={styles.eyebrow}>Hot Events</p>
                <h2>Live markets ready to trade</h2>
              </div>
            </div>

            <div className={styles.marketGrid}>
              {featuredMarkets.map((market) => (
                <article key={market.market} className={styles.marketCard}>
                  <div className={styles.marketCardTop}>
                    <span className={styles.badge}>{market.type}</span>
                    <span className={market.change.startsWith('+') ? styles.deltaUp : styles.deltaDown}>
                      {market.change}
                    </span>
                  </div>

                  <div className={styles.marketCardBody}>
                    <strong>{market.title}</strong>
                    <p>{market.market}</p>
                  </div>

                  <div className={styles.marketCardMeta}>
                    <span>Price {market.price}</span>
                    <span>Volume {market.volume}</span>
                  </div>

                  <Link className={styles.secondaryButton} to={buildEventRoute(market.routeId)}>
                    Open Event
                  </Link>
                </article>
              ))}
            </div>
          </article>

          <aside className={styles.sideColumn}>
            <article className={styles.panelAlt}>
              <div className={styles.sectionIntro}>
                <p className={styles.eyebrow}>Watchlist</p>
                <h2>Contracts you monitor</h2>
              </div>

              <div className={styles.stackList}>
                {watchlistMarkets.map((market) => (
                  <article key={market.contract} className={styles.watchlistRow}>
                    <div>
                      <strong>{market.contract}</strong>
                      <p>{market.title}</p>
                    </div>
                    <div className={styles.watchlistQuote}>
                      <span>{market.price}</span>
                      <small className={market.move.startsWith('+') ? styles.deltaUp : styles.deltaDown}>
                        {market.move}
                      </small>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className={styles.panelAlt}>
              <div className={styles.sectionIntro}>
                <p className={styles.eyebrow}>Next Step</p>
                <h2>Suggested path</h2>
              </div>
              <p className={styles.bodyCopy}>
                User clicks the live El Clasico card, lands on the market detail page, reviews chart,
                orderbook and timeline, then places the first trade.
              </p>
              <Link className={styles.primaryButton} to={buildEventRoute('barca-vs-real')}>
                Open Barca vs Real
              </Link>
            </article>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default MarketsLobby
