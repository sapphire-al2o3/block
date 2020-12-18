const Display = (() => {
    'use strict';

    const VS =
        "attribute vec2 pos;" +
        "varying vec2 uv;" +
        "void main(){" +
        "uv=pos.xy*.5+.5;" +
        "gl_Position=vec4(pos.xy,.0,1.0);}";

    const FS =
        "precision mediump float;" +
        "varying vec2 uv;" +
        "uniform sampler2D tex;" +
        "uniform vec2 o;" +
        "void main(){" +
        "vec4 c=texture2D(tex,uv);" +
        "float r=texture2D(tex,uv+o).r;" +
        "float b=texture2D(tex,uv-o).b;" +
        "gl_FragColor=vec4(r,c.g,b,c.a);}";

    let gl;
    const buffer = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]);

    function createTexture() {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture;
    }

    function getShader(src, kind) {
        const s = gl.createShader(kind);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
    }

    function createShader(fs, vs) {
        const p = gl.createProgram();
        gl.attachShader(p, getShader(vs, gl.VERTEX_SHADER));
        gl.attachShader(p, getShader(fs, gl.FRAGMENT_SHADER));
        gl.linkProgram(p);
        return p;
    }

    function Display(context) {
        gl = context;
        
        this.width = gl.drawingBufferWidth;
        this.height = gl.drawingBufferHeight;
        this.quad = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
        
        this.program = createShader(FS, VS);
        gl.useProgram(this.program);
        
        const loc = [];
        loc.push(gl.getUniformLocation(this.program, 'tex'));
        loc.push(gl.getUniformLocation(this.program, 'o'));
        this.loc = loc;
        
        var texture = createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.viewport(0, 0, this.width, this.height);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.clearColor(0, 0, 0, 255);

        this.timer = 0;
    }

    Display.prototype.shake = function(t, px, py) {
        this.timer = t * 1000;
        this.x = px;
        this.y = py;
    };

    Display.prototype.update = function(dt) {
        let x = 0,
            y = 0;
        if (this.timer > 0) {
            this.timer -= dt;
            const t = this.timer * 0.1;
            x = Math.sin(t) * this.x ^ 0;
            y = Math.sin(t) * this.y ^ 0;
        }
        gl.uniform2f(this.loc[1], x / this.width, y / this.height);
    };

    Display.prototype.draw = function(canvas) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.flush();
    };

    return Display;
})();