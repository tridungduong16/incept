import { Link, useParams } from 'react-router-dom'
import TradingHeader from '@/components/TradingHeader'
import { ROUTES } from '@/constants/routes'
import { featuredEvent, nextEvents, settlementSummary } from '@/data/tradingFlow'
import NotFound from '@/pages/NotFound'
import styles from '@/styles/tradingFlow.module.scss'

const Settlement = () => {
  const { eventId } = useParams()

  if (eventId !== featuredEvent.id) {
    return <NotFound />
  }

  return (
    <div className={styles.page}>
      <TradingHeader ctaLabel="Back To Markets" ctaTo={ROUTES.MARKETS} />

      <div className={styles.shell}>
        <section className={styles.recapHero}>
          <div className={styles.heroPanel}>
            <div className={styles.copyBlock}>
              <p className={styles.eyebrow}>Step 6</p>
              <h1 className={styles.title}>Settlement and recap.</h1>
              <p className={styles.lead}>
                Day la page cuoi flow: market resolved, payout credited, user thay realized PnL va
                duoc dieu huong sang event tiep theo.
              </p>
            </div>
          </div>

          <div className={styles.resultCard}>
            <span>Resolved</span>
            <strong>{settlementSummary.result}</strong>
            <p>{settlementSummary.settledAt}</p>
          </div>
        </section>

        <section className={styles.confirmGrid}>
          <article className={styles.panel}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Settlement</p>
              <h2>{settlementSummary.contract}</h2>
            </div>

            <div className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <span>Payout per share</span>
                <strong>{settlementSummary.payoutPerShare}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Position size</span>
                <strong>{settlementSummary.positionSize}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Total payout</span>
                <strong>{settlementSummary.totalPayout}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Fees</span>
                <strong>{settlementSummary.fees}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Realized PnL</span>
                <strong className={styles.deltaUp}>{settlementSummary.realizedPnl}</strong>
              </div>
            </div>
          </article>

          <aside className={styles.panelAlt}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Trade Next</p>
              <h2>Keep the user in the loop</h2>
            </div>

            <div className={styles.stackList}>
              {nextEvents.map((event) => (
                <article key={event.title} className={styles.infoCard}>
                  <strong>{event.title}</strong>
                  <p>{event.market}</p>
                  <small>Starting price {event.price}</small>
                </article>
              ))}
            </div>

            <div className={styles.buttonRow}>
              <Link className={styles.primaryButton} to={ROUTES.MARKETS}>
                Explore More Markets
              </Link>
              <Link className={styles.secondaryButton} to={ROUTES.PORTFOLIO}>
                Back To Portfolio
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default Settlement
