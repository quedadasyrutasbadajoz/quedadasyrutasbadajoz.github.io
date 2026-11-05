(function(){"use strict";
function pinta(el,zoomFijo){if(!window.L)return;var d=JSON.parse(el.dataset.mapa);var m=L.map(el,{scrollWheelZoom:false});
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(m);
var b=[];var esc=function(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
if(d.linea&&d.linea.length>1){L.polyline(d.linea,{color:"#ff7a1a",weight:4,opacity:.85,dashArray:d.carretera?null:"8 6"}).addTo(m);}
d.puntos.forEach(function(p){var col=p.c==="evento"?"#ffd34d":"#ff7a1a";var mk=L.circleMarker([p.lat,p.lon],{radius:p.s?Math.min(6+p.s.length,16):7,color:"#111",weight:2,fillColor:col,fillOpacity:.95}).addTo(m);
var h="<b>"+esc(p.n)+"</b>";if(p.s){h+="<ul style='padding-left:18px;margin:6px 0 0'>"+p.s.slice(0,8).map(function(s){return"<li><a href='"+esc(s.u)+"'>"+esc(s.t)+"</a> ("+esc(s.f)+")</li>"}).join("")+(p.s.length>8?"<li>y "+(p.s.length-8)+" más</li>":"")+"</ul>";}
mk.bindPopup(h);b.push([p.lat,p.lon]);});
if(d.carretera&&d.linea&&d.linea.length>1)b=b.concat(d.linea);if(b.length===1)m.setView(b[0],11);else if(b.length)m.fitBounds(b,{padding:[30,30]});else m.setView([38.88,-6.97],8);
m.on("focus",function(){m.scrollWheelZoom.enable();});}
document.addEventListener("DOMContentLoaded",function(){["mapa","mapa-mini"].forEach(function(id){var el=document.getElementById(id);if(el)pinta(el);});
var v=document.querySelectorAll(".mapa-ruta");if(!v.length)return;
if(!("IntersectionObserver" in window)){v.forEach(function(el){pinta(el);});return;}
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){io.unobserve(x.target);pinta(x.target);}});},{rootMargin:"300px"});
v.forEach(function(el){io.observe(el);});});
})();