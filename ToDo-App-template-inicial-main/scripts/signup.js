if (localStorage.jwt) {
  location.replace('./mis-tareas.html')
}

window.addEventListener('load', function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const form = document.querySelector('form')
  const firstName = document.querySelector('#inputNombre')
  const lastName = document.querySelector('#inputApellido')
  const email = document.querySelector('#inputEmail')
  const password = document.querySelector('#inputPassword')
  const passwordRepeat = document.querySelector('#inputPasswordRepetida')
  const url = 'https://unlpam-todo-api.vercel.app'

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener('submit', function (event) {
    event.preventDefault()

    const payload = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: normalizarEmail(email.value),
      password: password.value
    }

    const settings = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    if (
      validarTexto(firstName.value) &&
      validarTexto(lastName.value) &&
      validarEmail(email.value) &&
      validarContrasenia(password.value) &&
      compararContrasenias(password.value, passwordRepeat.value)
    ) {
      realizarRegister(settings)
      form.reset()
    } else {
      alert('Complete los campos correctamente')
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarRegister(settings) {
    fetch(`${url}/users`, settings)
      .then(response => {
        if (response.ok != true) {
          alert('Algo salió mal')
        }
        // if (response.status === 400) {
        //   alert('El usuario ya esta registrado')
        // }
        return response.json()
      })
      .then(data => {
        if (data.jwt) {
          localStorage.setItem('jwt', JSON.stringify(data.jwt))
          location.replace('./mis-tareas.html')
        }
      })
      .catch(error => {
        console.log(error)
        console.log('Promesa rechazada')
      })
  }
})
