import { capitalizar, guardarLocal } from './utilidades.js';
const marcasDiv = document.getElementById('marcas');
const modelosDiv = document.getElementById('modelos');
const coloresDiv = document.getElementById('colores');
const preciosDiv = document.getElementById('precios');
const lavadoresDiv = document.getElementById('lavadores');
const inputMarca = document.getElementById('inputMarca');
const inputModelo = document.getElementById('inputModelo');
const inputColor = document.getElementById('inputColor');
const inputPrecio = document.getElementById('inputPrecio');
const inputLavador = document.getElementById('inputLavador');


export let opciones = {};
export let coloresBase = [];
export let preciosBase = [];
export let lavadoresBase = [];

export function renderBotones(lista, contenedor, inputOculto, prefijo = '') {
  contenedor.innerHTML = '';
  lista.forEach(valor => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.classList.add('btn');
    boton.textContent = prefijo + valor;

    if (contenedor.id === 'colores') {
      boton.style.backgroundColor = valor;
    }
    if (contenedor.id === 'modelos') {
      boton.classList.add('modelo-dinamico');
    }

    boton.addEventListener('click', () => {
      [...contenedor.querySelectorAll('button')].forEach(b => b.classList.remove('activo'));
      boton.classList.add('activo');
      inputOculto.value = valor;

      if (contenedor.id === 'marcas') {
        if (opciones[valor]) {
          renderBotones(opciones[valor], modelosDiv, inputModelo);
        } else {
          modelosDiv.innerHTML = '';
          inputModelo.value = '';
        }
      }
    });

    contenedor.appendChild(boton);
  });
}

export function seleccionarBoton(grupo, valor) {
  const idContenedor = (grupo === 'color') ? 'colores' : grupo + 's';
  const contenedor = document.getElementById(idContenedor);
  const inputOculto = document.getElementById('input' + capitalizar(grupo));
  const valorNormalizado = valor.toLowerCase().trim();

  if (!contenedor || !inputOculto) return;

  let boton = [...contenedor.querySelectorAll('button')].find(
    b => b.textContent.toLowerCase().trim() === valorNormalizado
  );

  if (!boton) {
    boton = document.createElement('button');
    boton.classList.add('btn');
    boton.textContent = valor;

    if (grupo === 'color') boton.style.backgroundColor = valor;
    if (grupo === 'modelo') boton.classList.add('modelo-dinamico');
    if (grupo === 'modelo') {
      const marcaSeleccionada = inputMarca.value;
      if (marcaSeleccionada) {
        if (!opciones[marcaSeleccionada]) {
          opciones[marcaSeleccionada] = [];
        }
        if (!opciones[marcaSeleccionada].includes(valor)) {
          opciones[marcaSeleccionada].push(valor);
          guardarLocal('opciones', opciones);
        }
      }
    }
    contenedor.appendChild(boton);

    boton.addEventListener('click', () => {
      [...contenedor.querySelectorAll('button')].forEach(b => b.classList.remove('activo'));
      boton.classList.add('activo');
      inputOculto.value = valor;

      if (contenedor.id === 'marcas' && opciones[valor]) {
        renderBotones(opciones[valor], modelosDiv, inputModelo);
      } else if (contenedor.id === 'marcas') {
        modelosDiv.innerHTML = '';
        inputModelo.value = '';
      }
    });
  }

  [...contenedor.querySelectorAll('button')].forEach(b => b.classList.remove('activo'));
  boton.classList.add('activo');
  inputOculto.value = valor;
}

export function cargarTodoDesdeStorage() {
  opciones = JSON.parse(localStorage.getItem('opciones')) || {};
  coloresBase = JSON.parse(localStorage.getItem('coloresBase')) || [];
  preciosBase = JSON.parse(localStorage.getItem('preciosBase')) || [];
  lavadoresBase = JSON.parse(localStorage.getItem('lavadoresBase')) || [];

  renderBotones(Object.keys(opciones), marcasDiv, inputMarca);

  if (inputMarca.value && opciones[inputMarca.value]) {
    renderBotones(opciones[inputMarca.value], modelosDiv, inputModelo);
  }

  renderBotones(coloresBase, coloresDiv, inputColor);
  renderBotones(preciosBase, preciosDiv, inputPrecio, '$');
  renderBotones(lavadoresBase, lavadoresDiv, inputLavador);
}
