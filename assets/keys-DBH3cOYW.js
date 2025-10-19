import{j as n}from"./index-BL_mNyZO.js";import{c as s}from"./utils-B2IhEsb0.js";import{c as e}from"./createLucideIcon-D4P0TxH6.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r=[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]],i=e("arrow-up",r);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}]],d=e("book",l);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]],k=e("bookmark",p);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M12 20v-9",key:"1qisl0"}],["path",{d:"M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z",key:"uouzyp"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M21 21a4 4 0 0 0-3.81-4",key:"1b0z45"}],["path",{d:"M21 5a4 4 0 0 1-3.55 3.97",key:"5cxbf6"}],["path",{d:"M22 13h-4",key:"1jl80f"}],["path",{d:"M3 21a4 4 0 0 1 3.81-4",key:"1fjd4g"}],["path",{d:"M3 5a4 4 0 0 0 3.55 3.97",key:"1d7oge"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"m8 2 1.88 1.88",key:"fmnt4t"}],["path",{d:"M9 7.13V6a3 3 0 1 1 6 0v1.13",key:"1vgav8"}]],y=e("bug",u);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",key:"2acyp4"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],h=e("square-check-big",g),_=["red","yellow","green","blue","indigo"],S=["Bug","CheckSquare","Book","ArrowUp","Bookmark"],x={blue:"bg-blue-500",green:"bg-green-500",indigo:"bg-indigo-500",red:"bg-red-500",yellow:"bg-yellow-500"},m={blue:"text-blue-500",green:"text-green-500",indigo:"text-indigo-500",red:"text-red-500",yellow:"text-yellow-500"},b={ArrowUp:i,Book:d,Bookmark:k,Bug:y,CheckSquare:h};function N(o){const a=o.color?m[o.color]:"",c=b[o.icon];return n.jsx(c,{className:s(a,o.className)})}const E=o=>_.includes(o),I=o=>S.includes(o),T=o=>({color:E(o.color)?o.color:"blue",icon:I(o.icon)?o.icon:"Bug",id:o.id,name:o.name,order:o.order,projectId:o.project_id}),t={all:["issue-types"],list:o=>[...t.lists(),{projectId:o}],lists:()=>[...t.all,"list"]};export{S as I,_ as a,x as b,N as g,t as i,T as m};
