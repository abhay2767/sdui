# 📊 COVERAGE.md — SDUI Component & Generalization Coverage Matrix

## 1. Honest Coverage Claim

> **"Given a new Cars24 screen, 85–90% renders with JSON-only changes. Only specialized native modules (e.g. 3D car inspectors, native payment SDKs) require new client code."**

---

## 2. Expressible UI Patterns Matrix

| UI Pattern | Supported in Schema? | How it is Expressed in JSON | Client Code Required? |
| :--- | :--- | :--- | :--- |
| **Vertical Lists & Feeds** | ✅ Yes | `children: [...]` inside standard layout containers | ❌ No (JSON only) |
| **Horizontal Carousels** | ✅ Yes | `"type": "CAROUSEL"`, `props: { itemWidth, title }` | ❌ No (JSON only) |
| **Multi-Column Grids** | ✅ Yes | `"type": "GRID"`, `props: { columns: 2, gap: 12 }` | ❌ No (JSON only) |
| **Interactive Selection Chips**| ✅ Yes | `"type": "CHIP_GROUP"`, `props: { stateKey }` | ❌ No (JSON only) |
| **Conditional Rendering** | ✅ Yes | `"condition": { "stateKey": "selectedCategory", "equals": "suv" }` | ❌ No (JSON only) |
| **Tap Actions & Navigation** | ✅ Yes | `"action": { "type": "NAVIGATE", "payload": { "screen": "CarDetails" } }` | ❌ No (JSON only) |
| **Bottom Sheet Overlays** | ✅ Yes | `"action": { "type": "OPEN_BOTTOM_SHEET", "payload": { "title": "..." } }` | ❌ No (JSON only) |
| **Styling Overrides** | ✅ Yes | `"style": { "backgroundColor": "#0F172A", "borderRadius": 16 }` | ❌ No (JSON only) |

---

## 3. Supported Component Registry

| Component Type | SDUI Type Identifier | Dynamic Props | Supported Actions | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Header Bar** | `HEADER` | `title`, `subtitle`, `location`, `searchPlaceholder` | `OPEN_BOTTOM_SHEET`, `NAVIGATE` | ✅ Fully Supported |
| **Promo Banner** | `BANNER` | `title`, `subtitle`, `ctaText`, `badge`, `backgroundColor` | `OPEN_BOTTOM_SHEET`, `API_CALL` | ✅ Fully Supported |
| **Car Card** | `CAR_CARD` | `title`, `subtitle`, `price`, `emi`, `year`, `mileage`, `fuelType` | `NAVIGATE`, `TOGGLE_SELECTION` | ✅ Fully Supported |
| **Horizontal Rail**| `CAROUSEL` | `title`, `subtitle`, `itemWidth`, `children` | Container | ✅ Fully Supported |
| **Card Grid** | `GRID` | `title`, `subtitle`, `columns`, `gap`, `children` | Container | ✅ Fully Supported |
| **Category Chips** | `CHIP_GROUP` | `items`, `stateKey`, `selectedId` | `UPDATE_STATE` | ✅ Fully Supported |
| **Container Box** | `CONTAINER` | `style`, `padding`, `backgroundColor`, `children` | Tap actions | ✅ Fully Supported |
| **Spacer** | `SPACER` | `height`, `width`, `backgroundColor` | N/A | ✅ Fully Supported |
| **Fallback Widget**| *Unknown Type* | `type` | Graceful logging + Telemetry | ✅ Safe Degradation |

---

## 4. Extension Strategy for Unseen Cars24 Screens (Surprise Screen Test)

If presented with a brand new Cars24 screen (e.g., **Car Evaluation / Inspection Report Screen** or **Sell Car Booking Flow**):

### 🟢 Renders 100% via JSON edits (Zero Client Code):
- Section titles, headers, status badges, price breakdown rows, inspection checkmark lists, image carousels, CTA banners, and navigation buttons.

### 🟡 Requires New Component Registration (Fast AI Extension):
- **Custom Rating Star Bar**: Build `<RatingComponent />` (~10 mins using AI), register in `COMPONENT_REGISTRY["RATING_BAR"] = RatingComponent`, and consume immediately in JSON payloads.

### 🔴 Requires Native Code (Out of Scope for JSON):
- Native AR car inspection scanner modules, 3D WebGL viewer integration, or third-party payment SDK bridges (e.g. Razorpay/Stripe native views).
