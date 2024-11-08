window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
   const form= document.forms[0]
   const email= document.querySelector('#inputEmail')
   const password= document.querySelector('#inputPassword')
    const url= 'https://unlpam-todo-api.vercel.app'


    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
      //

        //Información del formulario
        const payload= {
        email: email.value,
        password:password.value
       }

       //Configuración del POST
       const settings={
        method:'POST',
        body: JSON.stringify(payload),
        headers:{
            'Content-Type' : 'application/json'
        }
       }
        realizarLogin(settings)
    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {
       console.log(settings)
       fetch(`${url}/users/login`, settings)
       //Escuchamos la respuesta
       .then (response =>{
        if(response.ok!=true){
           if (response.status ==404){
            alert('El usuario no existe')
           } 
           if( response.status == 400){
            alert('La contraseña ingresada no es válida')
           }
           if( response.status == 500){
            alert('Error en el servidor')
           }
        }
        return response.json()
       })
       //Datos en JSON
       .then(data=>{
        console.log(data.jwt)
        //Preguntar si existe jwt
        if(data.jwt) {
            //Se guarda en el local
            localStorage.setItem('jwt',JSON.stringify(data.jwt))
        }
        location.replace('./mis-tareas.html')
       })




        
    };


});