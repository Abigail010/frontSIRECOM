import{_ as I}from"./logo-BqxLN55x.js";import{y as C,D as B,H as c,u as S,a2 as w,o as p,c as f,b as a,w as i,a as s,z as h,s as b,d as N,P as E,Q as T}from"./index-BBW0LDRo.js";import{v as y}from"./validateText-UQqnbmko.js";import"./Logo-IgaxSl1x.js";import{V as _,a as P}from"./VRow-DX5Sb4gw.js";import{V}from"./VLabel-qvqZ8AnP.js";import{V as D}from"./VTextField-B9dtyK9C.js";import{V as $}from"./VBtn-CA5HvOgX.js";import{_ as j}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./min-Crf1ymV1.js";import"./customizer-BhFiuKIM.js";import"./useRender-BoJwxXaB.js";import"./router-gT8wHC9G.js";import"./VField-Cwcoyu1E.js";import"./index-Cc8afOxw.js";import"./transition-Dvz_RGnv.js";import"./VInput-Dv5K4Qb2.js";import"./forwardRefs-D3j0TLhE.js";import"./group-BrIAM_rf.js";import"./VProgressCircular-B-equZyi.js";import"./resizeObserver-rtAPYIjh.js";const r=n=>(E("data-v-4cdb6385"),n=n(),T(),n),z={class:"pa-3 prueba_unica"},F=r(()=>s("div",null,null,-1)),U={class:"mt-xl-0 mt-5 mw-100"},q=r(()=>s("div",{class:"text-center mb-3"},[s("img",{class:"imagen",src:I})],-1)),L=r(()=>s("h2",{class:"text-center mb-2",style:{color:"black","font-size":"2.5rem","font-weight":"bold"}}," INICIO DE SESIÓN ",-1)),M=r(()=>s("div",{class:"d-flex align-center text-center mb-6"},[s("div",{class:"text-h6 w-100 px-5 font-weight-regular auth-divider position-relative"},[s("span",{class:"bg-surface px-5 py-3 position-relative"})])],-1)),A=r(()=>s("b",null,"Nombre de Usuario",-1)),H={key:0,class:"v-messages font-weight-black px-2 py-2"},O=r(()=>s("div",{class:"v-messages__message text-error"}," El campo es requerido ",-1)),Q=[O],R=r(()=>s("b",null,"Contraseña",-1)),G={key:1,class:"v-messages font-weight-black px-2 py-2"},J=r(()=>s("div",{class:"v-messages__message text-error"}," El campo es requerido ",-1)),K=[J],W=r(()=>s("div",null,null,-1)),X=C({__name:"login",setup(n){const e=B({formData:{username:"",password:""}});document.addEventListener("keydown",function(d){d.keyCode===13&&g()});const m=c(!1),u=c(!0),v=async()=>{u.value=!0,(!e.formData.username||!e.formData.password)&&(u.value=!1)},l=c(!1),g=async()=>{if(l.value=!0,await v(),!u.value)return;const d=S(),{ok:t,message:o}=await d.login(e.formData.username,e.formData.password),x=t?"success":"error";t?w.fire({icon:x,title:o,timer:1500,showConfirmButton:!1,timerProgressBar:!0}):k.fire({icon:x,title:o})},k=w.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0});return(d,t)=>(p(),f("div",z,[a(P,{class:"h-100vh mh-100 auth"},{default:i(()=>[a(_,{cols:"12",lg:"4",xl:"4",class:"d-lg-flex align-center justify-center position-relative"},{default:i(()=>[F]),_:1}),a(_,{cols:"12",lg:"3",xl:"4",class:"d-flex align-center justify-center login_"},{default:i(()=>[s("div",U,[q,L,M,a(V,{class:"text-subtitle-1 font-weight-semibold pb-2 text-lightText"},{default:i(()=>[A]),_:1}),a(D,{modelValue:e.formData.username,"onUpdate:modelValue":t[0]||(t[0]=o=>e.formData.username=o),modelModifiers:{trim:!0},onInput:t[1]||(t[1]=o=>(v(),e.formData.username=h(y)(e.formData.username))),error:l.value&&!e.formData.username,"hide-details":""},null,8,["modelValue","error"]),l.value&&!e.formData.username?(p(),f("div",H,Q)):b("",!0),a(V,{class:"text-subtitle-1 font-weight-semibold pb-2 text-lightText"},{default:i(()=>[R]),_:1}),a(D,{modelValue:e.formData.password,"onUpdate:modelValue":t[2]||(t[2]=o=>e.formData.password=o),modelModifiers:{trim:!0},error:l.value&&!e.formData.password,type:m.value?"text":"password",color:"primary","hide-details":"","append-inner-icon":m.value?"mdi-eye":"mdi-eye-off","onClick:appendInner":t[3]||(t[3]=o=>m.value=!m.value),onInput:t[4]||(t[4]=o=>e.formData.password=h(y)(e.formData.password))},null,8,["modelValue","error","type","append-inner-icon"]),l.value&&!e.formData.password?(p(),f("div",G,K)):b("",!0),a($,{size:"large",class:"mt-3",color:"primary",block:"",onClick:t[5]||(t[5]=o=>g())},{default:i(()=>[N("Ingresar")]),_:1})])]),_:1}),a(_,{cols:"12",lg:"5",xl:"5",class:"d-lg-flex align-center justify-center position-relative"},{default:i(()=>[W]),_:1})]),_:1})]))}}),we=j(X,[["__scopeId","data-v-4cdb6385"]]);export{we as default};