import { useAuthStore } from '@/stores/auth'
import {
    CircleOffIcon,
    BoxMultipleIcon,
    AppsIcon,
    FileTextIcon,
    FileDotsIcon,
    FilesIcon,
    EditIcon,
    BorderAllIcon,
    BorderHorizontalIcon,
    BorderInnerIcon,
    BorderTopIcon,
    BorderVerticalIcon,
    BoxIcon,
    AlertCircleIcon,
    LoginIcon,
    UserPlusIcon,
    RotateIcon,
    CurrencyDollarIcon,
    ChartLineIcon,
    ChartAreaIcon,
    ChartDotsIcon,
    ChartArcsIcon,
    ChartCandleIcon,
    ChartDonut3Icon,
    ChartRadarIcon,
    ShoppingCartIcon,
    ApertureIcon,
    LayoutIcon,
    HelpIcon,
    UserCircleIcon,
    BoxAlignBottomIcon,
    BoxAlignLeftIcon,
    SettingsIcon,
    ZoomCodeIcon,
    StarIcon,
    AwardIcon,
    MoodSmileIcon,
    Message2Icon,
    PointIcon,
    AppWindowIcon,
    MailIcon,
    BasketIcon,
    CalendarIcon,
    BorderStyle2Icon,
    ColumnsIcon,
    RowInsertBottomIcon,
    EyeTableIcon,
    SortAscendingIcon,
    PageBreakIcon,
    FilterIcon,
    BoxModelIcon,
    ServerIcon,
    JumpRopeIcon,
    LayoutKanbanIcon,
    BrowserCheckIcon,
    ListCheckIcon,
    TextSpellcheckIcon,
    ChartBarIcon,
    MenuIcon,
    CircleIcon,
    CircleTriangleIcon,
    CircleXIcon,
    SearchIcon,
    BuildingFactory2Icon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipBgColor?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
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
      title: 'Gasto administrativo',
      icon: BrowserCheckIcon,
      // subCaption: 'This is the subtitle',
      to: '/administrativeExpenseList'
    },
    {
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
    },*/

    {
      title: 'Aprobacion de bienes',
      icon: TextSpellcheckIcon,
      to: '/propertyApprovalList'
    },
    {
      title: 'Dashboard',
      icon: ChartBarIcon,
      to: '/home'
    },
    {
      title: 'DAB solicitud',
      icon: CircleIcon,
      to: '/solicitudList'
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
        {
          title: 'Tipos de mantenimiento',
          icon: CircleIcon,
          to: '/tipo_manList'
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
    {
      title: 'Busqueda',
      icon: SearchIcon,
      to: '#',
      children: [
        {
          title: 'Tipo de bien',
          icon: CircleIcon,
          to: '/byType'
        },
        {
          title: 'Caso',
          icon: CircleIcon,
          to: '/byCase'
        },
      ]
    },
    {
      title: 'Entidades Externas',
      icon: ListCheckIcon,
      to: '#',
      children: [
        {
          title: 'Aprobados',
          icon: CircleIcon,
          to: '#',
          children: [
            {
              title: 'Persona Natural',
              icon: CircleIcon,
              to: '/externalRegistrationList/aprobado/natural'
            },
            {
              title: 'Persona Juridica',
              icon: CircleIcon,
              to: '/externalRegistrationList/aprobado/juridica'
            },
          ]
        },
        {
          title: 'Pendientes',
          icon: CircleIcon,
          to: '#',
          children: [
            {
              title: 'Persona Natural',
              icon: CircleIcon,
              to: '/externalRegistrationList/pendiente/natural'
            },
            {
              title: 'Persona Juridica',
              icon: CircleIcon,
              to: '/externalRegistrationList/pendiente/juridica'
            },
          ]
        },
      ]
    },
]

const authStore = useAuthStore()

const sidebarItem: menu[] = [
  
/*    { header: 'Home' },
    {
        title: 'Modern',
        icon: ApertureIcon,
        chip: 'New',
        chipColor: 'surface',
        chipBgColor: 'secondary',
        to: '/dashboards/modern'
    },
    {
        title: 'eCommerce',
        icon: ShoppingCartIcon,
        to: '/dashboards/ecommerce'
    },
    { header: 'Apps' },
    {
        title: 'Contact',
        icon: BoxIcon,
        to: '/apps/contacts',
        chip: '2',
        chipColor: 'surface',
        chipBgColor: 'secondary'
    },

    {
        title: 'Blog',
        icon: ChartDonut3Icon,
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
 /*   {
        title: 'E-Commerce',
        icon: BasketIcon,
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
        title: 'Chats',
        icon: Message2Icon,
        to: '/apps/chats'
    },
    {
        title: 'User Profile',
        icon: UserCircleIcon,
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
        icon: FilesIcon,
        to: '/apps/notes'
    },
    {
        title: 'Calendar',
        icon: CalendarIcon,
        to: '/apps/calendar'
    },
    {
        title: 'Kanban',
        icon: LayoutKanbanIcon,
        to: '/apps/kanban'
    },

    { header: 'Pages' },
    {
        title: 'Pricing',
        icon: CurrencyDollarIcon,
        to: '/pages/pricing'
    },
    {
        title: 'Account Setting',
        icon: UserCircleIcon,
        to: '/pages/account-settings'
    },
    {
        title: 'FAQ',
        icon: HelpIcon,
        to: '/pages/faq'
    },
    {
        title: 'Widget',
        icon: LayoutIcon,
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
        title: 'Landing Page',
        icon: AppWindowIcon,
        to: '/'
    },*/

  /*  { header: 'Forms' },
    {
        title: 'Form Elements',
        icon: AppsIcon,
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
                title: 'Date Time',
                icon: PointIcon,
                to: '/forms/form-elements/date-time'
            },
            {
                title: 'Select',
                icon: PointIcon,
                to: '/forms/form-elements/select'
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
        icon: FileTextIcon,
        to: '/forms/form-layouts'
    },
    {
        title: 'Form Horizontal',
        icon: BoxAlignBottomIcon,
        to: '/forms/form-horizontal'
    },
    {
        title: 'Form Vertical',
        icon: BoxAlignLeftIcon,
        to: '/forms/form-vertical'
    },
    {
        title: 'Form Custom',
        icon: FileDotsIcon,
        to: '/forms/form-custom'
    },
    {
        title: 'Form Validation',
        icon: FilesIcon,
        to: '/forms/form-validation'
    },
    {
        title: 'Editor',
        icon: EditIcon,
        to: '/forms/editor'
    },

    { header: 'Tables' },
    {
        title: 'Basic Table',
        icon: BorderAllIcon,
        to: '/tables/basic'
    },
    {
        title: 'Dark Table',
        icon: BorderHorizontalIcon,
        to: '/tables/dark'
    },
    {
        title: 'Density Table',
        icon: BorderInnerIcon,
        to: '/tables/density'
    },
    {
        title: 'Fixed Header Table',
        icon: BorderTopIcon,
        to: '/tables/fixed-header'
    },
    {
        title: 'Height Table',
        icon: BorderVerticalIcon,
        to: '/tables/height'
    },
    {
        title: 'Editable Table',
        icon: BorderStyle2Icon,
        to: '/tables/editable'
    },


    { header: 'Data Tables' },
    {
        title: 'Basic Table',
        icon: ColumnsIcon,
        to: '/tables/datatables/basic'
    },
    {
        title: 'Header Table',
        icon: RowInsertBottomIcon,
        to: '/tables/datatables/header'
    },
    {
        title: 'Selection Table',
        icon: EyeTableIcon,
        to: '/tables/datatables/selection'
    },
    {
        title: 'Sorting Table',
        icon: SortAscendingIcon,
        to: '/tables/datatables/sorting'
    },
    {
        title: 'Pagination Table',
        icon: PageBreakIcon,
        to: '/tables/datatables/pagination'
    },
    {
        title: 'Filtering Table',
        icon: FilterIcon,
        to: '/tables/datatables/filtering'
    },
    {
        title: 'Grouping Table',
        icon: BoxModelIcon,
        to: '/tables/datatables/grouping'
    },
    {
        title: 'Table Slots',
        icon: ServerIcon,
        to: '/tables/datatables/slots'
    },
    {
        title: 'CRUD Table',
        icon: JumpRopeIcon,
        to: '/tables/datatables/crudtable'
    },

    { header: 'UI' },
    {
        title: 'UI Components',
        icon: BoxIcon,
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
    { header: 'Charts' },
    {
        title: 'Line',
        icon: ChartLineIcon,
        to: '/charts/line-chart'
    },
    {
        title: 'Gredient',
        icon: ChartArcsIcon,
        to: '/charts/gredient-chart'
    },
    {
        title: 'Area',
        icon: ChartAreaIcon,
        to: '/charts/area-chart'
    },
    {
        title: 'Candlestick',
        icon: ChartCandleIcon,
        to: '/charts/candlestick-chart'
    },
    {
        title: 'Column',
        icon: ChartDotsIcon,
        to: '/charts/column-chart'
    },
    {
        title: 'Doughnut & Pie',
        icon: ChartDonut3Icon,
        to: '/charts/doughnut-pie-chart'
    },
    {
        title: 'Radialbar & Radar',
        icon: ChartRadarIcon,
        to: '/charts/radialbar-chart'
    },

    { header: 'Auth' },

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
    },

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

    { header: 'Others' },
    {
        title: 'Menu Level',
        icon: BoxMultipleIcon,
        to: '#',
        children: [
            {
                title: 'Level 1',
                icon: PointIcon,
                to: '/'
            },
            {
                title: 'Level 1',
                icon: PointIcon,
                to: '/',
                children: [
                    {
                        title: 'Level 2',
                        icon: PointIcon,
                        to: '/'
                    },
                    {
                        title: 'Level 2',
                        icon: PointIcon,
                        to: '/',
                        children: [
                            {
                                title: 'Level 3',
                                icon: PointIcon,
                                to: '/'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: 'Disabled',
        icon: CircleOffIcon,
        disabled: true,
        to: '/'
    },
    {
        title: 'Sub Caption',
        icon: StarIcon,
        subCaption: 'This is the subtitle',
        to: '/'
    },
    {
        title: 'Chip',
        icon: AwardIcon,
        chip: '9',
        chipColor: 'surface',
        chipBgColor: 'primary',
        to: '/'
    },
    {
        title: 'Outlined',
        icon: MoodSmileIcon,
        chip: 'outline',
        chipColor: 'primary',
        chipVariant: 'outlined',
        to: '/'
    },
    {
        title: 'External Link',
        icon: StarIcon,
        to: '/',
        type: 'external'
    }*/
  
];

const getMenu = async () => {
  const response = await authStore.getUserMenu()
  for (let i = 0; i < response.length; i++) {

   if(response[i].header){
      sidebarItem.push(response[i])
    }

    if(response[i].title && response[i].icon && !response[i].children){
      const registro:any = lista_menu.find(
        (menu: any) => menu.title == response[i].title
      )
      sidebarItem.push(registro)
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
      sidebarItem.push(registro)
    }
  }
}
getMenu()

export default sidebarItem;
