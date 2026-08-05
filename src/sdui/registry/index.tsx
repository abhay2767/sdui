import React from 'react';
// Cars24-flavoured composites
import { HeaderComponent } from '../components/HeaderComponent';
import { BannerComponent } from '../components/BannerComponent';
import { CarCardComponent } from '../components/CarCardComponent';
import { CarouselComponent } from '../components/CarouselComponent';
import { GridComponent } from '../components/GridComponent';
import { ChipGroupComponent } from '../components/ChipGroupComponent';
import { ContainerComponent } from '../components/ContainerComponent';
// Generic primitives — these are what make an unseen screen a JSON-only job
import { TextNode } from '../components/primitives/Text';
import { ImageNode } from '../components/primitives/Image';
import { ButtonNode } from '../components/primitives/Button';
import { BadgeNode } from '../components/primitives/Badge';
import { RowNode, ColumnNode, CardNode, DividerNode, SpacerNode } from '../components/primitives/Layout';
import {
  KeyValueRowNode,
  StatTileNode,
  RatingNode,
  ProgressBarNode,
} from '../components/primitives/DataDisplay';
import {
  SegmentedControlNode,
  ListItemNode,
  CheckRowNode,
} from '../components/primitives/Interactive';
import { logger } from '../utils/logger';

/**
 * The registry is the single point where a server-side name becomes a client
 * view. The renderer holds no other knowledge of component identity.
 */
const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Layout primitives
  ROW: RowNode,
  COLUMN: ColumnNode,
  CARD: CardNode,
  CONTAINER: ContainerComponent,
  DIVIDER: DividerNode,
  SPACER: SpacerNode,

  // Content primitives
  TEXT: TextNode,
  IMAGE: ImageNode,
  BUTTON: ButtonNode,
  BADGE: BadgeNode,
  KEY_VALUE_ROW: KeyValueRowNode,
  STAT_TILE: StatTileNode,
  RATING: RatingNode,
  PROGRESS_BAR: ProgressBarNode,
  LIST_ITEM: ListItemNode,
  CHECK_ROW: CheckRowNode,

  // Interactive primitives
  CHIP_GROUP: ChipGroupComponent,
  SEGMENTED_CONTROL: SegmentedControlNode,

  // Cars24 composites (each is expressible with primitives; they exist because
  // high-traffic sections deserve a hand-tuned native implementation)
  HEADER: HeaderComponent,
  BANNER: BannerComponent,
  CAR_CARD: CarCardComponent,
  CAROUSEL: CarouselComponent,
  GRID: GridComponent,
};

/**
 * Returns the component for a type, or `undefined` for unknown types — the
 * renderer owns the degradation path. Never fabricates components: returning
 * a fresh function per call would give React a new element type on every
 * render and force remounts.
 */
export function lookupComponent(type: string): React.ComponentType<any> | undefined {
  if (typeof type !== 'string') return undefined;
  return COMPONENT_REGISTRY[type.toUpperCase()];
}

/** Runtime extension point (used by tests and future dynamic modules). */
export function registerComponent(type: string, component: React.ComponentType<any>): void {
  const key = type.toUpperCase();
  if (COMPONENT_REGISTRY[key]) {
    logger.warn('REGISTRY', `Overwriting existing component registration "${key}"`);
  }
  COMPONENT_REGISTRY[key] = component;
}

export function registeredTypes(): string[] {
  return Object.keys(COMPONENT_REGISTRY).sort();
}
