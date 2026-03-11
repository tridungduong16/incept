import { useEffect, useRef, useState } from 'react'
import styles from './AIAssistant.module.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'user' | 'ai'

type Message = {
  id: string
  role: Role
  text: string
  time: string
}

// ─── AI response rules ────────────────────────────────────────────────────────

const AI_RULES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['top', 'trending', 'best', 'popular', 'hot'],
    response:
      'The top markets by volume right now are **BTC above $100K EOY 2026** ($22.3M), **Fed rate cut before July 2026** ($14.6M), and **Celtics win NBA Championship** ($9.2M). All three are Live with strong momentum.',
  },
  {
    keywords: ['yes', 'no', 'how', 'work', 'explain', 'binary'],
    response:
      'Prediction markets use YES/NO binary contracts. Each contract settles at **$1 if the event happens** or **$0 if it doesn\'t**. Buy YES if you think the probability is higher than the current price, or NO if you think it\'s overpriced. Your max loss is always your stake.',
  },
  {
    keywords: ['volume', 'highest', 'most', 'liquid'],
    response:
      'Highest 24h volume: **BTC above $100K** ($22.3M) → **Fed rate cut** ($14.6M) → **Celtics NBA Championship** ($9.2M). High-volume markets have tighter spreads and better fills.',
  },
  {
    keywords: ['portfolio', 'position', 'balance', 'pnl', 'profit', 'loss'],
    response:
      'Your portfolio shows an available balance of **$12,480** (up +$1,240 today). You have **6 open positions** and an **11 pending orders**. Win rate is **68%** over the last 30 settled markets. Best performer: **OVER2.5-USDT** at +40.7%.',
  },
  {
    keywords: ['btc', 'bitcoin', 'crypto', 'eth', 'sol', 'doge'],
    response:
      'Crypto markets are some of the most active on the platform. **BTC above $100K** is at 0.62 (+6.8%). **SOL ATH in Q2** is at 0.51 (+3.1%). **ETH flips BTC market cap** is at 0.09 — a long-shot with high upside. All three are Live.',
  },
  {
    keywords: ['politics', 'trump', 'election', 'government', 'policy'],
    response:
      'Top political markets: **Trump wins 2026 Midterms** (0.42, $12.1M), **US Gov Shutdown 2026** (0.31, $6.7M), and **UK PM Approval > 40%** (0.55, $2.4M). The **France EU Referendum** is a new market (+12.5% today) worth watching.',
  },
  {
    keywords: ['fed', 'rate', 'macro', 'economy', 'recession', 'inflation'],
    response:
      'Economy highlights: **Fed rate cut before July 2026** is the highest-probability bet at 0.74 ($14.6M volume). **US Recession in 2026** is at 0.28 and falling (-3.4%). **S&P 500 above 6000** sits at 0.58.',
  },
  {
    keywords: ['sport', 'football', 'soccer', 'barca', 'barcelona', 'nba', 'celtics', 'f1'],
    response:
      'Sports markets: **Barca vs Real — Barca Win** (0.57, Live, +4.2%). **Celtics NBA Championship** (0.34, +5.6%). **Verstappen WDC 2026** (0.48, -1.5%). All available in the Markets lobby under the Sports filter.',
  },
  {
    keywords: ['agi', 'ai', 'tech', 'spacex', 'apple', 'tesla'],
    response:
      '**AGI achieved by 2027** is the most momentum-driven market right now — up +15.4% today to 0.12. High risk, high reward. **Apple $4T market cap** at 0.68 is one of the most stable tech bets.',
  },
  {
    keywords: ['risk', 'safe', 'low risk', 'recommend', 'suggest', 'start'],
    response:
      'For lower-risk trades: **Fed rate cut** (0.74, high liquidity), **Apple $4T** (0.68, stable), **UK PM Approval** (0.55). For high-upside asymmetric bets: **AGI by 2027** (0.12), **Dogecoin above $1** (0.05). Start small and size according to your conviction.',
  },
  {
    keywords: ['market', 'markets', 'list', 'all', 'available'],
    response:
      'We have **34 active markets** across 7 categories: Politics, Sports, Entertainment, Crypto, Science & Tech, Economy, and Culture. Use the Markets page to filter, search, and sort by volume or price change. The most-watched today are in Crypto and Economy.',
  },
  {
    keywords: ['fee', 'fees', 'cost', 'charge'],
    response:
      'Trading fees are charged as a percentage of your stake on each fill. The fee is displayed in the order ticket before you confirm. There are no withdrawal or deposit fees. Settled contracts automatically credit your balance at expiry.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help'],
    response:
      'Hey there! I\'m **INCEPT AI**, your prediction markets co-pilot. I can help you find markets, explain how trading works, review your portfolio stats, or suggest opportunities. What would you like to explore?',
  },
]

