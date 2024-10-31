//Cargamos las librerías: express, bcryptjs; y el módulo de conexión a la BBDD creado por nosotros que se utilizan en las rutas: 
const express = require('express');
const rutas = express.Router();
const bcriptjs = require('bcryptjs');
const connectionbd = require('../database/db');


//10 - registro. Código que se cargará una vez relleno el formulario de registro
rutas.post('/register', async (req, res)=>{
    //variables para guardar la información de los campos
	const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const phone = req.body.phone;
    const rol = req.body.rol;
	const pass = req.body.pass;

    //variable que guarda la contraseña encriptada en 8 iteraciones por el módulo bcrypt
	let passwordHash = await bcriptjs.hash(pass, 8);

    //insertamos los datos en nuestra BBDD
    connectionbd.query('INSERT INTO users SET ?',{nombre:name, apellidos:surname, email:email, telefono:phone, idrol:rol, password:passwordHash}, async (error, results)=>{
        if(error){
            console.log(error);
        }else{
            //enviamos el render con un objeto para el Sweet Alert 2
			res.render('register', {
				alert: true,
				alertTitle: "Registro",
				alertMessage: "¡Registro exitoso!",
				alertIcon:'success',
				showConfirmButton: false,
				timer: 1500,
				ruta: '',
				login: false,
			});      
        }
	});
})

//registro. Código que se cargará una vez relleno el formulario de registro
rutas.post('/registerusers', async (req, res)=>{
    //variables para guardar la información de los campos
	const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const phone = req.body.phone;
    const rol = req.body.rol;
	const pass = req.body.pass;

    //variable que guarda la contraseña encriptada en 8 iteraciones por el módulo bcrypt
	let passwordHash = await bcriptjs.hash(pass, 8);

    //insertamos los datos en nuestra BBDD
    connectionbd.query('INSERT INTO users SET ?',{nombre:name, apellidos:surname, email:email, telefono:phone, idrol:rol, password:passwordHash}, async (error, results)=>{
        if(error){
            console.log(error);
        }else{
            //enviamos el render con un objeto para el Sweet Alert 2
			res.render('register', {
				alert: true,
				alertTitle: "Registro",
				alertMessage: "¡Registro de Usuario exitoso!",
				alertIcon:'success',
				showConfirmButton: false,
				timer: 1500,
				ruta: 'admin',
				login: false,
			});      
        }
	});
})

//Registro Categorías
rutas.post('/registercat', async (req, res)=>{
    //variables para guardar la información de los campos
	const name = req.body.name;

    //insertamos los datos en nuestra BBDD
    connectionbd.query('INSERT INTO categoria SET ?',{nombre:name}, async (error, results)=>{
        if(error){
            console.log(error);
        }else{
            //enviamos el render con un objeto para el Sweet Alert 2
			res.render('registercat', {
				alert: true,
				alertTitle: "Registro",
				alertMessage: "¡Registro de Categoria exitoso!",
				alertIcon:'success',
				showConfirmButton: false,
				timer: 1500,
				ruta: 'admin',
				login: true,
			});      
        }
	});
})

//Registro Localizaciones
rutas.post('/registerloc', async (req, res)=>{
    //variables para guardar la información de los campos
	const name = req.body.name;

    //insertamos los datos en nuestra BBDD
    connectionbd.query('INSERT INTO localizacion SET ?',{nombre:name}, async (error, results)=>{
        if(error){
            console.log(error);
        }else{
            //enviamos el render con un objeto para el Sweet Alert 2
			res.render('registerloc', {
				alert: true,
				alertTitle: "Registro",
				alertMessage: "¡Registro de Localización exitoso!",
				alertIcon:'success',
				showConfirmButton: false,
				timer: 1500,
				ruta: 'admin',
				login: true,
			});      
        }
	});
})

