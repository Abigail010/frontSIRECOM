import{B}from"./BaseBreadcrumb-BUjUSeql.js";import{y as g,H as a,a2 as u,E as k,o as x,c as w,b as e,w as o,d as m,F as y,a3 as T}from"./index-Buq65buf.js";import{u as F}from"./clase-bB7ie---.js";import{V as E,a as S}from"./VRow-Ctz1qQoW.js";import{V as D}from"./VDataTable-BpeV3fdk.js";import{V as N}from"./VToolbar-BClaxrMD.js";import{V as $}from"./VTextField-Ck2WlqEn.js";import{V as z}from"./VDivider-CrauPodZ.js";import{V as I}from"./VSpacer-CCZWhvvW.js";import{V as L}from"./VBtn-78ZGxu3p.js";import{V as f}from"./router-BUAsRsjo.js";import"./useRender-BxYPdWix.js";import"./VCard-DYx3ZWBV.js";import"./VAvatar-DnqmwHRx.js";import"./transition-B72dfbUm.js";import"./resizeObserver-BmQKPLvZ.js";import"./VSelect-AWVCrat9.js";import"./VInput-DW8trHrA.js";import"./index-BR_FMKrs.js";import"./forwardRefs-D3j0TLhE.js";import"./VList-DWEkCzxE.js";import"./ssrBoot-J2Isbuk5.js";import"./dialog-transition-9GmGLlaY.js";import"./VMenu-Vw07ipyt.js";import"./VOverlay-BKbQgHv6.js";import"./lazy-B33KSTCg.js";import"./scopeId-3T0RsHAR.js";import"./VCheckboxBtn-TAC0gRQb.js";import"./VSelectionControl-BcfiU6xa.js";import"./VLabel-Q0nQNgOl.js";import"./VChip-vQfLyUmr.js";import"./VSlideGroup-BbB4uZJz.js";import"./group-Db2nUOtn.js";import"./VTable-CpX0WyJs.js";import"./filter-Can5VoxW.js";import"./VField-FB0ObzHG.js";import"./VProgressCircular-5aNpqKQU.js";const Be=g({__name:"clasesList",setup(M){const n=F(),V=a({title:"Tipo"}),b=a([{text:"Dashboard",disabled:!1,href:"#"},{text:"Tipo de vehículo",disabled:!0,href:"#"}]),c=a([]),p=async()=>{c.value=await n.Clase()},d=s=>{T.push({name:"ClaseForm",params:{id_clase:s}})},C=a([{title:"Acciones",key:"actions",sortable:!1},{title:"Tipo",key:"nombre_clase"}]);function v(s){u.fire({title:"¿Estas seguro?",text:"¡El proceso no podra ser revertido!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"¡Si, eliminar!"}).then(async r=>{if(r.isConfirmed){const{ok:t,message:l}=await n.deleteClases({id:s}),h=t?"success":"error";t&&await p(),_.fire({icon:h,title:l})}})}const i=a(),_=u.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0});return k(()=>{p()}),(s,r)=>(x(),w(y,null,[e(B,{title:V.value.title,breadcrumbs:b.value},null,8,["title","breadcrumbs"]),e(S,null,{default:o(()=>[e(E,{cols:"12"},{default:o(()=>[e(D,{class:"border rounded-md",headers:C.value,items:c.value,"sort-by":[{key:"nombre_Clase",order:"asc"}],search:i.value},{top:o(()=>[e(N,{class:"bg-lightprimary",flat:""},{default:o(()=>[e($,{class:"ml-4",modelValue:i.value,"onUpdate:modelValue":r[0]||(r[0]=t=>i.value=t),modelModifiers:{trim:!0},"append-inner-icon":"mdi-magnify",label:"Busqueda","hide-details":""},null,8,["modelValue"]),e(z,{class:"mx-4",inset:"",vertical:""}),e(I),e(L,{color:"primary",variant:"flat",dark:"",onClick:r[1]||(r[1]=t=>d(0))},{default:o(()=>[m("Nuevo tipo")]),_:1})]),_:1})]),"item.actions":o(({item:t})=>[e(f,{color:"info",size:"large",class:"me-2",onClick:l=>d(t.id_clase)},{default:o(()=>[m(" mdi-pencil ")]),_:2},1032,["onClick"]),e(f,{color:"error",size:"large",onClick:l=>v(t.id_clase)},{default:o(()=>[m(" mdi-delete ")]),_:2},1032,["onClick"])]),_:1},8,["headers","items","search"])]),_:1})]),_:1})],64))}});export{Be as default};