
## Мета
Створити навчальний контент для кожної теми граматичної бібліотеки (усі slug-и з `src/data/mock.ts`) і зробити сторінку `/lesson/:slug` динамічною, щоб вона показувала контент відповідної теми, а не лише захардкоджену тему `adjektivdeklination-bestimmter`.

## Що буде створено

### 1. Новий файл контенту — `src/content/lessons.ts`
Єдина база даних уроків. Тип:

```ts
type LessonContent = {
  slug: string;
  level: "A1"|"A2"|"B1"|"B2"|"C1"|"C2";
  category: string;        // напр. "Дієслова"
  titleDe: string;         // "Präsens"
  titleUk: string;         // "Теперішній час"
  goal: string;            // мета уроку (укр.)
  explanation: string;     // 2–4 абзаци пояснення укр., з виділеннями
  table?: { headers: string[]; rows: string[][] }; // опц. таблиця
  examples: { de: string; uk: string; tag?: string }[]; // 4–6 прикладів
  tip: string;             // правило-памʼятка
  mistakes: { wrong: string; right: string }[]; // 2–3 типові помилки
  exercises: {
    mc?: { q: string; options: string[]; correct: number; explain: string };
    gap?: { q: string; answer: string; hint?: string };
    ending?: { q: string; options: string[]; correct: string; hint?: string };
  };
  nextSlug?: string;
  prevSlug?: string;
};
```

### 2. Покриття тем
Контент буде написаний для всіх slug-ів, які вже є в `grammarCategories` та підкатегоріях:

- **Дієслова:** `verben`, `praesens`, `perfekt`, `praeteritum`, `futur1`, `modalverben`, `trennbare`, `untrennbare`, `reflexive`, `verben-praep`, `konjunktiv2`, `passiv`
- **Іменники / Артиклі / Займенники:** `substantive`, `artikel`, `pronomen`
- **Прикметники:** `adjektive`, `adjektivdeklination-bestimmter` (зберегти існуючу), `komparativ-superlativ`, `adjektive-praep`, `partizipien`
- **Прислівники / Прийменники / Сполучники:** `adverbien`, `praepositionen`, `konjunktionen`
- **Будова речення / Часи:** `satzbau`, `zeiten`
- **Відмінки:** `nominativ`, `akkusativ`, `dativ`, `genitiv`
- **Словотвір:** `wortbildung`

Разом ~30 уроків. Контент — реалістичний, українською з німецькими прикладами, без Lorem Ipsum, відповідає заявленому рівню (A1–C2).

### 3. Рефакторинг `src/pages/Lesson.tsx`
- Зчитувати урок з `lessons[slug]`; якщо немає — показати fallback «Урок у розробці» з кнопкою назад.
- Рендерити секції (Мета, Пояснення, опц. Таблиця, Приклади, Памʼятка, Типові помилки, Вправи) з даних.
- Вправи: ті самі 3 формати (MC, Lückentext, Закінчення) — універсальний UI; перевірка враховує тільки ті вправи, що визначені для уроку.
- Кнопки «Попередня / Наступна» використовують `prevSlug`/`nextSlug`.
- Логіка `completeLesson` зберігається, але заголовок і рівень беруться з контенту.

### 4. Малі правки навігації
- У `src/pages/Grammar.tsx` для тем без підкатегорій — без змін (вже лінкує на `/lesson/:slug`).
- На `Dashboard` / `Home` нічого не змінюємо.

## Що НЕ змінюється
- Дизайн, токени, тема, шрифти.
- `AuthContext`, профіль, Cloud-інтеграція.
- Структура `grammarCategories` — лише читаємо з неї.

## Технічні деталі
- Контент — статичний TS-обʼєкт, без запитів до бекенду (швидко, працює офлайн, легко розширювати).
- Один великий файл `lessons.ts` (~1500–2000 рядків) із Record<slug, LessonContent>. Якщо стане незручно — згодом розбити по категоріях.
- Існуюча тема `adjektivdeklination-bestimmter` мігрує у новий формат 1-в-1, щоб не втратити приклад B1-уроку.

## Результат
Будь-який клік по темі чи підтемі у `/grammar` відкриває повноцінний урок (пояснення + таблиця + приклади + памʼятка + помилки + 2–3 вправи), а не одну й ту саму сторінку про Adjektivdeklination.
