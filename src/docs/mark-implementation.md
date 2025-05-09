# squareyourcircles Mark Implementation

## Overview

The squareyourcircles mark is a key design element that must be displayed on every page of the website. This document explains how the mark is implemented and how to control its display.

## Implementation Details

The mark is implemented as a global component that is included in the root layout. It can be displayed in two ways:

1. **Background Variant**: The mark is displayed as a large background image
2. **Corner Variant**: The mark is displayed in the top corner when a page has too much content

The system automatically determines which variant to use based on:
- The amount of content on the page
- The viewport size
- Custom settings from individual pages

## Usage

### Default Behavior

By default, the mark is included in the root layout and will be displayed on every page. No additional code is needed for most cases.

### Controlling the Mark Display

For pages with specific layout requirements, you can control how the mark is displayed:

```tsx
'use client';

import { useMarkControl } from '@/hooks/useMarkControl';

export default function YourPage() {
  // Force the corner variant for this page
  useMarkControl({ variant: 'corner' });
  
  // Or set a custom threshold for when to switch to corner variant
  // useMarkControl({ threshold: 5 });

  return (
    // Your page content
  );
}
```

### CSS Classes

You can also use CSS classes to add the mark to specific elements:

```html
<!-- Add the mark as a background -->
<div className="syc-mark-bg">
  <!-- Content -->
</div>

<!-- Add the mark in the corner -->
<div className="syc-mark-corner">
  <!-- Content -->
</div>
```

## Context and Provider

The mark's behavior is managed through React Context:

- `MarkProvider`: Provides mark state and control functions
- `useMark`: Hook to access the mark context
- `useMarkControl`: Hook to control mark display from any component
- `usePageCrowding`: Hook that dynamically determines which variant to use

## Design Guidelines

- The mark should always be visible on every page
- Prefer the background variant when possible
- Use the corner variant when the page is crowded
- Maintain appropriate contrast for readability

## SVG Asset

The mark is implemented as an SVG located at `/public/squareyourcircles.svg`. If you need to update the design, replace this file. 