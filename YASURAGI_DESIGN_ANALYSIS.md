# Yasuragi.se - Complete Website Design Analysis

## Executive Summary

Yasuragi.se embodies a sophisticated Japanese-inspired design philosophy that seamlessly blends traditional Japanese aesthetics (Wabi-Sabi, Ma, Kanso, Seijaku) with modern web design principles. The website creates a serene, tranquil user experience that reflects the spa's core values of peace, simplicity, and harmony.

---

## 1. OVERALL DESIGN PHILOSOPHY

### Design Principles Applied:
- **Ma (間) - Negative Space**: Extensive use of white space creates breathing room and visual hierarchy
- **Kanso (簡素) - Simplicity**: Clean, uncluttered layouts focusing on essential elements
- **Seijaku (静寂) - Tranquility**: Calm, peaceful aesthetic with subtle interactions
- **Wabi-Sabi**: Appreciation of imperfection and natural beauty

### Color Palette:
- **Primary**: Clean whites, soft beiges, and natural tones
- **Accents**: **Red (#C00 or similar)** - Used prominently for CTA buttons ("BOKA", "SÖK", "BOKA DAGSPA")
- **Dark Panels**: Dark olive-green/teal backgrounds for content overlays (e.g., "FÖRETAG" section)
- **Background**: White and light gray/off-white backgrounds for content sections
- **Text**: Dark gray/charcoal for readability (#2c2c2c range), white text on dark/colored backgrounds

### Layout Structure:
- **Full-width hero sections** with video backgrounds
- **Split-screen layouts** (50/50) for content and imagery
- **Card-based sections** for feature highlights
- **Generous padding** (6rem+ vertical spacing between sections)
- **Centered content** with max-width containers (1400px range)

---

## 2. TEXT PLACEMENT & TYPOGRAPHY

### Typography Hierarchy:

#### Hero Section:
- **Main Heading (H1)**: 
  - Large **sans-serif** font (likely 4-5rem on desktop)
  - Font: Clean, modern sans-serif (NOT serif - based on screenshots)
  - Weight: Bold (700)
  - Color: White (on dark backgrounds/video)
  - Letter spacing: Standard to slightly increased
  - Line height: Tight (1.2-1.3)
  - Placement: Varies - can be centered or left-aligned in content boxes
  - **Example**: "JAPANSKA BADET" appears in white, bold, large sans-serif

- **Subtitle/Description**:
  - Size: 1.2-1.4rem
  - Weight: Regular to Medium (400-500)
  - Line height: Generous (1.7-1.9)
  - Color: White (on dark backgrounds)
  - Placement: Below main heading, left-aligned in content boxes
  - **Example**: "En plats för alla sinnen" appears as white subheading

#### Section Headings (H2):
- **Size**: 3rem+ on desktop, very large and impactful
- **Font**: **Sans-serif** (consistent throughout - NOT serif)
- **Weight**: Bold (700)
- **Color**: Dark gray (#2c2c2c) on light backgrounds, white on dark backgrounds
- **Transform**: Often **UPPERCASE** (e.g., "BOENDE", "FÖRETAG", "WELLNESS PÅ DITT VIS")
- **Spacing**: 
  - Margin-bottom: 2rem
  - Section padding: 6rem vertical
- **Placement**: Left-aligned in most sections, centered for intro sections

#### Body Text:
- **Size**: 1.05-1.1rem (16-18px)
- **Font**: Sans-serif (clean, modern)
- **Weight**: Regular (400)
- **Line height**: Generous (1.8-1.9)
- **Color**: Medium gray (#555)
- **Max-width**: 600-900px for optimal readability
- **Spacing**: Paragraphs have 1.5rem bottom margin

#### Navigation Text:
- **Size**: 0.9-0.95rem
- **Weight**: Regular (400)
- **Transform**: **UPPERCASE** (all navigation items)
- **Letter spacing**: 1px
- **Color**: Dark gray/black (#2c2c2c)
- **Hover**: Color change to accent color
- **Items**: "HOTELLET", "JAPANSKA BADET", "ERBJUDANDEN", "MAT & DRYCK", "GRUPPER", "FÖRETAG", "OM YASURAGI", "PRESENTKORT"

### Text Placement Strategy:

1. **Centered Text**: Used for hero sections and intro content
2. **Left-aligned**: Used for content sections with images
3. **Max-width Containers**: Text never spans full width; typically 600-900px max
4. **Generous Margins**: 
   - Vertical spacing: 6rem between major sections
   - Horizontal padding: 2-4rem on containers
5. **White Space**: Significant gaps between text elements (Ma principle)

---

## 3. IMAGE PLACEMENT & ANIMATIONS

### Image Strategy:

#### Hero Section:
- **Full-screen video/image background** (100vh)
- **Background characteristics**:
  - Can be video OR high-quality static image
  - Examples seen: Person floating in water, smiling woman portrait
  - Autoplay, loop, muted (if video)
  - Smooth fade-in on load (opacity transition)
  - Overlay: Dark semi-transparent layer or dark content boxes
  - Object-fit: Cover (maintains aspect ratio)
  
- **Content Overlay Variations**:
  1. **Booking Widget Overlay** (Right side):
     - Semi-transparent or light-colored rectangular widget
     - Contains: Check-in/Check-out date selectors, room/guest selector, "SÖK" (Search) button, "BOKA DAGSPA" button
     - Red accent buttons within widget
     
  2. **Dark Content Box** (Left side):
     - Dark grey or dark olive-green rectangular panel
     - Contains: Small Japanese character icon, heading, subheading, body text, CTA button
     - White text on dark background
     - Example: "JAPANSKA BADET" section with dark grey box

#### Content Images:
- **Split-screen layouts**: 50/50 grid
  - Left: Image, Right: Content (or vice versa)
  - Alternating pattern for visual rhythm
- **Full-width images**: Used in wellness/feature sections
- **Card images**: 
  - Height: 350px
  - Object-fit: Cover
  - Rounded corners: Minimal (2px border-radius)
  - Hover effects: Subtle lift (translateY -5px)

#### Image Specifications:
- **Aspect ratios**: Maintained (object-fit: cover)
- **Quality**: High-resolution, professional photography
- **Placement**: 
  - Always paired with content (no standalone images)
  - Alternating left/right for visual interest
- **Min-height**: 600px for full sections, 350px for cards

### Animations & Transitions:

#### Subtle Animations (Seijaku principle):
1. **Video Fade-in**:
   - Initial opacity: 0
   - Transition: 0.3s ease
   - Final opacity: 1

2. **Hover Effects**:
   - **Buttons**: 
     - Transform: translateY(-2px)
     - Box-shadow: Increased on hover
     - Transition: 0.3s ease
   - **Cards**:
     - Transform: translateY(-5px)
     - Box-shadow: Enhanced
     - Transition: 0.3s ease
   - **Links**:
     - Color change
     - Underline animation (width: 0 to 100%)
     - Transform: translateX(5px) for arrow links

3. **Scroll Effects**:
   - **Navbar**: 
     - Background opacity change on scroll
     - Padding reduction (1.5rem to 1rem)
     - Box-shadow appears
     - Backdrop-filter: blur(10px)

4. **Menu Animations**:
   - **Mobile menu**: Slide-in from left (translateX)
   - **Hamburger icon**: Rotate animation (45deg/-45deg)
   - **Dropdown menus**: Fade-in with slight delay

#### Animation Philosophy:
- **Duration**: Short (0.3s) for responsiveness
- **Easing**: Smooth (ease or ease-in-out)
- **Purpose**: Enhance UX without distraction
- **No auto-animations**: Only on user interaction or scroll

---

## 4. NAVIGATION MENU

### Desktop Navigation:

#### Structure:
- **Position**: Fixed at top
- **Background**: 
  - Initial: rgba(255, 255, 255, 0.95) with backdrop-filter blur
  - Scrolled: rgba(255, 255, 255, 0.98) with shadow
- **Height**: 
  - Initial: ~80px (1.5rem padding)
  - Scrolled: ~70px (1rem padding)
- **Container**: Max-width 1400px, centered

#### Menu Items:
1. **Logo**: Left side, ~64px height
2. **Navigation Links**: 
   - Horizontal layout
   - Gap: 2.5rem between items
   - Font: 0.95rem, uppercase, letter-spacing 1px
   - Hover: Underline animation + color change
3. **CTA Button**: 
   - Right side: "BOKA" (Book) - **RED button**
   - Background: **Red (#C00 or similar)** - NOT green
   - Color: White text
   - Shape: **Rounded/oval** (NOT sharp corners)
   - Padding: 0.75rem 2rem
   - Border-radius: Significant (oval/rounded rectangle)
   - Very prominent and eye-catching

#### Dropdown Menus:
- **Trigger**: Hover on parent item
- **Position**: Absolute, below parent
- **Styling**: 
  - White background
  - Box-shadow: 0 4px 20px rgba(0,0,0,0.1)
  - Padding: 0.75rem vertical
- **Items**: 
  - Padding: 0.75rem 1.5rem
  - Hover: Background color change (#f5f5f5)
- **Delay**: 150ms on mouse leave (prevents accidental closure)

### Mobile Navigation:

#### Hamburger Menu:
- **Icon**: 3-line hamburger (25px width)
- **Animation**: Transforms to X on open
  - Top line: Rotate 45deg
  - Middle: Opacity 0
  - Bottom: Rotate -45deg
- **Position**: Right side of navbar

#### Mobile Menu Panel:
- **Position**: Fixed, full-width
- **Layout**: Vertical stack
- **Animation**: Slide-in from left (translateX -100% to 0)
- **Background**: White
- **Padding**: 2rem
- **Gap**: 1.5rem between items
- **Shadow**: 0 4px 20px rgba(0,0,0,0.1)

#### Mobile Menu Items:
- **Full-width**: Links span entire width
- **Dropdown**: Static (no hover), expands on click
- **CTA Button**: Full-width, centered text

### Navigation Features:

1. **Active State**: 
   - Underline animation
   - Color change to accent
   - Based on current route

2. **Smooth Scrolling**: 
   - Scroll behavior: smooth
   - Navbar adapts on scroll

3. **Accessibility**:
   - Keyboard navigation support
   - ARIA labels on mobile toggle
   - Focus states on interactive elements

---

## 5. SECTION-BY-SECTION BREAKDOWN

### Hero Section:
- **Layout**: Full-screen video/image background with content overlay
- **Content Variations**:
  
  **Variation 1 - Booking Widget:**
  - Full-width hero image (person smiling, warm tones)
  - **Booking widget on RIGHT side**:
    - Check-in/Check-out date boxes (rounded corners)
    - Room/guest selector dropdown
    - Red "SÖK" (Search) button
    - Red "BOKA DAGSPA" (Book Day Spa) button with arrow
    - Promo code link below
  
  **Variation 2 - Content Box:**
  - Full-width hero image/video (person floating in water)
  - **Dark content box on LEFT side**:
    - Small Japanese character icon at top
    - Large white heading (e.g., "JAPANSKA BADET")
    - White subheading (e.g., "En plats för alla sinnen")
    - White body text (left-aligned, generous line spacing)
    - Red "LÄS MER" (Read More) button with arrow
- **Positioning**: Content boxes positioned left or right, not centered

### Introduction Section:
- **Layout**: Centered text, max-width 900px
- **Spacing**: 6rem vertical padding
- **Content**: Welcome message, 2-3 paragraphs

### Feature Sections (Wellness, Dining):
- **Layout**: 50/50 split-screen grid
- **Image**: Full-height (min 600px), left or right
- **Content**: 
  - Heading (H2)
  - Description paragraph
  - Link with arrow (→)
- **Background**: Alternating white and #fafafa

### Visit Options Section:
- **Layout**: 2-column card grid
- **Cards**: 
  - Image top (350px height)
  - Content below (2.5rem padding)
  - Hover: Lift effect
- **Spacing**: 3rem gap between cards

### Accommodation Section ("BOENDE"):
- **Layout**: 50/50 split with image and content
- **Left Side**: 
  - Large vertical image (building exterior with dark wood siding, windows, trees)
  - Full-height image, well-integrated
- **Right Side**:
  - Large uppercase heading: "BOENDE" (dark grey, bold, sans-serif)
  - Subheading: "Japansk design med skandinavisk utsikt" (dark grey)
  - Body text: Multiple paragraphs describing 191 rooms, architect Yoji Kasajima, views, breakfast buffet
  - **Two buttons**:
    1. Red "BOKA BOENDE" (Book Accommodation) - primary CTA with arrow
    2. Light grey "SE VÅRA RUM" (See Our Rooms) - secondary CTA with arrow
  - Small square image below buttons (interior room with bed, shoji screens, window view)

### Company Section ("FÖRETAG"):
- **Layout**: Split layout (approximately 40% left, 60% right)
- **Left Panel** (Dark olive-green background):
  - Small Japanese character graphic at top left
  - Large white heading: "FÖRETAG" (uppercase, bold)
  - White subheading: "Spa & Konferens i Stockholm"
  - White body text: Describes spa and conference facilities, 191 rooms, Japanese spa features
  - **Two white buttons at bottom**:
    1. "BOKNINGSFÖRFRÅGAN" (Booking Inquiry) - dark grey text, arrow
    2. "LÄS MER" (Read More) - dark grey text, arrow
- **Right Panel** (Large photograph):
  - Warm-toned image of people in dark blue robes with white patterns
  - Social setting (dining/lounge area)
  - Fruits, glass bottle, notepad on table
  - Reddish-brown wall with diagonal shadows
  - Large window showing green foliage
  - Creates warm, inviting, serene atmosphere

---

## 6. RESPONSIVE DESIGN

### Breakpoints:
- **Desktop**: 1200px+
- **Tablet**: 968px - 1200px
- **Mobile**: < 968px
- **Small Mobile**: < 768px

### Responsive Adaptations:

#### Typography:
- **Hero H1**: 
  - Desktop: 4.5rem
  - Tablet: 3.5rem
  - Mobile: 2.8rem
  - Small: 2.2rem
- **Section H2**: 
  - Desktop: 3rem
  - Tablet: 2.5rem
  - Mobile: 2rem

#### Layout:
- **Split-screens**: Stack vertically on mobile
- **Card grids**: Single column on mobile
- **Padding**: Reduced on mobile (4rem vertical, 1.5rem horizontal)

#### Navigation:
- **Desktop**: Horizontal menu
- **Mobile**: Hamburger menu with slide-out panel

---

## 7. KEY DESIGN PATTERNS

### Visual Patterns:
1. **Alternating Layouts**: Left-right image/content alternation
2. **Consistent Spacing**: 6rem vertical, 2-4rem horizontal
3. **Card Elevation**: Subtle shadows, increased on hover
4. **Button Hierarchy**: Primary (filled) + Secondary (outline)

### Interaction Patterns:
1. **Hover States**: Always present, subtle animations
2. **Scroll Behavior**: Navbar adapts, smooth scrolling
3. **Loading States**: Video fade-in, no jarring transitions
4. **Focus States**: Visible for accessibility

### Content Patterns:
1. **Section Structure**: Heading → Description → CTA
2. **Text Blocks**: Never exceed 900px width
3. **Image-Text Balance**: Always paired, never standalone
4. **White Space**: Generous margins and padding

---

## 8. COMPARATIVE ANALYSIS WITH CURRENT MINTI DESIGN

### Similarities:
- ✅ Full-screen hero with video
- ✅ Split-screen content sections
- ✅ Card-based layouts
- ✅ Similar typography hierarchy
- ✅ Responsive design approach

### Differences to Consider:
- **Yasuragi**: More minimal, more white space
- **Yasuragi**: Subtler animations (Seijaku principle)
- **Yasuragi**: Alternating section backgrounds (white/#fafafa)
- **Yasuragi**: More generous vertical spacing (6rem vs 4rem)
- **Yasuragi**: Cleaner navigation (less visual weight)

---

## 9. RECOMMENDATIONS FOR IMPLEMENTATION

### Typography:
1. Increase vertical spacing between sections (6rem)
2. Ensure max-width on text blocks (600-900px)
3. Use more generous line-height (1.8-1.9)
4. **Use sans-serif for ALL text** (headings and body) - NOT serif
5. **Make section headings UPPERCASE and bold**
6. Use white text on dark backgrounds for contrast
7. Maintain consistent font family throughout

### Images:
1. Implement alternating left/right layouts
2. Add subtle hover effects (translateY -5px)
3. Ensure consistent image heights (600px sections, 350px cards)
4. Use object-fit: cover for all images
5. **Consider dark content boxes overlaying hero images** (left or right side)
6. **Use warm, inviting photography** with natural lighting
7. **Full-bleed images** for maximum impact
8. **Consider booking widget overlay** for hero section if applicable

### Animations:
1. Keep transitions short (0.3s)
2. Use smooth easing (ease or ease-in-out)
3. Add navbar scroll effects (opacity + shadow)
4. Implement video fade-in on load

### Navigation:
1. Add backdrop-filter blur effect
2. Implement scroll-based navbar changes
3. Add smooth underline animations on hover
4. Ensure mobile menu slide-in animation
5. **Use RED for primary CTA button** (not green) - rounded/oval shape
6. Include language selector (globe icon) if needed
7. Logo should include Japanese characters if applicable

### Layout:
1. Increase section padding (6rem vertical)
2. Use alternating backgrounds (white/#fafafa)
3. Center content with max-width containers
4. Ensure consistent spacing throughout
5. **Consider dark colored panels** (olive-green, dark grey) for content sections
6. **Implement split-screen layouts** with strong contrast (dark panel + image)
7. **Vary hero section layouts** (booking widget vs content box)
8. **Use rounded/oval buttons** (not sharp corners) for primary CTAs

---

## 10. DETAILED SCREENSHOT OBSERVATIONS

### Navigation Menu (From Screenshots):
- **Logo**: Left side, includes stylized Japanese character/symbol + "YASURAGI" text + Japanese characters "安らぎ"
- **Menu Items**: All uppercase, dark text, horizontal layout
- **"BOKA" Button**: Red, rounded/oval, white text, very prominent
- **Language Selector**: Globe icon + dropdown arrow on far right
- **Header Background**: White/light, clean and minimal

### Hero Section Variations Observed:

#### Type 1: Booking Widget Hero
- **Background**: Warm-toned portrait of smiling woman
- **Widget Position**: Right side overlay
- **Widget Features**:
  - Date selectors with rounded corners
  - Clear hierarchy (dates larger than labels)
  - Red accent buttons
  - Promo code option
  - Day spa booking CTA

#### Type 2: Content Box Hero
- **Background**: Person floating in dark, calm water (serene, tranquil)
- **Box Position**: Left side
- **Box Styling**: Dark grey background, white text
- **Content**: Japanese icon, heading, subheading, description, CTA
- **Mood**: Very peaceful, meditative

### Section Layout Patterns:

1. **Split-Screen with Dark Panel**:
   - Dark colored panel (olive-green, dark grey) on one side
   - White text on dark background
   - Large photograph on other side
   - Creates strong visual contrast

2. **Split-Screen with Light Panel**:
   - Light background panel with dark text
   - Image on opposite side
   - More subtle contrast

3. **Full-Width Content**:
   - Centered text blocks
   - Large headings
   - Generous white space

### Button Design Patterns:

1. **Primary CTA Buttons**:
   - **Color**: Red (#C00 range)
   - **Shape**: Rounded/oval (NOT sharp corners)
   - **Text**: White, uppercase
   - **Icons**: Arrow pointing right
   - **Examples**: "BOKA", "SÖK", "BOKA DAGSPA", "BOKA BOENDE"

2. **Secondary Buttons**:
   - **Color**: Light grey/white background
   - **Text**: Dark grey, uppercase
   - **Icons**: Arrow pointing right
   - **Examples**: "SE VÅRA RUM", "LÄS MER"

3. **Button Placement**:
   - Often appear in pairs (primary + secondary)
   - Positioned below text content
   - Consistent arrow icon usage

### Typography Observations:

- **All text is sans-serif** - no serif fonts observed
- **Headings are consistently UPPERCASE** and bold
- **Generous line spacing** in body text (1.8-1.9)
- **Clear hierarchy**: Large headings → subheadings → body text
- **White text on dark backgrounds** creates strong contrast
- **Dark text on light backgrounds** maintains readability

### Image Characteristics:

- **High-quality, professional photography**
- **Warm, inviting tones** (especially in people photos)
- **Natural lighting** (soft, ambient)
- **Serene, peaceful subject matter**
- **Full-bleed images** (edge-to-edge)
- **Consistent aspect ratios** maintained
- **Images tell a story** (wellness, relaxation, nature)

### Interactive Elements:

- **Floating Icon**: Small red circular icon with Japanese character in bottom right corner
- **Notification Badge**: Red bubble with number (e.g., "1") on icon
- **Likely Functions**: Chat support, help, or quick actions

---

## 11. KEY VISUAL DIFFERENCES FROM INITIAL ANALYSIS

Based on the actual screenshots, here are important corrections and additions:

### Critical Corrections:

1. **Typography**: 
   - ❌ **NOT serif fonts** - All text is sans-serif
   - ✅ Headings are bold, uppercase, sans-serif
   - ✅ Body text is regular weight, sans-serif

2. **Color Scheme**:
   - ❌ **NOT green accent** - Primary accent is **RED** (#C00 range)
   - ✅ Red used for all primary CTA buttons
   - ✅ Dark olive-green/teal used for content panels (not just white/grey)

3. **Button Design**:
   - ❌ **NOT sharp corners** - Buttons are **rounded/oval**
   - ✅ Red primary buttons with white text
   - ✅ Light grey/white secondary buttons with dark text
   - ✅ Arrow icons consistently used

4. **Hero Section Variations**:
   - ✅ **Two distinct hero patterns**:
     - Booking widget overlay (right side)
     - Dark content box (left side)
   - ✅ Not always centered content

5. **Section Layouts**:
   - ✅ **Dark colored panels** (olive-green, dark grey) for content
   - ✅ Strong contrast between dark panels and light images
   - ✅ Not always 50/50 split - can be 40/60 or other ratios

6. **Navigation**:
   - ✅ Logo includes Japanese characters "安らぎ"
   - ✅ All menu items are UPPERCASE
   - ✅ Red "BOKA" button is very prominent (oval shape)

### Additional Observations:

- **Floating UI Element**: Small red circular icon with notification badge in bottom right
- **Language Selector**: Globe icon visible in header
- **Image Quality**: Very high-resolution, warm-toned, professional photography
- **Content Boxes**: Dark backgrounds create strong visual hierarchy
- **Button Pairs**: Often two buttons together (primary red + secondary grey)

---

## 12. CONCLUSION

Yasuragi.se demonstrates a masterful application of Japanese design principles to create a serene, elegant, and highly functional website. The design prioritizes:

1. **Simplicity** (Kanso): Clean, uncluttered layouts
2. **Negative Space** (Ma): Generous white space for breathing room
3. **Tranquility** (Seijaku): Subtle, calming interactions
4. **Harmony**: Balanced image-text relationships

The website successfully translates the spa's physical experience into a digital format, creating an immersive and peaceful user journey that encourages booking and exploration.

---

*Analysis Date: 2025*
*Source: https://yasuragi.se/*
*Design Principles: Japanese Aesthetics (Ma, Kanso, Seijaku, Wabi-Sabi)*

