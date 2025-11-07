# Design Guidelines: Women's Safety & Wellness Companion

## Design Approach
**System**: Material Design 3 foundation with wellness app inspiration (Calm, Flo, Headspace)
**Rationale**: Utility-focused app requiring trustworthy, accessible interface with calming aesthetics for sensitive health and safety content.

## Typography
- **Primary Font**: Inter (via Google Fonts CDN)
- **Accent Font**: Playfair Display for headers and emotional emphasis
- **Hierarchy**:
  - Hero/Welcome: text-4xl font-medium
  - Section Headers: text-2xl font-semibold
  - Feature Titles: text-xl font-medium
  - Body Text: text-base font-normal
  - Captions/Labels: text-sm font-normal
  - Voice Output Text: text-lg font-light (readable during conversations)

## Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, and 16
- Component padding: p-4, p-6
- Section spacing: py-12, py-16
- Card gaps: gap-4, gap-6
- Margins: m-2, m-4, m-8

**Grid System**:
- Dashboard: 2-column on desktop (lg:grid-cols-2), single column mobile
- Health metrics: 3-column grid (lg:grid-cols-3)
- Emergency contacts: Card list with 2-column layout on tablet+

## Core Components

### Navigation
- Sticky top nav with app logo, main menu (Dashboard, Voice Chat, Safety, Health, Settings)
- Mobile: Bottom navigation bar with icons for primary features
- Active state: Underline indicator, weight increase

### Voice Interface (Primary Feature)
- **Voice Chat Card**: Centered, prominent position with max-w-2xl
- Large circular waveform visualization during active listening
- Start/Stop recording: Rounded-full button, size-16 minimum
- Voice output controls: Pitch/Rate sliders, voice selector dropdown
- Conversation history: Scrollable message bubbles (user right-aligned, AI left-aligned)
- Microphone permission prompt: Clear, centered modal

### Safety Features
- **Emergency Contacts Panel**: Card-based list with add/edit/delete actions
- Contact cards: Avatar (placeholder initial), name, phone, relationship tag
- Emergency trigger button: Large, prominent, rounded-xl, positioned for quick access
- Safety keyword status indicator: Badge showing active/inactive state

### Heat Map Component
- **Map Container**: Full-width section, min-h-96
- Interactive map with overlay showing safety ratings
- Legend: Fixed position, semi-transparent background with backdrop-blur
- Area markers: Color-coded zones with click-to-view details
- Current location indicator: Pulsing circle animation

### Health Dashboard
- **Cycle Tracker**: Circular progress indicator with day count
- **Mood Logger**: Grid of mood icons/emojis with selection states
- **Wellness Metrics**: Card grid showing sleep, water, exercise
- Quick log buttons: Floating action button style, rounded-full
- Calendar view: Month grid with marked dates for cycle tracking

### Cards & Containers
- Standard cards: rounded-xl, shadow-md, p-6
- Interactive cards: Hover lift effect (translate-y-1), shadow-lg
- Feature cards: Icon + title + description, text-center
- Modal dialogs: max-w-md, rounded-2xl, backdrop-blur background

### Forms & Inputs
- Text inputs: rounded-lg, border with focus ring
- Buttons: 
  - Primary: rounded-lg, py-3, px-6, font-medium
  - Secondary: rounded-lg, border variant
  - Icon buttons: rounded-full, p-2
  - Emergency: rounded-full, Large (h-16 w-16 minimum)
- Sliders: For voice customization (pitch/rate controls)
- Dropdowns: rounded-lg with smooth expand animation

## Images
**Hero Section**: Supportive illustration of a woman using voice assistant (peaceful, empowering aesthetic)
- Placement: Landing page hero, right side on desktop, full-width on mobile
- Style: Soft, modern illustration with welcoming presence

**Safety Features**: Icon-based illustrations for emergency contacts, safety zones
**Health Tracking**: Abstract wellness imagery (flowers, nature elements) for mood/cycle sections

## Accessibility
- Voice input with visual feedback (waveforms, transcription display)
- High contrast text throughout
- Focus indicators on all interactive elements
- Screen reader labels for icon-only buttons
- Keyboard navigation support for all features
- ARIA labels for emergency and safety features

## Layout Patterns
**Dashboard**: 
- Welcome banner with quick actions
- Voice chat access: Prominent card above fold
- 2-column grid: Safety features left, Health tracking right
- Map section: Full-width below

**Voice Chat Page**:
- Centered conversation interface
- Voice controls at bottom (sticky)
- Settings sidebar (collapsible)

**Safety Page**:
- Emergency button: Fixed top-right
- Contacts list: Main content area
- Heat map: Full section below

**Health Page**:
- Multi-tab interface (Cycle, Mood, Wellness)
- Dashboard cards with quick-add actions
- Historical data: Charts and calendar views

## Animation Principles
- Minimal, purposeful animations only
- Waveform visualization during voice input (CSS or Canvas)
- Smooth transitions for modal appearances (fade + scale)
- Pulsing effect for emergency button and active recording indicator
- No scroll-based animations