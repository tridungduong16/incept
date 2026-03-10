import { useState } from 'react'
import TradingHeader from '@/components/TradingHeader'
import styles from '@/styles/tradingFlow.module.scss'

type SettingsTab = 'profile' | 'security' | 'trading' | 'notifications' | 'display' | 'api'

const settingsTabs: { key: SettingsTab; label: string; icon: string }[] = [
  { key: 'profile', label: 'Profile', icon: '👤' },
  { key: 'security', label: 'Security', icon: '🔒' },
  { key: 'trading', label: 'Trading', icon: '📊' },
  { key: 'notifications', label: 'Notifications', icon: '🔔' },
  { key: 'display', label: 'Display', icon: '🎨' },
  { key: 'api', label: 'API Keys', icon: '🔑' },
]

const Toggle = ({ defaultOn = false }: { defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      type="button"
      className={on ? styles.stToggleOn : styles.stToggleOff}
      onClick={() => setOn(!on)}
      aria-pressed={on}
    >
      <span className={styles.stToggleKnob} />
    </button>
  )
}

const ProfileSection = () => (
  <div className={styles.stSection}>
    <div className={styles.stSectionHeader}>
      <h3>Profile Information</h3>
      <p>Manage your account details and public profile.</p>
    </div>
    <div className={styles.stFormGrid}>
      <label className={styles.stField}>
        <span>Display Name</span>
        <input className={styles.stInput} type="text" defaultValue="CryptoTrader_42" />
      </label>
      <label className={styles.stField}>
        <span>Email Address</span>
        <input className={styles.stInput} type="email" defaultValue="trader@incept.io" />
      </label>
      <label className={styles.stField}>
        <span>Username</span>
        <input className={styles.stInput} type="text" defaultValue="@cryptotrader42" />
      </label>
      <label className={styles.stField}>
        <span>Country / Region</span>
        <select className={styles.stSelect}>
          <option>United States</option>
          <option>United Kingdom</option>
          <option>Vietnam</option>
          <option>Singapore</option>
          <option>Germany</option>
          <option>Japan</option>
        </select>
      </label>
      <label className={styles.stFieldFull}>
        <span>Bio</span>
        <textarea className={styles.stTextarea} rows={3} defaultValue="Prediction market enthusiast. Sports & politics." />
      </label>
    </div>
    <div className={styles.stActions}>
      <button type="button" className={styles.stSaveBtn}>Save Changes</button>
    </div>
  </div>
)

const SecuritySection = () => (
  <div className={styles.stSection}>
    <div className={styles.stSectionHeader}>
      <h3>Security Settings</h3>
      <p>Protect your account with additional security layers.</p>
    </div>

    <div className={styles.stCardList}>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Two-Factor Authentication (2FA)</strong>
          <p>Add an extra layer of security using Google Authenticator or SMS.</p>
        </div>
        <Toggle defaultOn />
      </div>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Email Verification for Withdrawals</strong>
          <p>Require email confirmation before processing any withdrawal.</p>
        </div>
        <Toggle defaultOn />
      </div>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Anti-Phishing Code</strong>
          <p>Set a code that will appear in all official Incept emails.</p>
        </div>
        <input className={styles.stInputSmall} type="text" placeholder="Enter code..." />
      </div>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Login History</strong>
          <p>View recent login activity and manage active sessions.</p>
        </div>
        <button type="button" className={styles.stOutlineBtn}>View History</button>
      </div>
    </div>

    <div className={styles.stSectionHeader} style={{ marginTop: 24 }}>
      <h3>Change Password</h3>
    </div>
    <div className={styles.stFormGrid}>
      <label className={styles.stField}>
        <span>Current Password</span>
        <input className={styles.stInput} type="password" placeholder="••••••••" />
      </label>
      <label className={styles.stField}>
        <span>New Password</span>
        <input className={styles.stInput} type="password" placeholder="••••••••" />
      </label>
      <label className={styles.stField}>
        <span>Confirm New Password</span>
        <input className={styles.stInput} type="password" placeholder="••••••••" />
      </label>
    </div>
    <div className={styles.stActions}>
      <button type="button" className={styles.stSaveBtn}>Update Password</button>
    </div>
  </div>
)

