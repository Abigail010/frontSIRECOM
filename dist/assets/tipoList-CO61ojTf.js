import{B as C}from"./BaseBreadcrumb-4MIjbQwQ.js";import{y as T,H as i,a2 as u,E as g,o as k,c as x,b as o,w as t,d as m,F as w,a3 as y}from"./index-CUBqpQjk.js";import{u as M}from"./tipo-BK2Or2xZ.js";import{V as F,a as E}from"./VRow-De8gMS49.js";import{V as S}from"./VDataTable-Clv1HmiC.js";import{V as D}from"./VToolbar-Cf21mDDn.js";import{V as N}from"./VTextField-DvwW7kBo.js";import{V as $}from"./VDivider-BKsbfY-L.js";import{V as z}from"./VSpacer-D0J7wQQ_.js";import{V as I}from"./VBtn-Bwlw_S26.js";import{V as f}from"./router-DjP1fb63.js";import"./useRender-DUD5GNME.js";import"./VCard-B5JACPL-.js";import"./VAvatar-DCozc2c4.js";import"./transition-7eeLtsO5.js";import"./resizeObserver-Dy93hC7S.js";import"./VSelect-Y5UkN40p.js";import"./VInput-a6OhgCb3.js";import"./index-CBT7dlbo.js";import"./forwardRefs-D3j0TLhE.js";import"./VList-ClDiqBX_.js";import"./ssrBoot-TGepEb6s.js";import"./dialog-transition-BmxFGc2r.js";import"./VMenu-Cw996tyh.js";import"./VOverlay-ZufbB-oQ.js";import"./lazy-BqTskM4N.js";import"./scopeId-BvaqpV40.js";import"./VCheckboxBtn-Ct_gEblA.js";import"./VSelectionControl-Dee3CKWd.js";import"./VLabel-cMv036s0.js";import"./VChip-B4X-ZzT8.js";import"./VSlideGroup-Bt6gprAW.js";import"./group-C0-37VYq.js";import"./VTable-fMMFAG9t.js";import"./filter-CojnhgC1.js";import"./VField-CAUvKyXj.js";import"./VProgressCircular-D0IBnh0x.js";const To=T({__name:"tipoList",setup(L){const n=M(),V=i({title:"Modelo"}),b=i([{text:"Dashboard",disabled:!1,href:"#"},{text:"Modelos de vehículo ",disabled:!0,href:"#"}]),p=i([]),d=async()=>{p.value=await n.Tipo()},c=a=>{y.push({name:"TipoForm",params:{id_tipo:a}})},v=i([{title:"Acciones",key:"actions",sortable:!1},{title:"Modelo",key:"nombre_tipo"}]);function _(a){u.fire({title:"Estas seguro?",text:"¡El proceso no podra ser revertido!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"¡Si, eliminar!"}).then(async r=>{if(r.isConfirmed){const{ok:e,message:l}=await n.deleteTipos({id:a}),B=e?"success":"error";e&&await d(),h.fire({icon:B,title:l})}})}const s=i(),h=u.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0});return g(()=>{d()}),(a,r)=>(k(),x(w,null,[o(C,{title:V.value.title,breadcrumbs:b.value},null,8,["title","breadcrumbs"]),o(E,null,{default:t(()=>[o(F,{cols:"12"},{default:t(()=>[o(S,{class:"border rounded-md",headers:v.value,items:p.value,"sort-by":[{key:"nombre_Tipo",order:"asc"}],search:s.value},{top:t(()=>[o(D,{class:"bg-lightprimary",flat:""},{default:t(()=>[o(N,{class:"ml-4",modelValue:s.value,"onUpdate:modelValue":r[0]||(r[0]=e=>s.value=e),modelModifiers:{trim:!0},"append-inner-icon":"mdi-magnify",label:"Busqueda","hide-details":""},null,8,["modelValue"]),o($,{class:"mx-4",inset:"",vertical:""}),o(z),o(I,{color:"primary",variant:"flat",dark:"",onClick:r[1]||(r[1]=e=>c(0))},{default:t(()=>[m("Nuevo Modelo")]),_:1})]),_:1})]),"item.actions":t(({item:e})=>[o(f,{color:"info",size:"large",class:"me-2",onClick:l=>c(e.id_tipo)},{default:t(()=>[m(" mdi-pencil ")]),_:2},1032,["onClick"]),o(f,{color:"error",size:"large",onClick:l=>_(e.id_tipo)},{default:t(()=>[m(" mdi-delete ")]),_:2},1032,["onClick"])]),_:1},8,["headers","items","search"])]),_:1})]),_:1})],64))}});export{To as default};