const producto = {dia:"",hora:"",detalle:"",precio:0,cantidad:0,pneto:0,piva:0,pfinal:0,des:0};
const productos = [];
var productosr = [];

let i_iva = false;
let i_des = false;
let facturador = true;
let ptotal = 0;
let ctotal = 0;
let idp = 0;

let ptotalr = 0;
let ctotalr  = 0;

let diayhora = "";
var diayhorar = {dia:null,hora:null};

// ---------
// FUNCIONES
// ---------

function calcneto (p1,p2)
{
    return (p1 * p2);
}

function calciva (input)
{
    if (i_iva == true)
    {
        return (input + (input * 0.21));
    }
    else
    {
        return input;
    }
}

function calcdes (input)
{
    if (i_des == true)
    {
        return (input - (input * (producto.des / 100)));
    }
    else
    {
        return input;
    }
}

function calcptotal ()
{
    productos.forEach(element => { ptotal += element.pfinal; });
}

function calcctotal ()
{
    ctotal += productos.filter(element => element.pfinal > '0').length;
}

function calcr ()
{
    if(productosr === null){
    }
    else{
        productosr.forEach(element => { ptotalr += element.pfinal; });
        ctotalr += productosr.filter(element => element.pfinal > '0').length;
    }
}

function booleantosi (input)
{
    if (input)
    {
        return "SI";
    }
    else
    {
        return "NO";
    }
}

function porcentajetosi (input)
{
    if (input && producto.des >= 1)
    {
        return `${producto.des}%`;
    }
    else
    {
        return "NO";
    }
}

function checkbox()
{
    if (document.getElementById("f-des").checked == false )
    {
        document.getElementById("f-porcentaje").style.display = "none";
        document.getElementById("l-porcentaje").style.display = "none";
        document.getElementById("f-porcentaje").value = null;
        document.getElementById("f-porcentaje").removeAttribute('required');
    }
    else if (document.getElementById("f-des").checked == true )
    {
        document.getElementById("f-porcentaje").style.display = "inline-block";
        document.getElementById("l-porcentaje").style.display = "inline-block";
        document.getElementById("f-porcentaje").setAttribute('required','');
    }
}

