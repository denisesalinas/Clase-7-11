window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form= document.forms[0]
    const firstName= document.querySelector('#inputNombre')
    const lastName= document.querySelector('#inputApellido')
    const email= document.querySelector('#inputEmail')
    const password= document.querySelector('#inputPassword')
    const passwordRepetida= document.querySelector('#inputPasswordRepetida')
    const url= 'https://unlpam-todo-api.vercel.app/users'    

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
      event.preventDefault()
      const payload ={
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password:password.value        
      }

      const settings = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
             'Content-Type': 'application/json'
        }
      }
      realizarRegister(settings)
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        fetch (`${url}/signup`,settings)
        .then (response =>{
            if(response.ok!= true){
                if( response.status == 400){
                    alert('El usuario ya se encuentra registrado / Alguno de los datos requeridos estan incompletos')
                   }
                   if( response.status == 500){
                    alert('Error en el servidor')
                   }
                }
            return response.JSON()
            })
        
        .then(data =>{
            if(data.jwt){
                localStorage.setItem('jwt', JSON.stringify(data.jwt))
            }
            location.replace('./mis-tareas.html')
        })
    }
});