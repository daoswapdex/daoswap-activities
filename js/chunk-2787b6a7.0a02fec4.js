(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2787b6a7"],{"094e":function(t,e,i){},"3a66":function(t,e,i){"use strict";i.d(e,"a",(function(){return o}));var s=i("fe6c"),a=i("58df");function o(t,e=[]){return Object(a["a"])(Object(s["b"])(["absolute","fixed"])).extend({name:"applicationable",props:{app:Boolean},computed:{applicationProperty(){return t}},watch:{app(t,e){e?this.removeApplication(!0):this.callUpdate()},applicationProperty(t,e){this.$vuetify.application.unregister(this._uid,e)}},activated(){this.callUpdate()},created(){for(let t=0,i=e.length;t<i;t++)this.$watch(e[t],this.callUpdate);this.callUpdate()},mounted(){this.callUpdate()},deactivated(){this.removeApplication()},destroyed(){this.removeApplication()},methods:{callUpdate(){this.app&&this.$vuetify.application.register(this._uid,this.applicationProperty,this.updateApplication())},removeApplication(t=!1){(t||this.app)&&this.$vuetify.application.unregister(this._uid,this.applicationProperty)},updateApplication:()=>0}})}},"5bcb":function(t,e,i){"use strict";i.r(e);var s=i("62ad"),a=i("a523"),o=i("ce7e"),n=(i("b5b6"),i("8dd9")),r=i("3a66"),l=i("d10f"),p=i("58df"),c=i("80d2"),h=Object(p["a"])(n["a"],Object(r["a"])("footer",["height","inset"]),l["a"]).extend({name:"v-footer",props:{height:{default:"auto",type:[Number,String]},inset:Boolean,padless:Boolean,tag:{type:String,default:"footer"}},computed:{applicationProperty(){return this.inset?"insetFooter":"footer"},classes(){return{...n["a"].options.computed.classes.call(this),"v-footer--absolute":this.absolute,"v-footer--fixed":!this.absolute&&(this.app||this.fixed),"v-footer--padless":this.padless,"v-footer--inset":this.inset}},computedBottom(){if(this.isPositioned)return this.app?this.$vuetify.application.bottom:0},computedLeft(){if(this.isPositioned)return this.app&&this.inset?this.$vuetify.application.left:0},computedRight(){if(this.isPositioned)return this.app&&this.inset?this.$vuetify.application.right:0},isPositioned(){return Boolean(this.absolute||this.fixed||this.app)},styles(){const t=parseInt(this.height);return{...n["a"].options.computed.styles.call(this),height:isNaN(t)?t:Object(c["g"])(t),left:Object(c["g"])(this.computedLeft),right:Object(c["g"])(this.computedRight),bottom:Object(c["g"])(this.computedBottom)}}},methods:{updateApplication(){const t=parseInt(this.height);return isNaN(t)?this.$el?this.$el.clientHeight:0:t}},render(t){const e=this.setBackgroundColor(this.color,{staticClass:"v-footer",class:this.classes,style:this.styles});return t(this.tag,e,this.$slots.default)}}),d=i("6b53"),u=i("0fd9"),f=function(){var t=this,e=t._self._c;return e(h,{attrs:{id:"home-footer",color:"black",dark:"","min-height":"72"}},[e(a["a"],[e(u["a"],[e(s["a"],{attrs:{cols:"12",md:"6"}},[e("div",{staticClass:"d-flex flex-wrap justify-md-start justify-center justify-md-none"},[t._l(t.social,(function(i,s){return[e("a",{key:i.title,staticClass:"white--text pa-1 pa-md-0",attrs:{href:i.url,target:"_blank"},domProps:{textContent:t._s(i.title)}}),s<t.social.length-1?e(d["a"],{key:"divider-"+i,staticClass:"mx-4 shrink hidden-sm-and-down",attrs:{"max-height":"24"}},[e(o["a"],{attrs:{vertical:""}})],1):t._e()]}))],2)]),e(s["a"],{staticClass:"text-center text-md-right",attrs:{cols:"12",md:"6"}},[t._v(" Copyright © "+t._s((new Date).getFullYear())+" Daoswap ")])],1)],1)],1)},m=[],b={name:"HomeFooter",data:()=>({social:[{title:"Twitter",url:"https://twitter.com/Daoswapdex"},{title:"Email",url:"mailto:contact@daoswap.cc"}]})},g=b,v=(i("8c5d"),i("2877")),y=Object(v["a"])(g,f,m,!1,null,null,null);e["default"]=y.exports},"8c5d":function(t,e,i){"use strict";i("094e")},b5b6:function(t,e,i){},d10f:function(t,e,i){"use strict";var s=i("2b0e");e["a"]=s["a"].extend({name:"ssr-bootable",data:()=>({isBooted:!1}),mounted(){window.requestAnimationFrame(()=>{this.$el.setAttribute("data-booted","true"),this.isBooted=!0})}})}}]);