export const ROUTE = [
  {
    date: '2026-07-11', day: 'Сб', title: 'Бухарест → Порту', route: 'День прильоту', km: 0, type: 'travel',
    desc: 'Виліт о 16:25, прибуття в Порту о 18:45. Метро Лінія E (Violet) до Trindade, 27 хв, €2.30 (Andante Z4 квиток). Або Uber XL ~€20-25.',
    hl: 'Перший вечір — не поспішай. Francesinha на вечерю.)',
    places: [
      { n: 'Аеропорт Sá Carneiro (OPO)', i: 'Метро лінія E до Trindade — 27 хв, €2.30', m: 'https://maps.app.goo.gl/fAgCmHnMbVTB121q8', stamp: false, secret: false },
      { n: 'Livraria Lello', i: 'Найкрасивіша книгарня світу — квитки €10-16 онлайн.', m: 'https://maps.app.goo.gl/dqg5oepJ2CM1YtT79', stamp: false, secret: true },
      { n: 'Foz do Douro', i: 'Гирло Дору, маяк, форт São João da Foz — перший погляд на океан', m: 'https://maps.google.com/?q=Foz+do+Douro+Porto', stamp: false, secret: false },
      { n: 'Ponte Luís I', i: 'Міст через Дору, верхній рівень веде у Vila Nova de Gaia (винарні)', m: 'https://maps.app.goo.gl/KR4i38yuCVkit5kCA', stamp: false, secret: false },
      { n: 'Igreja do Carmo', i: 'Барокова церква, з’єднана будівлею з церквою-близнюком; популярна завдяки бічному фасаду з мозаїкою.', m: 'https://maps.app.goo.gl/mjovM8xpzWeSxpNc8', stamp: false, secret: true },
      { n: '🍽️ Café Santiago — francesinha', i: 'Класика з 1959. Замовляти з розрахунком, черги. Приходити після 17:00', m: 'https://maps.app.goo.gl/Yb7yTws3A944dMgy6', stamp: false, secret: false },
      { n: '🍽️ Mercado do Bolhão', i: 'Історичний дворівневий ринок у неокласичній будівлі. Спробувати bifana - світліше м\'ясо і тонше тісто.', m: 'https://maps.app.goo.gl/5wNnN7npAir7SLME9', stamp: false, secret: true },
    ],
    albs: [
      { n: 'The Passenger Hostel', p: '€32,5/паломника', b: 'http://www.thepassengerhostel.com/', m: 'https://maps.app.goo.gl/Rb1d5CxoA84iC6AXA', c: 'Проводять 🎸fado-вечори' },
      { n: 'Wine Hostel', p: '€32,5/паломника', b: 'https://www.winehostel.pt/en/', m: 'https://maps.app.goo.gl/Zn4L7qCdgaGQzyXW6', c: 'Найкращих у місті, унікальний wax stamp', stamp: true },
      { n: 'Albergue Peregrinos Porto', p: '€32,5/паломника', b: 'https://albergueperegrinosporto.pt/', m: 'https://maps.app.goo.gl/yCtDPjanBnhahxEg9', c: 'Ночівля 11 і 12 липня тут(ЗАБРОНЬОВАНО)', stamp: true },
    ],
    stamps: [
      { place: 'Albergue Peregrinos Porto', note: 'Штамп при заселенні' }
    ],
    elevation: { up: 0, down: 0 }
  },
  {
    date: '2026-07-12', day: 'Нд', title: 'Порту', route: 'День Credencial', km: 0, type: 'rest',
    desc: 'Головна задача — отримати Credencial у Sé do Porto. Весь день по набережній і пляжах, Matosinhos, Jardins do Palácio de Cristal, Mercado do Bolhão.',
    hl: 'У Livraria Lello купити мушлю Vieira на рюкзак у Sé — €2-5.',
    places: [
      { n: 'Sé do Porto', i: 'Відкрито 9:00-18:30. Credencial €2. Каса — біля входу до клуатру праворуч. Перший штамп тут!', m: 'https://maps.google.com/?q=Sé+do+Porto+Catedral', stamp: true, secret: false },
      { n: 'Livraria Lello', i: 'Найкрасивіша книгарня, надихнула Роулінг. Квитки €10-16 онлайн на livrarialello.pt', m: 'https://maps.google.com/?q=Livraria+Lello+Porto', stamp: false, secret: true },
      { n: 'Matosinhos', i: 'Рибальський порт, sardinhas grelhadas на вулиці €10-15', m: 'https://maps.google.com/?q=Matosinhos', stamp: false, secret: false },
      { n: 'Jardim do Morro', i: 'Сади з панорамою і заходом сонця', m: 'https://maps.app.goo.gl/XghU16RwE1sFASDP6', stamp: false, secret: true },
      { n: 'Jardins do Palácio de Cristal', i: 'Павичі гуляють вільно! Краєвиди на Дору, безкоштовно', m: 'https://maps.google.com/?q=Jardins+Palácio+Cristal+Porto', stamp: false, secret: true },
      { n: 'Mercado do Bolhão', i: 'сторичний дворівневий ринок у неокласичній будівлі. Свіжа риба, оливки, bifana €3-4. Закритий неділю!', m: 'https://maps.google.com/?q=Mercado+Bolhão+Porto', stamp: false, secret: false },
      { n: 'São Bento Station', i: 'Станція. Синє кахельне панно azulejos — безкоштовно, по дорозі', m: 'https://maps.google.com/?q=São+Bento+Porto', stamp: false, secret: false },
      { n: 'Torre dos Clérigos', i: 'Церква, 240 сходинок, найкращий краєвид на місто, €8', m: 'https://maps.google.com/?q=Torre+Clérigos+Porto', stamp: false, secret: true },
      { n: 'Vila Nova de Gaia', i: "Винарні Graham's 1890 (€30-40), Sandeman з костюмами — міст Dom Luís I по верхньому рівню", m: 'https://maps.google.com/?q=Vila+Nova+de+Gaia+wine', stamp: false, secret: false },
      { n: 'Miradouro da Vitória', i: 'Захований у єврейському кварталі, краєвид кращий за Serra do Pilar. Безкоштовно, найкращий захід сонця', m: 'https://maps.google.com/?q=Miradouro+da+Vitória+Porto', stamp: false, secret: true },
      { n: '🍽️ Restaurante Conga Casa das Bifanas', i: 'Спробувати Bifana', m: 'https://maps.app.goo.gl/vfieq5XEWi4exBr89', stamp: false, secret: true },
      { n: 'Jardim das Virtudes', i: 'Терасований сад на схилі, локали з vinho verde на закат', m: 'https://maps.google.com/?q=Jardim+das+Virtudes+Porto', stamp: false, secret: true },
    ],
    albs: [
      { n: 'The Passenger Hostel', p: '€32,5/паломника', b: 'http://www.thepassengerhostel.com/', m: 'https://maps.app.goo.gl/Rb1d5CxoA84iC6AXA', c: 'Проводять 🎸fado-вечори' },
      { n: 'Wine Hostel', p: '€32,5/паломника', b: 'https://www.winehostel.pt/en/', m: 'https://maps.app.goo.gl/Zn4L7qCdgaGQzyXW6', c: 'Найкращих у місті, унікальний wax stamp', stamp: true },
      { n: 'Albergue Peregrinos Porto', p: '€32,5/паломника', b: 'https://albergueperegrinosporto.pt/', m: 'https://maps.app.goo.gl/yCtDPjanBnhahxEg9', c: 'Ночівля 11 і 12 липня тут(ЗАБРОНЬОВАНО)' },
    ],
    stamps: [
      { place: 'Igreja Paroquial de Santo Ildefonso', note: 'Штамп із зображенням азулежу' },
      { place: 'Sé do Porto', note: 'Кафедральний собор, Перший штамп Камінó! Видають Credencial (€2) + печатку' },
    ],
    elevation: { up: 50, down: 50 }
  },
  {
    date: '2026-07-13', day: 'Пн', title: 'Porto → Vila do Conde', route: '🚶 СТАРТ! Senda Litoral', km: 28, type: 'walking',
    desc: "Старт від Sé о 6:30. Весь день по набережній і пляжах Matosinhos. Через passadiços (дерев'яний настил над дюнами) → Mindelo → Costa → Vila do Conde. Промзону Leixões наполегливо рекомендується проїхати на метро (лінія A) до Matosinhos Mercado.",
    hl: '⚡ Лайфхак: промзону Leixões можна проїхати метро лінією A до Matosinhos Mercado. Це прийнятно для компанії.',
    places: [
      { n: 'Foz do Douro', i: 'Старт маршруту. Маяк, Форт São João да Foz', m: 'https://maps.google.com/?q=Foz+do+Douro+lighthouse', stamp: false, secret: false },
      { n: 'Castelo do Queijo', i: 'Фортеця на березі океану. Поруч - Praia do Seixo (дикий пляж) і Farol de Felgueiras (маяк). Чудове місце для початку шляху.', m: 'https://maps.app.goo.gl/7HVBLLmNNtoBJnqx7', stamp: true, secret: false },
      { n: 'Cividade de Terroso', i: 'Бронзове/залізне поселення, один з найкращих castros Португалії', m: 'https://maps.app.goo.gl/jKwD7p7nC4R3qbq58', stamp: false, secret: false },
      { n: 'Praia de Mindelo', i: 'Тихий пляж', m: 'https://maps.app.goo.gl/QUkyYuoH6MhKyUPZ8', stamp: false, secret: false },
      { n: '🍽️ Matosinhos - Rua Heróis de França', i: 'Рибу на грилі просто на тротуарі €10-15, рибальський порт', m: 'https://maps.google.com/?q=Matosinhos', stamp: false, secret: false },
      { n: 'Leça da Palmeira', i: 'Модерністські океанські басейни легендарного архітектора Альваро Сізи, архітектурна мекка', m: 'https://maps.google.com/?q=Piscina+Marés+Leça+da+Palmeira', stamp: false, secret: true },
      { n: 'Castro de São Paio', i: 'Кельтське морське поселення прямо на маршруті, мало хто знає', m: 'https://maps.google.com/?q=Castro+de+São+Paio+Vila+do+Conde', stamp: false, secret: true },
      { n: 'Igreja e Mosteiro de Santa Clara', i: 'Монастир XIV ст. — рідкісна готична печатка', m: 'https://maps.google.com/?q=Mosteiro+Santa+Clara+Vila+do+Conde', stamp: true, secret: false },
      { n: 'Aqueduto de Santa Clara', i: '999 арок, 4 км. Секретний ракурс: дивитися на церкву крізь арки', m: 'https://maps.google.com/?q=Aqueduto+Santa+Clara+Vila+do+Conde', stamp: false, secret: true },
      { n: 'Nau Quinhentista', i: 'Діюча репліка корабля XVI ст. — унікальна морська печатка, символ Великих відкриттів', m: 'https://maps.google.com/?q=Nau+Quinhentista+Vila+do+Conde', stamp: true, secret: false },
      { n: 'Castro de São Paio + Centro de Interpretação', i: "Залізновікове (кельтське) прибережне поселення V–I ст. до н.е. + сучасний центр інтерпретації. Дуже мало паломників заходять всередину. Обов'язково!", m: 'https://maps.google.com/?q=Castro+de+São+Paio+Vila+do+Conde', stamp: false, secret: true },
      { n: 'Capela de São Paio', i: 'Маленька капличка над Castro — гарний вид і спокійне місце', m: 'https://maps.google.com/?q=Capela+de+São+Paio+Labruge', stamp: false, secret: true },
      { n: '🍽️ Lampião', i: 'Популярний локальний детур для кави та сніданку/обіду серед місцевих. Смачно і недорого', m: 'https://maps.google.com/?q=Lampi%C3%A3o+Vila+do+Conde', stamp: false, secret: false },
    ],
    albs: [
      { n: 'Albergue de Peregrinos do Mosteiro de Vairão', p: '€15/паломника', b: 'https://mosteirodevairao.blogspot.com/', m: 'https://maps.app.goo.gl/KzQLHniwY8ut3eAu5', c: 'В монастирі' },
      { n: 'Albergue de Peregrinos São José de Ribamar', p: '€15/паломника', b: 'https://www.alberguescaminosantiago.com/camino-portugues-por-la-costa/albergue-peregrinos-povoa-de-varzim/', m: 'https://maps.app.goo.gl/RMPZGymJkSvGbVbV7' },
      { n: 'Pousada de Juventude Vila do Conde', p: '€56 за 4-місну кімнату', b: 'https://www.pousadasjuventude.pt/pt/pousadas/pousada-de-vila-do-conde/', m: 'https://maps.app.goo.gl/pVxiECVHUio7PtGx5', c: '⭐ Ідеально для компанії, комфортне' },
    ],
    stamps: [
      { place: 'Mosteiro de Santa Clara', note: 'Монастир XIV ст. — рідкісна готична печатка' },
      { place: 'Nau Quinhentista', note: 'Морська печатка — символ Великих відкриттів' },
    ],
    elevation: { up: 150, down: 140 }
  },
  {
    date: '2026-07-14', day: 'Вт', title: 'Vila do Conde → Esposende', route: '🚶 Boardwalk через дюни', km: 23, type: 'walking',
    desc: 'Boardwalk вздовж пляжів, частково по берегу. A Ver-o-Mar → Aguçadoura → Apúlia → passadiços над дюнами → Esposende.',
    hl: 'Секрет: Moinhos de Apúlia — старі вітряні млини серед дюн. Унікальна фотозона!',
    places: [
      { n: 'Moinhos de Apúlia', i: 'Старі вітряні млини серед дюн — мало хто знає, відмінне фото', m: 'https://maps.google.com/?q=Moinhos+de+Apúlia', stamp: false, secret: true },
      { n: 'Bairro da Pesqueira', i: 'Рибальський квартал. Там продають штампи-наліпка з місцевою символікою "Siglas Poveiras', m: 'https://maps.app.goo.gl/Sm11QHhNcaTL5DPX9', stamp: true, secret: true },
      { n: 'Igreja Matriz de Esposende', i: 'Барокова церква в центрі — маленькі міста дають найколоритніші печатки', m: 'https://maps.google.com/?q=Igreja+Matriz+Esposende', stamp: true, secret: false },
      { n: 'Aqueduto de Santa Clara (Vila do Conde)', i: '999 арок по дорозі', m: 'https://maps.google.com/?q=Aqueduto+Santa+Clara+Vila+do+Conde', stamp: false, secret: false },
      { n: '🍽️ Diversus - Cafe & Snacks', i: 'Тости, креветки, рекомендація від поломників⭐', m: 'https://maps.app.goo.gl/oE9w93v3Vw4ULe4s5', stamp: false, secret: false },
      { n: 'Forte de São João Baptista', i: 'Океанський форт XVII ст.', m: 'https://maps.google.com/?q=Forte+São+João+Esposende', stamp: false, secret: false },
    ],
    albs: [
      { n: 'Albergue de Peregrinos de Marinhas', p: '€15/паломника', b: 'https://www.viaveteris.pt/', m: 'https://maps.app.goo.gl/oA78VugY6eNwwK9b9' },
      { n: 'InnEsposende Sports Hostel', p: '€14+/€37+ кімната', b: 'https://www.innesposende.com/', m: 'https://maps.app.goo.gl/3UNxL4wVthtoqafNA', c: 'З басейном' },
    ],
    stamps: [
      { place: 'Igreja Matriz de Esposende', note: 'Маленькі міста — найколоритніші бароко печатки!' }
    ],
    elevation: { up: 120, down: 120 }
  },
  {
    date: '2026-07-15', day: 'Ср', title: 'Esposende → Viana do Castelo', route: '🚶 Маршрут вглиб країни', km: 25, type: 'walking',
    desc: "Маршрут іде внутрь країни. Marinhas → Belinho → Antas → перехід річки Neiva по кам'яних плитах БЕЗ ПЕРИЛ → Anha → Darque → Viana do Castelo.",
    hl: "⭐ Перехід річки Neiva по кам'яних плитах без перил — легендарний найфотогенічніший момент Camino! Взяти воду на весь день — повністю внутрішній маршрут.",
    places: [
      { n: 'Перехід річки Neiva (passadeira)', i: "Кам'яні плити без перил — must-фото!", m: 'https://maps.google.com/?q=Rio+Neiva+passadeira+Camino', stamp: false, secret: true },
      { n: 'Monte Sta Luzia — Basílica de Santa Luzia', i: 'Фунікулер €3 (8:00-20:00), нео-візантійська базиліка 1903, National Geographic назвав один з найкращих краєвидів Португалії', m: 'https://maps.google.com/?q=Monte+Santa+Luzia+Viana', stamp: true, secret: true },
      { n: 'Santuário do Sagrado Coração de Jesus', i: 'Вид на місто і океан — одна з найкрасивіших зупинок', m: 'https://maps.google.com/?q=Santuário+Sagrado+Coração+Viana', stamp: true, secret: false },
      { n: 'Capela de Santo Amaro', i: 'Маленька каплиця 1658 з елементами майоліки та неймовірним видом на річку Ліма. Справжня перлина!', m: 'https://maps.app.goo.gl/rjFWgbrG5Dmoed2N8', stamp: true, secret: false },
      { n: 'Câmara Municipal', i: 'Офіційна печатка з гербом міста в мерії', m: 'https://maps.google.com/?q=Câmara+Municipal+Viana+do+Castelo', stamp: true, secret: false },
      { n: 'Navio-Hospital Gil Eannes', i: 'Корабель-музей, ходив у Гренландію за тріскою.', m: 'https://maps.google.com/?q=Gil+Eannes+Viana', stamp: false, secret: false },
      { n: 'The Umbrellas Street', i: 'Яскрава вулиця з парасольками', m: 'https://maps.app.goo.gl/PBg4D2ne2FRihDXQ8', stamp: false, secret: false },
      { n: '🍽️ Tasquinha da Linda', i: 'Преміальні морепродукти в порту', m: 'https://maps.app.goo.gl/NXH78mWLtRmkahKs9', stamp: false, secret: false },
      { n: '🍽️ Lampião Caffé', i: 'Кумедне місце з купою меморабільї', m: 'https://maps.app.goo.gl/pG3oKRFG2GvmxJpS8', stamp: false, secret: true },
      { n: 'Citânia de Santa Luzia', i: 'Залізновіковий castro VII ст. до н.е. поруч з базилікою', m: 'https://maps.google.com/?q=Citânia+Santa+Luzia+Viana', stamp: false, secret: true },
    ],
    albs: [
      { n: 'Albergue S. João dos Caminhos', p: '€15/паломника', b: 'https://viana.carmelitas.pt/?page_id=158', m: 'https://maps.app.goo.gl/dq92pDpd5zJyzvJE8', c: 'У церкві' },
      { n: 'Albergue de Santa Luzia', p: '€20/паломника', b: 'https://confrariadesantaluzia.pt/', m: 'https://maps.app.goo.gl/1kjixMaEuU8dPynp7', c: '⭐ Неймовірні краєвиди, кухня, washing machine; топ-рекомендація для sunset' },
      { n: 'Pousada de Juventude', p: '€44+ дабл, зі сніданком', b: 'https://www.pousadasjuventude.pt/pt/pousadas/pousada-de-viana-do-castelo/', m: 'https://maps.app.goo.gl/UF1b3BtsXbL5nNbZ6', c: '' },
    ],
    stamps: [
      { place: 'Santuário de Santa Luzia (Monte)', note: 'Вид на місто і океан — краєвид National Geographic, дуже деталізований великий штамп' },
      { place: 'Capela de Santo Amaro', note: 'Справжня перлина!' },
      { place: 'Câmara Municipal (мерія)', note: 'Офіційна печатка з гербом міста' },
    ],
    elevation: { up: 220, down: 210 }
  },
  {
    date: '2026-07-16', day: 'Чт', title: 'Viana do Castelo → Caminha', route: '🚶 До кордону', km: 27, type: 'walking',
    desc: 'Короткі виходи у Vila Praia de Âncora. Areosa → Carreço → Afife → Moledo → Mata Nacional do Camarido → Caminha.',
    hl: 'З причалу Caminha відкривається найкраща точка фото на заході сонця — Monte de Santa Tegra підсвічена сонцем, річка Мінью попереду. ПАРОМ В ІСПАНІЮ ЗВІДСИ!',
    places: [
      { n: 'Santuário de Santa Luzia (вид з дороги)', i: 'По дорозі видно базиліку на горі', m: 'https://maps.google.com/?q=Santuário+Santa+Luzia+Viana', stamp: false, secret: false },
      { n: 'Praia de Moledo', i: 'Один з найкрасивіших пляжів Португалії, вид на Santa Tegra в Іспанії', m: 'https://maps.google.com/?q=Praia+de+Moledo', stamp: false, secret: false },
      { n: 'Mata Nacional do Camarido', i: 'Тінистий сосновий ліс уздовж океану — блаженство після Coastal', m: 'https://maps.google.com/?q=Mata+Nacional+do+Camarido', stamp: false, secret: false },
      { n: 'Anta da Barrosa', i: 'Мегаліт (дольмен) якому 5000 років', m: 'https://maps.app.goo.gl/wK6h7FwyzeNzQJAy9', stamp: false, secret: false },
      { n: 'Caminha Main Church (Igreja Matriz)', i: 'XV ст., стеля mudéjar — XV вік прямо на площі з фонтаном', m: 'https://maps.google.com/?q=Igreja+Matriz+Caminha', stamp: true, secret: false },
      { n: 'Chafariz de Caminha', i: 'Фонтан на середньовічній площі', m: 'https://maps.app.goo.gl/k684uDyu3zGVMzUu6', stamp: false, secret: false },
      { n: '🛥️ Паромна компанія Xacobeo Transfer', i: 'Попросити печатку перед поромом! Рідкісна. xacobeotransfer.com, WhatsApp +34 613 011 226', m: 'https://maps.google.com/?q=Caminha+ferry+pier', stamp: true, secret: true },
      { n: 'Forte de São João Baptista', i: 'XVII ст. форт на океані в Caminha. Гарний вид і історичне місце', m: 'https://maps.google.com/?q=Forte+de+São+João+Baptista+Caminha', stamp: false, secret: false },
      { n: '🛥️ Поїздка на човні до острова Ilha da Ínsua', i: 'Можна домовитись з місцевими рибалками або через туристичний офіс. Дуже атмосферно', m: 'https://maps.google.com/?q=Ilha+da+Ínsua+Caminha', stamp: false, secret: true },
      { n: '🍽️ Amandio Restaurante', i: 'Locals рекомендують', m: 'https://maps.app.goo.gl/Tacd8svqJ9XANvie6', stamp: false, secret: false },
    ],
    albs: [
      { n: 'Albergue de Peregrinos Santiago de Caminha', p: '€15/паломника', b: 'https://www.booking.com/Share-PPxPBEo', m: 'https://maps.app.goo.gl/m13j2rS1jSVrc6Xv5A', c: 'Біля океану, БЕЗ бронювання — приходити до 15:00!' },
      { n: 'Albergue Bom Caminha', p: '€16-17 дорм', b: 'https://www.booking.com/Share-lv5fip', m: 'https://maps.app.goo.gl/JnYZEufi1TtENu376' },
    ],
    stamps: [
      { place: 'Café Central', note: 'Колекційні штампи', m: 'https://maps.app.goo.gl/thFoddB9w3haJAoj7' },
      { place: 'Caminha Main Church', note: 'XV ст. — прямо на площі з фонтаном', m: 'https://maps.app.goo.gl/qRvy7pWdtyR221N47' },
      { place: '🛥️ Паромна компанія Xacobeo Transfer', note: 'Паром через Мінью — рідкісна печатка! Просити перед посадкою' },
    ],
    elevation: { up: 180, down: 180 }
  },
  {
    date: '2026-07-17', day: 'Пт', title: 'Caminha → A Guarda → Baiona', route: '🛥️ ПОРОМ + Іспанія!', km: 22, type: 'walking-hard',
    desc: 'НАЙВАЖЧИЙ ДЕНЬ! Старт о 5:30! Пором через устя Мінью → A Guarda (Іспанія!) → скелясте узбережжя Галісії → Mosteiro de Oia → Baiona. Найкрасивіший відрізок маршруту!',
    hl: '🛥️ XACOBEO TRANSFER: €6/паломника. Розклад 2026: з Caminha 7:30–16:30 (кожні 30–60 хв). Бронювати на xacobeotransfer.com',
    places: [
      { n: '🛥️ Xacobeo Transfer', i: 'Пором €6/паломника. Капітани Miguel і Federico. Бронювати заздалегідь! Прибуття Camposancos → 6.8 км Blue Path до A Guarda', m: 'https://maps.google.com/?q=Caminha+ferry+A+Guarda', stamp: false, secret: false },
      { n: 'Castro de Santa Tegra', i: 'Кельто-римське городище II ст. до н.е., 100+ хатин, петрогліфи. Найвидатніший castro Галісії. Галісійський "Мачу-Пікчу" Вхід €1.50', m: 'https://maps.google.com/?q=Castro+Santa+Tegra+A+Guarda', stamp: true, secret: true },
      { n: 'Mosteiro de Santa María de Oia', i: 'Єдиний цистерціанський монастир Європи прямо біля океану (1137). У 1624 ченці-артилеристи відбили турецьких піратів!', m: 'https://maps.google.com/?q=Mosteiro+Santa+María+Oia', stamp: true, secret: true },
      { n: 'Praia América', i: 'Найкрасивіший пляж Галісії на маршруті', m: 'https://maps.google.com/?q=Praia+América+Nigrán', stamp: false, secret: false },
      { n: 'Fortaleza de Monterreal (Baiona)', i: 'Фортечні стіни на півострові, 3 км безкоштовно, вхід €1. Тут тепер Parador 5*', m: 'https://maps.google.com/?q=Fortaleza+Monterreal+Baiona', stamp: true, secret: false },
      { n: 'Réplica da Carabela La Pinta', i: 'Точна копія корабля Колумба, що ПЕРШИМ приніс звістку про відкриття Америки в Європу 1.03.1493! Музей €2-3', m: 'https://maps.google.com/?q=Carabela+La+Pinta+Baiona', stamp: true, secret: true },
      { n: 'Virgen de la Roca', i: 'Гігантська статуя Діви Марії (15 м) на скелі з човном у руці. Вид на океан і Baiona — один з найкращих на всьому маршруті!', m: 'https://maps.google.com/?q=Virgen+de+la+Roca+Baiona', stamp: false, secret: true },
      { n: 'Monteferro Peninsula', i: 'Півострів з фантастичним видом на острови Cíes. Мало хто з паломників доходить. Дикий, вітряний, дуже красивий', m: 'https://maps.google.com/?q=Monteferro+Baiona', stamp: false, secret: true },
    ],
    albs: [
      { n: 'Public Pilgrims Hostel of A Guarda', p: '€10/паломника (якщо зупинка в A Guarda)', b: 'https://www.alberguescaminosantiago.com/camino-portugues-por-la-costa/albergue-peregrinos-a-guarda/', m: 'https://maps.app.goo.gl/yaq9DpGZ7EcTcNuQ7', type: 'municipal', c: 'Жива черга, не бронюється. Приходити до 14:00' },
      { n: 'Albergue Playa de Sabarís', p: '€15/паломника', b: 'https://www.alberguescaminosantiago.com/camino-portugues-por-la-costa/albergue-playa-de-sabaris-baiona/', m: 'https://maps.app.goo.gl/NYyhYdF7SVxgiJURA' },
      { n: 'Albergue Estela do Mar', p: '€18/паломника', b: 'https://esteladomar.com/', m: 'https://maps.app.goo.gl/jtrM1JZMUd9miS8J9', c: 'На березі' },
    ],
    stamps: [
      { place: 'Castro de Santa Tegra', note: 'Кельтське городище — екзотична печатка!' },
      { place: 'Mosteiro de Oia', note: 'Монастир XII ст. біля океану' },
      { place: 'Castelo de Monterreal', note: 'У фортеці', m: 'https://maps.app.goo.gl/3TR5Rsvvhdfbxk2n8' },
      { place: 'Réplica La Pinta', note: 'Копія корабля Колумба — така печатка є тільки тут в усьому світі!' },
    ],
    elevation: { up: 400, down: 390 }
  },
  {
    date: '2026-07-18', day: 'Сб', title: 'Baiona → Vigo', route: '🚶 Початок останніх 100 км', km: 22, type: 'walking',
    desc: 'Маршрут частково іде вглиб країни. Senda da Foz через пляжі Praia América, Patos, Samil — рекомендується літоральний варіант, найкрасивіший. Ponte Romana da Ramallosa. Не йдіть через промисловий порт Віго. Тримайтеся маршруту Senda del Agua — це стежка з видами на затоку (Ria de Vigo). ⚠️ Попередження: на цій ділянці (Senda del Agua) відчутна нестача джерел питної води. Обов\'язково мати із собою запас води мінімум 1.5 л зранку!',
    hl: 'З цього моменту — останні 100 км! Потрібно тепер 2 штампи/день для Compostela.',
    places: [
      { n: 'Basílica de Santa María la Mayor (Vigo)', i: 'Важлива відмітка — початок останніх 100 км для Compostela', m: 'https://maps.google.com/?q=Concatedral+Santa+María+Vigo', stamp: true, secret: false },
      { n: 'Senda del Agua', i: 'Стежка з видами на затоку (Ria de Vigo)', m: 'https://maps.app.goo.gl/15RP53fJtx6QuS1h6', stamp: false, secret: false },
      { n: 'Senda da Foz', i: 'Через пляжі Praia América, Patos, Samil — найкрасивіше, літоральний шлях', m: 'https://maps.google.com/?q=Senda+da+Foz+Vigo', stamp: false, secret: false },
      { n: 'Monte O Castro', i: 'Замок на вершині', m: 'https://maps.app.goo.gl/A2nPDQwo7gdwPU9C6', stamp: false, secret: false },
      { n: '🍽️ Устриці на Сalle de las ostras', i: 'Ціла вулиця, €1 за устрицю🦪, відкривають при тобі. Місцева традиція, мало туристів знає', m: 'https://maps.app.goo.gl/6RZiWeMCkepGBjzQ6', stamp: false, secret: true },
      { n: 'Viaduto de Redondela', i: 'Величезний залізничний віадук — архітектурна ікона міста', m: 'https://maps.google.com/?q=Viaduto+Redondela', stamp: false, secret: false },
    ],
    albs: [
      { n: 'R4 Vigo Hostel', p: '€10/паломника', b: 'https://maps.google.com/?q=Albergue+Peregrinos+Vigo', m: 'https://maps.app.goo.gl/EppV4ujM28vVSmhh6', c: 'красиве історичне місце біля церкви' },
      { n: 'Albergue Publico de Peregrinos de Vigo', p: '€15/паломника', b: 'https://www.alberguescaminosantiago.com/camino-portugues-por-la-costa/albergue-peregrinos-vigo/', m: 'https://maps.app.goo.gl/6Ceupq4kyS1sY1c68', type: 'municipal', c: 'Жива черга, не бронюється. Приходити до 14:00' },
    ],
    stamps: [
      { place: 'Basílica de Santa María la Mayor', note: '⚠️ З цього моменту — 2 штампи на день!' },
      { place: 'Будь-яке кафе на маршруті', note: '2-й щоденний штамп' },
    ],
    elevation: { up: 350, down: 350 }
  },
  {
    date: '2026-07-19', day: 'Нд', title: 'Vigo → Redondela', route: "🚶 З'єднання маршрутів", km: 14, type: 'walking-easy',
    desc: 'Ліси, села. Senda da Traída das Augas — лісова стежка вздовж старого водогону з панорамою на ria de Vigo. Короткий легкий день. ⚠️ Попередження: на цій ділянці (Senda del Agua) відчутна нестача джерел питної води. Обов\'язково мати із собою запас води мінімум 1.5 л зранку!',
    hl: 'Redondela = злиття Coastal і Central маршрутів. Тепер значно більше паломників!',
    places: [
      { n: 'Viaduto de Pontevedra (Viaducto Redondela)', i: 'Залізничний віадук — архітектурна домінанта Redondela', m: 'https://maps.google.com/?q=Viaduto+Pontevedra+Redondela', stamp: false, secret: false },
      { n: 'Alameda Castelao', i: 'Красива прогулянкова вулиця в центрі', m: 'https://maps.google.com/?q=Alameda+Castelao+Redondela', stamp: false, secret: false },
      { n: 'Igrexa de Santiago de Redondela', i: 'Злиття Прибережного і Центрального маршрутів — важлива точка', m: 'https://maps.google.com/?q=Igrexa+Santiago+Redondela', stamp: true, secret: false },
      { n: 'Albergue O Refuxio da Jeruxa', i: 'Donativo, господарі співають для паломників — найтепліший прийом маршруту', m: 'https://maps.google.com/?q=Albergue+O+Refuxio+da+Jeruxa+Redondela', stamp: false, secret: true },
    ],
    albs: [
      { n: "Albergue de peregrinos Casa da Torre (Xunta)", p: '€15/паломника', b: 'https://www.alberguescaminosantiago.com/camino-portugues/albergue-de-peregrinos-de-redondela/', m: 'https://maps.app.goo.gl/i2EYWJSnxAfsJPF76', type: 'municipal', c: "Стара кам'яна вежа в центрі, 50 ліжок. Жива черга, не бронюється. Приходити до 14:00" },
      { n: 'O Refuxio de la Jerezana', p: '€5-10 пожертва', b: 'https://orefuxio.org/en/home/', m: 'https://maps.app.goo.gl/QMLcKaiPgksKse247' },
      { n: "O Refuxio D'Anton", p: '€5-10 пожертва', b: 'https://menuyvinos.com/orefuxio/', m: 'https://maps.app.goo.gl/bmBpAhkC5Zgy171J7', c: 'Найтепліший прийом' },
    ],
    stamps: [{ place: 'Igrexa de Santiago de Redondela', note: 'Злиття Coastal і Central маршрутів' }],
    elevation: { up: 200, down: 220 }
  },
  {
    date: '2026-07-20', day: 'Пн', title: 'Redondela → Pontevedra', route: '🚶 Через Arcade з мідіями', km: 18, type: 'walking',
    desc: 'Ліси, села. Через Arcade (10 км) — знаменита своїми мідіями! Обідня зупинка: mejillones al vapor €6-8, pulpo a feira €12. Ponte Sampaio (битва 1809).',
    hl: 'Pontevedra — Igrexa Peregrina у формі мушлі! Єдина в Іспанії церква у плані у вигляді гребінця-мушлі Якова. Меса для паломників щодня 19:30.',
    places: [
      { n: '🍽️ Taberna A Pulpeira de Arcade', i: 'Мідії €6-8, pulpo a feira €12 — місцеві приходять обідати, не туристична', m: 'https://maps.google.com/?q=Pulpeira+Arcade', stamp: false, secret: true },
      { n: 'Santuario de la Virgen Peregrina', i: 'Каплиця', m: 'https://maps.app.goo.gl/gr3rL11WkXBhmrLb8', stamp: false, secret: true },
      { n: 'Ponte do Burgo', i: 'Середньовічний міст через Лерес', m: 'https://maps.google.com/?q=Ponte+do+Burgo+Pontevedra', stamp: false, secret: false },
      { n: '🍽️ Plaza da Leña', i: 'Найкращі тапас-бари: Loaira, O Pulpeiro', m: 'https://maps.google.com/?q=Praza+da+Leña+Pontevedra', stamp: false, secret: false },
      { n: '🍽️ Casa Fidel OPulpeiro', i: 'Найкраща восьминіг (Pulpo a la Gallega) на маршруті', m: 'https://maps.app.goo.gl/QhSURfyB1mo7Gwf68', stamp: false, secret: false },
      { n: 'Iglesia de Santa María la Mayor (Pontevedra)', i: 'Красивіша готика Галісії', m: 'https://maps.google.com/?q=Iglesia+Santa+María+Pontevedra', stamp: false, secret: false },
      { n: 'Igrexa da Virxe Peregrina', i: 'XVIII ст. — ЄДИНА в Іспанії церква у формі мушлі Якова! Меса для паломників 19:30', m: 'https://maps.google.com/?q=Igrexa+Virxe+Peregrina+Pontevedra', stamp: true, secret: true },
    ],
    albs: [
      { n: 'ACOLÁ hostel', p: '€15-25 ліжко / €55-110 кімната', b: 'https://acolahostel.com/', m: 'https://maps.app.goo.gl/nE9dgoyWdMzyBAsP6', c: '⭐ Приватніше для компанії' },
      { n: 'Albergue público Virxe Peregrina', p: '€10/паломника', b: 'https://www.alberguescaminosantiago.com/camino-portugues/albergue-de-peregrinos-de-pontevedra/', m: 'https://maps.app.goo.gl/drf9iPX17miJBMfo9', type: 'municipal', c: '56-86 ліжок, без бронювання. Жива черга, не бронюється. Приходити до 14:00' },
    ],
    stamps: [
      { place: 'Igrexa da Virxe Peregrina', note: 'Церква має форму мушлі гребінця. Штамп унікальний — круглої форми з символом паломниці. Меса 19:30.' },
      { place: 'Будь-яке кафе чи церква', note: '2-й щоденний штамп' },
    ],
    elevation: { up: 320, down: 310 }
  },
  {
    date: '2026-07-21', day: 'Вт', title: 'Pontevedra → Caldas de Reis', route: '🚶 Виноградники Albariño', km: 19, type: 'walking',
    desc: 'Ліси, села. Виноградники Albariño на гранітних pergolas, евкаліптові ліси, річки.',
    hl: 'Caldas de Reis = "Гарячі джерела королів". Fonte das Burgas — БЕЗКОШТОВНІ гарячі джерела просто на вулиці, вода 40-50°C. Замочити ноги 20 хв = рай!',
    places: [
      { n: 'Iglesia de Santo Tomás Becket', i: 'ЄДИНА церква в Галісії, присвячена Томасу Бекету', m: 'https://maps.google.com/?q=Iglesia+Santo+Tomás+Caldas+de+Reis', stamp: true, secret: true },
      { n: 'Fonte das Burgas', i: 'БЕЗКОШТОВНІ гарячі джерела на вулиці! Вода 40-50°C — попросити печатку в альберге біля джерела', m: 'https://maps.google.com/?q=Fonte+das+Burgas+Caldas+de+Reis', stamp: true, secret: true },
      { n: 'Середньовічний міст Caldas', i: 'Поряд з альберге', m: 'https://maps.google.com/?q=Caldas+de+Reis+medieval+bridge', stamp: false, secret: false },
      { n: '🏰 Castelo de Soutomaior (детур)', i: 'Красивий середньовічний замок + чудові камелії в саду. 10–12 км в обидві сторони від маршруту, але дуже варте для тих, хто любить історію', m: 'https://maps.google.com/?q=Castelo+de+Soutomaior', stamp: false, secret: true },
    ],
    albs: [
      { n: 'Albergue Público de Peregrinos de Caldas de Reis', p: '€15/паломника', b: 'https://www.roomreserve.online/es/albergue-de-caldas-de-reis-urraca-caldas-de-reis/', m: 'https://maps.app.goo.gl/vNePZsTgTY6bneLv6', type: 'municipal', c: 'Біля мосту, 80 ліжок. Жива черга, не бронюється. Приходити до 14:00' },
      { n: 'Hotel O Cruceiro', p: '€10', b: 'https://www.hotelcruceiro.com/', m: 'https://maps.app.goo.gl/wAxpjKcuhH1FQTcp9', c: 'З басейном' },
      { n: 'ALBERGUE de Caldas de Reis URRACA', p: '€15', b: 'https://www.google.com/maps/place/ALBERGUE+de+Caldas+de+Reis+URRACA', m: 'https://www.google.com/maps/place/ALBERGUE+de+Caldas+de+Reis+URRACA' },
    ],
    stamps: [
      { place: 'Fonte das Burgas', note: 'Попросити печатку в альберге — особлива!' },
      { place: 'Iglesia de Santo Tomé', note: 'Єдина в Галісії церква — Томас Бекет' },
    ],
    elevation: { up: 210, down: 190 }
  },
  {
    date: '2026-07-22', day: 'Ср', title: 'Caldas → Padrón', route: '🚶 Дім легенди', km: 19, type: 'walking',
    desc: "Ліси, села. Річкові долини, кам'яні hórreos (зерносховища на ніжках). Передостанній день перед Сантьяго.",
    hl: 'Padrón — під вівтарем Igrexa de Santiago знаходиться PEDRÓN — камінь до якого пришвартувався човен з тілом Якова з Єрусалима. Звідси назва міста! Padrón peppers — лотерея гострих перчиків.',
    places: [
      { n: 'Iglesia de Santiago de Padrón', i: 'Під вівтарем — камінь Pedrón. ГОЛОВНА ЛЕГЕНДА Камінó! Одна з найголовніших печаток всього шляху.', m: 'https://maps.google.com/?q=Iglesia+Santiago+Padrón', stamp: true, secret: false },
      { n: 'Iglesia de Santiago Apóstol de Padrón', i: 'Церква де під вівтарем лежить "El Pedrón" — камінь, до якого за легендою пришвартували човен з тілом Апостола Якова.', m: 'https://maps.app.goo.gl/NpEvXLgSuT2EuYUy7', stamp: false, secret: false },
      { n: 'Santiaguiño do Monte', i: 'Маленьке місце паломників, мало хто знає — печера де ховався апостол. Особлива секретна печатка', m: 'https://maps.google.com/?q=Santiaguiño+do+Monte+Padrón', stamp: true, secret: true },
      { n: '🍽️ Pimientos de Padrón', i: '"Uns pican e outros non" — лотерея! Одні гострі, інші ні. Замовляти всім €4-6', m: 'https://maps.app.goo.gl/XJWYWVBqNos4azGj7 ', stamp: false, secret: false },
    ],
    albs: [
      { n: "Albergue de peregrinos de Padrón", p: '€15/паломника', b: 'https://www.alberguescaminosantiago.com/camino-portugues/albergue-de-peregrinos-de-padron/', m: 'https://maps.app.goo.gl/udndMuGKrNG43Fw99', type: 'municipal', c: 'Жива черга, не бронюється. Приходити до 14:00' },
      { n: '🤫 Convento Padres Franciscanos ~ San Antonio de Herbón', p: 'donativo', b: 'https://maps.app.goo.gl/nXz4d6aBjqtoTjYK8', m: 'https://maps.app.goo.gl/nXz4d6aBjqtoTjYK8', c: '3 км від Padrón — вечеря, молитва, спільне святкування. Особливий досвід!' },
    ],
    stamps: [
      { place: 'Iglesia de Santiago de Padrón', note: 'Місце прибуття мощів! Одна з головних печаток. В офісі туризму Padrón дають спеціальний сертифікат Pedronía, якщо ви відвідаєте святі місця міста.' },
      { place: 'Santiaguiño do Monte', note: 'Секретна печатка — печера апостола Якова' },
    ],
    elevation: { up: 150, down: 170 }
  },
  {
    date: '2026-07-23', day: 'Чт', title: 'Padrón → SANTIAGO', route: '🏆 ФІНІШ!', km: 24, type: 'walking-finish',
    desc: 'Ліси, села. Евкаліпти, A Escravitude (барокова церква), Milladoiro. Перший погляд на собор з Monte do Gozo — емоційний момент. Rúa do Franco → Praza do Obradoiro.',
    hl: '🏆 Pilgrim Office (Rúa das Carretas 33, 8:00-20:00) — Compostela БЕЗКОШТОВНА. Certificate of Distance €3, тубус €3. Заповнити форму онлайн за 1-2 дні: oficinadelperegrino.com → QR-код.',
    places: [
      { n: 'Monte do Gozo', i: '368 м — перший погляд на собор. Каменевий монумент паломників. Зупинитись!', m: 'https://maps.google.com/?q=Monte+do+Gozo+Santiago', stamp: false, secret: true },
      { n: 'Praza do Obradoiro', i: 'ФІНІШ! Головна площа перед собором', m: 'https://maps.google.com/?q=Praza+do+Obradoiro+Santiago', stamp: false, secret: false },
      { n: 'Pilgrims Reception Office', i: 'Rúa das Carretas 33. 8:00-20:00. Compostela безкоштовна! QR-код заповнити за 2 дні', m: 'https://maps.google.com/?q=Oficina+Peregrino+Santiago', stamp: true, secret: false },
      { n: 'Catedral de Santiago de Compostela', i: 'Загальний вхід безкоштовний. Pórtico de la Gloria €15 (€12 паломникам)', m: 'https://maps.google.com/?q=Catedral+Santiago', stamp: false, secret: false },
      { n: '🍽️ Abastos 2.0', i: 'Сучасна галісійська кухня', m: 'https://maps.app.goo.gl/radYpsd59LcLWUa46', stamp: false, secret: false },
      { n: 'Parque da Alameda', i: 'Класичний вид на собор на заході сонця', m: 'https://maps.google.com/?q=Parque+da+Alameda+Santiago', stamp: false, secret: false },
      { n: 'Mercado de Abastos', i: 'Закритий в неділю. У Nave 5/Abastos 2.0 приготують куплене вами', m: 'https://maps.google.com/?q=Mercado+Abastos+Santiago', stamp: false, secret: false },
    ],
    albs: [
      { n: 'Albergue Seminario Menor', p: '€24-40/паломника (приватна кімната)', b: 'https://seminariomenorsantiago.com/', m: 'https://maps.app.goo.gl/XR4o3RkZ2RE6v21M6', c: '🔴 Бронювати ПРЯМО через сайт, НЕ через Booking!' },
      { n: 'Albergue Peregrinos San Lázaro', p: '€10/паломника', b: 'https://www.alberguescaminosantiago.com/albergue-san-lazaro-santiago/', m: 'https://maps.app.goo.gl/xGw2o1wvFmRTdmqP7', type: 'municipal', c: 'Жива черга, не бронюється. Приходити до 14:00' },
    ],
    stamps: [{ place: 'Pilgrims Reception Office', note: '🏆 ОСТАННЯ ПЕЧАТКА перед Compostela!' }],
    elevation: { up: 450, down: 200 }
  },
  {
    date: '2026-07-24', day: 'Пт', title: 'Santiago + Fisterra', route: 'Кінець світу + Apóstolo', km: 0, type: 'special', special: 'birthday-holiday',
    desc: 'Ранком — Pilgrim Mass (Botafumeiro!). Автобусний тур від TOXO TRAVEL до Fisterra та Costa da Morte (€52). Повернення до Сантьяго. 🎆 23:30 — FUEGOS DEL APÓSTOLO на Praza do Obradoiro!',
    hl: 'Fuegos del Apóstolo — піротехнічний мультимедійний спектакль, що "підпалює" собор. 30,000+ людей! Приходити на Praza за 1.5 год (з 21:30). Унікальний раз на рік!',
    places: [
      { n: 'Pilgrim Mass', i: 'Соббор Botafumeiro — кадильниця 53 кг летить на 65 м. Меси: 9:30, 12:00, 19:30', m: 'https://maps.google.com/?q=Catedral+Santiago', stamp: false, secret: false },
      { n: '🚌 Тур від TOXO TRAVEL', i: 'Автобусний тур до Fisterra та Costa da Morte (€52). Усі наступні локації входять у його маршрут.<br><a class="det-book-btn" href="https://toxotravel.gal/tour/finisterre-costa-da-morte/?lang=en" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;margin-top:8px;background:var(--olive);color:#fff;border-color:var(--olive);padding:4px 8px;border-radius:6px;text-decoration:none;"><svg class="icon" style="margin-right:5px;"><use href="#icon-ticket"></use></svg> Забронювати тур</a>', m: 'https://toxotravel.gal/tour/finisterre-costa-da-morte/?lang=en', stamp: false, secret: false },
      { n: '↳ Muros', i: 'Рибальське містечко XV століття, оголошене історико-художньою пам\'яткою. Аркадні будиночки рибалок, вузькі вулички, краєвиди на естуарій.', m: 'https://maps.google.com/?cid=14019262240624744100', stamp: false, secret: false },
      { n: '↳ Fervenza do Xallas', i: 'Єдиний у континентальній Європі водоспад, що впадає просто в море. Річка Хальяс падає з висоти 40 метрів. Видовище особливо вражає після дощів.', m: 'https://maps.google.com/?cid=3787142362035004572', stamp: false, secret: false },
      { n: '↳ Faro de Fisterra', i: '«Кінець світу» для римлян і кельтів, межа між світом живих і мертвих. Знаменитий km0 Шляху Святого Якова. Відчинено 11:00–21:00 щодня.', m: 'https://maps.google.com/?cid=2047031956054418531', stamp: true, secret: true },
      { n: '↳ Fisterra', i: 'Вільний час ~1.5 години: середньовічне старе місто, рибний порт і ринок, обід з галісійською кухнею (pulpo, percebes, місцеві морепродукти).', m: 'https://maps.google.com/?cid=16639787414134346451', stamp: false, secret: false },
      { n: '↳ Святилище Вірхе да Барка, Мухія', i: 'Містичне місце біля самого океану: три священних каменя з легендами, хвилі б\'ють просто біля ніг. Відчинено 10:00–18:30.', m: 'https://maps.google.com/?cid=10473366910142432116', stamp: false, secret: false },
      { n: '↳ Ponte Maceira', i: 'На думку багатьох, найкрасивіше село Галісії. Романський міст XIV століття через річку Тамбре і середньовічні млини. Всього 10 хвилин від Сантьяго.', m: 'https://maps.google.com/?cid=16364930098742182097', stamp: false, secret: false },
      { n: 'Fuegos del Apóstolo 23:30', i: 'Praza do Obradoiro. Феєрверки "підпалюють" собор. Унікально раз на рік!', m: 'https://maps.app.goo.gl/X1CbYs88YUqhAkFy9', stamp: false, secret: false },
    ],
    albs: [
      { n: 'Albergue Seminario Menor', p: '€24-40/паломника (приватна кімната)', b: 'https://seminariomenorsantiago.com/', m: 'https://maps.app.goo.gl/XR4o3RkZ2RE6v21M6', c: '🔴 Бронювати ПРЯМО через сайт, НЕ через Booking!' },
      { n: 'Albergue Peregrinos San Lázaro', p: '€10/паломника', b: 'https://www.alberguescaminosantiago.com/albergue-san-lazaro-santiago/', m: 'https://maps.app.goo.gl/xGw2o1wvFmRTdmqP7' },
    ],
    stamps: [{ place: 'Faro de Fisterra (маяк)', note: 'Унікальна печатка маяка — 0,00 km від Fisterra!' }],
    elevation: { up: 100, down: 100 }
  },
  {
    date: '2026-07-25', day: 'Сб', title: 'Santiago → Порту → Бухарест', route: 'День Святого Якова + виліт', km: 0, type: 'travel', special: 'apostolo-mass',
    desc: '🎉 День Святого Якова! Урочиста Меса 10:30 з Botafumeiro гарантовано (доступ обмежений). Звичайні меси 13:00, 16:00, 19:30. ALSA автобус Santiago → OPO (~3 год, €25). Виліт 19:20!',
    hl: '⏰ Хронологія: 08:00 сніданок → 09:30 Pilgrim Mass → 12:00 ALSA автобус → 15:15 OPO → 17:30 check-in Wizz Air → 19:20 виліт 🛫',
    places: [
      { n: '⛪ Pilgrim Mass 9:30', i: '25.07 — Botafumeiro гарантовано! Приходити за 40 хв', m: 'https://maps.google.com/?q=Catedral+Santiago', stamp: false, secret: false },
      { n: '🚌 ALSA Santiago → Porto Airport', i: '~3 год, €20-30/паломника. БРОНЮВАТИ за 1-2 місяці! alsa.com', m: 'https://www.alsa.com/en', stamp: false, secret: false },
      { n: 'Аеропорт OPO', i: 'Виліт 19:20. Check-in за 1.5 год — Wizz Air terminal T1', m: 'https://maps.google.com/?q=Porto+Airport+OPO', stamp: false, secret: false },
    ],
    albs: [],
    stamps: [],
    elevation: { up: 0, down: 0 }
  },
];

