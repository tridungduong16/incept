import clsx from 'clsx'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import brandLogo from '../../../logo.png'
import { ROUTES, buildAIStudioFeatureRoute, buildSocialFeatureRoute } from '@/constants/routes'
import { aiStudioFeatures } from '@/data/aiStudio'
import { socialFeatures } from '@/data/social'
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
  { label: 'AI Studio', to: ROUTES.AI_STUDIO },
  { label: 'Social', to: ROUTES.SOCIAL },
  { label: 'Settings', to: ROUTES.SETTINGS },
]

const dropdownConfigs = {
  [ROUTES.AI_STUDIO]: {
    features: aiStudioFeatures,
    buildRoute: buildAIStudioFeatureRoute,
  },
  [ROUTES.SOCIAL]: {
    features: socialFeatures,
    buildRoute: buildSocialFeatureRoute,
  },
} as const

const TradingHeader = ({ ctaLabel = 'Start Trading', ctaTo = ROUTES.MARKETS }: TradingHeaderProps) => {
  const navigate = useNavigate()
  const location = useLocation()
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
          {navItems.map((item) => {
            const dropdownConfig = dropdownConfigs[item.to as keyof typeof dropdownConfigs]
            const isDropdownActive = location.pathname.startsWith(item.to)

            return dropdownConfig ? (
              <div key={item.to} className={styles.navDropdown}>
                <NavLink
                  to={item.to}
                  className={clsx(styles.navLink, isDropdownActive && styles.navLinkActive)}
                >
                  {item.label}
                </NavLink>

                <div className={styles.navDropdownMenu}>
                  {dropdownConfig.features.map((feature) => (
                    <NavLink
                      key={feature.id}
                      to={dropdownConfig.buildRoute(feature.id)}
                      className={({ isActive }) =>
                        clsx(styles.navDropdownItem, isActive && styles.navDropdownItemActive)
                      }
                    >
                      <span className={styles.navDropdownItemTitle}>{feature.title}</span>
                      <small className={styles.navDropdownItemDesc}>{feature.description}</small>
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}
              >
                {item.label}
              </NavLink>
            )
          })}
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
