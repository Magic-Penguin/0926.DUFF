"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("can3D");
  if (!canvas) return;

  const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
  if (!gl) {
    canvas.outerHTML = '<div class="can-fallback" role="img" aria-label="Duff Beer can">DUFF BEER</div>';
    return;
  }

  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aUV;
    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    varying vec3 vNormal;
    varying vec2 vUV;
    varying vec3 vPosition;

    void main() {
      vec4 worldPosition = uModel * vec4(aPosition, 1.0);
      vPosition = worldPosition.xyz;
      vNormal = mat3(uModel) * aNormal;
      vUV = aUV;
      gl_Position = uProjection * uView * worldPosition;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    varying vec3 vNormal;
    varying vec2 vUV;
    varying vec3 vPosition;
    uniform sampler2D uTexture;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDirection = normalize(vec3(-0.7, 0.9, 1.2));
      float diffuse = max(dot(normal, lightDirection), 0.0);
      float ambient = 0.35;
      vec4 textureColor = texture2D(uTexture, vUV);
      vec3 lit = textureColor.rgb * (ambient + diffuse * 0.75);
      gl_FragColor = vec4(lit, textureColor.a);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  function createProgram(vertexSource, fragmentSource) {
    const program = gl.createProgram();
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }
    return program;
  }

  const program = createProgram(vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  const segments = 96;
  const radius = 1.45;
  const height = 4.7;
  const vertices = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let y = 0; y <= 1; y++) {
    const py = (y - 0.5) * height;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2;
      vertices.push(Math.cos(angle) * radius, py, Math.sin(angle) * radius);
      normals.push(Math.cos(angle), 0, Math.sin(angle));
      uvs.push(t, y);
    }
  }

  for (let i = 0; i < segments; i++) {
    const a = i;
    const b = i + 1;
    const c = segments + 1 + i;
    const d = segments + 1 + i + 1;
    indices.push(a, c, b, b, c, d);
  }

  function addCap(y, normalY) {
    const centerIndex = vertices.length / 3;
    vertices.push(0, y, 0);
    normals.push(0, normalY, 0);
    uvs.push(0.5, 0.5);

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2;
      vertices.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      normals.push(0, normalY, 0);
      uvs.push(Math.cos(angle) * 0.5 + 0.5, Math.sin(angle) * 0.5 + 0.5);
    }

    const ringStart = centerIndex + 1;
    for (let i = 0; i < segments; i++) {
      const a = ringStart + i;
      const b = ringStart + i + 1;
      if (normalY > 0) indices.push(centerIndex, a, b);
      else indices.push(centerIndex, b, a);
    }
  }

  addCap(height / 2, 1);
  addCap(-height / 2, -1);

  function bufferData(target, data, size) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, new Float32Array(data), gl.STATIC_DRAW);
    return buffer;
  }

  const positionBuffer = bufferData(gl.ARRAY_BUFFER, vertices, 3);
  const normalBuffer = bufferData(gl.ARRAY_BUFFER, normals, 3);
  const uvBuffer = bufferData(gl.ARRAY_BUFFER, uvs, 2);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  function bindAttribute(name, buffer, size) {
    const location = gl.getAttribLocation(program, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }

  bindAttribute("aPosition", positionBuffer, 3);
  bindAttribute("aNormal", normalBuffer, 3);
  bindAttribute("aUV", uvBuffer, 2);

  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1024;
  textureCanvas.height = 512;
  const ctx = textureCanvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, textureCanvas.width, 0);
  gradient.addColorStop(0, "#65070c");
  gradient.addColorStop(0.12, "#b20e17");
  gradient.addColorStop(0.32, "#ed1c24");
  gradient.addColorStop(0.5, "#ff3a40");
  gradient.addColorStop(0.68, "#ed1c24");
  gradient.addColorStop(0.88, "#b20e17");
  gradient.addColorStop(1, "#65070c");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.ellipse(512, 250, 275, 135, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#111111";
  ctx.font = "900 150px Arial Black, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Duff", 512, 235);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 62px Arial Black, Arial, sans-serif";
  ctx.letterSpacing = "8px";
  ctx.fillText("BEER", 512, 365);

  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(300, 0, 95, 512);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const modelLocation = gl.getUniformLocation(program, "uModel");
  const viewLocation = gl.getUniformLocation(program, "uView");
  const projectionLocation = gl.getUniformLocation(program, "uProjection");
  const textureLocation = gl.getUniformLocation(program, "uTexture");

  function matrixPerspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0
    ]);
  }

  function matrixLookAt() {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, -8.2, 1
    ]);
  }

  function matrixRotateY(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Float32Array([
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ]);
  }

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.floor(canvas.clientWidth * ratio);
    const height = Math.floor(canvas.clientHeight * ratio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  const projection = matrixPerspective(Math.PI / 4.5, canvas.width / canvas.height, 0.1, 100);
  const view = matrixLookAt();
  let angle = 0;
  let last = performance.now();

  function render(now) {
    resize();
    const delta = Math.min((now - last) / 1000, 0.05);
    last = now;
    angle += delta * (Math.PI * 2 / 16);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(program);
    gl.uniformMatrix4fv(modelLocation, false, matrixRotateY(angle));
    gl.uniformMatrix4fv(viewLocation, false, view);
    gl.uniformMatrix4fv(projectionLocation, false, projection);
    gl.uniform1i(textureLocation, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
});
