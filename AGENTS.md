# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Super Buttery Smooth Animations Standard

All UI interactions and state changes throughout the app must be super buttery smooth, calibrated for 60Hz and 120Hz high-refresh displays.

### Core Rules:
1. **Never use stiff linear transitions or raw setTimeout hacks** for press states, expanding menus, or accordion toggles.
2. **Physics-based Springs**: Always use calibrated spring physics from `@/constants/animations`:
   - `Springs.snappy`: `{ damping: 18, stiffness: 350, mass: 0.6 }` (Buttons, icons, pills, micro-actions)
   - `Springs.bouncy`: `{ damping: 13, stiffness: 240, mass: 0.65 }` (Badges, active states, indicator dots)
   - `Springs.silky`: `{ damping: 22, stiffness: 200, mass: 0.8 }` (Cards, drawers, accordions)
   - `Springs.gentle`: `{ damping: 28, stiffness: 130, mass: 1.0 }` (Ambient pulses, floating bars)
3. **Tactile Press Feedback**:
   - Use `AnimatedPressableScale` (from `@/constants/animations`) or `AnimatedPressableCard` for buttons, cards, list items, and tabs.
   - Compress on `onPressIn` (scale `0.92` to `0.97`) with `Springs.snappy` + light haptics (`Haptics.ImpactFeedbackStyle.Light`).
   - Elastic rebound on `onPressOut` with `Springs.bouncy`.
4. **Organic Layout & Entrance Transitions**:
   - Expanding lists/accordions must use `Transitions.layout` (`LinearTransition.springify().damping(22).stiffness(220)`).
   - Staggered entrances use `Transitions.fadeDown(delay)` or `Transitions.fadeRight(delay)` with physical spring overshoot.
5. **UI-Thread Execution**:
   - Keep animation worklets strictly on the native UI thread via Reanimated shared values (`useAnimatedStyle`, `useDerivedValue`) to maintain consistent 60–120fps with zero frame drops.
