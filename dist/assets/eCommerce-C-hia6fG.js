import{a5 as o,b3 as r,b4 as e}from"./index-C6xIyDbS.js";const h=o({id:"eCommerceone",state:()=>({products:[],cart:[],gender:"",category:[],price:"",subTotal:0,discount:5,total:0,addresses:[],color:"All"}),getters:{},actions:{async fetchProducts(){try{const t=await r.get("/api/products/list");this.products=t.data}catch(t){alert(t),console.log(t)}},async fetchAddress(){try{const t=await r.get("/api/address/list");this.addresses=t.data}catch(t){alert(t),console.log(t)}},SelectGender(t){this.gender=t},sortByColor(t){this.color=t},SelectCategory(t){this.category=t},SelectPrice(t){this.price=t},AddToCart(t){const a=t;this.cart=[...this.cart,a]},incrementQty(t){const a=t,i=e.map(this.cart,s=>s.id===a?{...s,qty:s.qty+1}:s);this.cart=i,this.subTotal=e.sum(this.cart.map(s=>s.salePrice*s.qty)),this.discount=Math.round(this.subTotal*(5/100)),this.total=this.subTotal-this.discount},decrementQty(t){const a=t,i=e.map(this.cart,s=>s.id===a?{...s,qty:s.qty-1}:s);this.cart=i,this.subTotal=e.sum(this.cart.map(s=>s.salePrice*s.qty)),this.subTotal=e.sum(this.cart.map(s=>s.salePrice*s.qty)),this.discount=Math.round(this.subTotal*(5/100)),this.total=this.subTotal-this.discount},deleteCart(t){const a=e.filter(this.cart,i=>i.id!==t);this.cart=a},getsubTotal(){this.subTotal=e.sum(this.cart.map(t=>t.salePrice*t.qty))},getTotal(){this.total=this.subTotal-this.discount},getDiscount(){this.discount=Math.round(this.subTotal*(5/100))},filterReset(){}}});export{h as u};