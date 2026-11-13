/* Quedadas y Rutas Badajoz · JS mínimo: menú, galería con filtros, visor y consentimiento de cookies. */
(function () {
  "use strict";
  // Menú móvil
  var b = document.querySelector(".boton-menu"), m = document.getElementById("menu");
  if (b && m) b.addEventListener("click", function () {
    var a = m.classList.toggle("abierto"); b.setAttribute("aria-expanded", a ? "true" : "false");
  });

  // Filtros de galería (año y tipo)
  var gal = document.querySelector(".galeria[data-filtrable]");
  if (gal) {
    var estado = { año: "todos", tipo: "todos" };
    var aplica = function () {
      var n = 0;
      gal.querySelectorAll("a").forEach(function (a) {
        var ok = (estado.año === "todos" || a.dataset.año === estado.año) &&
                 (estado.tipo === "todos" || (" " + a.dataset.tipo + " ").indexOf(" " + estado.tipo + " ") >= 0);
        a.hidden = !ok; if (ok) n++;
      });
      var c = document.getElementById("contador"); if (c) c.textContent = n + (n === 1 ? " foto" : " fotos");
    };
    document.querySelectorAll(".filtros").forEach(function (f) {
      f.addEventListener("click", function (e) {
        var t = e.target.closest("button"); if (!t) return;
        f.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        t.setAttribute("aria-pressed", "true"); estado[f.dataset.filtro] = t.dataset.valor; aplica();
      });
    });
    aplica();
  }

  // Visor de fotos (cualquier enlace con data-visor dentro de un contenedor .con-visor)
  var visor = document.getElementById("visor");
  if (visor) {
    var img = visor.querySelector("img"), txt = visor.querySelector("p"), lista = [], i = 0;
    var muestra = function () {
      var a = lista[i]; img.src = a.getAttribute("href"); img.alt = a.querySelector("img").alt; txt.textContent = a.dataset.pie || "";
    };
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-visor]"); if (!a || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      lista = Array.prototype.filter.call(a.closest(".con-visor").querySelectorAll("a[data-visor]"), function (x) { return !x.hidden; });
      i = lista.indexOf(a); muestra(); visor.classList.add("abierto"); visor.querySelector(".cerrar").focus();
    });
    var cierra = function () { visor.classList.remove("abierto"); img.src = ""; };
    visor.querySelector(".cerrar").addEventListener("click", cierra);
    visor.querySelector(".ant").addEventListener("click", function () { i = (i - 1 + lista.length) % lista.length; muestra(); });
    visor.querySelector(".sig").addEventListener("click", function () { i = (i + 1) % lista.length; muestra(); });
    visor.addEventListener("click", function (e) { if (e.target === visor) cierra(); });
    document.addEventListener("keydown", function (e) {
      if (!visor.classList.contains("abierto")) return;
      if (e.key === "Escape") cierra();
      if (e.key === "ArrowLeft") visor.querySelector(".ant").click();
      if (e.key === "ArrowRight") visor.querySelector(".sig").click();
    });
  }

  // Consentimiento de cookies. 12-nov (7e1442): la PUBLICIDAD la gestiona la CMP de Google (adsbygoogle.js va siempre en la página);
  // este aviso propio solo pregunta por la analítica, y «Configurar cookies» abre también el aviso de Google.
  // Los scripts de terceros van en la página como <script type="text/plain" data-consentimiento="publicidad|analitica" data-src="...">
  // y solo se activan aquí, tras aceptar. Mientras CONFIG.anuncios sea false, no se carga ninguno aunque se acepte.
  var CLAVE = "qyrb_consentimiento_v1";
  var CONFIG = window.QYRB_CONFIG || { anuncios: false, analitica: false };
  var caja = document.getElementById("cookies");
  var lee = function () { try { return JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { return null; } };
  var activa = function (c) {
    document.querySelectorAll('script[type="text/plain"][data-consentimiento]').forEach(function (s) {
      var tipo = s.dataset.consentimiento;
      if (!c[tipo] || !CONFIG[tipo === "publicidad" ? "anuncios" : "analitica"]) return;
      var n = document.createElement("script");
      if (s.dataset.src) { n.src = s.dataset.src; n.async = true; if (s.dataset.crossorigin) n.crossOrigin = s.dataset.crossorigin; }
      else n.text = s.text;
      s.parentNode.replaceChild(n, s);
    });
  };
  var guarda = function (c) {
    c.fecha = new Date().toISOString(); localStorage.setItem(CLAVE, JSON.stringify(c));
    caja.classList.remove("visible", "con-ajustes"); activa(c);
  };
  if (caja) {
    var previo = lee();
    if (previo) activa(previo); else if (CONFIG.analitica) caja.classList.add("visible");  // sin analítica activa no hay nada que preguntar aquí
    caja.querySelector("[data-accion=aceptar]").addEventListener("click", function () { guarda({ analitica: true }); });
    caja.querySelector("[data-accion=rechazar]").addEventListener("click", function () { guarda({ analitica: false }); });
    caja.querySelector("[data-accion=ajustes]").addEventListener("click", function () { caja.classList.toggle("con-ajustes"); });
    caja.querySelector("[data-accion=guardar]").addEventListener("click", function () {
      guarda({ analitica: caja.querySelector("#ck-ana").checked });
    });
    document.querySelectorAll("[data-abrir-cookies]").forEach(function (x) {
      x.addEventListener("click", function () {
        if (CONFIG.anuncios) { window.googlefc = window.googlefc || {}; window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
          window.googlefc.callbackQueue.push(function () { window.googlefc.showRevocationMessage(); }); }   // aviso de Google (publicidad)
        if (!CONFIG.analitica) return;
        var p = lee() || {}; caja.querySelector("#ck-ana").checked = !!p.analitica;
        caja.classList.add("visible", "con-ajustes");
      });
    });
  }
})();

(function(){"use strict";
var cajas=document.querySelectorAll("[data-taldia] .tal-dia-contenido");if(!cajas.length)return;
var M=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
var esc=function(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
fetch("/datos/taldia.json").then(function(r){return r.json()}).then(function(d){
 var h=new Date(),y=h.getFullYear(),k=function(x){return("0"+(x.getMonth()+1)).slice(-2)+"-"+("0"+x.getDate()).slice(-2)};
 var hoy=(d[k(h)]||[]).filter(function(p){return p.a<y});var txt;
 if(hoy.length){txt="<p>Un "+h.getDate()+" de "+M[h.getMonth()]+" como hoy publicamos:</p>"+hoy.slice(0,3).map(function(p){return"<a href='"+esc(p.u)+"' style='display:flex;gap:12px;align-items:center;margin:10px 0;text-decoration:none'><img src='"+esc(p.i)+"' alt='"+esc(p.alt)+"' width='88' height='88' style='width:88px;height:88px;object-fit:cover;border-radius:8px' loading='lazy'><span><b>"+p.a+"</b> · "+esc(p.t||"Ver la publicación")+"</span></a>"}).join("");}
 else{var n=null;for(var i=1;i<366&&!n;i++){var x=new Date(h.getTime()+i*864e5);if((d[k(x)]||[]).length)n=x;}
  txt="<p>Hoy no hay nada en el archivo de otros años."+(n?" Lo próximo, el "+n.getDate()+" de "+M[n.getMonth()]+".":"")+"</p>";}
 cajas.forEach(function(c){c.innerHTML=txt;});}).catch(function(){cajas.forEach(function(c){c.innerHTML="<p class='suave'>No se ha podido cargar el archivo.</p>"})});
})();