const TradingSection = () => (
  <div className={styles.stSection}>
    <div className={styles.stSectionHeader}>
      <h3>Trading Preferences</h3>
      <p>Customize your default trading behavior.</p>
    </div>

    <div className={styles.stFormGrid}>
      <label className={styles.stField}>
        <span>Default Order Type</span>
        <select className={styles.stSelect}>
          <option>Market Order</option>
          <option>Limit Order</option>
          <option>Stop Order</option>
        </select>
      </label>
      <label className={styles.stField}>
        <span>Default Stake Amount</span>
        <input className={styles.stInput} type="text" defaultValue="$100.00" />
      </label>
      <label className={styles.stField}>
        <span>Slippage Tolerance</span>
        <select className={styles.stSelect}>
          <option>0.5%</option>
          <option>1.0%</option>
          <option>2.0%</option>
          <option>5.0%</option>
          <option>Custom</option>
        </select>
      </label>
      <label className={styles.stField}>
        <span>Default Leverage</span>
        <select className={styles.stSelect}>
          <option>1x (No leverage)</option>
          <option>2x</option>
          <option>5x</option>
          <option>10x</option>
        </select>
      </label>
    </div>

    <div className={styles.stCardList}>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Order Confirmation</strong>
          <p>Show confirmation dialog before placing orders.</p>
        </div>
        <Toggle defaultOn />
      </div>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>One-Click Trading</strong>
          <p>Execute trades instantly without confirmation step.</p>
        </div>
        <Toggle />
      </div>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Auto-Close at Settlement</strong>
          <p>Automatically close positions when markets settle.</p>
        </div>
        <Toggle defaultOn />
      </div>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Risk Warning Alerts</strong>
          <p>Show warnings when position size exceeds risk limits.</p>
        </div>
        <Toggle defaultOn />
      </div>
    </div>

    <div className={styles.stActions}>
      <button type="button" className={styles.stSaveBtn}>Save Preferences</button>
    </div>
  </div>
)

const NotificationsSection = () => (
  <div className={styles.stSection}>
    <div className={styles.stSectionHeader}>
      <h3>Notification Preferences</h3>
      <p>Control how and when you receive alerts.</p>
    </div>

    <div className={styles.stCardList}>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Trade Execution Alerts</strong>
          <p>Get notified when your orders are filled.</p>
        </div>
        <Toggle defaultOn />
      </div>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Price Movement Alerts</strong>
          <p>Notify when watched markets move more than 5%.</p>
        </div>
        <Toggle defaultOn />
      </div>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Settlement Notifications</strong>
          <p>Get notified when markets you traded settle.</p>
        </div>
        <Toggle defaultOn />
      </div>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>New Market Listings</strong>
          <p>Be the first to know about newly listed markets.</p>
        </div>
        <Toggle />
      </div>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Email Notifications</strong>
          <p>Receive email summaries and alerts.</p>
        </div>
        <Toggle defaultOn />
      </div>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Push Notifications</strong>
          <p>Enable browser push notifications.</p>
        </div>
        <Toggle />
      </div>
    </div>

    <div className={styles.stActions}>
      <button type="button" className={styles.stSaveBtn}>Save Notifications</button>
    </div>
  </div>
)

