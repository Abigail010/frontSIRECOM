import{y as B,a4 as C,H as m,D as R,E as k,o as f,c as _,b as o,w as r,d as i,z as E,s as F,a,V as S,F as L,a3 as N,a2 as T}from"./index-C6xIyDbS.js";import{B as M}from"./BaseBreadcrumb-jDxwAhJm.js";import{u as U}from"./repuesto-BhTnu2o_.js";import{v as $}from"./validateText-UQqnbmko.js";import{V as b,a as v}from"./VRow-rFEsfuxq.js";import{V as I}from"./VLabel-B-wY8ORj.js";import{V as O}from"./VTextField-B1n-2lTf.js";import{V}from"./VBtn-D5D2TZLp.js";import"./useRender-DGt6a0IA.js";import"./router-BDKllWdj.js";import"./VCard-BhLrgV9c.js";import"./VAvatar-DQ4qamF1.js";import"./transition-wc7ry4y5.js";import"./VField-QSBgCIU0.js";import"./index-Cya4CCex.js";import"./VInput-B410WGet.js";import"./forwardRefs-D3j0TLhE.js";import"./group-C9gy4-6n.js";import"./VProgressCircular-Bkdnhxpj.js";import"./resizeObserver-X_GALw7v.js";const P=a("h4",{class:"mb-5 mt-2 font-weight-light"},[a("strong",null," DATOS DEL REPUESTO:"),i(" Los campos con "),a("span",{style:{color:"red"}},"(*)"),i(" son obligatorios ")],-1),q=a("span",{style:{color:"red"}},"(*)",-1),z={key:0,class:"v-messages font-weight-black px-2 py-2"},A=a("div",{class:"v-messages__message text-error"}," El campo es requerido ",-1),H=[A],j={class:"mt-2 text-lg-left"},ce=B({__name:"formulario",setup(G){const l=C(),u=U(),g=m({title:"Registro del repuesto"}),D=m([{text:"Dashboard",disabled:!1,href:"#"},{text:"Filtro",disabled:!0,href:"#"}]),t=R({formData:{id_filtro:"",id:"",id_tipo_repuesto:"",nombre_clase:"",nombre_tipo:"",nombre_marca:"",nombre_tm:"",nombre_sistema:"",id_sistema:"",union:"",estado:"",nombre_repuesto:""}}),w=m(!1),y=async n=>{const e=await u.Repuesto(n);t.formData.id=e.id,t.formData.nombre_repuesto=e.nombre_repuesto},p=m(!0),c=async()=>{p.value=!0,t.formData.nombre_repuesto||(p.value=!1)},h=()=>{N.push({name:"repuestoList"})},d=m(!1),x=async()=>{if(d.value=!0,await c(),!p.value)return;const{ok:n,message:e}=l.params.id=="0"?await u.createRepuesto(t.formData):await u.updateRepuesto(t.formData),s=n?"success":"error";T.fire({icon:s,title:e,timer:1500,showConfirmButton:!1,timerProgressBar:!0})};return k(()=>{l.params.id!="0"&&(y(l.params.id),w.value=!0)}),(n,e)=>(f(),_(L,null,[o(M,{title:g.value.title,breadcrumbs:D.value},null,8,["title","breadcrumbs"]),o(v,null,{default:r(()=>[o(b,{cols:"12",lg:"12"},{default:r(()=>[P,o(v,null,{default:r(()=>[o(b,{cols:"12",md:"12"},{default:r(()=>[o(I,{class:"mb-2 font-weight-medium"},{default:r(()=>[i("Nombre "),q]),_:1}),o(O,{variant:"outlined",color:"primary",type:"text",modelValue:t.formData.nombre_repuesto,"onUpdate:modelValue":e[0]||(e[0]=s=>t.formData.nombre_repuesto=s),modelModifiers:{trim:!0},onInput:e[1]||(e[1]=s=>(c(),t.formData.nombre_repuesto=E($)(t.formData.nombre_repuesto.toUpperCase()))),error:d.value&&!t.formData.nombre_repuesto,"hide-details":""},null,8,["modelValue","error"]),d.value&&!t.formData.nombre_repuesto?(f(),_("div",z,H)):F("",!0)]),_:1})]),_:1}),a("p",j,[o(V,{color:"error",class:"mr-3",onClick:e[2]||(e[2]=s=>h())},{default:r(()=>[i("Cancelar")]),_:1}),o(V,{color:"primary",onClick:e[3]||(e[3]=S(s=>x(),["prevent"]))},{default:r(()=>[i("Enviar")]),_:1})])]),_:1})]),_:1})],64))}});export{ce as default};