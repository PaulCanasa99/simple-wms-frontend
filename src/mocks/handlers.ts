import { http, HttpResponse } from 'msw';
import { db } from './db';
import type { HandlingUnit, OutboundOrder, TransportOrder } from '../types/api';

const BASE = '/api';

const oid = () =>
  '64' +
  Math.random().toString(16).slice(2).padEnd(22, '0').slice(0, 22);

const findOrder = (id: string) =>
  db.state.orders.find((o) => o.id === id || String(o.orderId) === id);

const findInbound = (id: string) =>
  db.state.inboundOrders.find(
    (o) => o.id === id || String(o.inboundOrderId) === id,
  );

const findOutbound = (id: string) =>
  db.state.outboundOrders.find(
    (o) => o.id === id || String(o.outboundOrderId) === id,
  );

const findProduct = (id: string) =>
  db.state.products.find((p) => p.id === id || p.code === id);

interface DataBody<T> {
  data: T;
}

export const handlers = [
  http.post(`${BASE}/warehouseWorkers/authenticate`, async ({ request }) => {
    const body = (await request.json().catch(() => null)) as
      | DataBody<{ email: string; password: string }>
      | null;
    const email = body?.data?.email ?? '';
    const password = body?.data?.password ?? '';
    if (!email || !password) {
      return HttpResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 });
    }
    return HttpResponse.json({
      token: `demo-${Math.random().toString(36).slice(2)}`,
      user: db.state.worker,
    });
  }),

  http.get(`${BASE}/products`, () => HttpResponse.json(db.state.products)),

  http.get(`${BASE}/products/:id`, ({ params }) => {
    const product = findProduct(String(params.id));
    if (!product) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(product);
  }),

  http.get(`${BASE}/handlingUnits`, () =>
    HttpResponse.json(db.state.handlingUnits),
  ),

  http.get(`${BASE}/handlingUnits/:productId`, ({ params }) => {
    const product = findProduct(String(params.productId));
    if (!product) return HttpResponse.json([]);
    return HttpResponse.json(
      db.state.handlingUnits.filter((h) => h.product.id === product.id),
    );
  }),

  http.post(
    `${BASE}/handlingUnits/graspAssignationTransport`,
    async ({ request }) => {
      const body = (await request.json().catch(() => null)) as
        | DataBody<string[]>
        | null;
      const ids = body?.data ?? [];
      const updated: HandlingUnit[] = [];

      db.mutate((state) => {
        const freeLocations = state.locations.filter((l) => l.status === 'Libre');
        for (const huId of ids) {
          const hu = state.handlingUnits.find((h) => h.id === huId);
          if (!hu || hu.status !== 'Registrado') continue;
          const loc = freeLocations.shift();
          if (!loc) break;
          loc.status = 'Reservado';
          hu.status = 'Por ingresar';
          hu.location = { id: loc.id, code: loc.code };

          const tNum = ++state.counters.transportOrder;
          const transport: TransportOrder = {
            id: oid(),
            transportOrderId: tNum,
            handlingUnit: hu,
            warehouseWorker: state.worker,
            location: { id: loc.id, code: loc.code },
            status: 'Pendiente',
            date: new Date().toISOString(),
            inboundOrder: hu.inboundOrder
              ? {
                  id: hu.inboundOrder.id,
                  inboundOrderId: hu.inboundOrder.inboundOrderId,
                }
              : null,
            outboundOrder: null,
          };
          hu.transportOrder = {
            id: transport.id,
            transportOrderId: transport.transportOrderId,
          };
          state.transportOrders.unshift(transport);
          updated.push(hu);
        }
      });

      return HttpResponse.json(updated);
    },
  ),

  http.get(`${BASE}/locations`, () => HttpResponse.json(db.state.locations)),

  http.get(`${BASE}/locations/:rack`, ({ params }) => {
    const rack = String(params.rack).toUpperCase();
    return HttpResponse.json(
      db.state.locations.filter((l) => l.code.toUpperCase().startsWith(rack)),
    );
  }),

  http.get(`${BASE}/orders`, () => HttpResponse.json(db.state.orders)),

  http.get(`${BASE}/orders/:id`, ({ params }) => {
    const order = findOrder(String(params.id));
    if (!order) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.post(`${BASE}/orders/import`, async ({ request }) => {
    const body = (await request.json().catch(() => null)) as DataBody<unknown[]> | null;
    const rows = (body?.data as unknown[] | undefined) ?? [];
    return HttpResponse.json({ imported: rows.length });
  }),

  http.post(`${BASE}/orders/outboundSelection/:id`, async ({ params, request }) => {
    const body = (await request.json().catch(() => null)) as
      | DataBody<string[]>
      | null;
    const productLineIds = body?.data ?? [];
    let result = null;

    db.mutate((state) => {
      const order = state.orders.find(
        (o) => o.id === params.id || String(o.orderId) === params.id,
      );
      if (!order) return;

      const reservedHUs: HandlingUnit[] = [];
      for (const lineId of productLineIds) {
        const line = order.products.find((p) => p._id === lineId);
        if (!line) continue;
        line.status = 'En proceso';

        const available = state.handlingUnits.filter(
          (h) =>
            h.product.id === line.product.id && h.status === 'Libre disponibilidad',
        );
        for (const hu of available.slice(0, line.quantity)) {
          hu.status = 'Reservado';
          reservedHUs.push(hu);
        }
      }

      const allLinesProcessed = order.products.every(
        (p) => p.status !== 'Pendiente',
      );
      order.status = allLinesProcessed ? 'En proceso' : 'En proceso';

      if (reservedHUs.length > 0) {
        const outNum = ++state.counters.outboundOrder;
        const outboundDate = new Date().toISOString();
        const outboundId = oid();
        const outbound: OutboundOrder = {
          id: outboundId,
          outboundOrderId: outNum,
          handlingUnits: reservedHUs,
          order: { id: order.id, orderId: order.orderId },
          status: 'En proceso',
          date: outboundDate,
        };
        for (const hu of reservedHUs) {
          hu.outboundOrder = {
            id: outboundId,
            outboundOrderId: outNum,
            date: outboundDate,
          };
        }
        state.outboundOrders.unshift(outbound);
        order.outboundOrders.push(outboundId);
      }

      result = order;
    });

    return HttpResponse.json(result);
  }),

  http.get(`${BASE}/inboundOrders`, () =>
    HttpResponse.json(db.state.inboundOrders),
  ),

  http.get(`${BASE}/inboundOrders/:id`, ({ params }) => {
    const order = findInbound(String(params.id));
    if (!order) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.post(`${BASE}/inboundOrders/import`, async ({ request }) => {
    const body = (await request.json().catch(() => null)) as DataBody<unknown[]> | null;
    const rows = (body?.data as unknown[] | undefined) ?? [];

    db.mutate((state) => {
      const inboundNum = ++state.counters.inboundOrder;
      const inboundId = oid();
      const date = new Date().toISOString();
      const ownHUs: HandlingUnit[] = [];

      const max = Math.min(rows.length, 12);
      for (let i = 0; i < max; i++) {
        const product = state.products[i % state.products.length]!;
        const huNum = ++state.counters.handlingUnit;
        const hu: HandlingUnit = {
          id: oid(),
          handlingUnitId: huNum,
          product,
          entryDate: date,
          exitDate: null,
          expirationDate: new Date(Date.now() + 60 * 86400_000).toISOString(),
          status: 'Registrado',
          location: null,
          inboundOrder: { id: inboundId, inboundOrderId: inboundNum, date },
          outboundOrder: null,
          transportOrder: null,
        };
        state.handlingUnits.push(hu);
        ownHUs.push(hu);
      }

      state.inboundOrders.unshift({
        id: inboundId,
        inboundOrderId: inboundNum,
        handlingUnits: ownHUs,
        warehouseWorker: state.worker,
        status: 'Pendiente',
        date,
      });
    });

    return HttpResponse.json({ imported: rows.length });
  }),

  http.get(`${BASE}/outboundOrders`, () =>
    HttpResponse.json(db.state.outboundOrders),
  ),

  http.get(`${BASE}/outboundOrders/:id`, ({ params }) => {
    const order = findOutbound(String(params.id));
    if (!order) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.post(
    `${BASE}/outboundOrders/generateTransportOrders/:id`,
    async ({ params, request }) => {
      const body = (await request.json().catch(() => null)) as
        | DataBody<string[]>
        | null;
      const handlingUnitIds = body?.data ?? [];
      const generated: TransportOrder[] = [];

      db.mutate((state) => {
        const outbound = state.outboundOrders.find(
          (o) => o.id === params.id || String(o.outboundOrderId) === params.id,
        );
        if (!outbound) return;

        for (const huId of handlingUnitIds) {
          const hu = state.handlingUnits.find((h) => h.id === huId);
          if (!hu || hu.status !== 'Reservado') continue;
          hu.status = 'Por despachar';
          const tNum = ++state.counters.transportOrder;
          const transport: TransportOrder = {
            id: oid(),
            transportOrderId: tNum,
            handlingUnit: hu,
            warehouseWorker: state.worker,
            location: hu.location,
            status: 'Pendiente',
            date: new Date().toISOString(),
            inboundOrder: null,
            outboundOrder: {
              id: outbound.id,
              outboundOrderId: outbound.outboundOrderId,
            },
          };
          hu.transportOrder = {
            id: transport.id,
            transportOrderId: transport.transportOrderId,
          };
          state.transportOrders.unshift(transport);
          generated.push(transport);
        }

        // sync the outbound order's HU statuses
        outbound.handlingUnits = outbound.handlingUnits.map(
          (h) => state.handlingUnits.find((s) => s.id === h.id) ?? h,
        );
      });

      return HttpResponse.json(generated);
    },
  ),

  http.get(`${BASE}/transportOrders`, () =>
    HttpResponse.json(db.state.transportOrders),
  ),
];
