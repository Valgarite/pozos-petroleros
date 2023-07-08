var all_medidas = []
var all_nombres_y_estados = []
$.get('./assets/php/get_pozos-de-estado.php', (data)=>{
  // console.log(data)
  all_medidas=data[0]
  all_nombres_y_estados=data[1]
})

// function add_pozo() {
//   //Añade un pozo  
//   $.ajax({
//     url: './assets/php/insertar-pozo.php',
//     type: 'POST',
//     data: {
//         Nombre: $('input[name=Nombre]').val(),
//         Estado: $('input[name=Estado]').val()
//     },
//     dataType: 'json',
//     success: function(data) {
//         alert(data[0].message);
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//         console.log(textStatus, errorThrown);
//     }
// });
// }

// function add_medicion() {
//   //Añade una medición

//   $.ajax({
//     url: 'assets/php/insertar-medicion.php',
//     type: 'POST',
//     data: $('#add-medicion').serialize(),
//     dataType: 'json',
//     success: function(data) {
//         alert(data[0].message);
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//         console.log(textStatus, errorThrown);
//     }
// });
// }

let info_pozos = []
function recibir_info_listas() {
  $.ajax({
    url: 'assets/php/get_estados.php',
    method: 'GET',
    success: (data) => {
      //  Aprovechan la data recibida en una sola llamada al servidor para llenar las opciones
      //en los select.
      console.log(data)
      llenar_lista_estado(data, '#estados')
      llenar_lista_estado(data, '#estados-mediciones')
      llenar_lista_estado(data, '#info-estados')
      info_pozos = (data.pozos)
    }
  });
}

function llenar_lista_estado(data, select_estados){
  const lista_estados = document.querySelector(select_estados)
  data.estados.forEach(estado => {
    const option = document.createElement('option');
    option.innerText = estado
    lista_estados.append(option)
  });
}

function filtrar_pozos_por_estado(lista_estados) {
  const opciones = [];
  for (let i = 1; i < lista_estados.options.length; i++) {
    opciones.push(lista_estados.options[i].value);
  }
  // console.log(info_pozos[0])
  // console.log(opciones)

  // console.log(lista_estados.value)
  return (info_pozos.filter(pozo => pozo.Estado === lista_estados.value))
}

function filtrar_medicion_por_estado(medidas, estado) {
  return (medidas.filter(medida => medida.Estado === estado))
}
function filtrar_nombres_por_estado(pozos, estado) {
  const filtered = pozos.filter(pozo => pozo.estado === estado)
  return filtered
}

function llenar_lista_pozo(lista_estados, nombre_de_pozo) {
  //  Esta función va a llenar la lista de pozos según el estado seleccionado en el select.
  //Es por esto que se pasa la lista de estados, para que la función filtrar_pozos_por_estado
  //pueda detectar el estado seleccionado y filtrar los pozos existentes.

  const pozos = filtrar_pozos_por_estado(lista_estados)
  const selected_element = document.getElementById(nombre_de_pozo)

  while (1 < selected_element.options.length) {
    //Este bucle vacía las opciones del select en cada cambio.
    selected_element.remove(1)
  }

  pozos.forEach(pozo => {
    const nuevo_pozo = document.createElement('option')
    nuevo_pozo.value = pozo.idPozo
    nuevo_pozo.innerText = pozo.Nombre
    selected_element.append(nuevo_pozo)
  })
  // console.log(pozos)
}

function fecha_max(element) {
  //  Establece el máximo de fecha que se puede registrar en una medida.

  let dateInput = document.getElementById(element);
  dateInput.max = new Date().toISOString().slice(0, new Date().toISOString().lastIndexOf(":"));
}

function add_change_event(select_estados, id_select_pozos){
  //Esta función añade un eventListener que va a llamar a la función llenar_lista_pozo
  //cada vez que se cambie el estado seleccionado en el select de estados.
  
  const element_select_estados = document.getElementById(select_estados);
  element_select_estados.addEventListener('change', () =>{
    llenar_lista_pozo(element_select_estados, id_select_pozos)
    if(element_select_estados == document.getElementById('info-estados')){
      //Buscar mediciones
      llenar_grafica(element_select_estados.value)
    } 
  }
  );
}

