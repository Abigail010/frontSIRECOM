import{B as _}from"./BaseBreadcrumb-jDxwAhJm.js";import{y as g,H as i,a2 as u,E as k,o as x,c as w,b as o,w as t,d as c,F as y,a3 as A}from"./index-C6xIyDbS.js";import{u as T}from"./accesorio-Dsovqa2v.js";import{V as F,a as S}from"./VRow-rFEsfuxq.js";import{V as E}from"./VDataTable-Bx0twp9K.js";import{V as D}from"./VToolbar-Bq0J8p1V.js";import{V as L}from"./VTextField-B1n-2lTf.js";import{V as N}from"./VDivider-BT9IU-N7.js";import{V as $}from"./VSpacer-DBICP6Gn.js";import{V as z}from"./VBtn-D5D2TZLp.js";import{V as f}from"./router-BDKllWdj.js";import"./useRender-DGt6a0IA.js";import"./VCard-BhLrgV9c.js";import"./VAvatar-DQ4qamF1.js";import"./transition-wc7ry4y5.js";import"./resizeObserver-X_GALw7v.js";import"./VSelect-WoFjp-F4.js";import"./VInput-B410WGet.js";import"./index-Cya4CCex.js";import"./forwardRefs-D3j0TLhE.js";import"./VList-cqPY3INU.js";import"./ssrBoot-Cm67umqN.js";import"./dialog-transition-DL42JsIK.js";import"./VMenu-s0wgA0NL.js";import"./VOverlay-CSmFjP6x.js";import"./lazy-BeTNW6Wu.js";import"./scopeId-C2Bi3xh8.js";import"./VCheckboxBtn-5hB5J-9G.js";import"./VSelectionControl-x82hVVyd.js";import"./VLabel-B-wY8ORj.js";import"./VChip-BotuoLGf.js";import"./VSlideGroup-C4CVuqlZ.js";import"./group-C9gy4-6n.js";import"./VTable-DSKKUCT_.js";import"./filter-D0blEJ2G.js";import"./VField-QSBgCIU0.js";import"./VProgressCircular-Bkdnhxpj.js";const go=g({__name:"accesoriosList",setup(I){const l=T(),V=i({title:"Accesorios"}),b=i([{text:"Dashboard",disabled:!1,href:"#"},{text:"Listado de Accesorios",disabled:!0,href:"#"}]),n=i([]),d=async()=>{n.value=await l.accesorios()},p=s=>{A.push({name:"accesorioForm",params:{id_accesorio:s}})},v=i([{title:"Acciones",key:"actions",sortable:!1},{title:"Accesorioss",key:"nombre_accesorio"}]);function h(s){u.fire({title:"¿Estas seguro?",text:"¡El proceso no podra ser revertido!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"¡Si, eliminar!"}).then(async r=>{if(r.isConfirmed){const{ok:e,message:m}=await l.deleteaccesorio({id:s}),C=e?"success":"error";e&&await d(),B.fire({icon:C,title:m})}})}const a=i(),B=u.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0});return k(()=>{d()}),(s,r)=>(x(),w(y,null,[o(_,{title:V.value.title,breadcrumbs:b.value},null,8,["title","breadcrumbs"]),o(S,null,{default:t(()=>[o(F,{cols:"12"},{default:t(()=>[o(E,{class:"border rounded-md",headers:v.value,items:n.value,"sort-by":[{key:"nombre_accesorio",order:"asc"}],search:a.value},{top:t(()=>[o(D,{class:"bg-lightprimary",flat:""},{default:t(()=>[o(L,{class:"ml-4",modelValue:a.value,"onUpdate:modelValue":r[0]||(r[0]=e=>a.value=e),modelModifiers:{trim:!0},"append-inner-icon":"mdi-magnify",label:"Busqueda","hide-details":""},null,8,["modelValue"]),o(N,{class:"mx-4",inset:"",vertical:""}),o($),o(z,{color:"primary",variant:"flat",dark:"",onClick:r[1]||(r[1]=e=>p(0))},{default:t(()=>[c("Nuevo Accesorio")]),_:1})]),_:1})]),"item.actions":t(({item:e})=>[o(f,{color:"info",size:"large",class:"me-2",onClick:m=>p(e.id)},{default:t(()=>[c(" mdi-pencil ")]),_:2},1032,["onClick"]),o(f,{color:"error",size:"large",onClick:m=>h(e.id)},{default:t(()=>[c(" mdi-delete ")]),_:2},1032,["onClick"])]),_:1},8,["headers","items","search"])]),_:1})]),_:1})],64))}});export{go as default};