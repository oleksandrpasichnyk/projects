var height = 600, 
    width = 600, 
    margin = 50;   
// создание объекта svg
var svg = d3.select("svg")
        .attr("class", "axis")
        .attr("width", width)
        .attr("height", height);

var r=1; 
var s = height/200;
r*=s;

function clear_canvas(){
  d3.selectAll('rect').remove();
  d3.selectAll("line.notaxis").remove();
  d3.selectAll('polygon').remove();
}
// длина оси X= ширина контейнера svg - отступ слева и справа  
var xAxisLength = width - 2 * margin;     
  
// длина оси Y = высота контейнера svg - отступ сверху и снизу
var yAxisLength = height - 2 * margin;
    
// функция интерполяции значений на ось Х  
var scaleX = d3.scale.linear()
            .domain([0, 200])
            .range([0, xAxisLength]);
             
// функция интерполяции значений на ось Y
var scaleY = d3.scale.linear()
            .domain([200, 0])
            .range([0, yAxisLength]);    

var ticks = 10;         
// создаем ось X   
var xAxis = d3.svg.axis()
             .scale(scaleX)
             .orient("bottom")
             .ticks(ticks);
// создаем ось Y             
var yAxis = d3.svg.axis()
             .scale(scaleY)
             .orient("left")
             .ticks(ticks);

function zoom(){
  r = document.getElementById('r').value * s;
  document.getElementById('rlabel').innerHTML = "Pixel size: " + r/s + "x" + r/s;

}

var xtrans = yAxisLength + margin;           
svg.append("g")       
     .attr("class", "x-axis")
     .attr("transform",  // сдвиг оси x вправо и вниз
         "translate(" + margin + "," + xtrans + ")")
    .call(xAxis);
             
svg.append("g")       
    .attr("class", "y-axis")
    .attr("transform", // сдвиг оси y вправо и вниз 
            "translate(" + margin + "," + margin + ")")
    .call(yAxis);
 
function draw_vartical_lines(){
  // создаем набор вертикальных линий для сетки   
  d3.selectAll("g.x-axis g.tick")
      .append("line") // добавляем линию
      .classed("grid-line", true) // добавляем класс
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", - (yAxisLength));
}

draw_vartical_lines();

function draw_horisontal_lines(){
  // рисуем горизонтальные линии 
  d3.selectAll("g.y-axis g.tick")
      .append("line")
      .classed("grid-line", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", xAxisLength)
      .attr("y2", 0);
}    

draw_horisontal_lines();

function build_pixel(x,y){
  svg.append("rect")
    .style("fill", "red")
    //.style("stroke", "red")
    //.style("stroke-width", "2")
    .attr("x", scaleX(x-r/(2*s)) + margin)
    .attr("y", scaleY(y+r/(2*s)) + margin)
    .attr("width", r-r/(s*2)) 
    .attr("height", r-r/(s*2));
}

function build_line(){
  x1 = document.getElementById('x1').value;
  y1 = document.getElementById('y1').value;
  x2 = document.getElementById('x2').value;
  y2 = document.getElementById('y2').value;

  if(x2-x1>=y2-y1){
    var x,y;
    var k=(y2-y1)/(x2-x1);
    x = x1*1;
    y = y1*1;    //???????????
    while(x < x2){

      build_pixel(x,y-y%(r/s));  //ціла частина??кратна r
      y+=k*r/s;
      x+=r/s;
    }
  }

  if(x2-x1<y2-y1){
    var x,y;
    var k=(x2-x1)/(y2-y1);
    x = x1*1;
    y = y1*1;    //???????????
    while(y < y2){

      build_pixel(x-x%(r/s),y);  //ціла частина??кратна r
      x+=k*r/s;
      y+=r/s;
    }
  }
}

//$().button('toggle');
//$().button('dispose');