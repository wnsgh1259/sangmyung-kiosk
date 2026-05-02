import { menus } from '../data/menu'

function itemHaystack(item, lang) {
  const name = lang === 'en' && item.nameEn ? item.nameEn : item.name
  const desc = lang === 'en' && item.descEn ? item.descEn : item.desc
  return `${name} ${item.nameEn || ''} ${desc} ${item.descEn || ''}`.toLowerCase()
}

/** "피자나 파스타" → ["피자", "파스타"] — 줄바꿈·쉼표·접속사 기준 */
function splitTopics(raw) {
  const norm = raw.trim().replace(/\s+/g, ' ')
  if (!norm) return []
  const chunks = norm
    .split(
      /\s*(?:[,，、]|\b(?:and|or)\b|(?:이)?나|랑|하고|이랑|와|과|또는|\/|그리고|및)\s*/i
    )
    .map(s =>
      s
        .trim()
        .replace(
          /^(?:추천|추천해|추천해줘|메뉴|뭐|뭘|좀|해줘|주세요|알려줘|please|recommend|suggest)\s*/gi,
          ''
        )
        .replace(
          /\s*(?:추천|추천해|추천해줘|메뉴|뭐|뭘|좀|해줘|주세요|알려줘|please|recommend|suggest)\s*$/gi,
          ''
        )
        .trim()
    )
    .filter(Boolean)
  return chunks.length ? chunks : [norm]
}

function tokensFrom(text) {
  const t = text.toLowerCase()
  return t.split(/[\s,.!?;:·…，。'"“”]+/).filter(x => x.length >= 2)
}

function stripParticle(tok) {
  return tok.replace(
    /(?:나|랑|은|는|이|가|을|를|도|만|에|의|로|으로|에서|까지|에게|께|한테|처럼|같이|요|죠|줘|해|해줘)$/u,
    ''
  )
}

const rules = [
  [/피자|pizza/i, it => it._cat === '피자'],
  [
    /파스타|pasta|스파게티|로제|까르보|까보나|면\s*요리/i,
    it =>
      (/파스타|pasta|리조또|risotto|로제|까르보|까보나|스파게티|면/i).test(
        it.name + (it.nameEn || '')
      ),
  ],
  [/스테이크|steak|폭립|ribs|bbq|바베큐/i, it => (/스테이크|steak|폭립|ribs|bbq|바베큐/i).test(it.name + (it.nameEn || ''))],
  [/비빔밥|bibimbap/i, it => (/비빔밥|bibimbap/i).test(it.name + (it.nameEn || ''))],
  [/국밥|gukbap|soup|국물/i, it => (/국밥|soup|broth|국물/i).test(it.name + (it.nameEn || ''))],
  [/샐러드|salad/i, it => (/샐러드|salad/i).test(it.name + (it.nameEn || '')) || it._cat === '샐러드/사이드'],
  [/세트|set|런치|lunch|패밀리|family/i, it => it._cat === '세트'],
  [/매운|맵게|spicy|\bhot\b/i, it => it.hot || (/매운|맵|spicy|hot/i).test(it.desc + (it.descEn || ''))],
  [/맥주|beer|draft/i, it => (/맥주|beer|draft/i).test(it.name + (it.nameEn || ''))],
  [/와인|wine/i, it => (/와인|wine/i).test(it.name + (it.nameEn || ''))],
  [
    /음료|콜라|사이다|탄산|drink|soda|cola/i,
    it =>
      it._cat === '음료/주류' ||
      (/콜라|사이다|탄산|drink|soda/i).test(
        it.name + (it.nameEn || '')
      ),
  ],
  [/새우|shrimp|감바스|gambas/i, it => (/새우|shrimp|감바스|gambas/i).test(it.name + (it.nameEn || ''))],
  [/볶음밥|fried\s*rice/i, it => (/볶음밥|fried\s*rice/i).test(it.name + (it.nameEn || ''))],
  [/리조또|risotto/i, it => (/리조또|risotto/i).test(it.name + (it.nameEn || ''))],
  [/신메뉴|new/i, it => it.isNew || it._cat === '신메뉴'],
]

function scoreOnePart(item, part, lang) {
  let score = 0
  const partLower = part.toLowerCase()
  const hay = itemHaystack(item, lang) + ` ${item._cat}`.toLowerCase()

  if (partLower.length >= 2 && hay.includes(partLower)) score += 60

  const toks = tokensFrom(part)
  for (let tok of toks) {
    const stripped = stripParticle(tok)
    if (stripped.length >= 2 && hay.includes(stripped)) score += 22
    else if (tok.length >= 2 && hay.includes(tok)) score += 18
  }

  for (const [re, fn] of rules) {
    if (re.test(part) && fn(item)) score += 34
  }

  return score
}

/**
 * Local keyword + text match over full menu (no server).
 * 복합 질문(피자나 파스타, pizza and pasta)은 토막별 점수를 합산합니다.
 */
export function recommendMenuItems(query, lang, max = 8) {
  const raw = query.trim()
  if (!raw) return []

  const items = []
  for (const [cat, arr] of Object.entries(menus)) {
    for (const item of arr) {
      items.push({ ...item, _cat: cat })
    }
  }

  const featured = () =>
    [...items]
      .sort((a, b) => {
        const rank = x => (x.hot ? 4 : 0) + (x.isNew ? 2 : 0) + (x.price < 15000 ? 1 : 0)
        return rank(b) - rank(a)
      })
      .slice(0, max)
      .map(x => ({ ...x, _score: 1 }))

  const parts = splitTopics(raw)
  const scoreParts = parts.length ? parts : [raw]

  const byId = new Map()
  for (const item of items) {
    let total = 0
    for (const part of scoreParts) {
      total += scoreOnePart(item, part, lang)
    }
    byId.set(item.id, { ...item, _score: total })
  }

  const scored = items.map(it => byId.get(it.id))
  scored.sort((a, b) => b._score - a._score)
  const positive = scored.filter(x => x._score > 0)
  if (positive.length === 0) return featured()
  return positive.slice(0, max)
}
