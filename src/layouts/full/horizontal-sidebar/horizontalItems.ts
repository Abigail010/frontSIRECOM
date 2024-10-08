import { useAuthStore } from '@/stores/auth'
import {
    CircleIcon,
    HomeIcon,
    ClipboardIcon,
    AlertCircleIcon,
    SettingsIcon,
    LoginIcon,
    UserPlusIcon,
    RotateIcon,
    ZoomCodeIcon,
    FileDescriptionIcon,
    BorderAllIcon,
    AppsIcon,
    PointIcon,
    BrandAirtableIcon,
    BrowserCheckIcon,
    BuildingFactory2Icon,
    ChartDonut3Icon,
    ListCheckIcon,
    TextSpellcheckIcon,
    ChartBarIcon,
    MenuIcon,
    CircleTriangleIcon,
    CircleXIcon,
    SearchIcon,
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    divider?: boolean;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    subCaption?: string;
    class?: string;
    extraclass?: string;
    type?: string;
}

const lista_menu = [
    { header: 'Menu' },
    {
      title: 'Usuarios',
      icon: ChartDonut3Icon,
      to: '/userList'
  },
     { title: 'Talleres',
      icon: BuildingFactory2Icon,
      to: '/tallerList'
  },
      {
          title:'Ordenes',
          icon: ChartDonut3Icon,
      to: '/ordenList'
      
      }, 
   /* {
      title: 'Recepcion documental',
      icon: BrowserCheckIcon,
      // subCaption: 'This is the subtitle',
      to: '/documentaryReceptionList'
    },
    {
      title: 'Revision documental',
      icon: ListCheckIcon,
      // subCaption: 'This is the subtitle',
      to: '/documentaryReviewList'
*/ 
{
  title: 'Busqueda Reporte',
  icon: SearchIcon,
  to: '/Busqueda_list'
},
{
  title: 'Dashboard',
  icon: ChartBarIcon,
  to: '/home'
},


{
  title: 'Recursos',
  icon: MenuIcon,
  to: '#',
  children: [
    {
      title: 'Perfil',
      icon: CircleIcon,
      to: '/profileList'
    },
    {
      title: 'Servicios',
      icon: CircleIcon,
      to: '/serviciosList'
    },

    {
      title: 'Accesorios',
      icon: CircleIcon,
      to: '/accesorioList'
    },
    {
      title: 'Sistemas',
      icon: CircleIcon,
      to: '/systemList'
    },
    {
      title: 'Filtros',
      icon: CircleIcon,
      to: '/filtroList'
    },
    /*{
      title: 'Repuestos',
      icon: CircleIcon,
      to: '/repuestoList'
    },*/
    {
      title: 'Repuestos',
      icon: CircleIcon,
      to: '/3level',
      children: [
        
        
            {
              title: 'Repuesto',
              icon: CircleXIcon,
              to: '/repuestoList'
            },
            {
              title: 'Ingreso de repuestos',
              icon: CircleXIcon,
              to: '/registerList'
            },
    ]
    },
    {
      title: 'Tipos de mantenimiento',
      icon: CircleIcon,
      to: '/tipo_manList'
    },
    {
      title: 'Registro de vehículos',
      icon: CircleIcon,
      to: '/3level',
      children: [
        
        
            {
              title: 'Vehículos',
              icon: CircleXIcon,
              to: '/vehiculoList'
            },
            {
              title: 'Fuerzas',
              icon: CircleXIcon,
              to: '/FuerzasList'
            },
            {
              title: 'Marcas',
              icon: CircleXIcon,
              to: '/MarcaList'
            },
            {
              title: 'Tipo',
              icon: CircleXIcon,
              to: '/ClaseList'
            },
            {
              title: 'Modelo',
              icon: CircleXIcon,
              to: '/TipoList'
            },
            {
              title: 'Procedencia',
              icon: CircleXIcon,
              to: '/proceList'
            },        

      ]
    },
    {
      title: 'Bienes',
      icon: CircleIcon,
      to: '/3level',
      children: [
        {
          title: 'Sustancia controlada',
          icon: CircleTriangleIcon,
          to: '/4level',
          children: [
            {
              title: 'Tipos',
              icon: CircleXIcon,
              to: '/substanceTypeList'
            },
            {
              title: 'Contenedores',
              icon: CircleXIcon,
              to: '/substanceContainerList'
            },
          ]
        },
        {
          title: 'Semoviente',
          icon: CircleTriangleIcon,
          to: '/4level',
          children: [
            {
              title: 'Tipos',
              icon: CircleXIcon,
              to: '/selfMovingTypeList'
            },
          ]
        },
        {
          title: 'Inmueble',
          icon: CircleTriangleIcon,
          to: '/4level',
          children: [
            {
              title: 'Acabados',
              icon: CircleXIcon,
              to: '/immovablePropertyBrickworkList'
            },
            {
              title: 'Ambientes',
              icon: CircleXIcon,
              to: '/immovablePropertyEnviromentList'
            },
            {
              title: 'Tipos',
              icon: CircleXIcon,
              to: '/immovablePropertyTypeList'
            },
          ]
        },
        {
          title: 'Joya',
          icon: CircleTriangleIcon,
          to: '/4level',
          children: [
            {
              title: 'Metales',
              icon: CircleXIcon,
              to: '/jewelMaterialMetalList'
            },
            {
              title: 'Piedras',
              icon: CircleXIcon,
              to: '/jewelMaterialStoneList'
            },
            {
              title: 'Tipos',
              icon: CircleXIcon,
              to: '/jewelTypeList'
            },
          ]
        },
        {
          title: 'Vehiculo',
          icon: CircleTriangleIcon,
          to: '/4level',
          children: [
            {
              title: 'Industrias',
              icon: CircleXIcon,
              to: '/vehicleIndustryList'
            },
            {
              title: 'Kilometrajes',
              icon: CircleXIcon,
              to: '/vehicleMileageList'
            },
          ]
        },
      ]
    },
    {
      title: 'Revision documental',
      icon: CircleIcon,
      to: '/2level',
      children: [
        {
          title: 'Observaciones',
          icon: CircleTriangleIcon,
          to: '/documentaryReviewObservationList'
        },
      ]
    },
    {
      title: 'Logistica de recepcion',
      icon: CircleIcon,
      to: '/2level',
      children: [
        {
          title: 'Motivos',
          icon: CircleTriangleIcon,
          to: '/receptionLogisticsReasonList'
        },
      ]
    }
  ]
},

    
]

