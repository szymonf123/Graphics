const vertexShaderTxt = `
    precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    void main(){
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`

const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main(){
        gl_FragColor = vec4(fragColor, 1.0);
    }
`

const triangleColors = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];

const Triangle = function(){
    const canvas = document.getElementById("triangle");
    const ctx = canvas.getContext("webgl");
    if (!ctx){
        alert("Nie działa");
    }

    ctx.clearColor(0.5, 0.5, 0.9, 1.0);
    ctx.clear(ctx.COLOR_BUFFER_BIT);

    const vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
    const fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);

    ctx.shaderSource(vertexShader, vertexShaderTxt);
    ctx.shaderSource(fragmentShader, fragmentShaderTxt);
    ctx.compileShader(vertexShader);
    ctx.compileShader(fragmentShader);

    if (!ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS)){
        alert(ctx.getShaderInfoLog(vertexShader));
    }
    if (!ctx.getShaderParameter(fragmentShader, ctx.COMPILE_STATUS)){
        alert(ctx.getShaderInfoLog(fragmentShader));
    }

    const program = ctx.createProgram();
    ctx.attachShader(program, vertexShader);
    ctx.attachShader(program, fragmentShader);
    ctx.linkProgram(program);

    ctx.detachShader(program, vertexShader);
    ctx.detachShader(program, fragmentShader);
    ctx.validateProgram(program);

    let triangVert = [
        0.0, 0.5,       triangleColors[0], triangleColors[1], triangleColors[2],
        -0.5, -0.5,     triangleColors[3], triangleColors[4], triangleColors[5],
        0.5, -0.5,      triangleColors[6], triangleColors[7], triangleColors[8]
    ]
    const triangleVertexBufferObject = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, triangleVertexBufferObject);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(triangVert), ctx.STATIC_DRAW);

    const posAttrLocation = ctx.getAttribLocation(program, 'vertPosition');
    const colorAttrLocation = ctx.getAttribLocation(program, 'vertColor');

    ctx.vertexAttribPointer(
        posAttrLocation,
        2,
        ctx.FLOAT,
        ctx.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0,
    );
    ctx.vertexAttribPointer(
        colorAttrLocation,
        3,
        ctx.FLOAT,
        ctx.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT,
    );

    ctx.enableVertexAttribArray(posAttrLocation);
    ctx.enableVertexAttribArray(colorAttrLocation);
    ctx.useProgram(program);
    ctx.drawArrays(ctx.TRIANGLES, 0, 3);


}

const Square = function(){
    const canvas = document.getElementById("square");
    const ctx = canvas.getContext("webgl");
    if (!ctx){
        alert("Nie działa");
    }

    ctx.clearColor(0.5, 0.5, 0.9, 1.0);
    ctx.clear(ctx.COLOR_BUFFER_BIT);

    const vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
    const fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);

    ctx.shaderSource(vertexShader, vertexShaderTxt);
    ctx.shaderSource(fragmentShader, fragmentShaderTxt);
    ctx.compileShader(vertexShader);
    ctx.compileShader(fragmentShader);

    if (!ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS)){
        alert(ctx.getShaderInfoLog(vertexShader));
    }
    if (!ctx.getShaderParameter(fragmentShader, ctx.COMPILE_STATUS)){
        alert(ctx.getShaderInfoLog(fragmentShader));
    }

    const program = ctx.createProgram();
    ctx.attachShader(program, vertexShader);
    ctx.attachShader(program, fragmentShader);
    ctx.linkProgram(program);

    ctx.detachShader(program, vertexShader);
    ctx.detachShader(program, fragmentShader);
    ctx.validateProgram(program);

    let sqVert = [
        0.0, 0.0,       1.0, 0.0, 0.0,
        0.0, 0.5,       0.0, 1.0, 0.0,
        0.5, 0.5,       0.0, 0.0, 1.0,
        0.0, 0.0,       1.0, 0.0, 0.0,
        0.5, 0.0,       0.0, 1.0, 0.0,
        0.5, 0.5,       0.0, 0.0, 1.0
    ]
    const squareVertexBufferObject = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, squareVertexBufferObject);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(sqVert), ctx.STATIC_DRAW);

    const posAttrLocation = ctx.getAttribLocation(program, 'vertPosition');
    const colorAttrLocation = ctx.getAttribLocation(program, 'vertColor');

    ctx.vertexAttribPointer(
        posAttrLocation,
        2,
        ctx.FLOAT,
        ctx.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0,
    );
    ctx.vertexAttribPointer(
        colorAttrLocation,
        3,
        ctx.FLOAT,
        ctx.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT,
    );

    ctx.enableVertexAttribArray(posAttrLocation);
    ctx.enableVertexAttribArray(colorAttrLocation);
    ctx.useProgram(program);
    ctx.drawArrays(ctx.TRIANGLES, 0, 6);  
}

const Hexagon = function(){
    const canvas = document.getElementById("hexagon");
    const ctx = canvas.getContext("webgl");
    if (!ctx){
        alert("Nie działa");
    }

    ctx.clearColor(0.5, 0.5, 0.9, 1.0);
    ctx.clear(ctx.COLOR_BUFFER_BIT);

    const vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
    const fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);

    ctx.shaderSource(vertexShader, vertexShaderTxt);
    ctx.shaderSource(fragmentShader, fragmentShaderTxt);
    ctx.compileShader(vertexShader);
    ctx.compileShader(fragmentShader);

    if (!ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS)){
        alert(ctx.getShaderInfoLog(vertexShader));
    }
    if (!ctx.getShaderParameter(fragmentShader, ctx.COMPILE_STATUS)){
        alert(ctx.getShaderInfoLog(fragmentShader));
    }

    const program = ctx.createProgram();
    ctx.attachShader(program, vertexShader);
    ctx.attachShader(program, fragmentShader);
    ctx.linkProgram(program);

    ctx.detachShader(program, vertexShader);
    ctx.detachShader(program, fragmentShader);
    ctx.validateProgram(program);

    let hexVert = [
        0.0, 0.5,       1.0, 0.0, 0.0,
        0.5, 0.25,       0.0, 1.0, 0.0,
        0.5, -0.25,       0.0, 0.0, 1.0,
        0.0, -0.5,       0.0, 1.0, 1.0,
        -0.5, -0.25,       1.0, 0.0, 1.0,
        -0.5, 0.25,       1.0, 1.0, 0.0
    ]
    const hexVertexBufferObject = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, hexVertexBufferObject);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(hexVert), ctx.STATIC_DRAW);

    const posAttrLocation = ctx.getAttribLocation(program, 'vertPosition');
    const colorAttrLocation = ctx.getAttribLocation(program, 'vertColor');

    ctx.vertexAttribPointer(
        posAttrLocation,
        2,
        ctx.FLOAT,
        ctx.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0,
    );
    ctx.vertexAttribPointer(
        colorAttrLocation,
        3,
        ctx.FLOAT,
        ctx.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT,
    );

    ctx.enableVertexAttribArray(posAttrLocation);
    ctx.enableVertexAttribArray(colorAttrLocation);
    ctx.useProgram(program);
    ctx.drawArrays(ctx.TRIANGLE_FAN, 0, 6);  
}

const ChangeTriangleColors = function(){
    let i = 0;
    for (; i < 9; i++){
        if (triangleColors[i] == 0.0)
            triangleColors[i] = 1.0;
        else
            triangleColors[i] = 0.0;
    }
    Triangle();
}