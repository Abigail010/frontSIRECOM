import{y as B,a4 as C,H as i,D as M,E,o as f,c as _,b as e,w as a,d as n,z as N,s as T,a as s,V as k,F,a3 as I,a2 as L}from"./index-I5uRkXFU.js";import{B as R}from"./BaseBreadcrumb-CGsPg8x-.js";import{u as S}from"./tipo_man-BGllRDWd.js";import{v as O}from"./validateText-UQqnbmko.js";import{V as b,a as g}from"./VRow-C2-TvTum.js";import{V as $}from"./VLabel-Ag2grjr3.js";import{V as A}from"./VTextField-D1VQ5-ak.js";import{V as v}from"./VBtn-DyMptNjQ.js";import"./useRender-CofbKJNJ.js";import"./router-CIZ1aivY.js";import"./VCard-CFoLrGNY.js";import"./VAvatar-BgiBz-Io.js";import"./transition-CJctgnM6.js";import"./VField-CcxtAORc.js";import"./index-DVfikfhV.js";import"./VInput-C5uB995F.js";import"./forwardRefs-D3j0TLhE.js";import"./group-DMpYtfwH.js";import"./VProgressCircular-DLvzaeE_.js";import"./resizeObserver-BA5joKW-.js";const P=s("h4",{class:"mb-5 mt-2 font-weight-light"},[s("strong",null," DATOS DEL TIPO DE MANTENIMIENTO:"),n(" Los campos con "),s("span",{style:{color:"red"}},"(*)"),n(" son obligatorios ")],-1),U=s("span",{style:{color:"red"}},"(*)",-1),q={key:0,class:"v-messages font-weight-black px-2 py-2"},z=s("div",{class:"v-messages__message text-error"}," El campo es requerido ",-1),H=[z],j={class:"mt-2 text-lg-left"},pt=B({__name:"tipo_manForm",setup(G){const l=C(),d=S(),D=i({title:"Tipo de mantenimiento"}),V=i([{text:"Dashboard",disabled:!1,href:"#"},{text:"Registro",disabled:!0,href:"#"}]),o=M({formData:{id:"",nombre_diagnostico:"",estado:""}}),w=i(!1),h=async m=>{const t=await d.MantemID(m);o.formData.id=t.id,o.formData.nombre_diagnostico=t.nombre_diagnostico},c=i(!0),p=async()=>{c.value=!0,o.formData.nombre_diagnostico||(c.value=!1)},x=()=>{I.push({name:"tipo_manList"})},u=i(!1),y=async()=>{if(u.value=!0,await p(),!c.value)return;const{ok:m,message:t}=l.params.id_man=="0"?await d.createMan(o.formData):await d.updateMan(o.formData),r=m?"success":"error";L.fire({icon:r,title:t,timer:1500,showConfirmButton:!1,timerProgressBar:!0})};return E(()=>{l.params.id_man!="0"&&(h(l.params.id_man),w.value=!0)}),(m,t)=>(f(),_(F,null,[e(R,{title:D.value.title,breadcrumbs:V.value},null,8,["title","breadcrumbs"]),e(g,null,{default:a(()=>[e(b,{cols:"12",lg:"12"},{default:a(()=>[P,e(g,null,{default:a(()=>[e(b,{cols:"12",md:"12"},{default:a(()=>[e($,{class:"mb-2 font-weight-medium"},{default:a(()=>[n("Nombre mantenimiento"),U]),_:1}),e(A,{variant:"outlined",color:"primary",type:"text",modelValue:o.formData.nombre_diagnostico,"onUpdate:modelValue":t[0]||(t[0]=r=>o.formData.nombre_diagnostico=r),modelModifiers:{trim:!0},onInput:t[1]||(t[1]=r=>(p(),o.formData.nombre_diagnostico=N(O)(o.formData.nombre_diagnostico.toUpperCase()))),error:u.value&&!o.formData.nombre_diagnostico,"hide-details":""},null,8,["modelValue","error"]),u.value&&!o.formData.nombre_diagnostico?(f(),_("div",q,H)):T("",!0)]),_:1})]),_:1}),s("p",j,[e(v,{color:"error",class:"mr-3",onClick:t[2]||(t[2]=r=>x())},{default:a(()=>[n("Cancelar")]),_:1}),e(v,{color:"primary",onClick:t[3]||(t[3]=k(r=>y(),["prevent"]))},{default:a(()=>[n("Enviar")]),_:1})])]),_:1})]),_:1})],64))}});export{pt as default};