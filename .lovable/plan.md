# План: повноцінні Lern-Unterseiten для всіх тем A1–C2

## Мета
Зробити так, щоб кожна підкатегорія граматичної бібліотеки (Verben, Substantive, Artikel, Pronomen, Adjektive, Adverbien, Präpositionen, Konjunktionen, Satzbau, Zeiten, Nominativ/Akkusativ/Dativ/Genitiv, Wortbildung та ін.) відкривала повноцінний урок за єдиним шаблоном, який ми вже використали для Verben.

## Обсяг
- **Підтем у `grammarCategories`**: ~30 (verben, praesens, perfekt, praeteritum, futur1, modalverben, trennbare, untrennbare, reflexive, verben-praep, konjunktiv2, passiv, substantive, artikel, pronomen, adjektive, adjektivdeklination-bestimmter, komparativ-superlativ, adjektive-praep, partizipien, adverbien, praepositionen, konjunktionen, satzbau, zeiten, nominativ, akkusativ, dativ, genitiv, wortbildung).
- **Кожен урок**: header, цілі, пояснення, RuleBox, таблиця, ≥8 прикладів, MemoryBox, поради для україномовних, типові помилки, (опц.) порівняння DE↔UK, підсумок, **рівно 15 інтерактивних вправ** із миттєвим фідбеком, підсумковий екран із результатом, навігація prev/next + breadcrumb.

## Що буде створено / змінено

### 1. Розширений тип уроку — `src/content/lessons.ts`
Додати опційні поля до існуючого `LessonContent`, не ламаючи поточні дані:
- `duration?: number` (хв)
- `premium?: boolean`
- `learningGoals?: string[]`
- `ruleBox?: { title?: string; rule: string; examples?: { de: string; uk: string }[] }`
- `ukrainianTips?: string[]`
- `languageComparison?: { commons: string[]; diffs: string[]; traps?: string[] }`
- `summary?: string[]`
- `exercises15?: ExerciseItem[]` — нові 15 вправ для уроку

Існуючі уроки лишаються валідні; нові заповнюємо повністю.

### 2. Розширена бібліотека вправ — `src/content/exerciseSets.ts`
Додати нові типи `ExerciseItem` поверх існуючих (mc, gap, tf, order, translate):
- `match` (зіставлення пар DE↔UK / питання↔відповідь)
- `correct` (виправити неправильне речення)
- `conjugate` (форма дієслова за особою)
- `caseSelect` (визначити Kasus)
- `multiSelect` (кілька правильних відповідей)
- `write` (вільна коротка відповідь — приймається будь-який непорожній текст, показуємо зразкову відповідь)

### 3. Нові компоненти уроку — `src/components/lesson/`
- `LessonHeader.tsx` (рівень, категорія/підкатегорія, DE/UK заголовки, тривалість, premium-бейдж, breadcrumb, кнопка назад)
- `LearningGoals.tsx`
- `RuleBox.tsx` (фіолетовий акцент)
- `MemoryBox.tsx` (теплий бежевий — `bg-accent-soft`)
- `UkrainianTips.tsx` (синій — `bg-info-soft`)
- `LanguageComparison.tsx`
- `LessonSummary.tsx`
- `LessonNavigation.tsx` (prev/next/категорія/рівень)
- Розширити `ExerciseBlock.tsx`:
  - підтримати нові типи вправ (нові маленькі підкомпоненти всередині або окремі файли `exercises/*.tsx`)
  - двоетапний фідбек: 1-ша помилка → підказка; 2-га → кнопка «Показати відповідь»
  - підсумковий екран `ExerciseResult` (правильні/всього, %, спроби, повторити/наступний урок/завершити)

### 4. Рефакторинг `src/pages/Lesson.tsx`
Зібрати сторінку з нових компонентів у строгому порядку:
header → goals → explanation → ruleBox → table → examples → memoryBox → ukrainianTips → mistakes → (languageComparison?) → summary → 15 exercises → result → navigation.
Зберегти поточну логіку `completeLesson` + урок зараховується після проходження всіх 15 вправ або натискання «Завершити».

### 5. Контент уроків — 3 еталонні + усі інші
**Етап А (еталони, повністю вручну):**
1. A1 · `praesens` — Präsens (теперішній час)
2. B1 · `adjektivdeklination-bestimmter` — Schwache Deklination
3. C1 — додати новий slug `konjunktiv1` (Konjunktiv I, непряма мова) в `mock.ts` під C1 і написати повний урок.

**Етап Б (масштабування):**
Усі решта ~30 підтем заповнити за тим самим шаблоном — реалістичним змістом відповідного рівня (без плейсхолдерів «Mock-Content» у UI). Через обсяг — ділимо файл `lessons.ts` на модулі по категоріях: `src/content/lessons/verben.ts`, `nomen.ts`, `adjektive.ts`, `praeposi­tionen.ts`, `satzbau.ts`, `kasus.ts`, `wortbildung.ts` тощо, реекспортуємо з `index.ts`.

### 6. Дрібні правки навігації
- `src/pages/Grammar.tsx`: усі акордеони / картки підкатегорій ведуть на `/lesson/:slug` (уже так — лише перевірити, що нові slug-и присутні).
- Додати breadcrumb-навігацію всередині `LessonHeader`.

## Що НЕ змінюється
- Бренд, фіолетова палітра, біла картка, шрифти, header/footer, інші сторінки (Home, Pricing, Profile, Subscription).
- `AuthContext` лише розширюється новим методом збереження результатів вправ (опц., локально через існуючий механізм `completeLesson`).

## Технічні нотатки
- Усе клієнтське, без бекенду. Дані статичні в TS.
- Усі тексти укр. UI / DE граматичні терміни; кожен німецький приклад має укр. переклад під ним.
- Таблиці — `overflow-x-auto` для мобільних.
- Колірна логіка: правило — `bg-primary-soft`, порада — `bg-info-soft`, памʼятка — `bg-accent-soft`, успіх — `text-success`, помилка — `text-destructive`.

## Обережно щодо обсягу
30 уроків × (повний шаблон + 15 вправ) = дуже багато контенту й токенів. Пропоную **виконувати поетапно за ітераціями**:
- **PR-1 (цей хід):** інфраструктура (типи, компоненти, новий ExerciseBlock, підсумок, навігація) + 3 еталонні уроки (A1 Präsens, B1 schwache Deklination, C1 Konjunktiv I).
- **PR-2:** решта Verben (perfekt, praeteritum, futur1, modalverben, trennbare, untrennbare, reflexive, verben-praep, konjunktiv2, passiv).
- **PR-3:** Substantive / Artikel / Pronomen / Adjektive / Adverbien.
- **PR-4:** Präpositionen / Konjunktionen / Satzbau / Zeiten.
- **PR-5:** Kasus (Nom/Akk/Dat/Gen) + Wortbildung.

Після кожної ітерації — `tsgo --noEmit` для перевірки.

## Питання перед стартом
1. Підтверджуєш поетапну реалізацію (5 PR-ів), щоб уникнути обриву через обсяг, чи треба «все одним заходом» (тоді контент буде стисліший / шаблонніший)?
2. ОК додати новий slug `konjunktiv1` у C1 категорію Verben, щоб був C1-приклад?
