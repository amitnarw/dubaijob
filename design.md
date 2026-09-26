# design.md — "EduWave" visual spec (SINGLE SOURCE OF TRUTH for look)

Friendly learning-app feel: warm dark canvas, green primary actions, peach
badges, colorful shine cards. All screens compose from this sheet.

## 1. Color (opaque solids only — no alpha, blur, glows, shadows)

| Token              | Value     | Used for                              |
| ------------------ | --------- | ------------------------------------- |
| Canvas             | `#121212` | Everything behind cards               |
| Surface            | `#1E1E1E` | Cards, rows, sheets                   |
| Elevated           | `#242424` | Pills, chips, player, inputs          |
| Track              | `#2E2E2E` | Progress tracks, inactive chips       |
| Text 1/2/3         | `#FFFFFF` / `#9E9E9E` / `#5F5F5F` | Primary / secondary / meta |
| Dark-on-fill       | `#1A1A1A` | Text/icons on green & peach fills     |
| Green `#7BC96F`    | Primary   | CTAs, unlock bar, active progress     |
| Peach `#F2A28C`    | Secondary | Active filter pill, Free badges, free-videos pill, equalizer |
| Sun `#E8D06A`      | Pop       | Card variety in Continue Watching     |

Prices ride on green (dark text) or green text. `gold*` tokens alias the
green family so legacy price elements stay correct.

## 2. Type — Inter, friendly bold

Display 32/-0.8 Bold (page titles) · Title 20/-0.5 Bold (sections, cards) ·
Body 15 (titles, copy) · Meta 13 Medium `#9E9E9E` (kickers, counts, durations).

## 3. Geometry & rhythm

Radii: cards 24, thumbs/rows 16, pills 999. Screen margin 20, sections 36
apart. Layered cards overlap bottom sheets (featured cards peek). Motion:
existing spring system, unchanged.

## 4. Signature patterns

- Greeting "Hello, **Name**" + avatar, no badges.
- Filter pills with count badges (active = peach fill, dark text).
- Featured cards: colored shine background, dark title, black overlay pill
  ("Start Learning" / "Resume · Step N") + white circle play button.
- Meta chips: dark pills with green/peach icons.
- Lesson rows: white title + peach Free pill, muted minutes, dark play circle.
- Green unlock pill: dark lock circle, white bold text + chevrons, dark price.
- Tab bar: black, sliding white circle (finger-tracked), peach 3-bar
  equalizer on the Course tab while a lesson plays.

## 5. Banned list

Transparency/alpha · blur · glows · shadows · illustrations · rings ·
gold-as-decoration · uppercase overline labels · tabular-numeral styling.