// ─────────────────────────────────────────────
// DICTIONARY
// ─────────────────────────────────────────────

/**
 * @typedef {Object} DictPhrase
 * @property {string} ua
 * @property {string} pt
 * @property {string} es
 * @property {string} [pro]
 * @property {string} [tr]
 */

/**
 * @typedef {Object} DictCategory
 * @property {string} title
 * @property {DictPhrase[]} phrases
 */

/** @type {Record<string, DictCategory>} */
export const CITY_COORDS = {
  '2026-07-11': { lat: 41.15, lon: -8.61, name: 'Порту' },
  '2026-07-12': { lat: 41.15, lon: -8.61, name: 'Порту' },
  '2026-07-13': { lat: 41.35, lon: -8.75, name: 'Vila do Conde' },
  '2026-07-14': { lat: 41.53, lon: -8.78, name: 'Esposende' },
  '2026-07-15': { lat: 41.69, lon: -8.83, name: 'Viana do Castelo' },
  '2026-07-16': { lat: 41.87, lon: -8.84, name: 'Caminha' },
  '2026-07-17': { lat: 41.97, lon: -8.87, name: 'A Guarda / Baiona' },
  '2026-07-18': { lat: 42.12, lon: -8.85, name: 'Vigo' },
  '2026-07-19': { lat: 42.27, lon: -8.61, name: 'Redondela' },
  '2026-07-20': { lat: 42.43, lon: -8.64, name: 'Pontevedra' },
  '2026-07-21': { lat: 42.60, lon: -8.55, name: 'Caldas de Reis' },
  '2026-07-22': { lat: 42.74, lon: -8.66, name: 'Padrón' },
  '2026-07-23': { lat: 42.88, lon: -8.54, name: 'Santiago' },
  '2026-07-24': { lat: 42.88, lon: -8.54, name: 'Santiago + Fisterra' },
  '2026-07-25': { lat: 42.88, lon: -8.54, name: 'Santiago' },
};

/** @type {Record<number, string>} WMO weather code -> SVG icon ID */
export const STAGE_DAYS = [
  { date: '2026-07-13', city: 'Порту → Vila do Conde', km: 0 },
  { date: '2026-07-14', city: 'Vila do Conde → Esposende', km: 28 },
  { date: '2026-07-15', city: 'Esposende → Viana', km: 51 },
  { date: '2026-07-16', city: 'Viana → Caminha', km: 76 },
  { date: '2026-07-17', city: 'Caminha → Baiona', km: 103 },
  { date: '2026-07-18', city: 'Baiona → Vigo', km: 125 },
  { date: '2026-07-19', city: 'Vigo → Redondela', km: 147 },
  { date: '2026-07-20', city: 'Redondela → Pontevedra', km: 161 },
  { date: '2026-07-21', city: 'Pontevedra → Caldas', km: 179 },
  { date: '2026-07-22', city: 'Caldas → Padrón', km: 198 },
  { date: '2026-07-23', city: 'Padrón → Santiago', km: 217 },
  { date: '2026-07-24', city: '🏆 Santiago! Fisterra!', km: 241 },
];

/** Total route distance in km */
