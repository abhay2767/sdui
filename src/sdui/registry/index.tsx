import React from 'react';
import { HeaderComponent } from '../components/HeaderComponent';
import { BannerComponent } from '../components/BannerComponent';
import { CarCardComponent } from '../components/CarCardComponent';
import { CarouselComponent } from '../components/CarouselComponent';
import { GridComponent } from '../components/GridComponent';
import { ChipGroupComponent } from '../components/ChipGroupComponent';
import { ContainerComponent } from '../components/ContainerComponent';
import { SpacerComponent } from '../components/SpacerComponent';
import { FallbackComponent } from '../components/FallbackComponent';

export const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  HEADER: HeaderComponent,
  BANNER: BannerComponent,
  CAR_CARD: CarCardComponent,
  CAROUSEL: CarouselComponent,
  GRID: GridComponent,
  CHIP_GROUP: ChipGroupComponent,
  CONTAINER: ContainerComponent,
  SPACER: SpacerComponent,
};

export function getComponentForType(type: string): React.ComponentType<any> {
  const comp = COMPONENT_REGISTRY[type?.toUpperCase()];
  if (!comp) {
    return (props: any) => <FallbackComponent type={type} {...props} />;
  }
  return comp;
}

export function registerComponent(type: string, component: React.ComponentType<any>): void {
  COMPONENT_REGISTRY[type.toUpperCase()] = component;
}
