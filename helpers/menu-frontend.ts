export const getMenuFrontEnd = (role = '0') => {

     
    const menu =  [
        {
          titulo: 'Dashboard',
          icono: 'mdi mdi-gauge',
          submenu: [
            { titulo: 'Inicio', url: '/' },
          ]
        },
    

        {
          titulo: 'Mantenimiento',
          icono: 'mdi mdi-folder-lock-open',
          submenu: [
          ]
        },
    
    
      ];



      // ROLE 2 = ADMIN
      if( role === '2') {
          menu[1].submenu.unshift({ titulo: 'Administración', url: 'usuarios'})
          menu[1].submenu.unshift({ titulo: 'Usuarios APP', url: 'usuariosapp'})
          menu[1].submenu.unshift({ titulo: 'Categorias', url: 'categoria'})
          menu[1].submenu.unshift({ titulo: 'Cursos', url: 'cursos'})
          menu[1].submenu.unshift({ titulo: 'Pruebas', url: 'pruebas'})
          menu[1].submenu.unshift({ titulo: 'Lecciones', url: 'lecciones'})
          menu[1].submenu.unshift({ titulo: 'Recursos', url: 'recursos'})
          // menu[1].submenu.unshift({ titulo: 'Resultados', url: 'resultados'})
          menu[1].submenu.unshift({ titulo: 'Secciones', url: 'seccion'})

      }


      // ROLE 0  = PROFESOR
      if( role === '0') { 
        menu[1].submenu.unshift({ titulo: 'Usuarios APP', url: 'usuariosapp'})
        menu[1].submenu.unshift({ titulo: 'Cursos', url: 'cursos'})
        menu[1].submenu.unshift({ titulo: 'Pruebas', url: 'pruebas'})
        menu[1].submenu.unshift({ titulo: 'Lecciones', url: 'lecciones'})
        menu[1].submenu.unshift({ titulo: 'Resultados', url: 'resultados'})





      }

      return menu;

    }



    module.exports = {
        getMenuFrontEnd
    }