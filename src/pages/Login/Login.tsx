import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import TradingHeader from '@/components/TradingHeader'
import { ROUTES } from '@/constants/routes'
import { grantPlatformAccess } from '@/utils/platformAccess'
import styles from '@/styles/tradingFlow.module.scss'

const Login = () => {
  const navigate = useNavigate()

  const enterPlatform = () => {
    grantPlatformAccess()
    navigate(ROUTES.MARKETS)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    enterPlatform()
  }

  return (
    <div className={styles.page}>
      <TradingHeader ctaLabel="Open Lobby" ctaTo={ROUTES.MARKETS} />

      <div className={styles.shell}>
        <section className={styles.heroPanel}>
          <div className={styles.copyBlock}>
            <p className={styles.eyebrow}>Step 1</p>
            <h1 className={styles.title}>Sign in before you enter the trading lobby.</h1>
            <p className={styles.lead}>
              This page acts like the gateway after the user clicks <strong>Start Trading</strong>.
              The goal is to authenticate, show trust signals, and move them to the event marketplace.
            </p>
          </div>
        </section>

        <section className={styles.confirmGrid}>
          <article className={styles.panel}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Access</p>
              <h2>Login to continue</h2>
            </div>

            <form className={styles.formGrid} onSubmit={handleSubmit}>
              <label className={styles.inputGroup}>
                <span>Email</span>
                <input className={styles.input} type="email" defaultValue="trader@incept.app" />
              </label>

              <label className={styles.inputGroup}>
                <span>Password</span>
                <input className={styles.input} type="password" defaultValue="************" />
              </label>

              <div className={styles.buttonRow}>
                <button type="submit" className={styles.primaryButton}>
                  Continue To Lobby
                </button>
                <button type="button" className={styles.secondaryButton} onClick={enterPlatform}>
                  Connect Wallet
                </button>
              </div>

              <div className={styles.notice}>
                <span>2FA ready</span>
                <span>KYC checked</span>
                <span>Settlement feed synced</span>
              </div>
            </form>
          </article>

          <aside className={styles.panelAlt}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Workflow</p>
              <h2>What happens right after login</h2>
            </div>

            <div className={styles.stackList}>
              <article className={styles.infoCard}>
                <strong>1. Trading Lobby</strong>
                <p>User sees hot events, wallet balance, watchlist and live opportunities.</p>
              </article>
              <article className={styles.infoCard}>
                <strong>2. Event Page</strong>
                <p>User opens Barca vs Real to inspect chart, orderbook, timeline and market tabs.</p>
              </article>
              <article className={styles.infoCard}>
                <strong>3. Order + Confirm</strong>
                <p>User places a market or limit order, reviews max loss and payout, then confirms.</p>
              </article>
              <article className={styles.infoCard}>
                <strong>4. Portfolio + Settle</strong>
                <p>Position is tracked in real time until the match resolves and pays out.</p>
              </article>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default Login