//Registro Proveedores
rutas.post('/registerprov', async (req, res)=>{
    //variables para guardar la información de los campos
	const name = req.body.name;
	const phone = req.body.phone;
	const web = req.body.web;
	const email = req.body.email;

    //insertamos los datos en nuestra BBDD
    connectionbd.query('INSERT INTO proveedor SET ?',{nombre:name, telefono:phone, web:web, email:email}, async (error, results)=>{
        if(error){
            console.log(error);
        }else{
            //enviamos el render con un objeto para el Sweet Alert 2
			res.render('registerloc', {
				alert: true,
				alertTitle: "Registro",
				alertMessage: "¡Registro de Proveedor exitoso!",
				alertIcon:'success',
				showConfirmButton: false,
				timer: 1500,
				ruta: 'admin',
				login: true,
			});      
        }
	});
})

//11 - Metodo para la autenticación para el post definido como /auth. Método que se utiliza en el formulario para iniciar sesión
rutas.post('/auth', async (req, res)=> {
	const email = req.body.email;
	const pass = req.body.pass;
	
    //comprobamos si existe el usuario y la contraseña
	if (email && pass) {
        //comprobamos si existe el usuario em la base de datos
		connectionbd.query('SELECT * FROM users WHERE email = ? ', [email], async (error, results, fields)=> {
            //comprobamos si hemos obtenido resultados y si ha coincidido la contraseña en tal caso
			//console.log(await bcriptjs.compare(pass, results[0].password));
			if( results.length == 0 || !(await bcriptjs.compare(pass, results[0].password)) ) {
                //Mensaje simple para avisar de que es incorrecta la autenticación 
                //res.send('Usuario y/o contraseña erróneo');		

                //creamos un objeto para utilizarlo con Sweet Alert 2
				res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña erróneo",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login',
						login:false 
                    });
						
			} else {  
                //Mensaje simple para avisar de que es correcta la autenticación 
                //res.send('Inicio de sesión exitoso');		  
                
				//creamos una variable de session y le asignamos true       
				req.session.loggedin = true; 
                //cargamos el nombre de usuario que hemos importado de la BBDD
				req.session.name = results[0].nombre;
				req.session.rol = results[0].idrol;

                //creamos un objeto para utilizarlo con Sweet Alert 2
				res.render('login', {
					alert: true,
					alertTitle: "Conexión exitosa",
					alertMessage: "¡Inicio de sesión exitoso!",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: 'admin',
					login: false
				});        			
			}			
			// res.end();
		});
	} else {
        //avisar de que debe ingresar un usuario y una contraseña
		//res.send('Ingrese el usuario y la contraseña');
		//res.end();
        
        //creamos un objeto para utilizarlo con Sweet Alert 2
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Ingrese el usuario y la contraseña",
            alertIcon:'warning',
            showConfirmButton: true,
            timer: false,
            ruta: 'login',
			login:false,
        });
        
	}
});

//12 - Renderización para la ruta principal / de la vista index.ejs
rutas.get('/', (req, res)=> {
    // si existe la variable que guarda la autenticación
	if (req.session.loggedin) {
        //renderizamos index,asignándole el nombre de usuario y la variable login con valor true
		res.render('index',{
			login: true,
			name: req.session.name			
		});		
	} else {
        //renderizamos index,asignándole el texto a name y la variable login con valor false
		res.render('index',{
			login:false,
			name:'Debe iniciar sesión',			
		});				
	}
	res.end();
});

//12B - Renderización para la ruta /login de la vista login.ejs
rutas.get('/login', (req, res)=> {
    // si existe la variable que guarda la autenticación
	if (req.session.loggedin) {
        //renderizamos index,asignándole el nombre de usuario y la variable login con valor true
		res.render('login',{
			login: true		
		});		
	} else {
        //renderizamos index,asignándole el texto a name y la variable login con valor false
		res.render('login',{
			login:false			
		});				
	}
	res.end();
});

