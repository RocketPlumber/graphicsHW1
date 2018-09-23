"use strict";
var gl; // global variable
var ut;
var vBuffer1, vBuffer2, vPosition;

window.onload = function init() {
            // Set up WebGL
            var canvas = document.getElementById("gl-canvas");
            gl = WebGLUtils.setupWebGL( canvas );
            if(!gl){alert("WebGL setup failed!");}
            
            // Clear canvas
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            // Load shaders and initialize attribute buffers
            var program = initShaders( gl, "vertex-shader", "fragment-shader" );
            gl.useProgram( program );
            
            // set up first buffer with verts for an offset pentagon
            var vertices1 = pentagon_vertices(0.2, 0.5);
            vBuffer1 = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer1);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices1), gl.STATIC_DRAW);
            
            //set up second buffer, centered pentagon
            var vertices2 = pentagon_vertices(0.2, 0);
            vBuffer2 = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2); 
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);

            // Do shader plumbing
            vPosition = gl.getAttribLocation(program, "vPosition");
            gl.enableVertexAttribArray(vPosition);

            //Draw first pentagon
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer1); //set appropriate buffer as current
            gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // uses currently bound buffer
            gl.drawArrays(gl.TRIANGLE_FAN,0,5);

            //Draw second pentagon
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2); //set appropriate buffer as current
            gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // uses currently bound buffer
            gl.drawArrays(gl.TRIANGLE_FAN,0,5);
            ut = gl.getUniformLocation(program, "t");
            requestAnimationFrame(render);
};
// function to return an array of vertices of pentagon for a TRIANGLE_FAN
function pentagon_vertices(radius, offset){
  var vertices = [];
  var r =radius;
  for(var t = 0; t <  2*Math.PI; t+=2*Math.PI/5){
    vertices.push(r*Math.cos(t)+offset, r*Math.sin(t)+offset);
  }
  return vertices
}

function render(now){
  requestAnimationFrame(render);
    // For drawing the first triangle, set t to a time-specific variable
  var t = 0.001*now;
  gl.uniform1f(ut,t);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer1); //set appropriate buffer as current
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // uses currently bound buffer
  gl.drawArrays(gl.TRIANGLE_FAN,0,5);

  //For drawing the second triangle, set t to a constant value
  t = 0.3;
  gl.uniform1f(ut,t);
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2); //set appropriate buffer as current
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // uses currently bound buffer
  gl.drawArrays(gl.TRIANGLE_FAN,0,5);
}