function alertaok()
{
    Toastify({
        text: "PRODUCTO AGREGADO",
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
}

function alertaguardar()
{
    Toastify({
        text: "SALDO GUARDADO",
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: {
          background: "linear-gradient(to right, #71a5ff, #71ffe7)",
        },
    }).showToast();
}

function alertaborrar()
{
    Toastify({
        text: "SALDO BORRADO",
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
    }).showToast();
}

function alertalimpiar()
{
    Toastify({
        text: "REALIZADO",
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: {
          background: "linear-gradient(to right, #ff718b, #e571ff)",
        },
    }).showToast();
}

function drawsaldo()
{
    if(diayhorar === null){
    }
    else{
    totalr.innerHTML = `<a>saldo guardado: $${ptotalr} en ${ctotalr} productos</a><br><a style="font-size:15px;color:antiquewhite;">al día ${diayhorar.dia} a las ${diayhorar.hora} horas</a>`;
    }
}

function limpiar()
{
    document.getElementById("table-id").innerHTML ="<tr><th>ID</th><th>DIA</th><th>HORA</th><th>DETALLE</th><th>PRECIO</th><th>CANTIDAD</th><th>IVA?</th><th>DESCUENTO?</th><th>PRECIO FINAL</th></tr>";
    productos.length = 0;
    total.innerText = "AGREGA PRODUCTOS PARA SUMAR AL TOTAL";
    document.getElementById("f-guardar").setAttribute('disabled','');
    document.getElementById("f-limpiar").setAttribute('disabled','');
}

function guardar()
{
    localStorage.setItem("productos", JSON.stringify(productos))
    localStorage.setItem("tiempo", JSON.stringify(diayhorar))
    productosr = JSON.parse(localStorage.getItem("productos"));
    calcr();
    drawsaldo();
    productosr = [];
    document.getElementById("f-borrar").removeAttribute('disabled');
}

function borrar()
{
    localStorage.setItem("productos", "[]")
    productosr.length = 0;
    totalr.innerText = ``;
    ptotalr = 0;
    ctotalr = 0;
    limpiar();
    document.getElementById("f-borrar").setAttribute('disabled','');
}

function checkstorage()
{
    if(localStorage.getItem("productos") === "[]"){
    }
    else{
        document.getElementById("f-borrar").removeAttribute('disabled');
        productosr = JSON.parse(localStorage.getItem("productos"));
        diayhorar = JSON.parse(localStorage.getItem("tiempo"));
        calcr();
        drawsaldo();
    }
}

function resetearvars ()
{
    producto.dia = null;
    producto.hora = null;
    producto.detalle = null;
    producto.precio = null;
    producto.cantidad = null;
    i_iva == false;
    i_des == false;
    producto.des = null;
    producto.pneto = 0;
    producto.piva = 0;
    producto.pfinal = 0;
    ptotal = 0;
    ctotal = 0;
    document.getElementById("f-cantidad").value = "1";
    document.getElementById("f-detalle").value = "";
    document.getElementById("f-precio").value = "";
}

async function diadia ()
{
    const response = await fetch("http://worldtimeapi.org/api/timezone/America/Argentina/Buenos_Aires");
    const data = await response.json();
    diayhora = data.datetime;
    producto.dia = (diayhora.slice(8,-22) + "-" + diayhora.slice(5,-25) + "-" + diayhora.slice(0,-28));
    producto.hora = diayhora.slice(11,-13);
    diayhorar = {dia:producto.dia,hora:producto.hora}
}

// ---------
// PROGRAMA
// ---------

//INIT
fetch('info.json')
.then(response => {return response.json();})
.then(data => { 
    document.getElementById("titulo").innerText = (data.title);
    document.getElementById("infotext").innerHTML = (data.info);
});
diadia();
document.getElementById("f-porcentaje").style.display = "none";
document.getElementById("l-porcentaje").style.display = "none";
document.getElementById("f-guardar").setAttribute('disabled','');
document.getElementById("f-borrar").setAttribute('disabled','');
document.getElementById("f-limpiar").setAttribute('disabled','');
let rows = document.getElementById("table-id");
let total = document.getElementById("total");
let totalr = document.getElementById("totalr");
checkstorage();
//EVENTOS
document.getElementById("f-des").addEventListener("click", checkbox);
document.getElementById("form-id").addEventListener("submit", function(evento)
{
    evento.preventDefault();
    ejecutar();
});
document.getElementById("f-guardar").addEventListener("click", function(evento)
{
    evento.preventDefault();
    guardar();
    alertaguardar();
});
document.getElementById("f-borrar").addEventListener("click", function(evento)
{
    evento.preventDefault();
    borrar();
    alertaborrar();
});
document.getElementById("f-limpiar").addEventListener("click", function(evento)
{
    evento.preventDefault();
    limpiar();
    alertalimpiar();
});

function ejecutar()
{
    //VARS
    idp ++;
    //INPUTS
    diadia();
    document.getElementById("f-guardar").removeAttribute('disabled');
    document.getElementById("f-limpiar").removeAttribute('disabled');
    producto.detalle = document.getElementById("f-detalle").value;
    producto.precio = document.getElementById("f-precio").value;
    producto.cantidad = document.getElementById("f-cantidad").value;
    i_iva = document.getElementById("f-iva").checked;
    i_des = document.getElementById("f-des").checked;
    producto.des = document.getElementById("f-porcentaje").value;
    //CÁLCULOS
    producto.pneto = calcneto(producto.precio, producto.cantidad);
    producto.piva = calciva(producto.pneto);
    producto.pfinal = calcdes (producto.piva);
    //PUSH ARRAY
    productos.push({detalle:producto.detalle,precio:producto.precio,cantidad:producto.cantidad,pneto:producto.pneto,piva:producto.piva,pfinal:producto.pfinal,des:producto.des}); 
    //CONVERSIÓN VISUAL
    i_iva = booleantosi (i_iva);
    i_des = porcentajetosi (i_des);
    // DOM
    let neww = document.createElement("tr");
    neww.innerHTML=`<td>${idp}</td><td>${producto.dia}</td><td>${producto.hora}</td><td>${producto.detalle}</td><td>$${producto.precio}</td><td>${producto.cantidad}</td><td>${i_iva}</td><td>${i_des}</td><td>$${producto.pfinal}</td>`;
    rows.appendChild(neww);
    alertaok();
    // CÁLCULOS FINALES
    calcptotal();
    calcctotal();
    // FIN
    total.innerText = `PRECIO TOTAL: $${ptotal} (${ctotal} PRODUCTOS)`;
    resetearvars();
}