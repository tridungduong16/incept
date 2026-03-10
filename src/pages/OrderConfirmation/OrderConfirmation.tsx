import { Link, useParams } from 'react-router-dom'
import TradingHeader from '@/components/TradingHeader'
import { ROUTES, buildEventRoute } from '@/constants/routes'
import { featuredEvent, orderSummary } from '@/data/tradingFlow'
import NotFound from '@/pages/NotFound'
import styles from '@/styles/tradingFlow.module.scss'

const OrderConfirmation = () => {
  const { eventId } = useParams()

  if (eventId !== featuredEvent.id) {
    return <NotFound />
  }

  return (
    <div className={styles.page}>
      <TradingHeader ctaLabel="Open Portfolio" ctaTo={ROUTES.PORTFOLIO} />

      <div className={styles.shell}>
        <section className={styles.heroPanel}>
          <div className={styles.copyBlock}>
            <p className={styles.eyebrow}>Step 4</p>
            <h1 className={styles.title}>Order confirmation page.</h1>
            <p className={styles.lead}>
              User reviews the trade before execution: entry, fee, payout and thesis. This is the
              explicit checkpoint between event detail and portfolio.
            </p>
          </div>
        </section>

        <section className={styles.confirmGrid}>
          <article className={styles.panel}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Confirm</p>
              <h2>
                {featuredEvent.shortTitle} / {orderSummary.side}
              </h2>
            </div>

            <div className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <span>Order Type</span>
                <strong>{orderSummary.orderType}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Stake</span>
                <strong>{orderSummary.stake}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Entry Price</span>
                <strong>{orderSummary.entry}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Quantity</span>
                <strong>{orderSummary.quantity}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Fee</span>
                <strong>{orderSummary.fee}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Potential Payout</span>
                <strong>{orderSummary.payout}</strong>
              </div>
            </div>

            <div className={styles.noticeStrong}>
              <strong>Trade thesis</strong>
              <p>{orderSummary.thesis}</p>
            </div>

            <div className={styles.buttonRow}>
              <Link className={styles.primaryButton} to={ROUTES.PORTFOLIO}>
                Confirm And Open Position
              </Link>
              <Link className={styles.secondaryButton} to={buildEventRoute(featuredEvent.id)}>
                Back To Event
              </Link>
            </div>
          </article>

          <aside className={styles.panelAlt}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Risk Preview</p>
              <h2>Before the user submits</h2>
            </div>

            <div className={styles.stackList}>
              <article className={styles.infoCard}>
                <strong>Max loss</strong>
                <p>{orderSummary.maxLoss} if Barcelona do not win after settlement.</p>
              </article>
              <article className={styles.infoCard}>
                <strong>Fee awareness</strong>
                <p>{orderSummary.fee} charged up front so the user sees true realized PnL later.</p>
              </article>
              <article className={styles.infoCard}>
                <strong>Next screen</strong>
                <p>After confirmation the position appears in portfolio with live mark price updates.</p>
              </article>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default OrderConfirmation
