/** Payment marks: colored pill only wraps content — minimal empty color on sides. */

const VB = '0 0 120 28'

export function LogoCard() {
  return (
    <svg className="pay-logo-svg" viewBox={VB} aria-hidden>
      <rect x="32" y="0" width="56" height="28" rx="5" fill="#1a1f71" />
      <circle cx="52" cy="14" r="9.5" fill="#eb001b" opacity=".95" />
      <circle cx="68" cy="14" r="9.5" fill="#f79e1b" opacity=".95" />
      <rect x="42" y="9" width="36" height="10" rx="2" fill="#fff" opacity=".12" />
    </svg>
  )
}

export function LogoPayco() {
  return (
    <svg className="pay-logo-svg pay-logo--payco" viewBox={VB} aria-hidden>
      <rect x="31" y="0" width="58" height="28" rx="5" fill="#e60012" />
      <text x="60" y="19" textAnchor="middle" fill="#fff" fontSize="13.5" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.04em">PAYCO</text>
    </svg>
  )
}

export function LogoKakaoPay() {
  return (
    <svg className="pay-logo-svg pay-logo--kakao" viewBox={VB} aria-hidden>
      <rect x="12" y="0" width="96" height="28" rx="5" fill="#fee500" />
      <text x="60" y="18.5" textAnchor="middle" fill="#191919" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">kakao pay</text>
    </svg>
  )
}

export function LogoNaverPay() {
  return (
    <svg className="pay-logo-svg pay-logo--naver" viewBox={VB} aria-hidden>
      <rect x="24" y="0" width="72" height="28" rx="5" fill="#03c75a" />
      <text x="40" y="20" fill="#fff" fontSize="16" fontWeight="900" fontFamily="system-ui, sans-serif">N</text>
      <text x="52" y="18.5" fill="#fff" fontSize="10.5" fontWeight="700" fontFamily="system-ui, sans-serif">Pay</text>
    </svg>
  )
}

export function LogoSamsungPay() {
  return (
    <svg className="pay-logo-svg pay-logo--samsung" viewBox={VB} aria-hidden>
      <defs>
        <linearGradient id="samsungPayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1428a0" />
          <stop offset="100%" stopColor="#0b1d6b" />
        </linearGradient>
      </defs>
      <rect x="6" y="0" width="108" height="28" rx="5" fill="url(#samsungPayGrad)" />
      <text x="60" y="17.5" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="0.02em">SAMSUNG Pay</text>
    </svg>
  )
}

export function LogoApplePay() {
  return (
    <svg className="pay-logo-svg pay-logo--apple" viewBox={VB} aria-hidden>
      <rect x="26" y="0" width="68" height="28" rx="5" fill="#000" />
      <text x="60" y="18" textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="600" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.02em">Apple Pay</text>
    </svg>
  )
}

export function LogoOneClick() {
  return (
    <svg className="pay-logo-svg pay-logo--oneclick" viewBox={VB} aria-hidden>
      <defs>
        <linearGradient id="oneClickGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#ff8a65" />
        </linearGradient>
      </defs>
      <rect x="34" y="0" width="52" height="28" rx="6" fill="url(#oneClickGrad)" />
      <path fill="#fff" d="M62 6 L55 18h5l-2 6 8-13h-3l-1.5-5z" />
    </svg>
  )
}

const LOGO_MAP = {
  card: LogoCard,
  appcard: LogoPayco,
  kakao: LogoKakaoPay,
  naver: LogoNaverPay,
  samsung: LogoSamsungPay,
  apple: LogoApplePay,
}

export function PaymentLogo({ method }) {
  const Cmp = LOGO_MAP[method] || LogoCard
  return <Cmp />
}