//12C - Renderización para la ruta /registro de la vista register.ejs
rutas.get('/registro', (req, res)=> {
    // si existe la variable que guarda la autenticación
	if (req.session.loggedin) {
        //renderizamos index,asignándole el nombre de usuario y la variable login con valor true
		res.render('register',{
			login: true		
		});		
	} else {
        //renderizamos index,asignándole el texto a name y la variable login con valor false
		res.render('register',{
			login:false			
		});				
	}
	res.end();
});

//Renderización para la ruta /registrousers de la vista registerusers.ejs
rutas.get('/registrousers', (req, res)=> {
    // si existe la variable que guarda la autenticación
	if (req.session.loggedin) {
        //renderizamos index,asignándole el nombre de usuario y la variable login con valor true
		res.render('registerusers',{
			login: true		
		});		
	} else {
        //renderizamos index,asignándole el texto a name y la variable login con valor false
		res.render('registerusers',{
			login:false			
		});				
	}
	res.end();
});

//Renderización para la ruta /registrocat de la vista registercat.ejs
rutas.get('/registrocat', (req, res)=> {
    // si existe la variable que guarda la autenticación
	if (req.session.loggedin) {
        //renderizamos index,asignándole el nombre de usuario y la variable login con valor true
		res.render('registercat',{
			login: true		
		});		
	} else {
        //renderizamos index,asignándole el texto a name y la variable login con valor false
		res.render('registercat',{
			login:false			
		});				
	}
	res.end();
});

//Renderización para la ruta /localizacion de la vista registercat.ejs
rutas.get('/registroloc', (req, res)=> {
    // si existe la variable que guarda la autenticación
	if (req.session.loggedin) {
        //renderizamos index,asignándole el nombre de usuario y la variable login con valor true
		res.render('registerloc',{
			login: true		
		});		
	} else {
        //renderizamos index,asignándole el texto a name y la variable login con valor false
		res.render('registerloc',{
			login:false			
		});				
	}
	res.end();
});

//Renderización para la ruta /registroprov de la vista registerprov.ejs
rutas.get('/registroprov', (req, res)=> {
    // si existe la variable que guarda la autenticación
	if (req.session.loggedin) {
        //renderizamos index,asignándole el nombre de usuario y la variable login con valor true
		res.render('registerprov',{
			login: true		
		});		
	} else {
        //renderizamos index,asignándole el texto a name y la variable login con valor false
		res.render('registerprov',{
			login:false			
		});				
	}
	res.end();
});

//Renderización para la ruta /registroprod de la vista registerprod.ejs
rutas.get('/registroprod', async (req, res)=> {
    
    console.log("ini");
    let results;
    results = await connectionbd.query('SELECT id, nombre FROM localizacion ', (error, resultscat) => {
        if (error) {
            throw error;
        } 
        else{
            console.log(resultscat);
        }
    });
    console.log("external");
    console.log(results);

    if (req.session.loggedin) {
        res.render('registerprod', {
            login: true,
            name: req.session.name,
            rol: req.session.rol,
            results: results			
        });		
    } else {
        res.render('registerprod', {
            login: false,
            name: "Área privada, inicie sesión para poder acceder al contenido",
            rol: '',
            results: results			
        });				
    }
    
	//res.end();
});

//12D - Renderización para la ruta /admin de la vista admin.ejs
rutas.get('/admin', (req, res)=> {
	connectionbd.query('SELECT u.id, u.nombre, u.apellidos, u.email, u.telefono, r.nombre as rol FROM users u INNER JOIN roles r ON r.id = u.idrol', (error, results) => {
        if (error) {
            throw error;
        } else {
            if (req.session.loggedin) {
                res.render('admin', {
                    login: true,
                    name: req.session.name,
                    rol: req.session.rol,
                    results: results			
                });		
            } else {
                res.render('admin', {
                    login: false,
                    name: "Área privada, inicie sesión para poder acceder al contenido",
                    rol: '',
                    results: results			
                });				
            }
        }
    });
});

