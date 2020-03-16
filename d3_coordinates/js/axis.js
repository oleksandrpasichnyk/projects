var height = 600, 
    width = 600, 
    margin=50;
    
     
// создание объекта svg
var svg = d3.select("svg")
        .attr("class", "axis")
        .attr("width", width)
        .attr("height", height);

function clear_canvas(){
  d3.selectAll('circle').remove();
  d3.selectAll("line.notaxis").remove();
  d3.selectAll('polygon').remove();
}
// длина оси X= ширина контейнера svg - отступ слева и справа
var xAxisLength = width - 2 * margin;     
  
// длина оси Y = высота контейнера svg - отступ сверху и снизу
var yAxisLength = height - 2 * margin;
    
// функция интерполяции значений на ось Х  
var scaleX = d3.scale.linear()
            .domain([-100, 100])
            .range([0, xAxisLength]);
             
// функция интерполяции значений на ось Y
var scaleY = d3.scale.linear()
            .domain([100, -100])
            .range([0, yAxisLength]);    

var ticks = document.getElementById('customRange3').value;         
// создаем ось X   
var xAxis = d3.svg.axis()
             .scale(scaleX)
             .orient("bottom")
             .ticks(ticks);
// создаем ось Y             
var yAxis = d3.svg.axis()
             .scale(scaleY)
             .orient("left")
             .ticks(document.getElementById('customRange3').value);

function zoom(){
  ticks = document.getElementById('customRange3').value;    
  svg.select('.x-axis').transition().call(xAxis.ticks(ticks));
  svg.select('.y-axis').transition().call(yAxis.ticks(ticks));
  d3.selectAll("grid-line").remove();
  draw_vartical_lines();
  draw_horisontal_lines();
}
           
svg.append("g")       
     .attr("class", "x-axis")
     .attr("transform",  // сдвиг оси вниз и вправо
         "translate(" + margin + "," + height/2 + ")")
    .call(xAxis);
             
svg.append("g")       
    .attr("class", "y-axis")
    .attr("transform", // сдвиг оси вниз и вправо на margin
            "translate(" + width/2 + "," + margin + ")")
    .call(yAxis);
 
function draw_vartical_lines(){
  // создаем набор вертикальных линий для сетки   
  d3.selectAll("g.x-axis g.tick")
      .append("line") // добавляем линию
      .classed("grid-line", true) // добавляем класс
      .attr("x1", 0)
      .attr("y1", width/2 - margin)
      .attr("x2", 0)
      .attr("y2", - (yAxisLength-width/2 + margin));
}

draw_vartical_lines();

function draw_horisontal_lines(){
  // рисуем горизонтальные линии 
  d3.selectAll("g.y-axis g.tick")
      .append("line")
      .classed("grid-line", true)
      .attr("x1", -(height/2-margin))
      .attr("y1", 0)
      .attr("x2", xAxisLength-(height/2-margin))
      .attr("y2", 0);
}    

draw_horisontal_lines();

function build_point(){
  let x = document.getElementById('x').value;
  let y = document.getElementById('y').value;
           
  svg.append("circle") 
          //.attr("transform", "translate(" + margin + 300 "," + margin +  ")")
          .attr("cx", scaleX(x) + margin)
          .attr("cy", scaleY(y) + margin)
          .attr("r", 2)
          .style("fill", "#007bff")
          .style("stroke", "#007bff")
          .style("stroke-width", "2");
}

function build_line(){
  x1 = document.getElementById('x1').value;
  y1 = document.getElementById('y1').value;
  x2 = document.getElementById('x2').value;
  y2 = document.getElementById('y2').value;

  svg.append("line")
    .attr("x1", scaleX(x1) + margin)
    .attr("y1", scaleY(y1) + margin)
    .attr("x2", scaleX(x2) + margin)
    .attr("y2", scaleY(y2) + margin)
    .attr("class", "notaxis")
    .style("fill", "none")
    .style("stroke", "#28a745")
    .style("stroke-width", "2");
}

function build_triangle(){
  x1 = document.getElementById('tr_x1').value;
  y1 = document.getElementById('tr_y1').value;
  x2 = document.getElementById('tr_x2').value;
  y2 = document.getElementById('tr_y2').value;
  x3 = document.getElementById('tr_x3').value;
  y3 = document.getElementById('tr_y3').value;

  poly = [{"x":x1, "y":y1},
        {"x":x2,"y":y2},
        {"x":x3,"y":y3}];

svg.selectAll("polygon")
    .data([poly])
  .enter().append("polygon")
    .attr("points",function(d) { 
        return d.map(function(d) {
            return [scaleX(d.x)+margin,scaleY(d.y)+margin].join(",");
        }).join(" ");
    })
    .style("fill", "none")
    .attr("stroke","#dc3545")
    .attr("stroke-width",2);
    //.attr("points", ""scaleX(x1) + margin","scaleY(y1) + margin scaleX(x2) + margin","scaleY(y2) + margin scaleX(x3) + margin","scaleY(y3) + margin"");
}

function apply_matrix(){
  let x11 = document.getElementById('11').value;
  let x12 = document.getElementById('12').value;
  let x13 = document.getElementById('13').value;
  let x21 = document.getElementById('21').value;
  let x22 = document.getElementById('22').value;
  let x23 = document.getElementById('23').value;

  var Matrix = [x11, x21, x12, x22, x13, x23];
  //point1[0].style.transform = matrix(1, 0, 0, 1, x13, 0);

  // Create the matrix3d style property from a matrix array
  function matrixArrayToCssMatrix(array) {
    return 'matrix(' + array.join(',') + ')';
  }
    
  // Grab the DOM element
  var lines = document.getElementsByClassName('notaxis');

  // Returns a result like: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 50, 100, 0, 1);"
  var matrixRule = matrixArrayToCssMatrix(Matrix);

  // Set the transform
  lines[0].style.transform = matrixRule;
}