const DisplaySection = () => (
  <div className={styles.stSection}>
    <div className={styles.stSectionHeader}>
      <h3>Display & Appearance</h3>
      <p>Customize the look and feel of the platform.</p>
    </div>

    <div className={styles.stFormGrid}>
      <label className={styles.stField}>
        <span>Theme</span>
        <select className={styles.stSelect}>
          <option>Dark (Default)</option>
          <option>Light</option>
          <option>System</option>
        </select>
      </label>
      <label className={styles.stField}>
        <span>Language</span>
        <select className={styles.stSelect}>
          <option>English</option>
          <option>Tiếng Việt</option>
          <option>中文</option>
          <option>日本語</option>
          <option>한국어</option>
          <option>Español</option>
        </select>
      </label>
      <label className={styles.stField}>
        <span>Timezone</span>
        <select className={styles.stSelect}>
          <option>UTC+7 (Ho Chi Minh)</option>
          <option>UTC+0 (London)</option>
          <option>UTC-5 (New York)</option>
          <option>UTC-8 (Los Angeles)</option>
          <option>UTC+8 (Singapore)</option>
          <option>UTC+9 (Tokyo)</option>
        </select>
      </label>
      <label className={styles.stField}>
        <span>Currency Display</span>
        <select className={styles.stSelect}>
          <option>USD ($)</option>
          <option>EUR (€)</option>
          <option>GBP (£)</option>
          <option>VND (₫)</option>
          <option>BTC (₿)</option>
        </select>
      </label>
    </div>

    <div className={styles.stCardList}>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Chart Candlestick Colors</strong>
          <p>Use green/red (default) or custom color scheme.</p>
        </div>
        <select className={styles.stSelectSmall}>
          <option>Green / Red</option>
          <option>Blue / Orange</option>
          <option>Teal / Pink</option>
        </select>
      </div>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Compact Mode</strong>
          <p>Reduce spacing and font sizes for more data on screen.</p>
        </div>
        <Toggle />
      </div>
      <div className={styles.stCard}>
        <div className={styles.stCardLeft}>
          <strong>Animations</strong>
          <p>Enable smooth transitions and price update animations.</p>
        </div>
        <Toggle defaultOn />
      </div>
    </div>

    <div className={styles.stActions}>
      <button type="button" className={styles.stSaveBtn}>Save Display Settings</button>
    </div>
  </div>
)

const ApiSection = () => (
  <div className={styles.stSection}>
    <div className={styles.stSectionHeader}>
      <h3>API Key Management</h3>
      <p>Create and manage API keys for programmatic access.</p>
    </div>

    <div className={styles.stApiTable}>
      <div className={styles.stApiHead}>
        <span>Label</span>
        <span>Key</span>
        <span>Permissions</span>
        <span>Created</span>
        <span>Action</span>
      </div>
      <div className={styles.stApiRow}>
        <span>Trading Bot</span>
        <span className={styles.stApiKey}>sk-****...7f2a</span>
        <span>Read, Trade</span>
        <span>Mar 1, 2026</span>
        <button type="button" className={styles.stDeleteBtn}>Revoke</button>
      </div>
      <div className={styles.stApiRow}>
        <span>Portfolio Tracker</span>
        <span className={styles.stApiKey}>sk-****...3b9e</span>
        <span>Read Only</span>
        <span>Feb 14, 2026</span>
        <button type="button" className={styles.stDeleteBtn}>Revoke</button>
      </div>
    </div>

    <div className={styles.stActions}>
      <button type="button" className={styles.stSaveBtn}>Create New API Key</button>
    </div>

    <div className={styles.stNotice}>
      <strong>Security Notice</strong>
      <p>Never share your API secret key. Incept staff will never ask for your API credentials.</p>
    </div>
  </div>
)

const sectionMap: Record<SettingsTab, () => JSX.Element> = {
  profile: ProfileSection,
  security: SecuritySection,
  trading: TradingSection,
  notifications: NotificationsSection,
  display: DisplaySection,
  api: ApiSection,
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const ActiveSection = sectionMap[activeTab]

  return (
    <div className={styles.page}>
      <TradingHeader />

      <div className={styles.tvShell}>
        <section className={styles.stLayout}>
          {/* Sidebar nav */}
          <nav className={styles.stSidebar}>
            <div className={styles.stSidebarHeader}>
              <strong>Settings</strong>
            </div>
            {settingsTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={activeTab === tab.key ? styles.stNavActive : styles.stNav}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className={styles.stNavIcon}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Content area */}
          <main className={styles.stContent}>
            <ActiveSection />
          </main>
        </section>
      </div>
    </div>
  )
}

export default Settings
