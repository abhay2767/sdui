# 📊 COVERAGE.md — Component & Pattern Coverage Matrix

## 1. Supported Components Registry

| Component Type | SDUI Key Identifier | Dynamic Props Supported | Actions Supported | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Header** | `HEADER` | `title`, `subtitle`, `location`, `searchPlaceholder`, `showSearch` | `OPEN_BOTTOM_SHEET`, `NAVIGATE` | ✅ Fully Supported |
| **Banner** | `BANNER` | `title`, `subtitle`, `ctaText`, `imageUrl`, `backgroundColor`, `textColor`, `badge` | `OPEN_BOTTOM_SHEET`, `API_CALL` | ✅ Fully Supported |
| **Car Card** | `CAR_CARD` | `title`, `subtitle`, `price`, `emi`, `year`, `mileage`, `fuelType`, `transmission`, `imageUrl`, `tag` | `NAVIGATE`, `TOGGLE_SELECTION` | ✅ Fully Supported |
| **Carousel** | `CAROUSEL` | `title`, `subtitle`, `itemWidth`, `children` | N/A (Container) | ✅ Fully Supported |
| **Grid** | `GRID` | `title`, `subtitle`, `columns`, `gap`, `children` | N/A (Container) | ✅ Fully Supported |
| **Chip Group** | `CHIP_GROUP` | `items`, `stateKey`, `selectedId` | `UPDATE_STATE` | ✅ Fully Supported |
| **Container** | `CONTAINER` | `style`, `padding`, `backgroundColor`, `children` | Any tap action | ✅ Fully Supported |
| **Spacer** | `SPACER` | `height`, `width`, `backgroundColor` | N/A | ✅ Fully Supported |
| **Fallback** | *Any Unknown Key* | `type` | Graceful logging + Telemetry | ✅ Safe Degradation |

---

## 2. Supported Architectural Patterns

- **Dynamic Nested Layouts**: Infinite nesting via `children: SDUINode[]`.
- **Conditional Rendering**: Node level `condition: { stateKey, equals, notEquals }` evaluated dynamically.
- **State Management**: Reactive state binding (`stateKey`) triggering instant UI rerenders without client releases.
- **Action Handling**: Declarative JSON actions (`NAVIGATE`, `OPEN_BOTTOM_SHEET`, `UPDATE_STATE`, `API_CALL`).
- **Graceful Degradation**: Unknown component types do not crash the app; inline `FallbackComponent` renders and logs telemetry.
- **Schema Versioning**: `isSchemaSupported(version)` checks compatibility against client engine versions.

---

## 3. UI Coverage for New Screens

- **~90% Zero-Code Assembly**: New home screen sections, landing pages, category listings, promotional campaigns, and feature discovery banners can be shipped **100% via JSON updates**.
- **What Requires New Client Code**:
  - Complex 3D car viewers / AR scanning features.
  - Native payment gateway integrations (e.g. Razorpay native SDKs).
  - Novel gesture animations outside React Native's standard component primitives.
