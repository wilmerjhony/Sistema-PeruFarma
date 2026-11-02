
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ====================================
// MODELOS DE DATOS
// ====================================

interface Lote {
  codigo: string;
  vencimiento: string;
  unidades: number;
}

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  marca: string;
  categoria: string;
  presentacion: string;
  unidadesPorCaja: number;
  costoCaja: number;
  precioCaja: number;
  precioUnidad: number;
  stockMinimo: number;
  lotes: Lote[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {

  // ====================================
  // VARIABLES DEL INVENTARIO
  // ====================================

  productos: Producto[] = [];

  busqueda = '';
  filtro = 'todos';
  mensaje = '';
  error = '';

  modalProducto = false;
  modalLote = false;

  editandoId: number | null = null;
  objetivoLoteId: number | null = null;
  lotesExpandidos: number | null = null;

  form = this.nuevoFormulario();

  loteForm = {
    codigo: '',
    vencimiento: '',
    cajas: 0,
    unidadesSueltas: 0
  };

  constructor() {
    this.cargarDatos();
  }

  // ====================================
  // FORMULARIO DE MEDICAMENTOS
  // ====================================

  nuevoFormulario() {
    return {
      codigo: '',
      nombre: '',
      marca: '',
      categoria: '',
      presentacion: '',
      unidadesPorCaja: 1,
      costoCaja: 0,
      precioCaja: 0,
      precioUnidad: 0,
      stockMinimo: 10,
      lote: '',
      vencimiento: '',
      cajas: 0,
      unidadesSueltas: 0
    };
  }

  // ====================================
  // GUARDAR DATOS TEMPORALMENTE
  // ====================================

  cargarDatos() {
    try {
      const datos = localStorage.getItem(
        'perufarma_inventario_v1'
      );

      const lista = datos ? JSON.parse(datos) : [];

      this.productos = Array.isArray(lista) ? lista : [];

    } catch {
      this.productos = [];
      this.error = 'No se pudieron recuperar los datos guardados.';
    }
  }

  guardarDatos() {
    try {
      localStorage.setItem(
        'perufarma_inventario_v1',
        JSON.stringify(this.productos)
      );

    } catch {
      this.error = 'No se pudieron guardar los cambios.';
    }
  }

  avisar(texto: string) {
    this.mensaje = texto;
    this.error = '';
  }

  // ====================================
  // FECHAS DE VENCIMIENTO
  // ====================================

  diasParaVencer(fecha: string): number {
    const [anio, mes, dia] = fecha.split('-').map(Number);

    const ahora = new Date();

    const hoyUTC = Date.UTC(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate()
    );

    const fechaUTC = Date.UTC(anio, mes - 1, dia);

    return Math.round(
      (fechaUTC - hoyUTC) / 86400000
    );
  }

  // ====================================
  // CÁLCULOS DE STOCK
  // ====================================

  stockFisico(p: Producto): number {
    return p.lotes.reduce(
      (total, lote) => total + lote.unidades,
      0
    );
  }

  stockVigente(p: Producto): number {
    return p.lotes
      .filter(lote =>
        this.diasParaVencer(lote.vencimiento) >= 0
      )
      .reduce(
        (total, lote) => total + lote.unidades,
        0
      );
  }

  // ====================================
  // COSTOS POR UNIDAD
  // ====================================

  costoUnidad(p: Producto): number {
    return p.costoCaja / p.unidadesPorCaja;
  }

  // ====================================
  // PRÓXIMO VENCIMIENTO
  // ====================================

  proximoVencimiento(p: Producto): string {
    const lotes = p.lotes
      .filter(lote => lote.unidades > 0)
      .sort((a, b) =>
        a.vencimiento.localeCompare(b.vencimiento)
      );

    return lotes.length
      ? lotes[0].vencimiento
      : '—';
  }

  // ====================================
  // ESTADO DE CADA LOTE
  // ====================================

  estadoLote(lote: Lote): string {
    if (lote.unidades <= 0) {
      return 'Sin stock';
    }

    const dias = this.diasParaVencer(
      lote.vencimiento
    );

    if (dias < 0) {
      return 'Vencido';
    }

    if (dias <= 30) {
      return 'Vence en 30 días';
    }

    if (dias <= 90) {
      return 'Próximo a vencer';
    }

    return 'Vigente';
  }

  // ====================================
  // ESTADO GENERAL DEL PRODUCTO
  // ====================================

  estadoProducto(p: Producto): string {

    const tieneVencidos = p.lotes.some(
      lote =>
        lote.unidades > 0 &&
        this.diasParaVencer(lote.vencimiento) < 0
    );

    if (tieneVencidos) {
      return 'Lote vencido';
    }

    if (this.stockVigente(p) === 0) {
      return 'Agotado';
    }

    if (this.stockVigente(p) <= p.stockMinimo) {
      return 'Stock bajo';
    }

    const proximo = p.lotes.some(
      lote =>
        lote.unidades > 0 &&
        this.diasParaVencer(lote.vencimiento) >= 0 &&
        this.diasParaVencer(lote.vencimiento) <= 90
    );

    if (proximo) {
      return 'Próximo a vencer';
    }

    return 'Disponible';
  }

  // ====================================
  // ESTADÍSTICAS DEL INVENTARIO
  // ====================================

  get totalProductos(): number {
    return this.productos.length;
  }

  get totalUnidades(): number {
    return this.productos.reduce(
      (total, p) => total + this.stockVigente(p),
      0
    );
  }

  get totalStockBajo(): number {
    return this.productos.filter(
      p => this.stockVigente(p) <= p.stockMinimo
    ).length;
  }

  get totalProximos(): number {
    return this.productos.filter(
      p => p.lotes.some(
        lote =>
          lote.unidades > 0 &&
          this.diasParaVencer(lote.vencimiento) >= 0 &&
          this.diasParaVencer(lote.vencimiento) <= 90
      )
    ).length;
  }

  get totalVencidos(): number {
    return this.productos.filter(
      p => p.lotes.some(
        lote =>
          lote.unidades > 0 &&
          this.diasParaVencer(lote.vencimiento) < 0
      )
    ).length;
  }

  // ====================================
  // BÚSQUEDA Y FILTROS
  // ====================================

  get productosFiltrados(): Producto[] {

    const texto = this.busqueda
      .toLowerCase()
      .trim();

    return this.productos.filter(p => {

      const coincide = [
        p.codigo,
        p.nombre,
        p.marca,
        p.categoria
      ].some(valor =>
        valor.toLowerCase().includes(texto)
      );

      if (!coincide) {
        return false;
      }

      if (this.filtro === 'bajo') {
        return this.stockVigente(p) <= p.stockMinimo;
      }

      if (this.filtro === 'vencer') {
        return p.lotes.some(
          lote =>
            lote.unidades > 0 &&
            this.diasParaVencer(lote.vencimiento) >= 0 &&
            this.diasParaVencer(lote.vencimiento) <= 90
        );
      }

      if (this.filtro === 'vencidos') {
        return p.lotes.some(
          lote =>
            lote.unidades > 0 &&
            this.diasParaVencer(lote.vencimiento) < 0
        );
      }

      return true;
    });
  }

  // ====================================
  // AGREGAR MEDICAMENTO
  // ====================================

  abrirNuevo() {
    this.form = this.nuevoFormulario();
    this.editandoId = null;
    this.error = '';
    this.modalProducto = true;
  }

  // ====================================
  // EDITAR MEDICAMENTO
  // ====================================

  editarProducto(p: Producto) {

    this.editandoId = p.id;
    this.error = '';

    this.form = {
      ...this.nuevoFormulario(),
      codigo: p.codigo,
      nombre: p.nombre,
      marca: p.marca,
      categoria: p.categoria,
      presentacion: p.presentacion,
      unidadesPorCaja: p.unidadesPorCaja,
      costoCaja: p.costoCaja,
      precioCaja: p.precioCaja,
      precioUnidad: p.precioUnidad,
      stockMinimo: p.stockMinimo
    };

    this.modalProducto = true;
  }

  // ====================================
  // GUARDAR MEDICAMENTO
  // ====================================

  guardarProducto() {

    const f = this.form;

    const codigo = f.codigo.trim().toUpperCase();
    const nombre = f.nombre.trim();

    const unidadesPorCaja = Number(f.unidadesPorCaja);
    const cajas = Number(f.cajas);
    const sueltas = Number(f.unidadesSueltas);

    if (
      !codigo ||
      !nombre ||
      !f.marca.trim() ||
      !f.categoria.trim() ||
      !f.presentacion.trim()
    ) {
      this.error = 'Completa los datos del medicamento.';
      return;
    }

    if (
      !Number.isInteger(unidadesPorCaja) ||
      unidadesPorCaja < 1 ||
      !Number.isInteger(f.stockMinimo) ||
      f.stockMinimo < 0 ||
      ![
        f.costoCaja,
        f.precioCaja,
        f.precioUnidad
      ].every(n => Number.isFinite(n) && n >= 0)
    ) {
      this.error = 'Verifica las cantidades y los precios.';
      return;
    }

    const codigoExiste = this.productos.some(
      p =>
        p.codigo.toUpperCase() === codigo &&
        p.id !== this.editandoId
    );

    if (codigoExiste) {
      this.error = 'Ya existe un medicamento con ese código.';
      return;
    }

    // Validar el primer lote
    if (this.editandoId === null) {

      if (
        !f.lote.trim() ||
        !f.vencimiento ||
        !Number.isInteger(cajas) ||
        cajas < 0 ||
        !Number.isInteger(sueltas) ||
        sueltas < 0
      ) {
        this.error = 'Completa correctamente los datos del lote.';
        return;
      }
    }

    const datos = {
      codigo,
      nombre,
      marca: f.marca.trim(),
      categoria: f.categoria.trim(),
      presentacion: f.presentacion.trim(),
      unidadesPorCaja,
      costoCaja: Number(f.costoCaja),
      precioCaja: Number(f.precioCaja),
      precioUnidad: Number(f.precioUnidad),
      stockMinimo: Number(f.stockMinimo)
    };

    // CREAR NUEVO PRODUCTO
    if (this.editandoId === null) {

      const nuevo: Producto = {
        id: Date.now(),
        ...datos,
        lotes: [
          {
            codigo: f.lote.trim().toUpperCase(),
            vencimiento: f.vencimiento,
            unidades:
              cajas * unidadesPorCaja + sueltas
          }
        ]
      };

      this.productos = [
        ...this.productos,
        nuevo
      ];

      this.avisar(
        'Medicamento registrado correctamente.'
      );

    } else {

      // ACTUALIZAR PRODUCTO
      this.productos = this.productos.map(
        p =>
          p.id === this.editandoId
            ? { ...p, ...datos }
            : p
      );

      this.avisar(
        'Medicamento actualizado correctamente.'
      );
    }

    this.guardarDatos();
    this.modalProducto = false;
  }

  // ====================================
  // ELIMINAR MEDICAMENTO
  // ====================================

  eliminarProducto(p: Producto) {

    const confirmado = confirm(
      `¿Eliminar ${p.nombre} y todos sus lotes?`
    );

    if (!confirmado) {
      return;
    }

    this.productos = this.productos.filter(
      item => item.id !== p.id
    );

    this.guardarDatos();

    this.avisar('Medicamento eliminado.');
  }

  // ====================================
  // MOSTRAR LOTES
  // ====================================

  alternarLotes(p: Producto) {
    this.lotesExpandidos =
      this.lotesExpandidos === p.id
        ? null
        : p.id;
  }

  // ====================================
  // AGREGAR NUEVO LOTE
  // ====================================

  abrirNuevoLote(p: Producto) {

    this.objetivoLoteId = p.id;

    this.loteForm = {
      codigo: '',
      vencimiento: '',
      cajas: 0,
      unidadesSueltas: 0
    };

    this.error = '';
    this.modalLote = true;
  }

  // ====================================
  // GUARDAR LOTE
  // ====================================

  guardarLote() {

    const producto = this.productos.find(
      p => p.id === this.objetivoLoteId
    );

    if (!producto) {
      return;
    }

    const f = this.loteForm;

    const cajas = Number(f.cajas);
    const sueltas = Number(f.unidadesSueltas);

    const codigo = f.codigo.trim().toUpperCase();

    if (
      !codigo ||
      !f.vencimiento ||
      !Number.isInteger(cajas) ||
      cajas < 0 ||
      !Number.isInteger(sueltas) ||
      sueltas < 0 ||
      (cajas === 0 && sueltas === 0)
    ) {
      this.error = 'Ingresa un lote y cantidades válidas.';
      return;
    }

    const existe = producto.lotes.some(
      lote => lote.codigo === codigo
    );

    if (existe) {
      this.error = 'Este lote ya está registrado.';
      return;
    }

    const lote: Lote = {
      codigo,
      vencimiento: f.vencimiento,
      unidades:
        cajas * producto.unidadesPorCaja + sueltas
    };

    producto.lotes = [
      ...producto.lotes,
      lote
    ];

    this.productos = [...this.productos];

    this.guardarDatos();

    this.modalLote = false;

    this.avisar(
      'Nuevo lote agregado correctamente.'
    );
  }
}
