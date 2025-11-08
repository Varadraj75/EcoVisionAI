# EcoVision AI Design Guidelines

## Design Approach
**System-Based with Custom Eco-Aesthetic**: Using Material Design principles enhanced with a distinctive "Neo-Glass" sustainability theme. Drawing inspiration from modern SaaS dashboards like Linear and Notion, combined with eco-conscious visual language from brands like Patagonia and Tesla Energy.

## Core Design Principles
- **Transparency & Depth**: Layered glass-morphism effects creating visual hierarchy
- **Data Clarity**: Information-first approach with breathing room around metrics
- **Eco-Modern**: Contemporary sustainability aesthetic avoiding clichéd green imagery
- **Purposeful Motion**: Subtle transitions that enhance understanding, not distract

## Typography System

**Font Families**:
- Primary: Inter (headings, UI elements, data labels)
- Secondary: JetBrains Mono (numerical data, predictions, metrics)

**Hierarchy**:
- Hero Headlines: 4xl-6xl, font-bold
- Section Headers: 3xl-4xl, font-semibold
- Card Titles: xl-2xl, font-semibold
- Body Text: base-lg, font-normal
- Data Labels: sm-base, font-medium
- Metrics/Numbers: 2xl-4xl, font-bold (JetBrains Mono)

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16 for consistency
- Component padding: p-6, p-8
- Section spacing: py-12, py-16, py-20
- Card gaps: gap-6, gap-8
- Margins: mb-8, mb-12

**Grid Structure**:
- Container: max-w-7xl mx-auto px-6
- Dashboard: 12-column grid system
- Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

## Page-Specific Layouts

### Homepage (Marketing/Landing)
**Hero Section** (100vh):
- Full-width gradient overlay with hero image (abstract sustainability visual - solar panels, wind turbines, or earth from space)
- Centered content with max-w-4xl
- Large headline (text-6xl) + subheadline (text-xl)
- Dual CTA buttons with glass-blur backgrounds (Sign Up + View Demo)
- Floating metric cards showcasing platform impact (CO2 saved, users, predictions made)

**Features Section** (py-20):
- 3-column grid showcasing core modules
- Each card: icon, title, description, micro-stats
- Staggered layout with alternating depths

**How It Works** (py-16):
- 4-step horizontal timeline
- Icon → Title → Description per step
- Connecting lines between steps

**Social Proof** (py-16):
- 2-column testimonial cards with user avatars
- Impact metrics bar (5-column stats display)

**Final CTA** (py-20):
- Centered with gradient background
- Single focused message with primary action

### Authentication Pages
- Centered card (max-w-md) with glass-blur effect
- Logo + headline above form
- Input fields with floating labels
- Google Sign-In button with prominent placement
- Divider: "or continue with email"
- Footer link to alternate auth page

### Dashboard (Main App)
**Layout Structure**:
- Persistent sidebar (w-64, semi-transparent)
- Top bar with user profile, theme toggle, notifications
- Main content area (flex-1, p-8)

**Sidebar Navigation**:
- Logo at top (p-6)
- Nav items with icons (py-3, px-4)
- Active state: highlighted with subtle glow
- Bottom: User profile card

**Dashboard Content**:
- Welcome banner with personalized greeting + current sustainability score
- 4-metric overview cards (grid-cols-4): Energy, Water, CO2, Savings
- 2-column layout below:
  - Left (60%): Large consumption trend chart (Recharts area/line chart)
  - Right (40%): Stacked prediction summary cards
- Full-width: Weekly insights table/list

### Predictions Page
- Split layout (grid-cols-2 gap-8):
  - Left: Input form card with parameter sliders/inputs
  - Right: Live prediction visualization
- Bottom: Historical predictions table with pagination

### Eco-Route Page
- Map-style layout:
  - Top: Origin/destination input bar (sticky)
  - Main: Visual route comparison (3 routes side-by-side)
  - Each route card: map visual, distance, time, CO2 impact
  - Recommended route highlighted with glow effect

### AI Assistant Page
- Chat interface (max-w-4xl mx-auto):
  - Message bubbles (user: right-aligned, AI: left-aligned)
  - Suggested prompts as clickable chips
  - Input bar at bottom (sticky, glass-blur)
  - Typing indicators and smooth message animations

## Component Library

**Cards**:
- Glass-blur background (backdrop-blur-xl)
- Subtle border with transparency
- Rounded corners (rounded-xl, rounded-2xl)
- Padding: p-6, p-8
- Shadow: shadow-lg with subtle glow

**Buttons**:
- Primary: Solid with gradient, rounded-lg, px-6 py-3
- Secondary: Outline with glass-blur, same padding
- Icon buttons: p-3, rounded-full
- Hover: Subtle lift (transform translateY)

**Form Inputs**:
- Glass-blur backgrounds
- Floating labels
- Border on focus with glow effect
- Padding: px-4 py-3
- Rounded: rounded-lg

**Data Visualizations**:
- Recharts library for all charts
- Area charts: gradient fills with transparency
- Line charts: smooth curves, 2-3 color max
- Bar charts: rounded tops
- Consistent axis styling with grid lines

**Metric Cards**:
- Large number display (text-4xl)
- Label below (text-sm)
- Trend indicator (↑↓ with percentage)
- Icon in corner

**Navigation**:
- Sidebar: vertical nav with icons + labels
- Top bar: horizontal with dropdowns
- Breadcrumbs on sub-pages

## Images

**Hero Image**: 
- Full-width, full-height background image
- Abstract sustainability visual: aerial view of solar farm, wind turbines in golden hour, or earth's curvature from space
- Dark gradient overlay (opacity 60%) for text legibility
- Image placement: background cover, center center

**Feature Section Icons**:
- Use Heroicons for all UI icons
- Consistency: outline style throughout
- Size: w-12 h-12 for feature highlights

**Dashboard**: 
- Avatar images for user profiles
- No decorative images - data visualization is the visual focus

## Responsive Behavior

**Desktop (lg+)**: 
- Full sidebar visible
- Multi-column grids active
- Charts at full detail

**Tablet (md)**:
- Collapsible sidebar (hamburger)
- 2-column grids
- Stacked chart layouts

**Mobile (base)**:
- Bottom navigation bar
- Single column throughout
- Swipeable chart containers
- Sticky headers and CTAs

## Animations

Use sparingly and purposefully:
- Page transitions: fade-in (opacity + translateY)
- Card entrances: stagger fade-in on scroll
- Hover states: subtle scale (1.02) and shadow increase
- Loading states: skeleton screens with shimmer
- Number counting: animated odometer for metrics
- No parallax, no complex scroll-triggered animations