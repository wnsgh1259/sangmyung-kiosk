import { useState, useEffect, useCallback, useRef } from 'react'
import { menus, allItems, itemLabel, itemDesc, catLabel } from './data/menu'
import { recommendMenuItems } from './utils/menuRecommend'
import { STR, fmtPrice } from './locales'
import { PaymentLogo, LogoOneClick } from './components/PaymentLogos'

const cats = Object.keys(menus)
const SESSION_SEC = 107

function useLiveDateStr() {
  const [s, setS] = useState(() => formatBizDate(new Date()))
  useEffect(() => {
    const tick = () => setS(formatBizDate(new Date()))
    tick()
    const t = setInterval(tick, 30 * 1000)
    return () => clearInterval(t)
  }, [])
  return s
}

function formatBizDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function optLabel(o, lang) {
  return lang === 'en' && o.labelEn ? o.labelEn : o.label
}

function optChoices(o, lang) {
  return lang === 'en' && o.choicesEn ? o.choicesEn : o.choices
}

function MenuCard({ item, cartItem, onOpen, onQtyChange, lang, t }) {
  return (
    <div className={`mcard${cartItem ? ' has-item' : ''}`} onClick={() => onOpen(item)}>
      <div className="mcard-img">
        {item.emoji}
        <div className="badge-wrap">
          {item.hot && <span className="bdg hot">HOT</span>}
          {item.isNew && <span className="bdg new">NEW</span>}
        </div>
      </div>
      <div className="mcard-body">
        <div className="mcard-name">{itemLabel(item, lang)}</div>
        <div className="mcard-foot">
          <div className="mcard-price">{fmtPrice(item.price, lang)}</div>
          {cartItem ? (
            <div className="inline-qty">
              <button className="iq-btn" onClick={e => { e.stopPropagation(); onQtyChange(item.id, -1) }}>−</button>
              <span className="iq-num">{cartItem.qty}</span>
              <button className="iq-btn" onClick={e => { e.stopPropagation(); onQtyChange(item.id, 1) }}>+</button>
            </div>
          ) : (
            <span className="add-hint">{t.tapSelect}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function Drawer({ cart, onClose, onQtyChange, onPay, lang, t }) {
  const items = allItems()
  const cartKeys = Object.keys(cart)
  let sub = 0
  cartKeys.forEach(id => {
    const m = items.find(x => x.id == id)
    if (m) sub += m.price * cart[id].qty
  })
  const tax = Math.round(sub * 0.1)

  return (
    <>
      <div className="drawer-backdrop show" onClick={onClose} />
      <div className="drawer show">
        <div className="drawer-head">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="drawer-title">{t.orderTitle}</div>
              <div className="drawer-table">{t.table} 1</div>
            </div>
            <div style={{ fontSize: '10.5px', color: '#999', marginTop: 2 }}>
              {cartKeys.length ? t.orderSelected(cartKeys.length) : t.orderEmptyHint}
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>
        <div className="drawer-items">
          {!cartKeys.length ? (
            <div className="empty-msg">{t.cartEmpty}<br /><span style={{ fontSize: 24 }}>🛒</span></div>
          ) : cartKeys.map(id => {
            const m = items.find(x => x.id == id)
            if (!m) return null
            const line = m.price * cart[id].qty
            const optStr = cart[id].opts ? Object.values(cart[id].opts).filter(Boolean).join(' · ') : ''
            return (
              <div className="oi" key={id}>
                <div className="oi-emoji">{m.emoji}</div>
                <div className="oi-info">
                  <div className="oi-name">{itemLabel(m, lang)}</div>
                  {optStr && <div className="oi-opt">{optStr}</div>}
                  <div className="oi-row">
                    <div className="oi-qty">
                      <button className="oq-btn" onClick={() => onQtyChange(m.id, -1)}>−</button>
                      <span className="oq-n">{cart[id].qty}</span>
                      <button className="oq-btn" onClick={() => onQtyChange(m.id, 1)}>+</button>
                    </div>
                    <div className="oi-price">{fmtPrice(line, lang)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="drawer-foot">
          <div className="price-row total"><span>{t.total}</span><span>{fmtPrice(sub + tax, lang)}</span></div>
          <button className="order-btn" disabled={!cartKeys.length} onClick={onPay}>{t.pay}</button>
        </div>
      </div>
    </>
  )
}

function Modal({ item, cartItem, onClose, onAdd, lang, t }) {
  const [qty, setQty] = useState(cartItem ? cartItem.qty : 1)
  const [sel, setSel] = useState({})

  const toggleOpt = (labelKey, choice) => {
    setSel(prev => ({ ...prev, [labelKey]: prev[labelKey] === choice ? null : choice }))
  }

  return (
    <div className="modal-wrap show" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-img">{item.emoji}</div>
        <div className="modal-body">
          <div className="modal-name">{itemLabel(item, lang)}</div>
          <div className="modal-desc">{itemDesc(item, lang)}</div>
          {item.opts && item.opts.length > 0 && (
            <div className="modal-opts">
              {item.opts.map(o => {
                const label = optLabel(o, lang)
                const choices = optChoices(o, lang)
                return (
                  <div key={o.label} style={{ marginBottom: 10 }}>
                    <div className="opt-label">{label}</div>
                    <div className="opt-row">
                      {choices.map(c => (
                        <button
                          key={c}
                          className={`opt-chip${sel[o.label] === c ? ' sel' : ''}`}
                          onClick={() => toggleOpt(o.label, c)}
                        >{c}</button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <div className="modal-foot">
            <div className="modal-price">{fmtPrice(item.price * qty, lang)}</div>
            <div className="modal-qty">
              <button className="mq-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="mq-n">{qty}</span>
              <button className="mq-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button className="add-btn" onClick={() => onAdd(item, qty, sel)}>{t.addToCart}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Success({ onClose, t }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])
  const lines = t.orderDoneSub.split('\n')
  return (
    <div className="success-overlay">
      <div className="success-box">
        <div className="success-icon">✅</div>
        <div className="success-title">{t.orderDone}</div>
        <div className="success-sub">
          {lines.map((line, i) => (
            <span key={i}>{line}{i < lines.length - 1 ? <br /> : null}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function IdleScreen({ onDismiss, t }) {
  return (
    <button type="button" className="idle-screen" onClick={onDismiss}>
      <div className="idle-inner">
        <div className="idle-icon-wrap" aria-hidden>
          <span className="idle-hand">👆</span>
        </div>
        <div className="idle-title">{t.tapTitle}</div>
        <div className="idle-sub">{t.tapSub}</div>
      </div>
    </button>
  )
}

function FaceScanModal({ t }) {
  return (
    <div className="face-scan-overlay">
      <div className="face-scan-box">
        <div className="face-scan-ring" aria-hidden />
        <div className="face-scan-icon">📷</div>
        <div className="face-scan-title">{t.faceTitle}</div>
        <div className="face-scan-sub">{t.faceSub}</div>
      </div>
    </div>
  )
}

function WelcomeOverlay({ displayName, t }) {
  return (
    <div className="welcome-overlay">
      <div className="welcome-box">
        <div className="welcome-emoji">😊</div>
        <div className="welcome-msg">{t.welcomeMsg(displayName)}</div>
      </div>
    </div>
  )
}

function PaymentModal({ isMember, total, onClose, onSelect, lang, t }) {
  const others = [
    { key: 'card', label: t.payCard },
    { key: 'appcard', label: t.payAppCard },
    { key: 'kakao', label: t.payKakao },
    { key: 'naver', label: t.payNaver },
    { key: 'samsung', label: t.paySamsung },
    { key: 'apple', label: t.payApple },
  ]
  return (
    <div className="pay-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pay-modal">
        <button type="button" className="pay-modal-close" onClick={onClose}>✕</button>
        <div className="pay-modal-title">{t.payTitle}</div>
        <div className="pay-modal-total">{fmtPrice(total, lang)}</div>
        {isMember && (
          <>
            <div className="pay-oneclick-row">
              <button type="button" className="pay-chip pay-chip--oneclick-top" onClick={() => onSelect('oneclick')}>
                <div className="pay-chip-logo-wrap" aria-hidden>
                  <LogoOneClick />
                </div>
                <span className="pay-chip-label">{t.payOneClick}</span>
              </button>
            </div>
            <div className="pay-divider"><span>{lang === 'ko' ? '또는' : 'or'}</span></div>
          </>
        )}
        <div className="pay-grid">
          {others.map(({ key, label }) => (
            <button key={key} type="button" className="pay-chip" onClick={() => onSelect(key)}>
              <div className="pay-chip-logo-wrap" aria-hidden>
                <PaymentLogo method={key} />
              </div>
              <span className="pay-chip-label">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MyPageModal({ onNickname, onCard, onClose, t }) {
  return (
    <div className="mypage-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mypage-modal">
        <button type="button" className="mypage-close" onClick={onClose}>✕</button>
        <div className="mypage-title">{t.myPage}</div>
        <button type="button" className="mypage-action" onClick={onNickname}>{t.changeNickname}</button>
        <button type="button" className="mypage-action secondary" onClick={onCard}>{t.registerCard}</button>
      </div>
    </div>
  )
}

function NicknameModal({ value, onChange, onSave, onClose, t }) {
  return (
    <div className="mypage-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="nickname-modal">
        <div className="mypage-title">{t.changeNickname}</div>
        <input
          className="nickname-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={t.nicknamePlaceholder}
        />
        <div className="nickname-actions">
          <button type="button" className="nickname-cancel" onClick={onClose}>{t.cancel}</button>
          <button type="button" className="nickname-save" onClick={onSave}>{t.save}</button>
        </div>
      </div>
    </div>
  )
}

function AiRecommendModal({ query, items, onPick, onClose, lang, t }) {
  return (
    <div className="ai-rec-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ai-rec-panel" role="dialog" aria-labelledby="ai-rec-title">
        <button type="button" className="mypage-close" onClick={onClose}>✕</button>
        <div id="ai-rec-title" className="ai-rec-title">{t.aiRecTitle}</div>
        <div className="ai-rec-query"><span className="ai-rec-q-label">{t.aiRecAsked}</span> {query}</div>
        <div className="ai-rec-list">
          {items.map(it => (
            <button type="button" key={it.id} className="ai-rec-row" onClick={() => onPick(it)}>
              <span className="ai-rec-emoji" aria-hidden>{it.emoji}</span>
              <span className="ai-rec-name">{itemLabel(it, lang)}</span>
              <span className="ai-rec-price">{fmtPrice(it.price, lang)}</span>
              <span className="ai-rec-go">{t.aiRecView}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function AiQuestionModal({ value, onChange, onSubmit, onClose, t }) {
  const trimmed = value.trim()
  return (
    <div className="ai-question-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ai-question-panel" role="dialog" aria-labelledby="ai-q-title">
        <button type="button" className="mypage-close" onClick={onClose}>✕</button>
        <div id="ai-q-title" className="mypage-title">{t.aiQuestionTitle}</div>
        <textarea
          className="ai-question-textarea"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (trimmed) onSubmit(trimmed)
            }
          }}
          placeholder={t.aiQuestionPlaceholder}
          rows={5}
        />
        <div className="nickname-actions">
          <button type="button" className="nickname-cancel" onClick={onClose}>{t.cancel}</button>
          <button
            type="button"
            className="nickname-save"
            disabled={!trimmed}
            onClick={() => onSubmit(trimmed)}
          >
            {t.aiQuestionSubmit}
          </button>
        </div>
      </div>
    </div>
  )
}

function LangModal({ onPick, onClose, t }) {
  return (
    <div className="lang-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="lang-modal" role="dialog" aria-labelledby="lang-title">
        <div id="lang-title" className="lang-modal-title">{t.langTitle}</div>
        <div className="lang-modal-btns">
          <button type="button" className="lang-pick ko" onClick={() => onPick('ko')}>{t.langKo}</button>
          <button type="button" className="lang-pick en" onClick={() => onPick('en')}>{t.langEn}</button>
        </div>
        <button type="button" className="lang-modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  )
}

function InquiryModal({ onPick, onClose, t }) {
  return (
    <div className="lang-modal-backdrop inquiry-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="lang-modal inquiry-modal" role="dialog" aria-labelledby="inquiry-title">
        <div id="inquiry-title" className="lang-modal-title">{t.inquiryTitle}</div>
        <div className="lang-modal-btns">
          <button type="button" className="lang-pick inquiry-pick msg" onClick={onPick}>{t.inquiryMessage}</button>
          <button type="button" className="lang-pick inquiry-pick voice" onClick={onPick}>{t.inquiryVoice}</button>
          <button type="button" className="lang-pick inquiry-pick staff" onClick={onPick}>{t.inquiryStaff}</button>
        </div>
        <button type="button" className="lang-modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  )
}

function MicListenPopup({ t, onClose, onQuestion, liveFinal, liveInterim }) {
  // 말하기 버튼 클릭이 곧바로 배경 클릭으로 처리되면 빈 인식으로 닫히며 토스트가 뜬다.
  const openedAtRef = useRef(0)
  useEffect(() => {
    openedAtRef.current = Date.now()
  }, [])
  const onBackdropClick = e => {
    if (e.target !== e.currentTarget) return
    if (Date.now() - openedAtRef.current < 400) return
    onClose()
  }
  return (
    <div
      className="mic-listen-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mic-listen-title"
      aria-describedby="mic-live-region mic-listen-desc mic-fb1 mic-fb2"
      onClick={onBackdropClick}
    >
      <div className="mic-listen-box" onClick={e => e.stopPropagation()}>
        <div className="mic-listen-icon" aria-hidden>🎙️</div>
        <div id="mic-listen-title" className="mic-listen-title">{t.micOn}</div>
        <div id="mic-live-region" className="mic-listen-live-wrap" aria-live="polite">
          <div className="mic-listen-live-label">{t.micLiveCaption}</div>
          <div className="mic-listen-live-text">
            {liveFinal || liveInterim ? (
              <>
                {liveFinal}
                <span className="mic-listen-interim">{liveInterim}</span>
              </>
            ) : (
              <span className="mic-listen-live-placeholder">{t.micLivePlaceholder}</span>
            )}
          </div>
        </div>
        <div id="mic-listen-desc" className="mic-listen-sub mic-listen-line1">{t.micCloseHint}</div>
        <div className="mic-listen-gap" aria-hidden />
        <div id="mic-fb1" className="mic-listen-fb-line">{t.micFallbackLine1}</div>
        <div id="mic-fb2" className="mic-listen-fb-line">{t.micFallbackLine2}</div>
        <button type="button" className="mic-listen-question-btn" onClick={onQuestion}>
          {t.micQuestionBtn}
        </button>
      </div>
    </div>
  )
}

function StaffToast({ t }) {
  return (
    <div className="staff-toast-overlay" role="status">
      <div className="staff-toast">
        <div className="staff-toast-emoji">🙋‍♀️</div>
        <div className="staff-toast-title staff-toast-title-only">{t.staffWaitTitle}</div>
      </div>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState('ko')
  const [activeCat, setActiveCat] = useState(cats[0])
  const [cart, setCart] = useState({})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalItem, setModalItem] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [remaining, setRemaining] = useState(SESSION_SEC)
  const [showLangModal, setShowLangModal] = useState(false)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [showStaffToast, setShowStaffToast] = useState(false)

  const [overlay, setOverlay] = useState('member_guest')
  const [memberLoggedIn, setMemberLoggedIn] = useState(false)
  const [displayName, setDisplayName] = useState('김준호')
  const [showMyPage, setShowMyPage] = useState(false)
  const [showNicknameEdit, setShowNicknameEdit] = useState(false)
  const [nicknameDraft, setNicknameDraft] = useState('김준호')
  const [miniToastMsg, setMiniToastMsg] = useState('')
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [showAiQuestionModal, setShowAiQuestionModal] = useState(false)
  const [aiQuestionDraft, setAiQuestionDraft] = useState('')
  const [voiceLiveFinal, setVoiceLiveFinal] = useState('')
  const [voiceLiveInterim, setVoiceLiveInterim] = useState('')
  const [aiRecOpen, setAiRecOpen] = useState(false)
  const [aiRecQuery, setAiRecQuery] = useState('')
  const [aiRecItems, setAiRecItems] = useState([])

  const welcomeTimerRef = useRef(null)
  const memberRef = useRef(memberLoggedIn)
  const voiceCaptionRef = useRef('')
  const isListeningRef = useRef(false)
  const recognitionRef = useRef(null)
  const speechStartedAtRef = useRef(0)

  const bizDate = useLiveDateStr()
  const t = STR[lang]

  const menuActive = overlay === null

  useEffect(() => {
    memberRef.current = memberLoggedIn
  }, [memberLoggedIn])

  useEffect(() => {
    isListeningRef.current = isListening
  }, [isListening])

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'ko'
  }, [lang])

  useEffect(() => {
    if (overlay !== 'face_scan') return
    const id = setTimeout(() => setOverlay('welcome'), 3000)
    return () => clearTimeout(id)
  }, [overlay])

  useEffect(() => {
    if (overlay !== 'welcome') return
    welcomeTimerRef.current = setTimeout(() => {
      setMemberLoggedIn(true)
      setOverlay(null)
      setRemaining(SESSION_SEC)
    }, 2000)
    return () => clearTimeout(welcomeTimerRef.current)
  }, [overlay])

  useEffect(() => {
    if (!menuActive || showSuccess || paymentOpen) return
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          if (memberRef.current) {
            setOverlay('idle_tap')
          } else {
            setOverlay('member_guest')
            setCart({})
          }
          return SESSION_SEC
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [menuActive, showSuccess, paymentOpen])

  useEffect(() => {
    if (!showStaffToast) return
    const id = setTimeout(() => setShowStaffToast(false), 2800)
    return () => clearTimeout(id)
  }, [showStaffToast])

  useEffect(() => {
    if (!miniToastMsg) return
    const id = setTimeout(() => setMiniToastMsg(''), 2500)
    return () => clearTimeout(id)
  }, [miniToastMsg])

  const dismissIdle = useCallback(() => {
    setOverlay(null)
    setRemaining(SESSION_SEC)
  }, [])

  const openAiRecommend = useCallback(
    query => {
      const q = query.trim()
      if (!q) {
        setMiniToastMsg(t.speechNoResult)
        return
      }
      setAiRecQuery(q)
      setAiRecItems(recommendMenuItems(q, lang, 8))
      setAiRecOpen(true)
    },
    [lang, t]
  )

  const cartTotal = () => {
    const items = allItems()
    let sub = 0
    Object.keys(cart).forEach(id => {
      const m = items.find(x => x.id == id)
      if (m) sub += m.price * cart[id].qty
    })
    return sub + Math.round(sub * 0.1)
  }

  const handleQtyChange = (id, delta) => {
    setCart(prev => {
      const cur = prev[id]
      if (!cur) return prev
      const newQty = cur.qty + delta
      if (newQty <= 0) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: { ...cur, qty: newQty } }
    })
  }

  const handleAdd = (item, qty, opts) => {
    setCart(prev => ({ ...prev, [item.id]: { qty, opts } }))
    setModalItem(null)
  }

  const handlePayFromDrawer = () => {
    setPaymentOpen(true)
  }

  const completePayment = () => {
    setPaymentOpen(false)
    setCart({})
    setDrawerOpen(false)
    setShowSuccess(true)
  }

  useEffect(() => {
    if (!isListening) {
      setVoiceLiveFinal('')
      setVoiceLiveInterim('')
      return undefined
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setMiniToastMsg(t.speechNotSupported)
      setIsListening(false)
      return undefined
    }
    const rec = new SR()
    rec.lang = lang === 'en' ? 'en-US' : 'ko-KR'
    rec.continuous = true
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onresult = event => {
      let finalPart = ''
      let interimPart = ''
      for (let i = 0; i < event.results.length; i += 1) {
        const piece = event.results[i][0].transcript
        if (event.results[i].isFinal) finalPart += piece
        else interimPart += piece
      }
      const v = (finalPart + interimPart).trim()
      voiceCaptionRef.current = v
      setVoiceLiveFinal(finalPart)
      setVoiceLiveInterim(interimPart)
    }
    rec.onerror = ev => {
      const code = ev && ev.error
      if (!code) return
      if (code === 'not-allowed' || code === 'service-not-allowed') {
        setMiniToastMsg(t.speechNotSupported)
        setIsListening(false)
        return
      }
      if (code === 'no-speech' || code === 'aborted') return
      // 연속 인식 시작 직후 일시적 network 오류는 흔함 — "잘 안 들렸어요"와 맞지 않음
      if (code === 'network') return
      if (code === 'audio-capture') {
        setMiniToastMsg(t.speechNotSupported)
        setIsListening(false)
        return
      }
      // 세션 초반(마이크·서비스 기동) 잡음은 사용자에게 말 안 들림으로 오해시키지 않음
      if (Date.now() - speechStartedAtRef.current < 1200) return
      setMiniToastMsg(t.speechNoResult)
    }
    rec.onend = () => {
      if (isListeningRef.current) {
        try {
          rec.start()
          speechStartedAtRef.current = Date.now()
        } catch {
          /* already running */
        }
      }
    }

    recognitionRef.current = rec
    voiceCaptionRef.current = ''
    setVoiceLiveFinal('')
    setVoiceLiveInterim('')
    try {
      rec.start()
      speechStartedAtRef.current = Date.now()
    } catch {
      setMiniToastMsg(t.speechNotSupported)
      setIsListening(false)
    }

    return () => {
      recognitionRef.current = null
      try {
        rec.abort()
      } catch {
        try {
          rec.stop()
        } catch {
          /* */
        }
      }
    }
  }, [isListening, lang, t])

  const toggleMic = () => {
    if (!isListening) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SR) {
        setMiniToastMsg(t.speechNotSupported)
        return
      }
      voiceCaptionRef.current = ''
      setVoiceLiveFinal('')
      setVoiceLiveInterim('')
      // 클릭이 듣기 오버레이 배경으로 넘어가 즉시 닫히는 것을 줄이기 위해 한 틱 뒤에 연다.
      window.setTimeout(() => setIsListening(true), 0)
    }
  }

  const closeMicListen = () => {
    const q = voiceCaptionRef.current.trim()
    setIsListening(false)
    voiceCaptionRef.current = ''
    setVoiceLiveFinal('')
    setVoiceLiveInterim('')
    if (q) window.setTimeout(() => openAiRecommend(q), 0)
    else setMiniToastMsg(t.speechNoResult)
  }

  const currentItems = menus[activeCat] || []

  const onGateMember = () => setOverlay('face_scan')
  const onGateGuest = () => {
    setMemberLoggedIn(false)
    setOverlay(null)
    setRemaining(SESSION_SEC)
  }

  const MemberGuestGateFixed = () => (
    <div className="gate-screen">
      <div className="gate-inner">
        <div className="gate-brand">{t.brand}</div>
        <p className="gate-hint">{lang === 'ko' ? '이용 방식을 선택해 주세요' : 'How would you like to order?'}</p>
        <div className="gate-btns">
          <button type="button" className="gate-btn member" onClick={onGateMember}>
            <span className="gate-btn-title">{t.memberBtn}</span>
            <span className="gate-btn-sub">{t.memberSub}</span>
          </button>
          <button type="button" className="gate-btn guest" onClick={onGateGuest}>
            <span className="gate-btn-title">{t.guestBtn}</span>
          </button>
        </div>
        <button type="button" className="gate-lang" onClick={() => setShowLangModal(true)}>{t.langBtn}</button>
      </div>
    </div>
  )

  return (
    <div className="shell">
      <div className="sidebar">
        <div className="brand"><div className="brand-name">{t.brand}</div></div>
        <div className="cat-list">
          {cats.map(c => (
            <button key={c} className={`cat-btn${activeCat === c ? ' on' : ''}`} onClick={() => setActiveCat(c)}>
              <span className="label">{catLabel(c, lang)}</span>
              <span className="arr">›</span>
            </button>
          ))}
        </div>
        <div className="sidebar-foot">
          <button className="foot-btn btn-home" onClick={() => setActiveCat(cats[0])}>{t.home}</button>
          <button className="foot-btn btn-lang" onClick={() => setShowLangModal(true)}>{t.langBtn}</button>
          <button className="foot-btn btn-staff" onClick={() => setShowInquiryModal(true)}>{t.inquiryBtn}</button>
          <button className="btn-order" onClick={() => setDrawerOpen(true)}>
            {t.orderReview}
            {Object.values(cart).reduce((a, b) => a + b.qty, 0) > 0 && (
              <span className="cart-badge">{Object.values(cart).reduce((a, b) => a + b.qty, 0)}</span>
            )}
          </button>
        </div>
      </div>

      <div className="center">
        <div className="topbar">
          <div className="topbar-left">
            <span>{t.businessDate} <b>{bizDate}</b></span>
            <span>{t.timeLeft} <span className="timer-red">{remaining}</span>{t.sec}</span>
          </div>
          <div className="topbar-right">
            {memberLoggedIn && (
              <>
                <button
                  type="button"
                  className="topbar-logout"
                  onClick={() => {
                    setMemberLoggedIn(false)
                    setCart({})
                    setDrawerOpen(false)
                    setPaymentOpen(false)
                    setShowMyPage(false)
                    setOverlay('member_guest')
                    setRemaining(SESSION_SEC)
                  }}
                >{t.logout}</button>
                <button type="button" className="topbar-mypage" onClick={() => setShowMyPage(true)}>{t.myPage}</button>
                <span className="topbar-user">{displayName}{lang === 'ko' ? '님' : ''}</span>
              </>
            )}
            {!memberLoggedIn && (
              <>
                <button type="button" className="topbar-login" onClick={() => setOverlay('face_scan')}>{t.login}</button>
                <button type="button" className="topbar-signup" onClick={() => setMiniToastMsg(t.signupSoon)}>{t.signup}</button>
              </>
            )}
            <span className="topbar-hall">{t.hallServing} — {t.table} 1</span>
          </div>
        </div>
        <div className="menu-scroll">
          <div className="sec-title">{catLabel(activeCat, lang)}</div>
          <div className="grid">
            {currentItems.map(item => (
              <MenuCard
                key={item.id}
                item={item}
                cartItem={cart[item.id]}
                onOpen={setModalItem}
                onQtyChange={handleQtyChange}
                lang={lang}
                t={t}
              />
            ))}
          </div>
        </div>
        <div className="ai-bar">
          <div className="ai-tag"><span className="ai-dot" />AI</div>
          <div className="ai-text">
            {isListening ? t.aiListening : t.aiHint}
          </div>
          <button className={`mic${isListening ? ' on' : ''}`} onClick={toggleMic}>
            <span style={{ fontSize: 15, lineHeight: 1 }}>🎙️</span>
            <span>{isListening ? t.micOn : t.micOff}</span>
          </button>
        </div>
      </div>

      {drawerOpen && (
        <Drawer
          cart={cart}
          onClose={() => setDrawerOpen(false)}
          onQtyChange={handleQtyChange}
          onPay={handlePayFromDrawer}
          lang={lang}
          t={t}
        />
      )}

      {modalItem && (
        <Modal
          item={modalItem}
          cartItem={cart[modalItem.id]}
          onClose={() => setModalItem(null)}
          onAdd={handleAdd}
          lang={lang}
          t={t}
        />
      )}

      {showSuccess && <Success onClose={() => setShowSuccess(false)} t={t} />}

      {showLangModal && (
        <LangModal
          onPick={l => { setLang(l); setShowLangModal(false) }}
          onClose={() => setShowLangModal(false)}
          t={t}
        />
      )}

      {showInquiryModal && (
        <InquiryModal
          onPick={() => { setShowInquiryModal(false); setShowStaffToast(true) }}
          onClose={() => setShowInquiryModal(false)}
          t={t}
        />
      )}

      {isListening && (
        <MicListenPopup
          t={t}
          liveFinal={voiceLiveFinal}
          liveInterim={voiceLiveInterim}
          onClose={closeMicListen}
          onQuestion={() => {
            const draft = voiceCaptionRef.current.trim()
            setIsListening(false)
            setAiQuestionDraft(draft)
            setShowAiQuestionModal(true)
          }}
        />
      )}

      {showAiQuestionModal && (
        <AiQuestionModal
          value={aiQuestionDraft}
          onChange={setAiQuestionDraft}
          onSubmit={text => {
            setShowAiQuestionModal(false)
            setAiQuestionDraft('')
            // 같은 클릭이 추천 모달 배경으로 떨어져 즉시 닫히는 것을 막기 위해 한 틱 뒤에 연다.
            window.setTimeout(() => openAiRecommend(text), 0)
          }}
          onClose={() => { setShowAiQuestionModal(false); setAiQuestionDraft('') }}
          t={t}
        />
      )}

      {aiRecOpen && (
        <AiRecommendModal
          query={aiRecQuery}
          items={aiRecItems}
          onPick={item => {
            setAiRecOpen(false)
            setModalItem(item)
          }}
          onClose={() => setAiRecOpen(false)}
          lang={lang}
          t={t}
        />
      )}

      {showStaffToast && <StaffToast t={t} />}

      {paymentOpen && (
        <PaymentModal
          isMember={memberLoggedIn}
          total={cartTotal()}
          onClose={() => setPaymentOpen(false)}
          onSelect={() => completePayment()}
          lang={lang}
          t={t}
        />
      )}

      {showMyPage && (
        <MyPageModal
          onNickname={() => { setShowMyPage(false); setNicknameDraft(displayName); setShowNicknameEdit(true) }}
          onCard={() => { setShowMyPage(false); setMiniToastMsg(t.cardRegSoon) }}
          onClose={() => setShowMyPage(false)}
          t={t}
        />
      )}

      {showNicknameEdit && (
        <NicknameModal
          value={nicknameDraft}
          onChange={setNicknameDraft}
          onSave={() => {
            const v = nicknameDraft.trim() || displayName
            setDisplayName(v)
            setShowNicknameEdit(false)
          }}
          onClose={() => setShowNicknameEdit(false)}
          t={t}
        />
      )}

      {miniToastMsg && (
        <div className="mini-toast-overlay">
          <div className="mini-toast">{miniToastMsg}</div>
        </div>
      )}

      {overlay === 'member_guest' && <MemberGuestGateFixed />}

      {overlay === 'face_scan' && <FaceScanModal t={t} />}

      {overlay === 'welcome' && <WelcomeOverlay displayName={displayName} t={t} />}

      {overlay === 'idle_tap' && <IdleScreen onDismiss={dismissIdle} t={t} />}
    </div>
  )
}
