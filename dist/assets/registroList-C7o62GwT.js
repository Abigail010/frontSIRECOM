import{B as w}from"./BaseBreadcrumb-Bbeybyc2.js";import{y as T,H as s,a2 as b,E as N,o as m,c as D,b as t,w as r,n as F,z as i,d,k,s as v,a as z,t as E,q as I,F as L,a3 as O}from"./index-BBW0LDRo.js";import{u as $}from"./register_rep-C2DNaxqM.js";import{V as q,a as J}from"./VRow-DX5Sb4gw.js";import{V as M}from"./VDataTable-DtwV1n7G.js";import{V as y}from"./router-gT8wHC9G.js";import{V as A}from"./VToolbar-D7EgbTjP.js";import{V as H}from"./VTextField-B9dtyK9C.js";import{V as P}from"./VDivider-BqBvKInr.js";import{V as U}from"./VSpacer-C4YehYqH.js";import{V as j}from"./VBtn-CA5HvOgX.js";import"./useRender-BoJwxXaB.js";import"./VCard-CyUESBTG.js";import"./VAvatar-CvPN9Auc.js";import"./transition-Dvz_RGnv.js";import"./resizeObserver-rtAPYIjh.js";import"./VSelect-C-doLMjY.js";import"./VInput-Dv5K4Qb2.js";import"./index-Cc8afOxw.js";import"./forwardRefs-D3j0TLhE.js";import"./VList-CoRMvSCW.js";import"./ssrBoot-CyiQOt3t.js";import"./dialog-transition-Dp73Dg04.js";import"./VMenu-ICMzGcM6.js";import"./VOverlay-CV23jINX.js";import"./lazy-RzZV4TKb.js";import"./scopeId-gozin-t_.js";import"./VCheckboxBtn-Vmcd_CXn.js";import"./VSelectionControl-BwI9Q-JQ.js";import"./VLabel-qvqZ8AnP.js";import"./VChip-HOQ3ysh5.js";import"./VSlideGroup-Bp84vIQo.js";import"./group-BrIAM_rf.js";import"./VTable-BAA6tTWP.js";import"./filter-BW4ShBJr.js";import"./VField-Cwcoyu1E.js";import"./VProgressCircular-B-equZyi.js";const De=T({__name:"registroList",setup(G){const c=JSON.parse(localStorage.getItem("user")||"").id_perfil,p=JSON.parse(localStorage.getItem("user")||"").id_taller,u=$(),C=s({title:"Registro de repuestos"}),B=s([{text:"Dashboard",disabled:!1,href:"#"},{text:"Listado de Registros",disabled:!0,href:"#"}]),f=s([]),g=async()=>{f.value=await u.getRegisterRs()},V=o=>{O.push({name:"registerForm",params:{id:o}})},R=o=>o<=0?"tipo-ex":"tipo-ex2",_=s([{title:"Acciones",key:"actions",sortable:!1},{title:"N° de partida",key:"nro_partida"},{title:"Cantidad de repuestos",key:"cantidad"},{title:"Total",key:"total"},{title:"Observación",key:"observacion"}]);function h(o){b.fire({title:"¿Estas seguro?",text:"¡El proceso no podra ser revertido!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Si, ¡eliminar!"}).then(async a=>{if(a.isConfirmed){const{ok:e,message:n}=await u.deleteRegisterR({id:o}),S=e?"success":"error";e&&await g(),x.fire({icon:S,title:n})}})}const l=s(),x=b.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0});return N(()=>{g()}),(o,a)=>(m(),D(L,null,[t(w,{title:C.value.title,breadcrumbs:B.value},null,8,["title","breadcrumbs"]),t(J,null,{default:r(()=>[t(q,{cols:"12"},{default:r(()=>[t(M,{class:"border rounded-md",headers:_.value,items:f.value,"sort-by":[{key:"nombre_delito",order:"asc"}],search:l.value},F({"item.cantidad":r(({item:e})=>[z("span",{class:I(R(e.cantidad))},E(e.cantidad),3)]),top:r(()=>[t(A,{class:"bg-lightprimary",flat:""},{default:r(()=>[t(H,{class:"ml-4",modelValue:l.value,"onUpdate:modelValue":a[0]||(a[0]=e=>l.value=e),modelModifiers:{trim:!0},"append-inner-icon":"mdi-magnify",label:"Busqueda","hide-details":""},null,8,["modelValue"]),t(P,{class:"mx-4",inset:"",vertical:""}),t(U),i(c)==1||i(p)==1?(m(),k(j,{key:0,color:"primary",variant:"flat",dark:"",onClick:a[1]||(a[1]=e=>V(0))},{default:r(()=>[d("Registro de Repuestos")]),_:1})):v("",!0)]),_:1})]),_:2},[i(c)==1||i(p)==1?{name:"item.actions",fn:r(({item:e})=>[t(y,{color:"info",size:"large",class:"me-2",onClick:n=>V(e.id)},{default:r(()=>[d(" mdi-pencil ")]),_:2},1032,["onClick"]),e.entregado==0?(m(),k(y,{key:0,color:"error",size:"large",onClick:n=>h(e.id)},{default:r(()=>[d(" mdi-delete ")]),_:2},1032,["onClick"])):v("",!0)]),key:"0"}:void 0]),1032,["headers","items","search"])]),_:1})]),_:1})],64))}});export{De as default};