const getAIResponse = (input: string): string => {
  const lower = input.toLowerCase()
  for (const rule of AI_RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) return rule.response
  }
  return "I'm not sure about that one yet, but I'm learning! Try asking me about specific markets, how YES/NO trading works, your portfolio performance, or which markets are trending today."
}

const now = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

// ─── Suggestions ──────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'What are the top markets?',
  'How does YES/NO trading work?',
  'Recommend a low-risk trade',
  'Review my portfolio',
]

// ─── Inline markdown renderer (bold only) ────────────────────────────────────

const renderText = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  )

// ─── Icons ────────────────────────────────────────────────────────────────────

const SparkleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z"
      fill="white"
      opacity="0.95"
    />
    <path
      d="M19.5 15L20.4 17.6L23 18.5L20.4 19.4L19.5 22L18.6 19.4L16 18.5L18.6 17.6L19.5 15Z"
      fill="white"
      opacity="0.7"
    />
  </svg>
)

const AvatarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z"
      fill="white"
      opacity="0.9"
    />
  </svg>
)

const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
)

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

// ─── Component ────────────────────────────────────────────────────────────────

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'ai',
      text: "Hi! I'm **INCEPT AI**, your prediction markets assistant. I can help you discover markets, understand probabilities, and review your portfolio. What would you like to explore?",
      time: now(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [messages, isOpen])

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed, time: now() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    const delay = 700 + Math.random() * 500
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: getAIResponse(trimmed),
        time: now(),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
      if (!isOpen) setHasUnread(true)
    }, delay)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage(input)
  }

  return (
    <>
      {/* ── Chat panel ── */}
      {isOpen && (
        <div className={styles.panel} role="dialog" aria-label="INCEPT AI Assistant">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.avatar}>
                <AvatarIcon />
              </div>
              <div className={styles.headerText}>
                <strong>INCEPT AI</strong>
                <span>
                  <span className={styles.onlineDot} />
                  Markets Assistant · Online
                </span>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close AI assistant"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messages} aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={msg.role === 'user' ? styles.userBubble : styles.aiBubble}
              >
                <p>{renderText(msg.text)}</p>
                <time className={styles.msgTime}>{msg.time}</time>
              </div>
            ))}

            {isTyping && (
              <div className={styles.typingIndicator} aria-label="AI is typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion chips */}
          <div className={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className={styles.chip}
                onClick={() => sendMessage(s)}
                disabled={isTyping}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              placeholder="Ask about markets…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <button
              type="button"
              className={styles.sendBtn}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      {/* ── FAB trigger ── */}
      <button
        type="button"
        className={`${styles.fab} ${isOpen ? styles.fabOpen : ''}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
      >
        <span className={styles.fabRing} />
        {hasUnread && !isOpen && <span className={styles.unreadDot} aria-label="Unread message" />}
        <span className={styles.fabIcon}>
          <SparkleIcon />
        </span>
      </button>
    </>
  )
}

export default AIAssistant