const authStore = useAuthStore()

const horizontalItems: menu[] = [
    /*
    {
        title: 'Dashboard',
        icon: HomeIcon,
        to: '#',
        children: [
            {
                title: 'Modern',
                icon: CircleIcon,
                to: '/dashboards/modern'
            },
            {
                title: 'Ecommerce',
                icon: CircleIcon,
                to: '/dashboards/ecommerce'
            }
        ]
    },
    {
        title: 'Apps',
        icon: AppsIcon,
        to: '#',
        children: [
            {
                title: 'Chats',
                icon: CircleIcon,
                to: '/apps/chats'
            },
            {
                title: 'Blog',
                icon: CircleIcon,
                to: '/',
                children: [
                    {
                        title: 'Posts',
                        icon: PointIcon,
                        to: '/apps/blog/posts'
                    },
                    {
                        title: 'Detail',
                        icon: PointIcon,
                        to: '/apps/blog/early-black-friday-amazon-deals-cheap-tvs-headphones'
                    }
                ]
            },
            {
                title: 'E-Commerce',
                icon: CircleIcon,
                to: '/ecommerce/',
                children: [
                    {
                        title: 'Shop',
                        icon: PointIcon,
                        to: '/ecommerce/products'
                    },
                    {
                        title: 'Detail',
                        icon: PointIcon,
                        to: '/ecommerce/product/detail/1'
                    },
                    {
                        title: 'List',
                        icon: PointIcon,
                        to: '/ecommerce/productlist'
                    },
                    {
                        title: 'Checkout',
                        icon: PointIcon,
                        to: '/ecommerce/checkout'
                    }
                ]
            },
            {
                title: 'User Profile',
                icon: CircleIcon,
                to: '/',
                children: [
                    {
                        title: 'Profile',
                        icon: PointIcon,
                        to: '/apps/user/profile'
                    },
                    {
                        title: 'Followers',
                        icon: PointIcon,
                        to: '/apps/user/profile/followers'
                    },
                    {
                        title: 'Friends',
                        icon: PointIcon,
                        to: '/apps/user/profile/friends'
                    },
                    {
                        title: 'Gallery',
                        icon: PointIcon,
                        to: '/apps/user/profile/gallery'
                    }
                ]
            },
            {
                title: 'Notes',
                icon: CircleIcon,
                to: '/apps/notes'
            },
            {
                title: 'Calendar',
                icon: CircleIcon,
                to: '/apps/calendar'
            },
            {
                title: 'Kanban',
                icon: CircleIcon,
                to: '/apps/kanban'
            },
        ]
    },

    {
        title: 'Pages',
        icon: ClipboardIcon,
        to: '#',
        children: [
            {
                title: 'Pricing',
                icon: CircleIcon,
                to: '/pages/pricing'
            },
            {
                title: 'Account Setting',
                icon: CircleIcon,
                to: '/pages/account-settings'
            },
            {
                title: 'FAQ',
                icon: CircleIcon,
                to: '/pages/faq'
            },
            {
                title: 'Widget',
                icon: CircleIcon,
                to: '/widget-card',
                children: [
                    {
                        title: 'Cards',
                        icon: PointIcon,
                        to: '/widgets/cards'
                    },
                    {
                        title: 'Banners',
                        icon: PointIcon,
                        to: '/widgets/banners'
                    },
                    {
                        title: 'Charts',
                        icon: PointIcon,
                        to: '/widgets/charts'
                    }
                ]
            },
            {
                title: 'UI',
                icon: CircleIcon,
                to: '#',
                children: [
                    {
                        title: 'Alert',
                        icon: PointIcon,
                        to: '/ui-components/alert'
                    },
                    {
                        title: 'Accordion',
                        icon: PointIcon,
                        to: '/ui-components/accordion'
                    },
                    {
                        title: 'Avatar',
                        icon: PointIcon,
                        to: '/ui-components/avatar'
                    },
                    {
                        title: 'Chip',
                        icon: PointIcon,
                        to: '/ui-components/chip'
                    },
                    {
                        title: 'Dialog',
                        icon: PointIcon,
                        to: '/ui-components/dialogs'
                    },
                    {
                        title: 'List',
                        icon: PointIcon,
                        to: '/ui-components/list'
                    },
                    {
                        title: 'Menus',
                        icon: PointIcon,
                        to: '/ui-components/menus'
                    },
                    {
                        title: 'Rating',
                        icon: PointIcon,
                        to: '/ui-components/rating'
                    },
                    {
                        title: 'Tabs',
                        icon: PointIcon,
                        to: '/ui-components/tabs'
                    },
                    {
                        title: 'Tooltip',
                        icon: PointIcon,
                        to: '/ui-components/tooltip'
                    },
                    {
                        title: 'Typography',
                        icon: PointIcon,
                        to: '/ui-components/typography'
                    }
                ]
            },
            {
                title: 'Charts',
                icon: CircleIcon,
                to: '#',
                children: [
                    {
                        title: 'Line',
                        icon: PointIcon,
                        to: '/charts/line-chart'
                    },
                    {
                        title: 'Gredient',
                        icon: PointIcon,
                        to: '/charts/gredient-chart'
                    },
                    {
                        title: 'Area',
                        icon: PointIcon,
                        to: '/charts/area-chart'
                    },
                    {
                        title: 'Candlestick',
                        icon: PointIcon,
                        to: '/charts/candlestick-chart'
                    },
                    {
                        title: 'Column',
                        icon: PointIcon,
                        to: '/charts/column-chart'
                    },
                    {
                        title: 'Doughnut & Pie',
                        icon: PointIcon,
                        to: '/charts/doughnut-pie-chart'
                    },
                    {
                        title: 'Radialbar & Radar',
                        icon: PointIcon,
                        to: '/charts/radialbar-chart'
                    }
                ]
            },
            {
                title: 'Auth',
                icon: CircleIcon,
                to: '#',
                children: [
                    {
                        title: 'Error',
                        icon: AlertCircleIcon,
                        to: '/auth/404'
                    },
                    {
                        title: 'Maintenance',
                        icon: SettingsIcon,
                        to: '/auth/maintenance'
                    },
                    {
                        title: 'Login',
                        icon: LoginIcon,
                        to: '#',
                        children: [
                            {
                                title: 'Side Login',
                                icon: PointIcon,
                                to: '/auth/login'
                            },
                            {
                                title: 'Boxed Login',
                                icon: PointIcon,
                                to: '/'
                            }
                        ]
                    },
                    {
                        title: 'Register',
                        icon: UserPlusIcon,
                        to: '#',
                        children: [
                            {
                                title: 'Side Register',
                                icon: PointIcon,
                                to: '/auth/register'
                            },
                            {
                                title: 'Boxed Register',
                                icon: PointIcon,
                                to: '/auth/register2'
                            }
                        ]
                    },
                    {
                        title: 'Forgot Password',
                        icon: RotateIcon,
                        to: '#',
                        children: [
                            {
                                title: 'Side Forgot Password',
                                icon: PointIcon,
                                to: '/auth/forgot-password'
                            },
                            {
                                title: 'Boxed Forgot Password',
                                icon: PointIcon,
                                to: '/auth/forgot-password2'
                            }
                        ]
                    },
                    {
                        title: 'Two Steps',
                        icon: ZoomCodeIcon,
                        to: '#',
                        children: [
                            {
                                title: 'Side Two Steps',
                                icon: SettingsIcon,
                                to: '/auth/two-step'
                            },
                            {
                                title: 'Boxed Two Steps',
                                icon: SettingsIcon,
                                to: '/auth/two-step2'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: 'Forms',
        icon: FileDescriptionIcon,
        to: '#',
        children: [
            {
                title: 'Form Elements',
                icon: CircleIcon,
                to: '/components/',
                children: [
                    {
                        title: 'Autocomplete',
                        icon: PointIcon,
                        to: '/forms/form-elements/autocomplete'
                    },
                    {
                        title: 'Combobox',
                        icon: PointIcon,
                        to: '/forms/form-elements/combobox'
                    },
                    {
                        title: 'Button',
                        icon: PointIcon,
                        to: '/forms/form-elements/button'
                    },
                    {
                        title: 'Checkbox',
                        icon: PointIcon,
                        to: '/forms/form-elements/checkbox'
                    },
                    {
                        title: 'Custom Inputs',
                        icon: PointIcon,
                        to: '/forms/form-elements/custominputs'
                    },
                    {
                        title: 'File Inputs',
                        icon: PointIcon,
                        to: '/forms/form-elements/fileinputs'
                    },
                    {
                        title: 'Radio',
                        icon: PointIcon,
                        to: '/forms/form-elements/radio'
                    },
                    {
                        title: 'Select',
                        icon: PointIcon,
                        to: '/forms/form-elements/select'
                    },
                    {
                        title: 'Date Time',
                        icon: PointIcon,
                        to: '/forms/form-elements/date-time'
                    },
                    {
                        title: 'Slider',
                        icon: PointIcon,
                        to: '/forms/form-elements/slider'
                    },
                    {
                        title: 'Switch',
                        icon: PointIcon,
                        to: '/forms/form-elements/switch'
                    }
                ]
            },
            {
                title: 'Form Layout',
                icon: CircleIcon,
                to: '/forms/form-layouts'
            },
            {
                title: 'Form Horizontal',
                icon: CircleIcon,
                to: '/forms/form-horizontal'
            },
            {
                title: 'Form Vertical',
                icon: CircleIcon,
                to: '/forms/form-vertical'
            },
            {
                title: 'Form Custom',
                icon: CircleIcon,
                to: '/forms/form-custom'
            },
            {
                title: 'Form Validation',
                icon: CircleIcon,
                to: '/forms/form-validation'
            }
        ]
    },
    {
        title: 'Tables',
        icon: BorderAllIcon,
        to: '#',
        children: [
            {
                title: 'Basic Table',
                icon: CircleIcon,
                to: '/tables/basic'
            },
            {
                title: 'Dark Table',
                icon: CircleIcon,
                to: '/tables/dark'
            },
            {
                title: 'Density Table',
                icon: CircleIcon,
                to: '/tables/density'
            },
            {
                title: 'Fixed Header Table',
                icon: CircleIcon,
                to: '/tables/fixed-header'
            },
            {
                title: 'Height Table',
                icon: CircleIcon,
                to: '/tables/height'
            },
            {
                title: 'Editable Table',
                icon: CircleIcon,
                to: '/tables/editable'
            },
        ]
    },
    {
        title: 'Data Tables',
        icon: BrandAirtableIcon,
        to: '#',
        children: [
            {
                title: 'Basic Table',
                icon: CircleIcon,
                to: '/tables/datatables/basic'
            },
            {
                title: 'Header Table',
                icon: CircleIcon,
                to: '/tables/datatables/header'
            },
            {
                title: 'Selection Table',
                icon: CircleIcon,
                to: '/tables/datatables/selection'
            },
            {
                title: 'Sorting Table',
                icon: CircleIcon,
                to: '/tables/datatables/sorting'
            },
            {
                title: 'Pagination Table',
                icon: CircleIcon,
                to: '/tables/datatables/pagination'
            },
            {
                title: 'Filtering Table',
                icon: CircleIcon,
                to: '/tables/datatables/filtering'
            },
            {
                title: 'Grouping Table',
                icon: CircleIcon,
                to: '/tables/datatables/grouping'
            },
            {
                title: 'Table Slots',
                icon: CircleIcon,
                to: '/tables/datatables/slots'
            },
            {
                title: 'CRUD Table',
                icon: CircleIcon,
                to: '/tables/datatables/crudtable'
            },
        ]
    }
    */
];

