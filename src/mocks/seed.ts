import type {
  Clasification,
  Customer,
  HandlingUnit,
  HandlingUnitStatus,
  InboundOrder,
  Location,
  Order,
  OutboundOrder,
  Product,
  Rotation,
  TransportOrder,
  WarehouseWorker,
} from '../types/api';

const oid = () =>
  '64' +
  Math.random().toString(16).slice(2).padEnd(22, '0').slice(0, 22);

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)] as T;

const ROTATIONS: Rotation[] = ['A', 'B', 'C'];

const PRODUCT_NAMES: Array<[string, Clasification]> = [
  ['Manzana Fuji caja 5kg', 'Orgánico'],
  ['Plátano Cavendish caja 8kg', 'Orgánico'],
  ['Naranja Valencia caja 10kg', 'Orgánico'],
  ['Papa amarilla saco 25kg', 'Orgánico'],
  ['Arroz extra saco 50kg', 'Orgánico'],
  ['Quinua orgánica bolsa 1kg', 'Orgánico'],
  ['Café tostado bolsa 500g', 'Orgánico'],
  ['Detergente líquido 5L', 'Inorgánico'],
  ['Jabón de tocador pack x12', 'Inorgánico'],
  ['Papel higiénico pack x24', 'Inorgánico'],
  ['Aceite vegetal botella 1L', 'Inorgánico'],
  ['Cloro doméstico 4L', 'Inorgánico'],
  ['Cerveza lata 355ml pack x12', 'Inorgánico'],
  ['Agua mineral botella 625ml', 'Inorgánico'],
  ['Yogurt natural 1L pack x6', 'Congelado'],
  ['Helado vainilla 1L', 'Congelado'],
  ['Pollo entero 2kg', 'Congelado'],
  ['Filete de pescado 1kg', 'Congelado'],
  ['Carne molida 1kg', 'Congelado'],
  ['Vegetales mixtos bolsa 1kg', 'Congelado'],
];

const STATUSES: HandlingUnitStatus[] = [
  'En inspección',
  'Registrado',
  'Libre disponibilidad',
  'Reservado',
  'Por despachar',
  'Despachado',
];

const RACK_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const POSITIONS_PER_RACK = 6;

const buildProducts = (): Product[] =>
  PRODUCT_NAMES.map(([name, clasification], i) => ({
    id: oid(),
    code: `P${String(i + 1).padStart(4, '0')}`,
    name,
    rotation: pick(ROTATIONS),
    clasification,
    productsPerHU: 24 + (i % 4) * 12,
  }));

const buildLocations = (): Location[] => {
  const out: Location[] = [];
  for (let r1 = 0; r1 < RACK_LETTERS.length; r1++) {
    for (let r2 = 1; r2 <= 4; r2++) {
      const rackPrefix = `${RACK_LETTERS[r1]}${RACK_LETTERS[r2]}`;
      const clasification: Clasification =
        r1 < 3 ? 'Orgánico' : r1 < 6 ? 'Inorgánico' : 'Congelado';
      for (let pos = 1; pos <= POSITIONS_PER_RACK; pos++) {
        out.push({
          id: oid(),
          code: `${rackPrefix}-${String(pos).padStart(2, '0')}`,
          xDistance: r1 + 1,
          yDistance: r2 + 1,
          zDistance: pos,
          clasification,
          status: 'Libre',
          handlingUnit: null,
        });
      }
    }
  }
  return out;
};

const buildCustomers = (): Customer[] => [
  {
    id: oid(),
    name: 'Supermercados Andes SAC',
    contactName: 'Lucía Pérez',
    contactPhoneNumber: '+51 987 654 321',
    address: 'Av. Javier Prado 1234, Lima',
  },
  {
    id: oid(),
    name: 'Distribuidora Norte EIRL',
    contactName: 'Carlos Ramos',
    contactPhoneNumber: '+51 999 111 222',
    address: 'Jr. Bolognesi 456, Trujillo',
  },
  {
    id: oid(),
    name: 'Mayorista Sur SAC',
    contactName: 'María Quispe',
    contactPhoneNumber: '+51 955 222 333',
    address: 'Av. Ejército 789, Arequipa',
  },
  {
    id: oid(),
    name: 'Bodegas Unidas',
    contactName: 'Jorge Castro',
    contactPhoneNumber: '+51 988 333 444',
    address: 'Av. La Marina 2020, Lima',
  },
];

const buildWorker = (): WarehouseWorker => ({
  id: oid(),
  name: 'Demo Worker',
});

export interface MockState {
  products: Product[];
  locations: Location[];
  handlingUnits: HandlingUnit[];
  orders: Order[];
  inboundOrders: InboundOrder[];
  outboundOrders: OutboundOrder[];
  transportOrders: TransportOrder[];
  customers: Customer[];
  worker: WarehouseWorker;
  counters: {
    handlingUnit: number;
    order: number;
    inboundOrder: number;
    outboundOrder: number;
    transportOrder: number;
  };
}

