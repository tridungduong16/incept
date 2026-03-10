import clsx from 'clsx'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import brandLogo from '../../../logo.png'
import { ROUTES } from '@/constants/routes'
import { hasPlatformAccess, revokePlatformAccess } from '@/utils/platformAccess'
import styles from '@/styles/tradingFlow.module.scss'

type TradingHeaderProps = {
  ctaLabel?: string
  ctaTo?: string
}

const navItems = [
  { label: 'Markets', to: ROUTES.MARKETS },
  { label: 'Trade', to: ROUTES.TRADE },
  { label: 'Portfolio', to: ROUTES.PORTFOLIO },
  { label: 'Settings', to: ROUTES.SETTINGS },
]

const TradingHeader = ({ ctaLabel = 'Start Trading', ctaTo = ROUTES.MARKETS }: TradingHeaderProps) => {
  const navigate = useNavigate()
  const isLoggedIn = hasPlatformAccess()

  const handleLogout = () => {
    revokePlatformAccess()
    navigate(ROUTES.HOME)
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarInner}>
        <Link className={styles.brand} to={ROUTES.HOME} aria-label="Incept home">
          <img src={brandLogo} alt="" className={styles.brandLogo} />
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
          {isLoggedIn ? (
            <button type="button" className={styles.ghostButton} onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link className={styles.primaryButton} to={ctaTo}>
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default TradingHeader
