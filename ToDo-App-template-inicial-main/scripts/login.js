if (localStorage.jwt) {
  location.replace('./mis-tareas.html')
}

window.addEventListener('load', function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const form = document.querySelector('form')
  const email = document.querySelector('#inputEmail')
  const password = document.querySelector('#inputPassword')
  const url = 'https://unlpam-todo-api.vercel.app'

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener('submit', function (event) {
    event.preventDefault()

    const payload = {
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

    if (validarEmail(email.value) && validarTexto(password.value)) {
      realizarLogin(settings)
      form.reset()
    } else {
      alert('Complete los campos correctamente')
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 2: Realizar el login [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarLogin(settings) {
    console.log('Lanzamos la consulta a la API...')
    fetch(`${url}/users/login`, settings)
      .then(response => {
        if (response.ok != true) {
          alert('Algo malió sal.')
        }
        return response.json()
      })
      .then(data => {
        console.log(data)
        if (data.jwt) {
          localStorage.setItem('jwt', JSON.stringify(data.jwt))
          location.replace('./mis-tareas.html')
        }
      })
  }
})
