import{B}from"./BaseBreadcrumb-jDxwAhJm.js";import{y as C,H as i,a2 as u,E as k,o as x,c as w,b as e,w as o,d as m,F as y,a3 as T}from"./index-C6xIyDbS.js";import{u as M}from"./tipo_man-DZm520DZ.js";import{V as F,a as S}from"./VRow-rFEsfuxq.js";import{V as E}from"./VDataTable-Bx0twp9K.js";import{V as D}from"./VToolbar-Bq0J8p1V.js";import{V as L}from"./VTextField-B1n-2lTf.js";import{V as N}from"./VDivider-BT9IU-N7.js";import{V as $}from"./VSpacer-DBICP6Gn.js";import{V as z}from"./VBtn-D5D2TZLp.js";import{V as f}from"./router-BDKllWdj.js";import"./useRender-DGt6a0IA.js";import"./VCard-BhLrgV9c.js";import"./VAvatar-DQ4qamF1.js";import"./transition-wc7ry4y5.js";import"./resizeObserver-X_GALw7v.js";import"./VSelect-WoFjp-F4.js";import"./VInput-B410WGet.js";import"./index-Cya4CCex.js";import"./forwardRefs-D3j0TLhE.js";import"./VList-cqPY3INU.js";import"./ssrBoot-Cm67umqN.js";import"./dialog-transition-DL42JsIK.js";import"./VMenu-s0wgA0NL.js";import"./VOverlay-CSmFjP6x.js";import"./lazy-BeTNW6Wu.js";import"./scopeId-C2Bi3xh8.js";import"./VCheckboxBtn-5hB5J-9G.js";import"./VSelectionControl-x82hVVyd.js";import"./VLabel-B-wY8ORj.js";import"./VChip-BotuoLGf.js";import"./VSlideGroup-C4CVuqlZ.js";import"./group-C9gy4-6n.js";import"./VTable-DSKKUCT_.js";import"./filter-D0blEJ2G.js";import"./VField-QSBgCIU0.js";import"./VProgressCircular-Bkdnhxpj.js";const Be=C({__name:"tipo_manList",setup(I){const l=M(),V=i({title:"Mantenimientos"}),b=i([{text:"Dashboard",disabled:!1,href:"#"},{text:"Listado de mantenimientos",disabled:!0,href:"#"}]),d=i([]),c=async()=>{d.value=await l.Mantems()},p=a=>{T.push({name:"tipo_manForm",params:{id_man:a}})},v=i([{title:"Acciones",key:"actions",sortable:!1},{title:"Tipo de mantenimiento",key:"nombre_diagnostico"}]);function _(a){u.fire({title:"¿Estas seguro?",text:"¡El proceso no podra ser revertido!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Si, ¡eliminar!"}).then(async r=>{if(r.isConfirmed){const{ok:t,message:n}=await l.deleteMan({id:a}),h=t?"success":"error";t&&await c(),g.fire({icon:h,title:n})}})}const s=i(),g=u.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0});return k(()=>{c()}),(a,r)=>(x(),w(y,null,[e(B,{title:V.value.title,breadcrumbs:b.value},null,8,["title","breadcrumbs"]),e(S,null,{default:o(()=>[e(F,{cols:"12"},{default:o(()=>[e(E,{class:"border rounded-md",headers:v.value,items:d.value,"sort-by":[{key:"nombre_diagnostico",order:"asc"}],search:s.value},{top:o(()=>[e(D,{class:"bg-lightprimary",flat:""},{default:o(()=>[e(L,{class:"ml-4",modelValue:s.value,"onUpdate:modelValue":r[0]||(r[0]=t=>s.value=t),modelModifiers:{trim:!0},"append-inner-icon":"mdi-magnify",label:"Busqueda","hide-details":""},null,8,["modelValue"]),e(N,{class:"mx-4",inset:"",vertical:""}),e($),e(z,{color:"primary",variant:"flat",dark:"",onClick:r[1]||(r[1]=t=>p(0))},{default:o(()=>[m("Nuevo tipo de mantenimiento")]),_:1})]),_:1})]),"item.actions":o(({item:t})=>[e(f,{color:"info",size:"large",class:"me-2",onClick:n=>p(t.id)},{default:o(()=>[m(" mdi-pencil ")]),_:2},1032,["onClick"]),e(f,{color:"error",size:"large",onClick:n=>_(t.id)},{default:o(()=>[m(" mdi-delete ")]),_:2},1032,["onClick"])]),_:1},8,["headers","items","search"])]),_:1})]),_:1})],64))}});export{Be as default};