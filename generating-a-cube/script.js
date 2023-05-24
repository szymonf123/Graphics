const vertexShaderTxt = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main()
    {
        fragColor = vertColor;
        gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    }
`

const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`
const mat4 = glMatrix.mat4;

const defaultColors = [
    // R, G, B

    // Top
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,

    // Left
    0.75, 0.25, 0.5,
    0.75, 0.25, 0.5,
    0.75, 0.25, 0.5,
    0.75, 0.25, 0.5,

    // Right
    0.25, 0.25, 0.75,
    0.25, 0.25, 0.75,
    0.25, 0.25, 0.75,
    0.25, 0.25, 0.75,

    // Front
    1.0, 0.0, 0.15,
    1.0, 0.0, 0.15,
    1.0, 0.0, 0.15,
    1.0, 0.0, 0.15,

    // Back
    0.0, 1.0, 0.15,
    0.0, 1.0, 0.15,
    0.0, 1.0, 0.15,
    0.0, 1.0, 0.15,

    // Bottom
    0.5, 0.5, 0.0,
    0.5, 0.5, 1.0,
    0.5, 0.5, 1.0,
    0.5, 0.5, 1.0
];

const boxVertices = function(side) {
    return [
        // X, Y, Z
        // Top
        -side / 2, side / 2, -side / 2,   
        -side / 2, side / 2, side / 2,    
        side / 2, side / 2, side / 2,     
        side / 2, side / 2, -side / 2,    

        // Left
        -side / 2, side / 2, side / 2,    
        -side / 2, -side / 2, side / 2,   
        -side / 2, -side / 2, -side / 2,  
        -side / 2, side / 2, -side / 2,   

        // Right
        side / 2, side / 2, side / 2,     
        side / 2, -side / 2, side / 2,    
        side / 2, -side / 2, -side / 2,   
        side / 2, side / 2, -side / 2,    

        // Front
        side / 2, side / 2, side / 2,     
        side / 2, -side / 2, side / 2,    
        -side / 2, -side / 2, side / 2,   
        -side / 2, side / 2, side / 2,    

        // Back
        side / 2, side / 2, -side / 2,    
        side / 2, -side / 2, -side / 2,   
        -side / 2, -side / 2, -side / 2,  
        -side / 2, side / 2, -side / 2,   

        // Bottom
        -side / 2, -side / 2, -side / 2,  
        -side / 2, -side / 2, side / 2,   
        side / 2, -side / 2, side / 2,    
        side / 2, -side / 2, -side / 2,   
    ];
}

const Cube = function (side, colors = defaultColors) {
    const canvas = document.getElementById("main-canvas");
    // console.log(canvas);
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert('no webgl');
    }

    gl.clearColor(0.5, 0.4, 0.7, 1.0);   // R,G,B, opacity
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vertexShader));
    }
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.detachShader(program, vertexShader); //https://www.khronos.org/opengl/wiki/Shader_Compilation#Before_linking
    gl.detachShader(program, fragmentShader);
 
    gl.validateProgram(program);

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];
    const boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices(side)), gl.STATIC_DRAW); // since everything in JS is 64 bit floating point we need to convert to 32 bits

    const cubeVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW); 

    const posAttrLocation = gl.getAttribLocation(program, 'vertPosition');
    const colorAttrLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        posAttrLocation,
        3, // number of elements per attribute
        gl.FLOAT,
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); // since everything in JS is 64 bit floating point we need to convert to 32 bits

    gl.vertexAttribPointer(
        colorAttrLocation,    // attribute location
        3,// number of elements per attribute
        gl.FLOAT,// type of elements
        gl.FALSE,// if data is normalized
        3 * Float32Array.BYTES_PER_ELEMENT,// Size of individual vertex
        0// offset from the beginnning  of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(posAttrLocation);
    gl.enableVertexAttribArray(colorAttrLocation);

    gl.useProgram(program);

    const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    let worldMatrix = mat4.create();
    let viewMatrix = mat4.create();
    let projMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0,0,-8], [0,0,0], [0,1,0]);
    mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    let identityMatrix = mat4.create(); 
    let angle = 0
    const loop = function () {
        angle = performance.now() / 1000 / 8 * 2 * Math.PI;

        mat4.rotate(worldMatrix, identityMatrix, angle, [2,1,0]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

} 
