<!-- filepath: /Users/lee/Documents/Projects/lagre/thesis/thesis-frontend/docs/main/THEMES.md -->
# Agent Guidelines for thesis-frontend

## Commands
- **Build**: `npm run build` or `bun run build` (Turbopack)
- **Dev**: `npm run dev` or `bun run dev` (Turbopack)
- **Start**: `npm run start` or `bun start`
- **Type Check**: `npx tsc --noEmit` (strict mode enabled)
- **Lint**: `npx biome check` (organize imports only)
- **Test**: No framework configured (test files exist but commented out)
- **Single Test**: Uncomment and run test files manually with Node.js

## Code Style
- **Imports**: External libs first, then internal with @/ alias; sort alphabetically
- **Types**: Strict TS, explicit types, prefer interfaces, Zod validation
- **Naming**: camelCase vars/functions, PascalCase components/types, UPPER_SNAKE constants
- **Formatting**: 2-space indent, semicolons, single quotes, trailing commas
- **Error Handling**: try/catch with ZodError handling, async/await
- **Comments**: JSDoc for exports only, no inline comments
- **Functions**: <50 lines, functional style, const over let, avoid side effects
- **Components**: "use client" directive for client components

## Best Practices
- Validate inputs with Zod, never log/expose secrets
- Run typecheck before commits, write tests for new features
- Use meaningful commit messages, follow existing patterns
- Prefer functional programming, avoid mutations
- No Cursor or Copilot rules configured

## Styling & Theming

### Design System
- **Framework**: TailwindCSS v4 with @tailwindcss/postcss plugin
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Theme System**: next-themes for light/dark mode support
- **Color Format**: OKLCH color space for better perceptual uniformity
- **Icons**: lucide-react icon library
- **Design Philosophy**: Modern, clean, with depth through subtle shadows and borders

### Color Palette
Use CSS custom properties defined in [app/globals.css](app/globals.css):

**Light Mode:**
- Primary: `oklch(0.208 0.042 265.755)` (deep blue)
- Background: `oklch(1 0 0)` (white)
- Foreground: `oklch(0.129 0.042 264.695)` (dark blue-gray)
- Muted: `oklch(0.968 0.007 247.896)` (light gray)
- Border: `oklch(0.929 0.013 255.508)` (soft gray)

**Dark Mode:**
- Primary: `oklch(0.929 0.013 255.508)` (light blue-gray)
- Background: `oklch(0.129 0.042 264.695)` (dark blue-gray)
- Foreground: `oklch(0.984 0.003 247.858)` (near white)
- Muted: `oklch(0.279 0.041 260.031)` (dark gray)
- Border: `oklch(1 0 0 / 10%)` (transparent white)

---

## 🎨 UI/UX UPGRADE PLAN (2024)

### Overview
Complete redesign focusing on modern aesthetics, better visual hierarchy, micro-interactions, and improved user experience across all components.

### Core Design Principles
1. **Depth & Layering**: Use subtle shadows, borders, and elevation to create visual hierarchy
2. **Smooth Interactions**: Add micro-animations and transitions for better feedback
3. **Consistent Spacing**: Implement 8px spacing system for better rhythm
4. **Visual Feedback**: Clear hover, focus, active, and disabled states
5. **Accessibility First**: Maintain WCAG 2.1 AA standards throughout

### Component Improvements

#### 1. **Cards** (card.tsx)
**Current Issues:**
- Flat appearance, lacks depth
- No hover effects
- Minimal visual interest

**Improvements:**
- Add subtle gradient backgrounds with `bg-gradient-to-br`
- Implement hover elevation with `hover:shadow-lg` and `hover:-translate-y-0.5`
- Add border glow effect on hover using `hover:border-primary/50`
- Improve card header with better padding and separator
- Add smooth transitions: `transition-all duration-300`

#### 2. **Buttons** (button.tsx)
**Current Issues:**
- Basic styling, minimal feedback
- No pressed state animations
- Inconsistent sizing

