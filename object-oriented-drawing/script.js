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

class World {
    #gl;
    #canvas;
    #backgroundColor;
    #program;

    #boxVertices;
    #colors;
    #boxIndices = null;

    #worldMatrix = mat4.create();
    #viewMatrix = mat4.create();
    #projMatrix = mat4.create();
    #matWorldUniformLocation;

    //we initialize basic fields in class World
    constructor(id, backgroundColor= [0.5, 0.4, 0.7]) {
        this.#canvas = document.getElementById(id);
        this.#gl = this.#canvas.getContext("webgl");
        this.#backgroundColor = backgroundColor;
        this.#program = this.#gl.createProgram();
        
        this.prepareBackground()
    }

    //we just prepare background by setting canvas color and clearing color bits 
    prepareBackground() {
        const gl= this.#gl;
        gl.clearColor(...this.#backgroundColor, 1.0);   // R,G,B, opacity
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
    }

    //we set the background color
    background(backgroundColor) {
        const gl= this.#gl;
        this.#backgroundColor = backgroundColor;
        gl.clearColor(...this.#backgroundColor, 1.0);   // R,G,B, opacity
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    //we load one given shader
    loadShader(shaderTxt, type) {
        let shader_type = null;
        const gl = this.#gl;
        if (type== 'VERTEX') {
            shader_type = gl.VERTEX_SHADER
            // this.verticeName = var_name;
        } else if (type== 'FRAGMENT') {
            shader_type = gl.FRAGMENT_SHADER
            // this.colorName = var_name;
        }
        const shader = gl.createShader(shader_type);   
        gl.shaderSource(shader, shaderTxt);
        gl.compileShader(shader);
        gl.attachShader(this.#program, shader);
    }

    //we prepare and load both shaders
    prepareShaders() {
        const gl = this.#gl;
        this.loadShader(vertexShaderTxt, 'VERTEX');
        this.loadShader(fragmentShaderTxt, 'FRAGMENT');
        gl.linkProgram(this.#program);
    }

    //we load parameters of the object
    loadObject(vertices, colors, indices=null) {
        this.#boxVertices = vertices;
        this.#colors = colors;
        this.#boxIndices = indices;
    }

    //we buffer objects and use program
    bufferObject(){
        const gl = this.#gl;

        const boxVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#boxVertices), gl.STATIC_DRAW); // since everything in JS is 64 bit floating point we need to convert to 32 bits

        const cubeVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.#boxIndices), gl.STATIC_DRAW); 

        const posAttrLocation = gl.getAttribLocation(this.#program, 'vertPosition');
        const colorAttrLocation = gl.getAttribLocation(this.#program, 'vertColor');
        gl.vertexAttribPointer(
            posAttrLocation,
            3, // number of elements per attribute
            gl.FLOAT,
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0,
        );

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#colors), gl.STATIC_DRAW); // since everything in JS is 64 bit floating point we need to convert to 32 bits

        gl.vertexAttribPointer(
            colorAttrLocation,    // attribute location
            3,// number of elements per attribute
            gl.FLOAT,// type of elements
            gl.FALSE,// if data is normalized
            3 * Float32Array.BYTES_PER_ELEMENT,// Size of individual vertex
            0 * Float32Array.BYTES_PER_ELEMENT,// offset from the beginnning  of a single vertex to this attribute
        );

        gl.enableVertexAttribArray(posAttrLocation);
        gl.enableVertexAttribArray(colorAttrLocation);

        gl.useProgram(this.#program);
    }

    //we can load world matrix, view matrix and projection matrix, in my implementation all these matrixes are id-matrixes by default; if user doesn't want to change it, he may not call this method
    loadMatrixes(world, view, proj){
        this.#worldMatrix = world;
        this.#viewMatrix = view;
        this.#projMatrix = proj;
    }

    //we load parameters of camera
    loadPerspective(camLoc, destPoint, camTop, fieldOfView, minLength, maxLength){
        const gl = this.#gl;
        const program = this.#program;

        mat4.lookAt(this.#viewMatrix, camLoc, destPoint, camTop);
        mat4.perspective(this.#projMatrix, glMatrix.glMatrix.toRadian(fieldOfView), this.#canvas.width / this.#canvas.height, minLength, maxLength);

        const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
        const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
        const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, this.#worldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, this.#viewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, this.#projMatrix);
    }

    //we finally draw the object
    //here something is wrong because the cube is drawn but it doesn't rotate
    draw(){
        let rotationMatrix = new Float32Array(16);
        let translationMatrix = new Float32Array(16);
        let angle = 0;
        const gl = this.#gl;
        const worldMatrix = this.#worldMatrix;
        const matWorldUniformLocation = this.#matWorldUniformLocation;
        const boxIndices = this.#boxIndices;

        const loop = () => {
    
            angle = performance.now() / 1000 / 8 * 2 * Math.PI;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
            mat4.fromRotation(rotationMatrix, angle, [2, 1, 0]);
            mat4.fromTranslation(translationMatrix, [2, -1, 0]);
            mat4.mul(worldMatrix, translationMatrix, rotationMatrix);   // RTFM
            gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
            gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
    
            requestAnimationFrame(loop);
        }

        requestAnimationFrame(loop);
    }
}

//I used these arrays when I call method loadObject()
var boxVertices = 
    [ // X, Y, Z         
        // Top
        -1.0, 1.0, -1.0,   
        -1.0, 1.0, 1.0,    
        1.0, 1.0, 1.0,    
        1.0, 1.0, -1.0,   
    
        // Left
        -1.0, 1.0, 1.0,    
        -1.0, -1.0, 1.0,  
        -1.0, -1.0, -1.0,  
        -1.0, 1.0, -1.0,   
    
        // Right
        1.0, 1.0, 1.0,  
        1.0, -1.0, 1.0,  
        1.0, -1.0, -1.0, 
        1.0, 1.0, -1.0,  
    
        // Front
        1.0, 1.0, 1.0,    
        1.0, -1.0, 1.0,    
        -1.0, -1.0, 1.0,   
        -1.0, 1.0, 1.0,    
    
        // Back
        1.0, 1.0, -1.0,   
        1.0, -1.0, -1.0,   
        -1.0, -1.0, -1.0,    
        -1.0, 1.0, -1.0,    
    
        // Bottom
        -1.0, -1.0, -1.0,  
        -1.0, -1.0, 1.0,    
        1.0, -1.0, 1.0,     
        1.0, -1.0, -1.0,    
    ];
    
    
    let colors = [
        // R, G, B
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
    
        0.75, 0.25, 0.5,
        0.75, 0.25, 0.5,
        0.75, 0.25, 0.5,
        0.75, 0.25, 0.5,
    
        0.25, 0.25, 0.75,
        0.25, 0.25, 0.75,
        0.25, 0.25, 0.75,
        0.25, 0.25, 0.75,
    
        1.0, 0.0, 0.15,
        1.0, 0.0, 0.15,
        1.0, 0.0, 0.15,
        1.0, 0.0, 0.15,
    
        0.0, 1.0, 0.15,
        0.0, 1.0, 0.15,
        0.0, 1.0, 0.15,
        0.0, 1.0, 0.15,
    
        0.5, 0.5, 1.0,
        0.5, 0.5, 1.0,
        0.5, 0.5, 1.0,
        0.5, 0.5, 1.0,
    ]

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

let world = new World('main-canvas', [0.5, 0.4, 0.7]);
world.loadObject(boxVertices, colors, boxIndices);
world.background([0,0,0]);
world.prepareShaders();
world.bufferObject();
//world.loadMatrixes(...); //not used because in my class these matrixes are initialized as identity matrixes
world.loadPerspective([0,0,-8], [0,0,0], [0,1,0], 45, 0.1, 1000.0);
world.draw();