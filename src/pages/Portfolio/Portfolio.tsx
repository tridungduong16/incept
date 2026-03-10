import { Link } from 'react-router-dom'
import TradingHeader from '@/components/TradingHeader'
import { buildSettlementRoute } from '@/constants/routes'
import { featuredEvent, openOrders, openPositions } from '@/data/tradingFlow'
import styles from '@/styles/tradingFlow.module.scss'

const portfolioStats = [
  { label: 'Net PnL', value: '+$132.90', detail: 'Across all live sports contracts' },
  { label: 'Exposure', value: '$1,940', detail: 'Capital at risk right now' },
  { label: 'Best Position', value: 'OVER2.5', detail: '+$24.20 unrealized' },
]

const Portfolio = () => {
  return (
    <div className={styles.page}>
      <TradingHeader ctaLabel="View Settlement" ctaTo={buildSettlementRoute(featuredEvent.id)} />

      <div className={styles.shell}>
        <section className={styles.heroPanel}>
          <div className={styles.copyBlock}>
            <p className={styles.eyebrow}>Step 5</p>
            <h1 className={styles.title}>Portfolio and order management.</h1>
            <p className={styles.lead}>
              Sau khi confirm, user quay ve portfolio de theo doi PnL realtime, dong vi the som,
              hoac cho settlement.
            </p>
          </div>
        </section>

        <section className={styles.statsGrid}>
          {portfolioStats.map((stat) => (
            <article key={stat.label} className={styles.statCard}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </article>
          ))}
        </section>

        <section className={styles.dashboardGrid}>
          <article className={styles.panel}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Open Positions</p>
              <h2>Live exposure</h2>
            </div>

            <div className={styles.table}>
              <div className={styles.tableHead}>
                <span>Contract</span>
                <span>Side</span>
                <span>Avg Entry</span>
                <span>Mark</span>
                <span>PnL</span>
              </div>
              {openPositions.map((position) => (
                <div key={position.contract} className={styles.tableRow}>
                  <span>{position.contract}</span>
                  <span>{position.side}</span>
                  <span>{position.avgEntry}</span>
                  <span>{position.mark}</span>
                  <span className={styles.deltaUp}>{position.pnl}</span>
                </div>
              ))}
            </div>
          </article>

          <aside className={styles.sideColumn}>
            <article className={styles.panelAlt}>
              <div className={styles.sectionIntro}>
                <p className={styles.eyebrow}>Open Orders</p>
                <h2>Waiting to fill</h2>
              </div>

              <div className={styles.stackList}>
                {openOrders.map((order) => (
                  <article key={order.contract} className={styles.infoCard}>
                    <strong>{order.contract}</strong>
                    <p>
                      {order.side} {order.size} @ {order.limit}
                    </p>
                    <small>{order.expires}</small>
                  </article>
                ))}
              </div>
            </article>

            <article className={styles.panelAlt}>
              <div className={styles.sectionIntro}>
                <p className={styles.eyebrow}>Resolution</p>
                <h2>What the user does next</h2>
              </div>
              <p className={styles.bodyCopy}>
                When the match ends, the portfolio pushes the user to the settlement summary page to
                show realized PnL and credited balance.
              </p>
              <Link className={styles.primaryButton} to={buildSettlementRoute(featuredEvent.id)}>
                Open Settlement Recap
              </Link>
            </article>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default Portfolio