//Renderización para la ruta /users de la vista users.ejs
rutas.get('/users', (req, res)=> {
	connectionbd.query('SELECT u.id, u.nombre, u.apellidos, u.email, u.telefono, r.nombre as rol FROM users u INNER JOIN roles r ON r.id = u.idrol', (error, results) => {
        if (error) {
            throw error;
        } else {
            if (req.session.loggedin) {
                res.render('users', {
                    login: true,
                    name: req.session.name,
                    rol: req.session.rol,
                    results: results			
                });		
            } else {
                res.render('users', {
                    login: false,
                    name: "Área privada, inicie sesión para poder acceder al contenido",
                    rol: '',
                    results: results			
                });				
            }
        }
    });
});

//Renderización para la ruta /category de la vista category.ejs
rutas.get('/category', (req, res)=> {
	connectionbd.query('SELECT id, nombre FROM categoria ', (error, results) => {
        if (error) {
            throw error;
        } else {
            if (req.session.loggedin) {
                res.render('category', {
                    login: true,
                    name: req.session.name,
                    rol: req.session.rol,
                    results: results			
                });		
            } else {
                res.render('category', {
                    login: false,
                    name: "Área privada, inicie sesión para poder acceder al contenido",
                    rol: '',
                    results: results			
                });				
            }
        }
    });
});

//Renderización para la ruta /location de la vista location.ejs
rutas.get('/location', (req, res)=> {
	connectionbd.query('SELECT id, nombre FROM localizacion ', (error, results) => {
        if (error) {
            throw error;
        } else {
            if (req.session.loggedin) {
                res.render('location', {
                    login: true,
                    name: req.session.name,
                    rol: req.session.rol,
                    results: results			
                });		
            } else {
                res.render('location', {
                    login: false,
                    name: "Área privada, inicie sesión para poder acceder al contenido",
                    rol: '',
                    results: results			
                });				
            }
        }
    });
});

//Renderización para la ruta /provider de la vista provider.ejs
rutas.get('/provider', (req, res)=> {
	connectionbd.query('SELECT id, nombre, telefono, web, email FROM proveedor ', (error, results) => {
        if (error) {
            throw error;
        } else {
            if (req.session.loggedin) {
                res.render('provider', {
                    login: true,
                    name: req.session.name,
                    rol: req.session.rol,
                    results: results			
                });		
            } else {
                res.render('provider', {
                    login: false,
                    name: "Área privada, inicie sesión para poder acceder al contenido",
                    rol: '',
                    results: results			
                });				
            }
        }
    });
});

//13 - Ruta que será cargada para destruir la sesión y redirigir a la página principal
rutas.get('/logout', function (req, res) {
    //Destruye la sesión.
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});



//14 - ruta para editar los registros
rutas.get ('/edit/:id', (req, res)=>{
	const id =req.params.id;
	connectionbd.query('SELECT * FROM users WHERE id=?', [id], (error, results)=>{
		if (error) {
            throw error;
        } else {
			res.render('edit', {
				user: results[0],
				login: true,
				name: req.session.name,
				rol: req.session.rol,
			})
		}
	})
})

// post de actualizar
rutas.post('/actualizar', (req,res)=>{
	//variables para guardar la información de los campos
	const id = req.body.id;
	const user = req.body.user;
	const name = req.body.name;
    const rol = req.body.rol;


    //insertamos los datos en nuestra BBDD 
    connectionbd.query('UPDATE users SET ? WHERE id = ?',[{user:user, name:name, rol:rol}, id], (error, results)=>{
        if(error){
            console.log(error);
        }else{
			res.redirect('/admin');  
        }
	});
})

//post de eliminar registro
rutas.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    connectionbd.query('DELETE FROM users WHERE id = ?',[id], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect('/admin');         
        }
    })
});

//exportamos todas las rutas
module.exports = rutas;

