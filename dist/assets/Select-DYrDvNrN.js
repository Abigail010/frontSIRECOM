import{B as f}from"./BaseBreadcrumb-BUjUSeql.js";import{_ as M}from"./UiParentCard.vue_vue_type_script_setup_true_lang-fgGlwcJm.js";import{_ as p}from"./UiChildCard.vue_vue_type_script_setup_true_lang-YNyDmDAq.js";import{V as s}from"./VSelect-AWVCrat9.js";import{y as r,H as i,o as m,c as u,b as e,w as t,F as b}from"./index-Buq65buf.js";import{V as n,a as h}from"./VRow-Ctz1qQoW.js";import"./useRender-BxYPdWix.js";import"./router-BUAsRsjo.js";import"./VCard-DYx3ZWBV.js";import"./VAvatar-DnqmwHRx.js";import"./transition-B72dfbUm.js";import"./VDivider-CrauPodZ.js";import"./VTextField-Ck2WlqEn.js";import"./VField-FB0ObzHG.js";import"./index-BR_FMKrs.js";import"./VLabel-Q0nQNgOl.js";import"./VInput-DW8trHrA.js";import"./forwardRefs-D3j0TLhE.js";import"./VList-DWEkCzxE.js";import"./ssrBoot-J2Isbuk5.js";import"./dialog-transition-9GmGLlaY.js";import"./VMenu-Vw07ipyt.js";import"./VOverlay-BKbQgHv6.js";import"./lazy-B33KSTCg.js";import"./scopeId-3T0RsHAR.js";import"./resizeObserver-BmQKPLvZ.js";import"./VCheckboxBtn-TAC0gRQb.js";import"./VSelectionControl-BcfiU6xa.js";import"./VChip-vQfLyUmr.js";import"./VSlideGroup-BbB4uZJz.js";import"./group-Db2nUOtn.js";const v=r({__name:"SelectDefault",setup(c){const a=i(["Foo","Bar","Fizz","Buzz"]);return(l,d)=>(m(),u("div",null,[e(s,{items:a.value,label:"Select Item","hide-details":""},null,8,["items"])]))}}),S=r({__name:"SelectReadOnly",setup(c){const a=i(["Foo","Bar","Fizz","Buzz"]);return(l,d)=>(m(),u("div",null,[e(s,{items:a.value,label:"Select Item",readonly:"","hide-details":""},null,8,["items"])]))}}),g=r({__name:"SelectMultiple",setup(c){const a=i([]),l=i(["Alabama","Alaska","American Samoa","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Federated States of Micronesia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Marshall Islands","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Northern Mariana Islands","Ohio","Oklahoma","Oregon","Palau","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virgin Island","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]);return(d,o)=>(m(),u("div",null,[e(s,{modelValue:a.value,"onUpdate:modelValue":o[0]||(o[0]=_=>a.value=_),items:l.value,label:"Select Multiple",multiple:"",hint:"Pick your favorite states","persistent-hint":""},null,8,["modelValue","items"])]))}}),V=r({__name:"SelectChip",setup(c){const a=i([]),l=i(["Alabama","Alaska","American Samoa","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Federated States of Micronesia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Marshall Islands","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Northern Mariana Islands","Ohio","Oklahoma","Oregon","Palau","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virgin Island","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]);return(d,o)=>(m(),u("div",null,[e(s,{modelValue:a.value,"onUpdate:modelValue":o[0]||(o[0]=_=>a.value=_),items:l.value,label:"Select item",multiple:"",chips:"",hint:"What are the target regions","persistent-hint":""},null,8,["modelValue","items"])]))}}),k=r({__name:"SelectDensity",setup(c){const a=i(["Foo","Bar","Fizz","Buzz"]);return(l,d)=>(m(),u("div",null,[e(s,{items:a.value,label:"Compact",density:"compact"},null,8,["items"]),e(s,{items:a.value,label:"Comfortable",density:"comfortable"},null,8,["items"]),e(s,{items:a.value,label:"Default","hide-details":""},null,8,["items"])]))}}),ae=r({__name:"Select",setup(c){const a=i({title:"Select"}),l=i([{text:"Dashboard",disabled:!1,href:"#"},{text:"Select",disabled:!0,href:"#"}]);return(d,o)=>(m(),u(b,null,[e(f,{title:a.value.title,breadcrumbs:l.value},null,8,["title","breadcrumbs"]),e(h,null,{default:t(()=>[e(n,{cols:"12"},{default:t(()=>[e(M,{title:"Select"},{default:t(()=>[e(h,null,{default:t(()=>[e(n,{cols:"12",sm:"6"},{default:t(()=>[e(p,{title:"Basic"},{default:t(()=>[e(v)]),_:1})]),_:1}),e(n,{cols:"12",sm:"6"},{default:t(()=>[e(p,{title:"Read only"},{default:t(()=>[e(S)]),_:1})]),_:1}),e(n,{cols:"12",sm:"6"},{default:t(()=>[e(p,{title:"Multiple"},{default:t(()=>[e(g)]),_:1})]),_:1}),e(n,{cols:"12",sm:"6"},{default:t(()=>[e(p,{title:"Chips"},{default:t(()=>[e(V)]),_:1})]),_:1}),e(n,{cols:"12",sm:"12"},{default:t(()=>[e(p,{title:"Density"},{default:t(()=>[e(k)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})],64))}});export{ae as default};