import clsx from 'clsx'
import { Link, NavLink } from 'react-router-dom'
import brandLogo from '../../../logo.png'
import { ROUTES, buildSettlementRoute } from '@/constants/routes'
import { featuredEvent } from '@/data/tradingFlow'
import styles from '@/styles/tradingFlow.module.scss'

type TradingHeaderProps = {
  ctaLabel?: string
  ctaTo?: string
}

const navItems = [
  { label: 'Overview', to: ROUTES.HOME },
  { label: 'Markets', to: ROUTES.MARKETS },
  { label: 'Portfolio', to: ROUTES.PORTFOLIO },
  { label: 'Settlement', to: buildSettlementRoute(featuredEvent.id) },
]

const TradingHeader = ({ ctaLabel = 'Start Trading', ctaTo = ROUTES.LOGIN }: TradingHeaderProps) => {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarInner}>
        <Link className={styles.brand} to={ROUTES.HOME} aria-label="Incept home">
          <img src={brandLogo} alt="" className={styles.brandLogo} />
          <div>
            <strong>INCEPT</strong>
            <span>sports prediction exchange</span>
          </div>
        </Link>

        <nav className={styles.topbarNav} aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.topbarActions}>
          <Link className={styles.ghostButton} to={ROUTES.LOGIN}>
            Log In
          </Link>
          <Link className={styles.primaryButton} to={ctaTo}>
            {ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default TradingHeader