**Improvements:**
- Add scale animation on hover: `hover:scale-[1.02]`
- Implement active state: `active:scale-[0.98]`
- Add shadow on hover: `hover:shadow-md`
- Improve ghost button visibility with `hover:bg-accent/80`
- Add loading spinner integration
- Better disabled state with reduced opacity and cursor-not-allowed

#### 3. **Inputs** (input.tsx)
**Current Issues:**
- Minimal focus indication
- No interaction feedback
- Plain appearance

**Improvements:**
- Add focus ring with smooth transition
- Implement border color change on focus: `focus:border-primary`
- Add background tint on focus: `focus:bg-accent/5`
- Better placeholder styling with animation
- Add clear icon button for text inputs
- Smooth transition for all states: `transition-all duration-200`

#### 4. **Tables** (table.tsx)
**Current Issues:**
- Basic row styling
- No hover feedback
- Poor visual separation

**Improvements:**
- Add alternating row backgrounds: `odd:bg-muted/30`
- Implement smooth row hover: `hover:bg-accent/50 transition-colors`
- Better header styling with gradient: `bg-gradient-to-b from-muted to-background`
- Add sticky header support
- Improve cell spacing and alignment
- Add row selection highlight effect

#### 5. **Badges** (badge.tsx)
**Current Issues:**
- Flat design
- Limited variants
- No hover effects

**Improvements:**
- Add subtle shadow: `shadow-sm`
- Implement hover glow: `hover:shadow-md hover:shadow-primary/20`
- Add dot indicator variant for status
- Smooth scale on hover: `hover:scale-105`
- Better color variants with improved contrast

#### 6. **Dropdown Menu** (dropdown-menu.tsx)
**Current Issues:**
- Basic list appearance
- No hover preview
- Minimal visual feedback

**Improvements:**
- Add backdrop blur: `backdrop-blur-md`
- Implement smooth item hover with accent background
- Add icons to menu items by default
- Better separator styling with gradient
- Add keyboard shortcut indicators
- Smooth open/close animations with spring physics

#### 7. **Tabs** (Custom Tab Navigation)
**Current Issues:**
- Button-style tabs lack finesse
- No active indicator animation
- Poor visual hierarchy

**Improvements:**
- Implement sliding active indicator with `framer-motion`
- Add smooth color transitions
- Better spacing and padding
- Add subtle shadow under active tab
- Implement glass-morphism effect: `backdrop-blur-sm bg-background/80`

#### 8. **Forms** (form.tsx)
**Current Issues:**
- Minimal error indication
- Basic label styling
- No success states

**Improvements:**
- Add floating labels with smooth animation
- Implement color-coded validation states
- Better error messages with slide-in animation
- Add success checkmark animation
- Improve field group spacing
- Add helper text with better typography

#### 9. **Modals/Dialogs** (alert-dialog.tsx)
**Current Issues:**
- Basic overlay
- Simple content container
- No entrance animation variety

**Improvements:**
- Add backdrop blur: `backdrop-blur-sm`
- Implement spring entrance animation
- Better overlay opacity: `bg-black/60`
- Add subtle border to content
- Improve header with icon support
- Better button layout with primary action emphasis

#### 10. **Navigation** (Navbar.tsx)
**Current Issues:**
- Basic layout
- No active link indication
- Minimal hover effects

**Improvements:**
- Add glass-morphism effect: `backdrop-blur-md bg-background/80`
- Implement active link underline animation
- Better hover states with smooth transitions
- Add sticky positioning with shadow on scroll
- Improve mobile menu with slide animation
- Better logo/brand area with subtle animation

### New Component Enhancements

#### 11. **Loading States**
- Add skeleton loaders with shimmer effect
- Implement progressive content loading
- Better spinner with gradient spin
- Add page transition animations

#### 12. **Empty States**
- Design illustrated empty states
- Add helpful CTAs
- Better messaging with icon support

