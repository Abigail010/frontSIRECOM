import{B as _}from"./BaseBreadcrumb-4MIjbQwQ.js";import{y as g,H as i,a2 as u,E as k,o as x,c as w,b as e,w as t,d as l,F as y,a3 as S}from"./index-CUBqpQjk.js";import{u as T}from"./servicios-BCfQ5iHD.js";import{V as F,a as E}from"./VRow-De8gMS49.js";import{V as D}from"./VDataTable-Clv1HmiC.js";import{V as L}from"./VToolbar-Cf21mDDn.js";import{V as N}from"./VTextField-DvwW7kBo.js";import{V as $}from"./VDivider-BKsbfY-L.js";import{V as z}from"./VSpacer-D0J7wQQ_.js";import{V as I}from"./VBtn-Bwlw_S26.js";import{V as f}from"./router-DjP1fb63.js";import"./useRender-DUD5GNME.js";import"./VCard-B5JACPL-.js";import"./VAvatar-DCozc2c4.js";import"./transition-7eeLtsO5.js";import"./resizeObserver-Dy93hC7S.js";import"./VSelect-Y5UkN40p.js";import"./VInput-a6OhgCb3.js";import"./index-CBT7dlbo.js";import"./forwardRefs-D3j0TLhE.js";import"./VList-ClDiqBX_.js";import"./ssrBoot-TGepEb6s.js";import"./dialog-transition-BmxFGc2r.js";import"./VMenu-Cw996tyh.js";import"./VOverlay-ZufbB-oQ.js";import"./lazy-BqTskM4N.js";import"./scopeId-BvaqpV40.js";import"./VCheckboxBtn-Ct_gEblA.js";import"./VSelectionControl-Dee3CKWd.js";import"./VLabel-cMv036s0.js";import"./VChip-B4X-ZzT8.js";import"./VSlideGroup-Bt6gprAW.js";import"./group-C0-37VYq.js";import"./VTable-fMMFAG9t.js";import"./filter-CojnhgC1.js";import"./VField-CAUvKyXj.js";import"./VProgressCircular-D0IBnh0x.js";const _e=g({__name:"serviciosList",setup(M){const n=T(),v=i({title:"Servicios para talleres externos"}),V=i([{text:"Dashboard",disabled:!1,href:"#"},{text:"Listado de servicios",disabled:!0,href:"#"}]),c=i([]),d=async()=>{c.value=await n.servicios()},p=s=>{S.push({name:"serviciosForm",params:{id_servicio:s}})},b=i([{title:"Acciones",key:"actions",sortable:!1},{title:"Servicios",key:"nombre_servicio"}]);function h(s){u.fire({title:"¿Estas seguro?",text:"¡El proceso no podra ser revertido!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Si, ¡eliminar!"}).then(async r=>{if(r.isConfirmed){const{ok:o,message:m}=await n.deleteService({id:s}),C=o?"success":"error";o&&await d(),B.fire({icon:C,title:m})}})}const a=i(),B=u.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0});return k(()=>{d()}),(s,r)=>(x(),w(y,null,[e(_,{title:v.value.title,breadcrumbs:V.value},null,8,["title","breadcrumbs"]),e(E,null,{default:t(()=>[e(F,{cols:"12"},{default:t(()=>[e(D,{class:"border rounded-md",headers:b.value,items:c.value,"sort-by":[{key:"nombre_servicio",order:"asc"}],search:a.value},{top:t(()=>[e(L,{class:"bg-lightprimary",flat:""},{default:t(()=>[e(N,{class:"ml-4",modelValue:a.value,"onUpdate:modelValue":r[0]||(r[0]=o=>a.value=o),modelModifiers:{trim:!0},"append-inner-icon":"mdi-magnify",label:"Busqueda","hide-details":""},null,8,["modelValue"]),e($,{class:"mx-4",inset:"",vertical:""}),e(z),e(I,{color:"primary",variant:"flat",dark:"",onClick:r[1]||(r[1]=o=>p(0))},{default:t(()=>[l("Nuevo Servicio")]),_:1})]),_:1})]),"item.actions":t(({item:o})=>[e(f,{color:"info",size:"large",class:"me-2",onClick:m=>p(o.id)},{default:t(()=>[l(" mdi-pencil ")]),_:2},1032,["onClick"]),e(f,{color:"error",size:"large",onClick:m=>h(o.id)},{default:t(()=>[l(" mdi-delete ")]),_:2},1032,["onClick"])]),_:1},8,["headers","items","search"])]),_:1})]),_:1})],64))}});export{_e as default};