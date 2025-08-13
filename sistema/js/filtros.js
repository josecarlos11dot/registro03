import { mostrarRegistrosDelServidor, mostrarRegistros } from './tabla.js';

btnAplicarFiltros.addEventListener('click', () => {
  fetch('https://sistema-2025-backend.onrender.com/api/registros')
    .then(res => res.json())
    .then(registros => {
      const placa = filtroPlaca.value.trim().toLowerCase();
      const desde = filtroFechaInicio.value ? new Date(filtroFechaInicio.value) : null;
      const hasta = filtroFechaFin.value ? new Date(filtroFechaFin.value) : null;
      if (hasta) hasta.setHours(23, 59, 59, 999);

      const lavador = filtroLavador.value.trim().toLowerCase();
      const marca = filtroMarca.value.trim().toLowerCase();
      const modelo = filtroModelo.value.trim().toLowerCase();
      const color = filtroColor.value.trim().toLowerCase();
      const precioMin = filtroPrecioMin.value ? parseFloat(filtroPrecioMin.value) : null;
      const precioMax = filtroPrecioMax.value ? parseFloat(filtroPrecioMax.value) : null;

      const filtrados = registros.filter(reg => {
        const fecha = new Date(reg.fecha);
        return (
          (!placa || reg.placa.toLowerCase().includes(placa)) &&
          (!desde || fecha >= desde) &&
          (!hasta || fecha <= hasta) &&
          (!lavador || reg.lavador.toLowerCase().includes(lavador)) &&
          (!marca || reg.marca.toLowerCase().includes(marca)) &&
          (!modelo || reg.modelo.toLowerCase().includes(modelo)) &&
          (!color || reg.color.toLowerCase().includes(color)) &&
          (!precioMin || parseFloat(reg.precio) >= precioMin) &&
          (!precioMax || parseFloat(reg.precio) <= precioMax)
        );
      });

      resultadoFiltros.textContent = `${filtrados.length} resultado(s)`;
      mostrarRegistros(filtrados);
    })
    .catch(err => {
      console.error('Error al aplicar filtros:', err);
    });
});

document.getElementById('btnLimpiarFiltros').addEventListener('click', () => {
  filtroPlaca.value = '';
  filtroFechaInicio.value = '';
  filtroFechaFin.value = '';
  filtroLavador.value = '';
  filtroMarca.value = '';
  filtroModelo.value = '';
  filtroColor.value = '';
  filtroPrecioMin.value = '';
  filtroPrecioMax.value = '';
  resultadoFiltros.textContent = '';
  mostrarRegistrosDelServidor();
});

btnToggleFiltros.addEventListener('click', () => {
  panelFiltros.classList.add('activo');
  overlay.classList.add('activo');
});

btnCerrarFiltros.addEventListener('click', () => {
  panelFiltros.classList.remove('activo');
  overlay.classList.remove('activo');
});

overlay.addEventListener('click', () => {
  panelFiltros.classList.remove('activo');
  overlay.classList.remove('activo');
});
