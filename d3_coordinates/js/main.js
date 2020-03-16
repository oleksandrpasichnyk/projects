/* $().button('toggle');
$().button('dispose');
 */
function click1(){
  let x = document.getElementById("point");
  if(x.className=="hidden-form"){
    x.className="pactive-form";
    document.getElementById("line").className="hidden-form";
    document.getElementById("triangle").className="hidden-form";
  }
}

function click2(){
  let x = document.getElementById("line");
  if(x.className=="hidden-form"){
    x.className="active-form";
    document.getElementById("point").className="hidden-form";
    document.getElementById("triangle").className="hidden-form";
  }
}

function click3(){
  let x =document.getElementById("triangle");
  if(x.className=="hidden-form"){
    x.className="active-form";
    document.getElementById("point").className="hidden-form";
    document.getElementById("line").className="hidden-form";
  }
}