const getMenu = async () => {
    const response = await authStore.getUserMenu()
    for (let i = 0; i < response.length; i++) {
  
    //   if(response[i].header){
    //     horizontalItems.push(response[i])
    //   }
  
      if(response[i].title && response[i].icon && !response[i].children){
        const registro:any = lista_menu.find(
          (menu: any) => menu.title == response[i].title
        )
        horizontalItems.push(registro)
      }
  
      if(response[i].title && response[i].icon && response[i].children){
        // CAPTURAMOS EL REGISTRO QUE TIENE HIJOS EN LA VARIABLE registro
        const registro:any = lista_menu.find(
          (menu: any) => menu.title == response[i].title
        )
        // CREAMOS UN ARRAY DONDE SE ALMACENARAN LOS HIJOS QUE NO TIENEN MAS HIJOS
        const menu_nivel_2 = []
        // ITERAREMOS SOBRE LOS HIJOS QUE TIENE EL USUARIO
        for (let j = 0; j < response[i].children.length; j++) {
          // EN LA VARIABLE submenu ALMACENAREMOS EL MENU HIJO
          const submenu: any = registro.children.find(
            (menu: any) => menu.title == response[i].children[j].title
          )
          // ANALIZAREMOS SI EL SUBMENU QUE NOS LLEGA DEL BACKEND TIENE HIJOS
          if(response[i].children[j].children){
            // EL 2DO NIVEL TIENE HIJOS DE 3ER NIVEL
            // console.log(response[i].children[j]);
            const menu_nivel_3 = []
            for (let k = 0; k < response[i].children[j].children.length; k++) {
              // console.log(response[i].children[j].children[k]);
              const submenu_2: any = submenu.children.find(
                (menu: any) => menu.title == response[i].children[j].children[k].title
              )
              // console.log('submenu2:',submenu_2);
              if(response[i].children[j].children[k].children){
                const menu_nivel_4 = []
                for (let l = 0; l < response[i].children[j].children[k].children.length; l++) {
                  const submenu_3: any = submenu_2.children.find(
                    (menu: any) => menu.title == response[i].children[j].children[k].children[l].title
                  )
                  menu_nivel_4.push(submenu_3)
                }
                submenu_2.children = menu_nivel_4
              }
              menu_nivel_3.push(submenu_2)
            }
            submenu.children = menu_nivel_3
          }
          menu_nivel_2.push(submenu)
        }
        // SE AGREGARA LOS HIJOS(submenus) QUE TIENE EL registro 
        registro.children = menu_nivel_2
        // SE AGREGA EL REGISTRO AL LISTADO DE MENUS
        horizontalItems.push(registro)
      }
    }
  }
  getMenu()

export default horizontalItems;
