# Shadow/Elevation Token Reference

## Elevation Levels

Material Design inspired elevation system.

```typescript
import { elevation } from "@/lib/design-tokens";

<div className={elevation[2]}>Elevated card</div>
```

**Available Levels:** `0`, `1`, `2`, `3`, `4`, `5`

## Elevation Hover States

```typescript
import { elevationHover } from "@/lib/design-tokens";

<div className={cn(elevation[1], elevationHover[2])}>
  Hover to elevate
</div>
```

## Surface Styles

Pre-composed surface styles with elevation and background.

```typescript
import { surface } from "@/lib/design-tokens";

<div className={surface.raised}>Raised surface</div>
<div className={surface.floating}>Floating surface</div>
<div className={surface.modal}>Modal surface</div>
```

**Available Surfaces:** `flat`, `raised`, `floating`, `modal`

## Elevation Guidelines

- **0**: No elevation (flat surfaces)
- **1**: Subtle elevation (cards, raised surfaces)
- **2**: Standard elevation (interactive cards, buttons)
- **3**: Prominent elevation (dropdowns, popovers)
- **4**: High elevation (modals, dialogs)
- **5**: Maximum elevation (toasts, tooltips)

## Usage Example

```typescript
import { elevation, surface, elevationHover } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

// Standard card
<div className={cn(surface.raised, elevationHover[2])}>
  Card content
</div>

// Interactive card with hover
<div className={cn(
  elevation[1],
  elevationHover[3],
  "transition-shadow duration-200"
)}>
  Hover me
</div>
```

## Common Patterns

- **Cards**: `elevation[1]` or `surface.raised`
- **Interactive Cards**: `elevation[1]` + `elevationHover[2]`
- **Modals**: `elevation[4]` or `surface.modal`
- **Buttons**: `elevation[0]` (no shadow) or `elevation[1]` on hover


