#### 13. **Toast Notifications**
- Implement slide-in animations
- Add icon variants (success, error, warning, info)
- Better positioning and stacking
- Auto-dismiss with progress bar

### Layout Improvements

#### Dashboard Layouts
**Improvements:**
- Add subtle grid background pattern
- Implement better stat card designs with icons and trends
- Add chart card variants with hover details
- Better action button placement with FAB option
- Implement breadcrumb navigation

#### Page Containers
**Improvements:**
- Add max-width constraints for readability
- Implement better section spacing with visual separators
- Add scroll-to-top button
- Better footer design with gradient

### Animation & Transitions

#### Micro-Interactions
1. **Hover Effects:**
   - Scale: `hover:scale-[1.02]` for clickable elements
   - Shadow: `hover:shadow-lg` for cards and buttons
   - Border glow: `hover:border-primary/50` for focused elements
   - Background tint: `hover:bg-accent/10` for lists

2. **Focus States:**
   - Ring animation: `focus-visible:ring-2 focus-visible:ring-primary/50`
   - Border color transition: `focus:border-primary`
   - Smooth transitions: `transition-all duration-200`

3. **Active States:**
   - Scale down: `active:scale-[0.98]`
   - Brightness change: `active:brightness-95`

4. **Loading States:**
   - Pulse animation for skeletons
   - Spin animation for spinners
   - Shimmer effect for cards

#### Page Transitions
- Fade-in on mount
- Slide-in for modals
- Spring animations for dropdowns
- Smooth scroll behavior

### Spacing System (8px base)
- **xs**: `gap-1` (4px)
- **sm**: `gap-2` (8px)
- **md**: `gap-4` (16px)
- **lg**: `gap-6` (24px)
- **xl**: `gap-8` (32px)
- **2xl**: `gap-12` (48px)

### Typography Enhancements
- Add line height variations for better readability
- Implement gradient text for headings: `bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent`
- Better font weight hierarchy
- Improved letter spacing for headings

### Shadow Scale
- **xs**: `shadow-xs` - Subtle depth
- **sm**: `shadow-sm` - Small elements
- **md**: `shadow-md` - Cards, buttons
- **lg**: `shadow-lg` - Elevated elements
- **xl**: `shadow-xl` - Modals, popovers
- **2xl**: `shadow-2xl` - Maximum elevation

### Border Treatments
- Default: `border border-border`
- Hover: `hover:border-primary/50`
- Focus: `focus:border-primary`
- Gradient borders for special elements

### Accessibility Enhancements
- Better focus indicators with high contrast
- Improved color contrast ratios
- Keyboard navigation highlights
- Screen reader optimized labels
- Reduced motion support: `prefers-reduced-motion:transition-none`

### Dark Mode Optimizations
- Adjust shadow opacity for dark backgrounds
- Better border visibility with `border-white/10`
- Soften backgrounds with opacity layers
- Improve glass-morphism in dark mode

### Performance Considerations
- Use `will-change` sparingly for animated elements
- Implement `contain: layout` for isolated components
- Use CSS transforms over position changes
- Lazy load heavy animations

### Implementation Priority
1. **Phase 1 (High Impact):**
   - Cards, Buttons, Inputs
   - Navigation, Tabs
   - Tables, Badges

2. **Phase 2 (Medium Impact):**
   - Forms, Dropdowns
   - Modals, Dialogs
   - Loading states

3. **Phase 3 (Polish):**
   - Animations, Transitions
   - Empty states, Toasts
   - Page layouts

### Testing Checklist
- [ ] Test all hover states in light/dark mode
- [ ] Verify keyboard navigation
- [ ] Check mobile responsiveness
- [ ] Test with screen readers
- [ ] Verify color contrast ratios
- [ ] Test reduced motion preferences
- [ ] Cross-browser compatibility
- [ ] Performance metrics (no jank)

---

## Component Patterns