export const buildSeed = (): MockState => {
  const products = buildProducts();
  const locations = buildLocations();
  const customers = buildCustomers();
  const worker = buildWorker();

  let huCounter = 0;
  let inboundCounter = 0;
  const handlingUnits: HandlingUnit[] = [];
  const inboundOrders: InboundOrder[] = [];

  for (let i = 0; i < 5; i++) {
    const inboundId = oid();
    const inboundDate = daysAgo(20 - i * 3);
    const inboundOrderNum = ++inboundCounter;
    const ownHUs: HandlingUnit[] = [];

    for (let j = 0; j < 8; j++) {
      const product = pick(products);
      const status: HandlingUnitStatus = STATUSES[Math.min(j, STATUSES.length - 1)] ?? 'Registrado';
      const huNum = ++huCounter;
      const hu: HandlingUnit = {
        id: oid(),
        handlingUnitId: huNum,
        product,
        entryDate: inboundDate,
        exitDate: status === 'Despachado' ? daysAgo(i) : null,
        expirationDate: inDays(60 + (huNum % 30)),
        status,
        location: null,
        inboundOrder: {
          id: inboundId,
          inboundOrderId: inboundOrderNum,
          date: inboundDate,
        },
        outboundOrder: null,
        transportOrder: null,
      };
      handlingUnits.push(hu);
      ownHUs.push(hu);
    }

    inboundOrders.push({
      id: inboundId,
      inboundOrderId: inboundOrderNum,
      handlingUnits: ownHUs,
      warehouseWorker: worker,
      status: i < 3 ? 'Finalizado' : i < 4 ? 'En proceso' : 'Pendiente',
      date: inboundDate,
    });
  }

  // Assign some HUs to locations
  const freeLocations = [...locations];
  for (const hu of handlingUnits) {
    if (
      ['Libre disponibilidad', 'Reservado', 'Por despachar', 'Despachado'].includes(
        hu.status,
      )
    ) {
      const loc = freeLocations.shift();
      if (loc) {
        loc.status = 'Ocupado';
        loc.handlingUnit = hu;
        hu.location = { id: loc.id, code: loc.code };
      }
    }
  }

  // Sales orders
  let orderCounter = 0;
  const orders: Order[] = [];
  for (let i = 0; i < 4; i++) {
    const customer = customers[i % customers.length] as Customer;
    const orderId = oid();
    const orderNum = ++orderCounter;
    const date = daysAgo(10 - i * 2);
    const productLines = [];
    const productCount = 2 + (i % 3);
    for (let p = 0; p < productCount; p++) {
      const product = pick(products);
      const huStockForProduct = handlingUnits.filter(
        (h) => h.product.id === product.id && h.status === 'Libre disponibilidad',
      ).length;
      productLines.push({
        _id: oid(),
        product,
        quantity: Math.max(1, Math.floor(huStockForProduct / 2)) || 1,
        stock: huStockForProduct,
        status: 'Pendiente' as const,
      });
    }
    orders.push({
      id: orderId,
      orderId: orderNum,
      customer,
      products: productLines,
      outboundOrders: [],
      status: i === 0 ? 'En proceso' : 'Pendiente',
      date,
    });
  }

  // One outbound order tied to the first order, with a couple of HUs already Reservado
  let outboundCounter = 0;
  const outboundOrders: OutboundOrder[] = [];
  const firstOrder = orders[0];
  if (firstOrder) {
    const reserved = handlingUnits
      .filter((h) => h.status === 'Reservado')
      .slice(0, 3);
    if (reserved.length > 0) {
      const outboundId = oid();
      const outNum = ++outboundCounter;
      const outboundDate = daysAgo(2);
      const outbound: OutboundOrder = {
        id: outboundId,
        outboundOrderId: outNum,
        handlingUnits: reserved,
        order: { id: firstOrder.id, orderId: firstOrder.orderId },
        status: 'En proceso',
        date: outboundDate,
      };
      outboundOrders.push(outbound);
      firstOrder.outboundOrders.push(outboundId);
      for (const hu of reserved) {
        hu.outboundOrder = {
          id: outboundId,
          outboundOrderId: outNum,
          date: outboundDate,
        };
      }
    }
  }

  // Seed a couple of transport orders for "Por despachar" HUs
  let transportCounter = 0;
  const transportOrders: TransportOrder[] = [];
  const porDespachar = handlingUnits.filter((h) => h.status === 'Por despachar');
  for (const hu of porDespachar.slice(0, 2)) {
    const tNum = ++transportCounter;
    const tDate = daysAgo(1);
    transportOrders.push({
      id: oid(),
      transportOrderId: tNum,
      handlingUnit: hu,
      warehouseWorker: worker,
      location: hu.location,
      status: 'Pendiente',
      date: tDate,
      inboundOrder: null,
      outboundOrder: hu.outboundOrder
        ? { id: hu.outboundOrder.id, outboundOrderId: hu.outboundOrder.outboundOrderId }
        : null,
    });
  }

  return {
    products,
    locations,
    handlingUnits,
    orders,
    inboundOrders,
    outboundOrders,
    transportOrders,
    customers,
    worker,
    counters: {
      handlingUnit: huCounter,
      order: orderCounter,
      inboundOrder: inboundCounter,
      outboundOrder: outboundCounter,
      transportOrder: transportCounter,
    },
  };
};
