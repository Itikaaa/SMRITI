# SMRITI — Product & Visual Direction

## Three initial directions

### Theme Name: Quiet Garden
Very Brief Intro: A sunlit, botanical care companion with paper-like surfaces, a gentle forest palette, and reassuring human warmth. It makes clinical tasks feel like familiar daily rituals.
Probability: 0.07

### Theme Name: Monsoon Radio
Very Brief Intro: A calm, tactile interface inspired by old radios, hand-labelled drawers, and soft rain. It uses warm mineral tones and rounded controls to make audio-first interaction feel tangible.
Probability: 0.03

### Theme Name: Night Lamp
Very Brief Intro: A softly lit evening companion with deep ink surfaces, amber wayfinding, and a single glowing listening state. It is intimate and protective without becoming futuristic or clinical.
Probability: 0.08

## Chosen approach: Quiet Garden

### Design Movement
Contemporary Indian botanical modernism, borrowing the material honesty of editorial print, the quiet pacing of a community clinic, and the familiarity of a family prayer room without religious symbolism.

### Core Principles
1. **Reassurance before information density.** Every view leads with one clear next action, generous type, and visible listening state.
2. **Familiar over futuristic.** Use paper, leaf, sunlight, and handwritten-note cues instead of medical dashboards or tech-heavy motifs.
3. **Caregiver clarity, elder simplicity.** The caregiver gets structured controls; the elderly view removes navigation clutter and speaks aloud whenever possible.
4. **Progress is a gentle path, not a score.** Reports describe moments, responses, and patterns without shame or gamification pressure.

### Color Philosophy
The palette starts with warm rice-paper cream (`#F7F2E8`) to reduce glare and evoke a familiar home surface. Deep guava-leaf green (`#1E493F`) carries trust and legibility. Marigold (`#E9A23B`) is reserved for moments that need attention, never used as decoration. Clay coral (`#D86F58`) is used for human warmth and reminders. Mist blue (`#DDE9E5`) creates rest zones for elderly-facing content.

### Layout Paradigm
A persistent left rail anchors the caregiver dashboard while content is arranged as an editorial column with offset cards and generous breathing room. The elderly session uses a single focus stage: one large conversational surface, one listening orb, and no competing controls. The page rhythm is asymmetric and intentionally avoids an app-store grid.

### Signature Elements
1. **The listening leaf:** a softly outlined leaf-shaped or oval listening orb that breathes when the assistant is speaking.
2. **Care ribbons:** thin marigold and coral timeline strokes that connect reminders, sessions, and reports.
3. **Paper slips:** slightly offset note cards for caregiver observations, framed like a bedside note rather than a medical record.

### Interaction Philosophy
Interactions should feel acknowledged, not rewarded. Buttons press with a brief tactile scale, alarms surface as clear full-width banners, and voice states always have a readable text fallback. The caregiver can preview the elderly experience before saving. Any browser limitation is explained in plain language.

### Animation
Use 180–260ms ease-out transitions for controls, a slow 2.8s breathing animation for the listening orb, and staggered 50ms entrances for care-ribbon items. Avoid bouncing or gamified confetti. Respect `prefers-reduced-motion` by disabling breathing and entrance motion while preserving focus and status changes.

### Typography System
Use **DM Serif Display** for display headlines and section titles, paired with **Atkinson Hyperlegible** for controls, labels, and elder-facing copy. Display text should be large and slightly tight; body text should have generous line-height. Use `font-variant-numeric: tabular-nums` for times and progress values.

### Brand Essence
SMRITI is a gentle multilingual memory companion for families caring for an older loved one, different because it turns daily care into familiar conversation instead of a clinical checklist. Personality: **tender, grounded, attentive**.

### Brand Voice
Headlines are calm and direct. CTAs are invitations, never commands. Microcopy explains what will happen next and avoids medical jargon or guilt.

Example lines:
- “A small moment of memory, together.”
- “I’m listening. Take your time.”

### Wordmark & Logo
The mark is a bold abstract leaf made from two overlapping speech-bubble forms, suggesting memory and conversation without drawing a literal brain. The wordmark is set in DM Serif Display with a custom elongated crossbar on the “T”; never use the brand name as an unstyled default font.

### Signature Brand Color
**Guava leaf green — `#1E493F`**. It is ownable, soft enough for long sessions, and visually connects the brand to living memory rather than hospitals.

## Product decisions for the prototype

This first release is a browser-based prototype. It stores caregiver settings and session progress locally in the browser so the flow can be demonstrated without a backend. The voice layer uses the browser Speech Synthesis and Speech Recognition APIs when the browser supports them, with a large readable fallback if speech recognition is unavailable. Language labels and core prompts are translated for the requested languages; because browser voice availability varies by device, the interface exposes the selected language and the detected voice when available.

Alarm reminders run while the app is open. The session alarm opens a large start prompt and begins the elderly session after the caregiver/elder taps “Begin session”; medication and hydration reminders open acknowledgement cards. Camera monitoring is a privacy-conscious prototype using the browser camera preview and manual caregiver confirmation rather than claiming medical-grade computer vision. A production version would need explicit consent, secure storage, a verified vision model, and reliable caregiver notifications.