#### Cards
```tsx
<Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/50 hover:border-primary/50">
  <CardHeader className="border-b border-border/50 bg-gradient-to-br from-background to-muted/20">
    <CardTitle className="flex items-center gap-2">
      <Icon className="size-5 text-primary" />
      Title
    </CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent className="pt-6">
    {/* Main content */}
  </CardContent>
  <CardFooter className="border-t border-border/50 bg-muted/20">
    {/* Optional footer actions */}
  </CardFooter>
</Card>
```

#### Buttons
```tsx
<Button
  variant="default"
  size="default"
  className="hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md"
>
  Action Button
</Button>
```

#### Forms
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
      control={form.control}
      name="fieldName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">Label</FormLabel>
          <FormControl>
            <Input
              {...field}
              className="transition-all duration-200 focus:shadow-sm"
            />
          </FormControl>
          <FormMessage className="text-xs animate-in slide-in-from-top-1" />
        </FormItem>
      )}
    />
  </form>
</Form>
```

#### Tables
```tsx
<Table>
  <TableHeader className="bg-gradient-to-b from-muted to-background sticky top-0">
    <TableRow className="hover:bg-transparent">
      <TableHead className="font-semibold">Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-accent/50 transition-colors cursor-pointer">
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Layout Patterns

#### Page Structure
```tsx
<div className="container mx-auto py-8 px-4 max-w-7xl">
  <div className="mb-8 space-y-2">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
      Page Title
    </h1>
    <p className="text-muted-foreground">Optional subtitle</p>
  </div>
  {/* Content */}
</div>
```

#### Dashboard Layout
```tsx
<div className="p-8 space-y-8">
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground mt-1">Welcome back!</p>
    </div>
    <Button className="shadow-md">
      <Plus className="size-4 mr-2" />
      Action
    </Button>
  </div>
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {/* Stats cards */}
  </div>
</div>
```

#### Tab Navigation
```tsx
<div className="inline-flex p-1 gap-1 rounded-lg bg-muted/50 backdrop-blur-sm">
  <button
    type="button"
    onClick={() => setActiveTab("tab1")}
    className={cn(
      "px-4 py-2 rounded-md font-medium transition-all duration-200",
      activeTab === "tab1"
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
    )}
  >
    Tab 1
  </button>
</div>
```

### Typography
- **Headings**:
  - H1: `text-4xl font-bold tracking-tight` with optional gradient
  - H2: `text-3xl font-bold tracking-tight`
  - H3: `text-2xl font-semibold`
  - H4: `text-xl font-semibold`
- **Body**: `text-base leading-relaxed` (default)
- **Small**: `text-sm leading-relaxed`
- **Muted**: `text-muted-foreground`
- **Font**: Roboto (defined in [app/layout.tsx](app/layout.tsx))

### Spacing
- **Container**: `container mx-auto px-4 md:px-6 max-w-7xl`
- **Section**: `py-12 md:py-16 lg:py-24` for large sections
- **Card padding**: `p-6`
- **Gap**: Use `gap-2`, `gap-4`, `gap-6`, `gap-8` for consistent spacing
- **Grid**: `grid gap-6 md:grid-cols-2 lg:grid-cols-3`

### Animations
- **Transitions**: Use `transition-all duration-200` or `transition-colors duration-200`
- **Hover states**: `hover:shadow-lg hover:-translate-y-0.5`
- **Scale effects**: `hover:scale-[1.02] active:scale-[0.98]`
- **Custom animations**: Defined in [app/globals.css](app/globals.css)
  - `animate-float`: Floating effect (20s)
  - `animate-float-delayed`: Delayed floating effect
  - `animate-shimmer`: Shimmer effect for skeletons
  - `animate-slide-in`: Slide in from bottom
- **Loading**: Use `<Spinner />` with gradient animation

### Responsive Design
- **Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)
- **Mobile-first**: Start with mobile layout, add breakpoints as needed
- **Grid patterns**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Flex wrap**: Use `flex-wrap` for adaptive layouts
- **Hide/show**: Use `hidden md:block` or `md:hidden`

