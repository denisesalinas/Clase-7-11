// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
if (!localStorage.jwt) {
  location.replace('./')
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  /* ---------------- variables globales y llamado a funciones ---------------- */
  const jwt = JSON.parse(localStorage.jwt)
  const btnCerrarSesion= document.querySelector('#closeApp')
  const nombreUsuario= document.querySelector('.user-info p')
  const formCrearTarea= document.querySelector('.nueva-tarea')
  const task=document.querySelector('#nuevaTarea')

  const url = 'https://unlpam-todo-api.vercel.app'

  obtenerNombreUsuario()
  consultarTareas()

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
   console.log('Cerrando sesión')
   //primero eliminamos el jwt
    localStorage.removeItem('jwt')
    //nos vamos al index.html
   location.replace('./index.html')
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
console.log('Obteniendo nombre de usuario')
nombreUsuario.innerHTML = 'Cargando...'

const settings={
  method: 'GET',
  headers: {
    Authorization: `Bearer ${jwt}`
  }
}

fetch(`${url}/users/getMe`,settings)

.then (response =>{
  if (response.ok != true) {
    alert('Algo salio mal')
    nombreUsuario.innerHTML='Algo salió mal'
  }
  return response.json()
})
.then (data => {
  console.log (data)
  nombreUsuario.innerText = data.firstName
})

  };

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    console.log('Obteniendo tareas...')

    const settings = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    };

    fetch(`${url}/tasks`,settings)
    .then(response =>{
      if (response.ok != true) {
        alert ('Algo salió mal');
      }
      return response.json();
    })
    .then(data =>{
      console.log(data)
      renderizarTareas(data);
    })
    .catch(error=>{
      console.log('Error al obtener tareas: ', error)
    })

  };

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault()
    console.log ('Creando tarea')

    const payload ={
      description:task.value,
      completed:false
    }

    const settings= {
      method:'POST',
      body:JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      }
    }
    
    //POST
    if ( validarTexto (task.value) ) {

      fetch(`${url}/tasks`,settings)
      
      .then(response =>{
        if(response.ok != true){
          alert ('Algo salió mal')
        }
        return response.json()
      })

      .then(data =>{
        console.log(data)
        formCrearTarea.reset()
        consultarTareas()
      })
    } else {
      alert ('No se pueden cargar tareas vacias')
    }

  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    let countEndTask=0
    
    const pendingTask = document.querySelector('.tareas-pendientes')
    const endTask = document.querySelector('.tareas-terminadas')
    const cantidadFinalizadas = document.querySelector('#cantidad-finalizadas')
    //Vaciar las constantes
    pendingTask.innerHTML = '';
    endTask.innerHTML = '';

    console.log ('Cargando TAREAS')

    listado.forEach(tarea=>{

      if(tarea.completed){
      endTask.innerHTML += `<li class="tarea">
                              <div class="hecha">
                                <i class="fa-regular fa-circle-check"></i>
                              </div>
                              
                              <div class="descripcion">
                                <p class="nombre">${tarea.description}</p>
                              </div>

                              <div class="cambios-estados">
                                <button class="change completa" id="${tarea.id}"> <i class="fa-solid fa-rotate-left"></i> </button>
                                <button class="borrar" id="${tarea.id}"> <i class="fa-regular fa-trash-can"></i> </button>
                              </div>
                            </li>`
      countEndTask++//Contar tareas finalizadas
            
      } else {
        pendingTask.innerHTML +=`
        <li class="tarea">
          <button class="change" id="${tarea.id}"> <i class="fa-regular fa-circle"></i> </button>
          <div class="descripcion">
            <p class="nombre"> ${tarea.description}</p>
          </div>
        </li>`
      }
    })
    cantidadFinalizadas.innerHTML = countEndTask
    botonesCambioEstado()
    botonBorrarTarea()
  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    const btnCambiarEstado = document.querySelectorAll('.change')

    btnCambiarEstado.forEach(btn=>{
      btn.addEventListener('click', function(event){
        const payload = {}

      if(event.target.classList.contains('completa')){

        payload.completed = false
      } else {
        payload.completed = true
      }

      const settings ={
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        }
      }

      fetch(`${url}/tasks/${event.target.id}`,settings)
      .then(response =>{
        if(response.ok !=true) {
          alert ('Algo salió mal')
        }
        return response.json()
      })
      .then(data=>{
        console.log(data)
        consultarTareas()
      })

      })
      
    })
  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
    const btnBorrarTarea = document.querySelectorAll('.borrar')

    btnBorrarTarea.forEach(btn=>{
      btn.addEventListener('click', function(event){

        const settings ={
          method:'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
          }
        }

        fetch(`${url}/tasks/${event.target.id}`,settings)
        .then(response =>{
          if(response.ok!= true){
            alert('Algo salió mal')
          }
          return response.json()
        })
        .then(data =>{
          console.log(data)
          consultarTareas()
        })
      })
    })
  };

});

