let registros = []; // Memoria volátil (se reinicia a veces en serverless)

export default function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { placa } = req.query || {};
    const data = placa ? registros.filter(r => r.placa === placa) : registros;
    return res.status(200).json({ ok: true, data });
  }

  if (method === 'POST') {
    const body = req.body || {};
    const required = ['placa', 'marca', 'modelo', 'color', 'precio', 'lavador'];
    const falta = required.find(k => !body[k]);
    if (falta) return res.status(400).json({ ok: false, msg: `Falta ${falta}` });

    const nuevo = { id: Date.now(), fecha: new Date().toISOString(), ...body };
    registros.push(nuevo);
    return res.status(201).json({ ok: true, item: nuevo });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ ok: false, msg: 'Método no permitido' });
}