### Component Data Attributes
All shadcn components use `data-slot` attributes for styling:
- `data-slot="button"`, `data-slot="card"`, `data-slot="input"`, etc.
- Use for targeted CSS selectors when needed
- Add custom data attributes for state: `data-state="active"`, `data-loading="true"`

### Accessibility
- **Focus states**: `focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2`
- **Invalid states**: `aria-invalid:ring-destructive/50 aria-invalid:border-destructive`
- **Disabled states**: `disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed`
- **Labels**: Always pair inputs with labels using `FormLabel`
- **Keyboard navigation**: Ensure all interactive elements are keyboard accessible
- **Screen readers**: Use `sr-only` for screen reader only text

### Best Practices
1. **Use shadcn components**: Import from `@/components/ui/shadcn` instead of creating custom components
2. **cn() utility**: Always use [`cn()`](lib/utils/cn.ts) for merging Tailwind classes
3. **Color classes**: Use semantic color names (`bg-primary`, `text-muted-foreground`) instead of raw colors
4. **Dark mode**: Test all components in both light and dark themes
5. **Consistent spacing**: Use spacing scale (`gap-4`, `p-6`, `mb-4`) consistently
6. **Typography hierarchy**: Maintain clear visual hierarchy with consistent font sizes
7. **Loading states**: Always show loading UI with `<Loading />` or `<Spinner />`
8. **Error states**: Use toast notifications via `sonner` for user feedback
9. **Form validation**: Always use Zod schemas with react-hook-form
10. **Gradients**: Use `bg-gradient-to-br` for background gradients with OKLCH colors
11. **Animations**: Keep animations under 300ms for micro-interactions
12. **Shadows**: Use shadow scale consistently across similar components

### File Organization
- **Global styles**: [app/globals.css](app/globals.css)
- **shadcn components**: [components/ui/shadcn/](components/ui/shadcn/)
- **Custom components**: [components/ui/](components/ui/)
- **Utilities**: [lib/utils/](lib/utils/)
- **Theme provider**: [components/provider/ThemeProvider.tsx](components/provider/ThemeProvider.tsx)

### Example Component Template
```tsx
"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { cn } from "@/lib/utils";

export function ExampleComponent() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/50 hover:border-primary/50">
        <CardHeader className="border-b border-border/50 bg-gradient-to-br from-background to-muted/20">
          <CardTitle>Example Title</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Example description text.
          </p>
          <Button
            variant="default"
            size="default"
            className="hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Action Button
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Do's and Don'ts

**DO:**
- ✅ Use semantic color variables (`bg-primary`, `text-foreground`)
- ✅ Use shadcn components for consistency
- ✅ Apply hover/focus states for interactive elements
- ✅ Use `cn()` for conditional class merging
- ✅ Test in both light and dark modes
- ✅ Use consistent spacing from Tailwind scale
- ✅ Add loading states for async operations
- ✅ Use `data-slot` attributes in shadcn components
- ✅ Implement smooth transitions for all interactive elements
- ✅ Add proper focus rings for accessibility
- ✅ Use scale transforms for micro-interactions
- ✅ Test with keyboard navigation

**DON'T:**
- ❌ Use arbitrary color values (e.g., `bg-[#3b82f6]`)
- ❌ Create custom components that duplicate shadcn functionality
- ❌ Use inline styles (prefer Tailwind classes)
- ❌ Mix spacing units (stick to Tailwind scale)
- ❌ Forget aria labels for accessibility
- ❌ Use `className` string concatenation (use `cn()`)
- ❌ Hardcode colors without dark mode variants
- ❌ Skip hover states on interactive elements
- ❌ Use transitions longer than 300ms for micro-interactions
- ❌ Forget to test reduced motion preferences
- ❌ Overuse animations (can cause motion sickness)
- ❌ Use `will-change` without removing it after animation