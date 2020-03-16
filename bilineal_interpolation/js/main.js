var img_height = 200;
var img =  new Image();

function previewFile() {
  var preview = document.getElementById('img');
  var file    = document.getElementById('src').files[0];
  var reader  = new FileReader();

  reader.onloadend = function () {
    preview.src = reader.result;
    img.src = reader.result;
  }

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }
}

img.onload = function() {       
    function sketch(p) {
        var IMAGE_URL = document.getElementById("img").src;
        const APERTURE_SIZE = 20;
        const SCALEFACTOR = img_height/(APERTURE_SIZE*2);
        var im;
        var res;    

        var W = new Array(SCALEFACTOR);
        const S = SCALEFACTOR*SCALEFACTOR;
        for (var i=0; i<SCALEFACTOR; i++) {
            W[i] = new Array(SCALEFACTOR);
            for (var j=0; j<SCALEFACTOR; j++) {
                W[i][j] = {
                    a00: (SCALEFACTOR-1-j)*(SCALEFACTOR-1-i)/S,
                    a01: j*(SCALEFACTOR-1-i)/S,
                    a10: i*(SCALEFACTOR-1-j)/S,
                    a11: i*j/S
                };
            }
        }
        
        var aperture = {
            left: 0,
            top: 0,
            width: 1+2*APERTURE_SIZE,
            height: 1+2*APERTURE_SIZE
        };
        
        p.preload = function() {  
            im = p.loadImage(IMAGE_URL);                      
        }   
        
        p.setup = function() {      
            p.createP('<div class="contain-2">Aperture size: ' + aperture.width + 'x' + aperture.height + 'px<br>Scaling factor: x' + SCALEFACTOR+'</div>');
            
            p.createCanvas(window.screen.width, img_height);
            p.rectMode(p.CORNER);
            im.loadPixels();        
            res = p.createImage(aperture.width*SCALEFACTOR, aperture.height*SCALEFACTOR);
            p.textFont('Cambria');
            p.textSize(14);
            p.textAlign(p.LEFT, p.BASELINE);
        }
        
        p.draw = function() {       
            p.background(19,19,19);
            var k=img_height/im.height;
            im.resize(k*im.width, k*im.height);
            p.image(im, (window.screen.width-(2*img_height)-im.width-(img_height/2)-(img_height/4))/2, 0);  
            updateAperture();
            drawAperture();
            scanImage();
        }
        
        function updateAperture() {
            var mx = p.mouseX-(window.screen.width-(2*img_height)-im.width-(img_height/2)-(img_height/4))/2,
                    my = p.mouseY;
            var x1 = mx - APERTURE_SIZE,
                    y1 = my - APERTURE_SIZE,
                    x2 = mx + APERTURE_SIZE,
                    y2 = my + APERTURE_SIZE;
            if (x1 < 0) {
                x1 = 0;         
                x2 = x1 + 2*APERTURE_SIZE;
            }   
            if (y1 < 0) {
                y1 = 0;
                y2 = y1 + 2*APERTURE_SIZE;
            }
            if (x2 > im.width-1) {
                x2 = im.width-1;
                x1 = x2 - 2*APERTURE_SIZE;
            }
            if (y2 > im.height-1) {
                y2 = im.height-1;
                y1 = y2 - 2*APERTURE_SIZE;
            }
            aperture.left = x1;
            aperture.top = y1;
        }
        
        function drawAperture() {       
            p.strokeWeight(1);
            p.stroke(255);
            p.noFill();
            p.rect(aperture.left+(window.screen.width-(2*img_height)-im.width-(img_height/2)-(img_height/4))/2, aperture.top, aperture.width, aperture.height);
        }
        
        function scanImage() {
            const x1 = aperture.left;
            const y1 = aperture.top;
            const S = SCALEFACTOR*SCALEFACTOR;
                    
            p.noStroke();
            res.loadPixels();       
            for (var i=0; i<aperture.height-1; i++) {
                for (var j=0; j<aperture.width-1; j++) {
                    var idx = ((x1+j)+(y1+i)*im.width)<<2;              
                    var c = im.get(x1+j, y1+i);
                    p.fill(c);
                    p.rect(im.width+(window.screen.width-(2*img_height)-im.width-(img_height/2)-(img_height/4))/2+img_height/4+j*SCALEFACTOR, i*SCALEFACTOR, SCALEFACTOR, SCALEFACTOR);
                }
            }
            
            for (var i=0; i<aperture.height-1; i++) {
                for (var j=0; j<aperture.width-1; j++) {
                    var c00 = im.get(x1+j, y1+i);
                    var c01 = im.get(x1+j+1, y1+i);
                    var c10 = im.get(x1+j, y1+i+1);
                    var c11 = im.get(x1+j+1, y1+i+1);

                    for (var m=0; m<SCALEFACTOR; m++) {
                        var y = i*SCALEFACTOR + m;
                        for (var n=0; n<SCALEFACTOR; n++) {
                            var x = j*SCALEFACTOR + n;
                            var w = W[m][n];
                            var r = w.a00*c00[0] + w.a01*c01[0] + w.a10*c10[0] + w.a11*c11[0];
                            var g = w.a00*c00[1] + w.a01*c01[1] + w.a10*c10[1] + w.a11*c11[1];
                            var b = w.a00*c00[2] + w.a01*c01[2] + w.a10*c10[2] + w.a11*c11[2];                      
                            res.set(x, y, p.color(r, g, b, 255));
                        }
                    }
                }
            }
            res.updatePixels();
            p.image(res, im.width+(window.screen.width-(2*img_height)-im.width-(img_height/2)-(img_height/4))/2+img_height/2+aperture.width*SCALEFACTOR, 0);
        }
    }
    var app = new p5(sketch);

}