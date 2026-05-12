export type HandlingUnitStatus =
  | 'En inspección'
  | 'Registrado'
  | 'Por ingresar'
  | 'Libre disponibilidad'
  | 'Reservado'
  | 'Por despachar'
  | 'Despachado'
  | 'Observado';

export type OrderStatus = 'Pendiente' | 'En proceso' | 'Despachado';
export type OperationOrderStatus = 'Pendiente' | 'En proceso' | 'Finalizado';
export type ProductLineStatus = 'Pendiente' | 'En proceso' | 'Despachado';
export type LocationStatus = 'Libre' | 'Ocupado' | 'Reservado';
export type Rotation = 'A' | 'B' | 'C';
export type Clasification = 'Orgánico' | 'Inorgánico' | 'Congelado';

export interface Product {
  id: string;
  code: string;
  name: string;
  rotation: Rotation;
  clasification: Clasification;
  productsPerHU: number;
}

export interface Customer {
  id: string;
  name: string;
  contactName: string;
  contactPhoneNumber: string;
  address: string;
}

export interface WarehouseWorker {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  code: string;
  xDistance: number;
  yDistance: number;
  zDistance: number;
  clasification: Clasification;
  status: LocationStatus;
  handlingUnit: HandlingUnit | null;
}

export interface HandlingUnit {
  id: string;
  handlingUnitId: number;
  product: Product;
  entryDate: string;
  exitDate: string | null;
  expirationDate: string;
  status: HandlingUnitStatus;
  location: Pick<Location, 'id' | 'code'> | null;
  inboundOrder: Pick<InboundOrder, 'id' | 'inboundOrderId' | 'date'> | null;
  outboundOrder: Pick<OutboundOrder, 'id' | 'outboundOrderId' | 'date'> | null;
  transportOrder: { id: string; transportOrderId: number } | null;
}

export interface OrderProductLine {
  _id: string;
  product: Product;
  quantity: number;
  stock: number;
  status: ProductLineStatus;
}

export interface Order {
  id: string;
  orderId: number;
  customer: Customer;
  products: OrderProductLine[];
  outboundOrders: string[];
  status: OrderStatus;
  date: string;
}

export interface InboundOrder {
  id: string;
  inboundOrderId: number;
  handlingUnits: HandlingUnit[];
  warehouseWorker: WarehouseWorker | null;
  status: OperationOrderStatus;
  date: string;
}

export interface OutboundOrder {
  id: string;
  outboundOrderId: number;
  handlingUnits: HandlingUnit[];
  order: Pick<Order, 'id' | 'orderId'>;
  status: OperationOrderStatus;
  date: string;
}

export interface TransportOrder {
  id: string;
  transportOrderId: number;
  handlingUnit: HandlingUnit;
  warehouseWorker: WarehouseWorker | null;
  location: Pick<Location, 'id' | 'code'> | null;
  status: 'Pendiente' | 'Finalizado';
  date: string;
  inboundOrder: Pick<InboundOrder, 'id' | 'inboundOrderId'> | null;
  outboundOrder: Pick<OutboundOrder, 'id' | 'outboundOrderId'> | null;
}

export interface AuthResponse {
  token: string;
  user: WarehouseWorker;
}

export interface CsvImportResult {
  imported: number;
}
