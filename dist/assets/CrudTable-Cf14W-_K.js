import{B as R}from"./BaseBreadcrumb-4MIjbQwQ.js";import{_ as E}from"./UiParentCard.vue_vue_type_script_setup_true_lang-jhNl0ZHJ.js";import{V as m,a as g}from"./VRow-De8gMS49.js";import{V as K}from"./VDataTable-Clv1HmiC.js";import{V as P,a as S}from"./VToolbar-Cf21mDDn.js";import{V as $}from"./VDivider-BKsbfY-L.js";import{V as v}from"./VSpacer-D0J7wQQ_.js";import{V as k}from"./VDialog-BritogP2.js";import{V as d}from"./VBtn-Bwlw_S26.js";import{V as x,a as y,b as H,c as T}from"./VCard-B5JACPL-.js";import{V as G}from"./VContainer-BxvF_pwG.js";import{V as p}from"./VTextField-DvwW7kBo.js";import{V as D}from"./router-DjP1fb63.js";import{H as i,U as J,T as I,o as L,c as M,b as e,w as a,d as s,v as Y,a as q,t as Q,F as W,ah as w}from"./index-CUBqpQjk.js";import"./useRender-DUD5GNME.js";import"./resizeObserver-Dy93hC7S.js";import"./VSelect-Y5UkN40p.js";import"./VInput-a6OhgCb3.js";import"./index-CBT7dlbo.js";import"./transition-7eeLtsO5.js";import"./forwardRefs-D3j0TLhE.js";import"./VList-ClDiqBX_.js";import"./ssrBoot-TGepEb6s.js";import"./VAvatar-DCozc2c4.js";import"./dialog-transition-BmxFGc2r.js";import"./VMenu-Cw996tyh.js";import"./VOverlay-ZufbB-oQ.js";import"./lazy-BqTskM4N.js";import"./scopeId-BvaqpV40.js";import"./VCheckboxBtn-Ct_gEblA.js";import"./VSelectionControl-Dee3CKWd.js";import"./VLabel-cMv036s0.js";import"./VChip-B4X-ZzT8.js";import"./VSlideGroup-Bt6gprAW.js";import"./group-C0-37VYq.js";import"./VTable-fMMFAG9t.js";import"./filter-CojnhgC1.js";import"./VProgressCircular-D0IBnh0x.js";import"./VField-CAUvKyXj.js";const X={class:"text-h5"},Ke={__name:"CrudTable",setup(Z){const U=i({title:"CRUD Table"}),O=i([{text:"Dashboard",disabled:!1,href:"#"},{text:"CRUD Table",disabled:!0,href:"#"}]),c=i(!1),f=i(!1),B=i([{title:"Dessert (100g serving)",align:"start",sortable:!1,key:"name"},{title:"Calories",key:"calories"},{title:"Fat (g)",key:"fat"},{title:"Carbs (g)",key:"carbs"},{title:"Protein (g)",key:"protein"},{title:"Actions",key:"actions",sortable:!1}]),u=i([]),n=i(-1),t=i({name:"",calories:0,fat:0,carbs:0,protein:0}),C=i({name:"",calories:0,fat:0,carbs:0,protein:0}),F=J(()=>n.value===-1?"New Item":"Edit Item");function _(){u.value=[{name:"Frozen Yogurt",calories:159,fat:6,carbs:24,protein:4},{name:"Ice cream sandwich",calories:237,fat:9,carbs:37,protein:4.3},{name:"Eclair",calories:262,fat:16,carbs:23,protein:6},{name:"Cupcake",calories:305,fat:3.7,carbs:67,protein:4.3},{name:"Gingerbread",calories:356,fat:16,carbs:49,protein:3.9},{name:"Jelly bean",calories:375,fat:0,carbs:94,protein:0},{name:"Lollipop",calories:392,fat:.2,carbs:98,protein:0},{name:"Honeycomb",calories:408,fat:3.2,carbs:87,protein:6.5},{name:"Donut",calories:452,fat:25,carbs:51,protein:4.9},{name:"KitKat",calories:518,fat:26,carbs:65,protein:7}]}function h(r){n.value=u.value.indexOf(r),t.value=Object.assign({},r),c.value=!0}function j(r){n.value=u.value.indexOf(r),t.value=Object.assign({},r),f.value=!0}function N(){u.value.splice(n.value,1),V()}function b(){c.value=!1,w(()=>{t.value=Object.assign({},C.value),n.value=-1})}function V(){f.value=!1,w(()=>{t.value=Object.assign({},C.value),n.value=-1})}function z(){n.value>-1?Object.assign(u.value[n.value],t.value):u.value.push(t.value),b()}return I(c,r=>{r||b()}),I(f,r=>{r||V()}),_(),(r,o)=>(L(),M(W,null,[e(R,{title:U.value.title,breadcrumbs:O.value},null,8,["title","breadcrumbs"]),e(g,null,{default:a(()=>[e(m,{cols:"12"},{default:a(()=>[e(E,{title:"Crud Table"},{default:a(()=>[e(K,{class:"border rounded-md",headers:B.value,items:u.value,"sort-by":[{key:"calories",order:"asc"}]},{top:a(()=>[e(P,{class:"bg-lightprimary",flat:""},{default:a(()=>[e(S,null,{default:a(()=>[s("My Crud Table")]),_:1}),e($,{class:"mx-4",inset:"",vertical:""}),e(v),e(k,{modelValue:c.value,"onUpdate:modelValue":o[5]||(o[5]=l=>c.value=l),"max-width":"500px"},{activator:a(({props:l})=>[e(d,Y({color:"primary",variant:"flat",dark:""},l),{default:a(()=>[s("Add New Item")]),_:2},1040)]),default:a(()=>[e(x,null,{default:a(()=>[e(y,{class:"pa-4 bg-secondary"},{default:a(()=>[q("span",X,Q(F.value),1)]),_:1}),e(H,null,{default:a(()=>[e(G,{class:"px-0"},{default:a(()=>[e(g,null,{default:a(()=>[e(m,{cols:"12",sm:"6",md:"4"},{default:a(()=>[e(p,{modelValue:t.value.name,"onUpdate:modelValue":o[0]||(o[0]=l=>t.value.name=l),label:"Dessert name"},null,8,["modelValue"])]),_:1}),e(m,{cols:"12",sm:"6",md:"4"},{default:a(()=>[e(p,{modelValue:t.value.calories,"onUpdate:modelValue":o[1]||(o[1]=l=>t.value.calories=l),label:"Calories"},null,8,["modelValue"])]),_:1}),e(m,{cols:"12",sm:"6",md:"4"},{default:a(()=>[e(p,{modelValue:t.value.fat,"onUpdate:modelValue":o[2]||(o[2]=l=>t.value.fat=l),label:"Fat (g)"},null,8,["modelValue"])]),_:1}),e(m,{cols:"12",sm:"6",md:"4"},{default:a(()=>[e(p,{modelValue:t.value.carbs,"onUpdate:modelValue":o[3]||(o[3]=l=>t.value.carbs=l),label:"Carbs (g)"},null,8,["modelValue"])]),_:1}),e(m,{cols:"12",sm:"6",md:"4"},{default:a(()=>[e(p,{modelValue:t.value.protein,"onUpdate:modelValue":o[4]||(o[4]=l=>t.value.protein=l),label:"Protein (g)"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}),e(T,null,{default:a(()=>[e(v),e(d,{color:"error",variant:"flat",dark:"",onClick:b},{default:a(()=>[s(" Cancel ")]),_:1}),e(d,{color:"success",variant:"flat",dark:"",onClick:z},{default:a(()=>[s(" Save ")]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),e(k,{modelValue:f.value,"onUpdate:modelValue":o[6]||(o[6]=l=>f.value=l),"max-width":"500px"},{default:a(()=>[e(x,null,{default:a(()=>[e(y,{class:"text-h5 text-center py-6"},{default:a(()=>[s("Are you sure you want to delete this item?")]),_:1}),e(T,null,{default:a(()=>[e(v),e(d,{color:"error",variant:"flat",dark:"",onClick:V},{default:a(()=>[s("Cancel")]),_:1}),e(d,{color:"success",variant:"flat",dark:"",onClick:N},{default:a(()=>[s("OK")]),_:1}),e(v)]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),"item.actions":a(({item:l})=>[e(D,{color:"info",size:"small",class:"me-2",onClick:A=>h(l)},{default:a(()=>[s(" mdi-pencil ")]),_:2},1032,["onClick"]),e(D,{color:"error",size:"small",onClick:A=>j(l)},{default:a(()=>[s(" mdi-delete ")]),_:2},1032,["onClick"])]),"no-data":a(()=>[e(d,{color:"primary",onClick:_},{default:a(()=>[s(" Reset ")]),_:1})]),_:1},8,["headers","items"])]),_:1})]),_:1})]),_:1})],64))}};export{Ke as default};