let graph;
function llenar_grafica(estado){
  
  const medidas_del_estado = filtrar_medicion_por_estado(all_medidas, estado)
  const pozos_del_estado = filtrar_nombres_por_estado(all_nombres_y_estados, estado)
  const datos_graph = {
    nombre: [],
    medidas_respectivas: [],
    fecha: []
  }

  console.log(pozos_del_estado)
  const asociados = [];
  let asociar_pozo;
  pozos_del_estado.forEach( datos => {
    const pozo_filtrado = buscar_mediciones_en_pozo(datos.nombre, medidas_del_estado)
    if(pozo_filtrado){

      // console.log(pozo_filtrado)
      // console.log(pozo_filtrado[0])
      // console.log(pozo_filtrado[1])
      console.log(pozo_filtrado[2])

      asociados.push(pozo_filtrado[2])
      // datos_graph.nombre.push(datos.nombre)    

      datos_graph.medidas_respectivas.push(pozo_filtrado[0])
      datos_graph.fecha.push(pozo_filtrado[1])
    }
  })

  const individual_data = []
  const dataset = []
  console.log(asociados)

  pozos_del_estado.forEach(( pozo, i )=>{
    let llaves = [];
    try {
      llaves = Object.keys(asociados[i])
    } catch (error) {}
    llaves = llaves.sort()
    
    // console.log(llaves)
    datos=[]
    llaves.forEach((llave)=>{
      // console.log(asociados[i][llave])
      datos.push({
        x: llave,
        y: asociados[i][llave]
      })
    }
    )
    console.log(datos)
    
    
    
    dataset.push({
      label: pozo.nombre,
      data: datos
    })
  })

  console.log(dataset)

  const context = document.getElementById('info-chart').getContext('2d');

  if(graph){
    graph.destroy();
  }

  // console.log(labels_fechas)
  
  graph = new Chart(context,{
    type:"line",
    data:{
      datasets: dataset,
      options: {
        scales:{
          x:{
            type: 'time',
            time:{
              unit: 'day'
            },
            title:{
              display: true,
              align: 'end',
              text: 'Fechas'
              }
            },
          y: {
            beginAtZero:true
          }
          }
        }
      }
    })

  }

function buscar_mediciones_en_pozo(nombre, mediciones){
  const mediciones_del_pozo = mediciones.filter(medida => medida.Nombre === nombre)

    // console.log(mediciones_del_pozo)
    const presiones_registradas = mediciones_del_pozo.map(x => x.PSI)
    const tiempos_registrados = mediciones_del_pozo.map(x => x.timestamp) 

    let datos_asociados = {}
    tiempos_registrados.forEach( (tiempo, i) => {
      //Creación de un diccionario que asocie los datos.
      // console.log(datos_asociados)

      datos_asociados [tiempo] = presiones_registradas[i]

      }
    )
    return [presiones_registradas, tiempos_registrados, datos_asociados]
}

function add_change_en_tabla(listId) {
  const element_select = document.getElementById(listId);
  element_select.addEventListener('change', ()=>{
    llenar_tbody(element_select.value)
  })
}

function llenar_tbody(idPozo){
  console.log(idPozo)
    $.get('./assets/php/get_info-pozo.php?pozo=' + idPozo, (data)=>{
      const tbody = document.getElementById('tabla-body');
      tbody.innerHTML = data;
    })
}

function validarNombre(idCampo) {
  const nombre = document.getElementById(idCampo);
  const regex = /^[a-zA-Z0-9\s]*$/; // expresión regular que permite solo letras y espacios en blanco

  if (nombre.value == "") {
    
  } else if (!regex.test(nombre.value)) {
    var valorAnterior = nombre.value;
    nombre.value = valorAnterior.replace(/[^a-zA-Z0-9\s]/g, '');
  }
}

fecha_max("hora_medida");

recibir_info_listas()
add_change_event('estados-mediciones', 'nombre_pozo2')
add_change_event('info-estados', 'info-pozos')
add_change_en_tabla('info-pozos')

// $('#submit-pozo').click(add_pozo)
// $('#submit-medicion').click(add_medicion)