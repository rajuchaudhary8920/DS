# Naari Sashaktikaran - Women's Safety & Wellness Companion

## Overview

Naari Sashaktikaran is a comprehensive women's safety and wellness application that combines AI-powered conversational support with health tracking and emergency safety features. The application provides:

- **Voice-enabled AI chat** for emotional support and wellness guidance
- **Emergency contact management** with quick-access safety features
- **Health tracking** including menstrual cycle, mood, and wellness metrics
- **Safety mapping** with location-based safety zone visualization
- **Keyword-based safety alerts** for detecting distress in conversations

The application is designed with a calming, trustworthy interface inspired by wellness apps like Calm and Flo, using Material Design 3 principles with soft colors and accessible typography.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for lightweight client-side routing, with pages for Home, Chat, Safety, Health, and Map.

**State Management**: TanStack Query (React Query) for server state management with built-in caching, background refetching disabled (staleTime: Infinity) for predictable data behavior.

**UI Components**: Radix UI primitives wrapped with custom styling via shadcn/ui component system. Uses the "new-york" style variant with Tailwind CSS for styling.

**Design System**:
- Color scheme based on HSL CSS variables for light/dark theme support
- Custom spacing primitives (2, 4, 6, 8, 12, 16 Tailwind units)
- Typography using Inter for body text and Playfair Display for headers
- Responsive grid layouts (2-column desktop, single-column mobile)
- Material Design 3 foundation with wellness app aesthetics

**Voice Integration**: Web Speech API for speech recognition and synthesis, with customizable voice settings (pitch, rate, voice selection).

**Mapping**: Leaflet.js for interactive safety zone visualization with custom markers and safety ratings.

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API endpoints organized by feature domain:
- `/api/emergency-contacts` - CRUD operations for emergency contacts
- `/api/conversations` - Chat message history
- `/api/cycle-tracking` - Menstrual cycle data
- `/api/mood-entries` - Mood tracking
- `/api/wellness-metrics` - Daily wellness metrics (water, sleep, exercise)
- `/api/safety-keywords` - Safety keyword management
- `/api/voice-settings` - Voice customization preferences

**Middleware**: Custom request logging middleware that captures method, path, status code, duration, and response body for API routes (truncated to 80 characters).

**Development Setup**: Vite middleware mode for HMR (Hot Module Replacement) during development, with custom error handling that exits on Vite errors.

### Data Storage

**Database**: PostgreSQL via Neon serverless driver (`@neondatabase/serverless`).

**ORM**: Drizzle ORM for type-safe database operations with schema-first approach.

**Schema Management**: Drizzle Kit for migrations, configured to output to `./migrations` directory.

**Session Storage**: PostgreSQL-backed sessions using `connect-pg-simple`.

**Fallback Storage**: In-memory storage implementation (`MemStorage` class) that implements the same interface as database storage for development/testing.

**Schema Design**:
- Emergency contacts with name, phone, relationship
- Conversations with user message, AI response, and safety alert flag
- Cycle tracking with start date, cycle length, period length
- Mood entries with mood type and notes
- Wellness metrics with date and daily measurements
- Safety keywords with activation status
- Voice settings for personalization

All tables use UUID primary keys generated via PostgreSQL's `gen_random_uuid()` and include `createdAt` timestamps.

### Authentication & Authorization

No authentication system is currently implemented. The application operates in a single-user mode without user accounts or session-based authentication for emergency contacts and health data.

## External Dependencies

### AI Services

**OpenAI API**: GPT-5 model for conversational AI responses. The system prompt configures the AI as a "supportive, empathetic AI companion for women's wellness and safety."

**Safety Detection**: Custom keyword detection logic that scans user messages for configured safety keywords to trigger alerts.

### UI Component Libraries

**Radix UI**: Headless, accessible component primitives including:
- Dialogs, popovers, tooltips, dropdowns
- Form controls (checkbox, radio, select, slider, switch)
- Navigation components (accordion, tabs, menubar)
- Feedback components (toast, alert dialog, progress)

**shadcn/ui**: Pre-styled component system built on Radix UI with Tailwind CSS integration, using the "new-york" style variant.

**Lucide React**: Icon library for UI elements.

### Mapping & Geolocation

**Leaflet**: Interactive map library for safety zone visualization with custom markers and clustering.

**Browser Geolocation API**: For obtaining user's current location (with fallback to NYC coordinates).

### Database & Infrastructure

**Neon Database**: Serverless PostgreSQL hosting with connection pooling.

**Drizzle ORM**: Type-safe SQL query builder with schema validation using Zod.

### Form Handling

**React Hook Form**: Form state management with validation.

**@hookform/resolvers**: Integration with Zod for schema-based validation.

**Zod**: Schema validation library, also used via `drizzle-zod` for creating insert schemas from database tables.

### Date & Time

**date-fns**: Date manipulation and formatting, used for cycle tracking calculations (e.g., `differenceInDays`).

### Styling & Theming

**Tailwind CSS**: Utility-first CSS framework with custom configuration for extended color palette and border radius values.

**class-variance-authority**: Type-safe variant-based styling for components.

**PostCSS**: CSS processing with Autoprefixer plugin.

### Development Tools

**Replit Plugins**: Development environment enhancements including cartographer for code navigation and dev banner for development mode indicators.

**TypeScript**: Full type safety across frontend, backend, and shared code with strict mode enabled.

**Path Aliases**: Configured for clean imports (`@/`, `@shared/`, `@assets/`).