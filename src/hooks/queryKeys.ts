export const qk = {
  products: ['products'] as const,
  product: (id: string) => ['products', id] as const,
  handlingUnits: ['handlingUnits'] as const,
  handlingUnitsByProduct: (productId: string) =>
    ['handlingUnits', 'product', productId] as const,
  locations: ['locations'] as const,
  locationsByRack: (rack: string) => ['locations', 'rack', rack] as const,
  orders: ['orders'] as const,
  order: (id: string) => ['orders', id] as const,
  inboundOrders: ['inboundOrders'] as const,
  inboundOrder: (id: string) => ['inboundOrders', id] as const,
  outboundOrders: ['outboundOrders'] as const,
  outboundOrder: (id: string) => ['outboundOrders', id] as const,
  transportOrders: ['transportOrders'] as const,
};
