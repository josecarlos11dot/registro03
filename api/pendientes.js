let cola = []; // Memoria volátil (puede reiniciarse en serverless)

export default function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    return res.status(200).json({ ok: true, data: cola });
  }

  if (method === 'POST') {
    const { placa } = req.body || {};
    if (!placa) return res.status(400).json({ ok: false, msg: 'Falta placa' });
    const item = { id: Date.now(), placa, status: 'pendiente' };
    cola.push(item);
    return res.status(201).json({ ok: true, item });
  }

  if (method === 'DELETE') {
    const { id } = req.query || {};
    cola = cola.filter(x => String(x.id) !== String(id));
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).json({ ok: false, msg: 'Método no permitido' });
}
