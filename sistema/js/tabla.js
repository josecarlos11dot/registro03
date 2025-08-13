let registrosGuardados = [];

import { esDeHoy } from './utilidades.js';
import { activarBoton } from './utilidades.js';
import { renderBotones } from './opciones.js';
import { abrirFormulario } from './registro.js';
import { opciones } from './opciones.js';

export function mostrarRegistros(datos) {
  registroBody.innerHTML = '';

  datos.forEach((r, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${r.placa}</td>
      <td>${r.marca}</td>
      <td>${r.modelo}</td>
      <td>${r.color}</td>
      <td>$${r.precio}</td>
      <td>${r.lavador}</td>
      <td>${new Date(r.fecha).toLocaleString('es-MX', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      })} hrs</td>
      <td><button class="btn-editar">Editar</button><button class="btn-eliminar">Eliminar</button></td>
    `;
    fila.dataset.id = r._id;
    registroBody.appendChild(fila);
  });
}

export function actualizarResumen(registros) {
  const resumen = document.getElementById('resumenDia');
  if (!resumen || registros.length === 0) {
    resumen.innerHTML = '';
    return;
  }
  const filas = registros.map(r => {
    const hora = new Date(r.fecha).toLocaleTimeString('es-MX', {
      hour: '2-digit', minute: '2-digit'
    });
    return `
      <tr>
        <td>${r.marca} ${r.modelo}</td>
        <td>${r.color}</td>
        <td>$${r.precio}</td>
        <td>${hora}</td>
      </tr>
    `;
  }).join('');
  resumen.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Auto</th>
          <th>Color</th>
          <th>Precio</th>
          <th>Hora</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>
  `;
}

export function mostrarRegistrosDelServidor() {
  fetch('https://sistema-2025-backend.onrender.com/api/registros')
    .then(res => res.json())
    .then(datos => {
      registrosGuardados = datos;
      const soloHoy = datos.filter(r => esDeHoy(r.fecha));
      mostrarRegistros(soloHoy);
      actualizarResumen(soloHoy);
    })
    .catch(err => console.error('Error al cargar registros:', err));
}
