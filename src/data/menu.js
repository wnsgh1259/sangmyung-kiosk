const CAT_EN = {
  신메뉴: 'New',
  세트: 'Sets',
  시그니처: 'Signature',
  피자: 'Pizza',
  '샐러드/사이드': 'Salad & Sides',
  '음료/주류': 'Drinks',
}

export const menus = {
  신메뉴: [
    {
      id: 101,
      name: '봄나물 비빔밥',
      nameEn: 'Spring Greens Bibimbap',
      desc: '제철 봄나물 7가지로 만든 건강 비빔밥. 고추장 소스 별도.',
      descEn: 'Healthy bibimbap with seven seasonal spring greens. Gochujang served separately.',
      price: 13000,
      emoji: '🥗',
      hot: true,
      isNew: true,
      opts: [{ label: '맵기', labelEn: 'Spice', choices: ['순한맛', '보통', '매운맛'], choicesEn: ['Mild', 'Medium', 'Spicy'] }],
    },
    {
      id: 102,
      name: '한우 국밥',
      nameEn: 'Hanwoo Beef Soup',
      desc: '12시간 우려낸 진한 사골 국물에 한우 수육.',
      descEn: 'Rich 12-hour bone broth with premium beef slices.',
      price: 15000,
      emoji: '🍲',
      isNew: true,
      opts: [{ label: '국물 양', labelEn: 'Broth', choices: ['보통', '넉넉히'], choicesEn: ['Regular', 'Extra'] }],
    },
  ],
  세트: [
    {
      id: 1,
      name: '올데이 세트',
      nameEn: 'All-Day Set',
      desc: '피자+파스타+음료 구성의 합리적인 세트메뉴.',
      descEn: 'Pizza, pasta & drink — great value.',
      price: 34800,
      emoji: '🍱',
      hot: true,
      opts: [
        { label: '파스타', labelEn: 'Pasta', choices: ['까보나라', '토마토', '로제'], choicesEn: ['Carbonara', 'Tomato', 'Rose'] },
        { label: '음료', labelEn: 'Drink', choices: ['콜라', '사이다', '주스'], choicesEn: ['Cola', 'Cider', 'Juice'] },
      ],
    },
    {
      id: 2,
      name: '런치 스페셜',
      nameEn: 'Lunch Special',
      desc: '평일 런치 전용 스테이크+샐러드+음료.',
      descEn: 'Weekday lunch: steak, salad & drink.',
      price: 28000,
      emoji: '🥩',
      opts: [{ label: '굽기', labelEn: 'Doneness', choices: ['미디엄레어', '미디엄', '웰던'], choicesEn: ['Med-rare', 'Medium', 'Well-done'] }],
    },
    {
      id: 3,
      name: '패밀리 세트',
      nameEn: 'Family Set',
      desc: '4인 가족을 위한 피자+파스타2+음료4.',
      descEn: 'For four: pizza, two pastas & four drinks.',
      price: 58000,
      emoji: '🍽️',
      opts: [],
    },
  ],
  시그니처: [
    {
      id: 4,
      name: '시크릿 바베큐 폭립',
      nameEn: 'Secret BBQ Ribs',
      desc: '12시간 마리네이드 후 숯불로 구워낸 폭립.',
      descEn: '12-hour marinade, charcoal grilled.',
      price: 28800,
      emoji: '🥩',
      hot: true,
      opts: [{ label: '사이드', labelEn: 'Side', choices: ['감자튀김', '샐러드', '수프'], choicesEn: ['Fries', 'Salad', 'Soup'] }],
    },
    {
      id: 5,
      name: '큐브 스테이크',
      nameEn: 'Cube Steak',
      desc: '한우 큐브 스테이크, 트러플 소스.',
      descEn: 'Hanwoo cubes with truffle sauce.',
      price: 24800,
      emoji: '🥩',
      opts: [{ label: '굽기', labelEn: 'Doneness', choices: ['미디엄레어', '미디엄', '웰던'], choicesEn: ['Med-rare', 'Medium', 'Well-done'] }],
    },
    {
      id: 6,
      name: '감바스 파스타',
      nameEn: 'Gambas Pasta',
      desc: '마늘 향 오일 소스에 새우와 파스타.',
      descEn: 'Garlic oil pasta with shrimp.',
      price: 11800,
      emoji: '🍝',
      opts: [{ label: '면 종류', labelEn: 'Noodle', choices: ['스파게티', '링귀네', '펜네'], choicesEn: ['Spaghetti', 'Linguine', 'Penne'] }],
    },
    {
      id: 7,
      name: '로제맥체 파스타',
      nameEn: 'Rose Mackerel Pasta',
      desc: '부드러운 로제 소스에 소고기와 버섯.',
      descEn: 'Creamy rose sauce with beef & mushrooms.',
      price: 13800,
      emoji: '🍝',
      hot: true,
      opts: [{ label: '면 종류', labelEn: 'Noodle', choices: ['스파게티', '링귀네'], choicesEn: ['Spaghetti', 'Linguine'] }],
    },
    {
      id: 8,
      name: '트러플 리조또',
      nameEn: 'Truffle Risotto',
      desc: '진한 트러플 향 크리미 리조또.',
      descEn: 'Creamy risotto with rich truffle aroma.',
      price: 18000,
      emoji: '🍚',
      opts: [],
    },
    {
      id: 9,
      name: '갈릭 새우 볶음밥',
      nameEn: 'Garlic Shrimp Fried Rice',
      desc: '탱글한 왕새우와 마늘 볶음밥.',
      descEn: 'Juicy shrimp & garlic fried rice.',
      price: 14000,
      emoji: '🍤',
      opts: [],
    },
  ],
  피자: [
    {
      id: 14,
      name: '마르게리따 피자',
      nameEn: 'Margherita Pizza',
      desc: '모짜렐라와 바질의 클래식 씬 크러스트.',
      descEn: 'Classic thin crust with mozzarella & basil.',
      price: 18000,
      emoji: '🍕',
      opts: [
        { label: '크러스트', labelEn: 'Crust', choices: ['씬', '레귤러', '치즈'], choicesEn: ['Thin', 'Regular', 'Cheese'] },
        { label: '사이즈', labelEn: 'Size', choices: ['M', 'L'], choicesEn: ['M', 'L'] },
      ],
    },
    {
      id: 15,
      name: '포크 BBQ 피자',
      nameEn: 'Pulled Pork BBQ Pizza',
      desc: 'BBQ 소스와 훈제 포크, 양파, 콘.',
      descEn: 'BBQ sauce, smoked pork, onion & corn.',
      price: 21000,
      emoji: '🍕',
      hot: true,
      opts: [{ label: '사이즈', labelEn: 'Size', choices: ['M', 'L'], choicesEn: ['M', 'L'] }],
    },
  ],
  '샐러드/사이드': [
    {
      id: 16,
      name: '시저 샐러드',
      nameEn: 'Caesar Salad',
      desc: '로메인·파마산·크루통.',
      descEn: 'Romaine, parmesan & croutons.',
      price: 9800,
      emoji: '🥗',
      opts: [{ label: '드레싱', labelEn: 'Dressing', choices: ['시저', '발사믹', '허니머스타드'], choicesEn: ['Caesar', 'Balsamic', 'Honey mustard'] }],
    },
    {
      id: 17,
      name: '갈릭 브레드',
      nameEn: 'Garlic Bread',
      desc: '버터와 마늘을 발라 구운 빵.',
      descEn: 'Buttery garlic toasted bread.',
      price: 5500,
      emoji: '🍞',
      opts: [],
    },
    {
      id: 18,
      name: '웨지 감자',
      nameEn: 'Wedge Fries',
      desc: '바삭한 웨지 감자, 케첩 제공.',
      descEn: 'Crispy wedges with ketchup.',
      price: 6000,
      emoji: '🍟',
      opts: [{ label: '소스', labelEn: 'Sauce', choices: ['케첩', '체다치즈', '트러플마요'], choicesEn: ['Ketchup', 'Cheddar', 'Truffle mayo'] }],
    },
  ],
  '음료/주류': [
    {
      id: 19,
      name: '생맥주 500ml',
      nameEn: 'Draft Beer 500ml',
      desc: '시원한 생맥주.',
      descEn: 'Ice-cold draft beer.',
      price: 5500,
      emoji: '🍺',
      opts: [],
    },
    {
      id: 20,
      name: '와인 1잔',
      nameEn: 'Wine (glass)',
      desc: '레드/화이트 중 선택.',
      descEn: 'Red or white.',
      price: 9000,
      emoji: '🍷',
      opts: [{ label: '종류', labelEn: 'Type', choices: ['레드', '화이트'], choicesEn: ['Red', 'White'] }],
    },
    {
      id: 21,
      name: '탄산음료',
      nameEn: 'Soft Drink',
      desc: '콜라, 사이다, 환타 중 선택.',
      descEn: 'Cola, cider or Fanta.',
      price: 3000,
      emoji: '🥤',
      opts: [{ label: '종류', labelEn: 'Flavor', choices: ['콜라', '사이다', '환타'], choicesEn: ['Cola', 'Cider', 'Fanta'] }],
    },
  ],
}

export const allItems = () => Object.values(menus).flat()

export const fmt = n => n.toLocaleString() + '원'

export function itemLabel(item, lang) {
  if (lang === 'en' && item.nameEn) return item.nameEn
  return item.name
}

export function itemDesc(item, lang) {
  if (lang === 'en' && item.descEn) return item.descEn
  return item.desc
}

export function catLabel(catKey, lang) {
  if (lang === 'en' && CAT_EN[catKey]) return CAT_EN[catKey]
  return catKey
}
