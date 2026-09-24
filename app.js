"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("can3D");
  if (!canvas || typeof BABYLON === "undefined") return;

  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    antialias: true
  });

  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.05,
    8.5,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, false);
  camera.lowerRadiusLimit = 8.5;
  camera.upperRadiusLimit = 8.5;
  camera.lowerBetaLimit = Math.PI / 2.05;
  camera.upperBetaLimit = Math.PI / 2.05;

  const light = new BABYLON.HemisphericLight(
    "ambientLight",
    new BABYLON.Vector3(-0.5, 1, -0.7),
    scene
  );
  light.intensity = 1.15;

  const keyLight = new BABYLON.DirectionalLight(
    "keyLight",
    new BABYLON.Vector3(-0.5, -1, -1),
    scene
  );
  keyLight.position = new BABYLON.Vector3(4, 6, -8);
  keyLight.intensity = 1.6;

  const fillLight = new BABYLON.PointLight(
    "fillLight",
    new BABYLON.Vector3(-4, 1, 5),
    scene
  );
  fillLight.intensity = 18;

  const can = BABYLON.MeshBuilder.CreateCylinder("duffCan", {
    height: 4.7,
    diameter: 2.9,
    tessellation: 96,
    subdivisions: 2
  }, scene);

  can.position.y = 0;

  const material = new BABYLON.StandardMaterial("duffCanMaterial", scene);
  material.diffuseColor = new BABYLON.Color3(0.88, 0.04, 0.07);
  material.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
  material.specularPower = 96;
  material.roughness = 0.28;

  const labelTexture = new BABYLON.DynamicTexture(
    "duffLabel",
    { width: 2048, height: 1024 },
    scene,
    true
  );
  const ctx = labelTexture.getContext();
  const w = 2048;
  const h = 1024;

  const gradient = ctx.createLinearGradient(0, 0, w, 0);
  gradient.addColorStop(0, "#65070c");
  gradient.addColorStop(0.12, "#b20e17");
  gradient.addColorStop(0.32, "#ed1c24");
  gradient.addColorStop(0.5, "#ff3a40");
  gradient.addColorStop(0.68, "#ed1c24");
  gradient.addColorStop(0.88, "#b20e17");
  gradient.addColorStop(1, "#65070c");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 28;
  ctx.beginPath();
  ctx.ellipse(w / 2, h / 2 - 25, 550, 270, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#111";
  ctx.font = "900 300px Arial Black, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Duff", w / 2, h / 2 - 55);

  ctx.fillStyle = "#fff";
  ctx.font = "900 124px Arial Black, Arial, sans-serif";
  ctx.fillText("BEER", w / 2, h / 2 + 220);

  labelTexture.update();
  material.diffuseTexture = labelTexture;
  material.diffuseTexture.hasAlpha = false;
  material.backFaceCulling = true;
  can.material = material;

  const top = BABYLON.MeshBuilder.CreateCylinder("canTop", {
    height: 0.09,
    diameter: 2.72,
    tessellation: 96
  }, scene);
  top.position.y = 2.36;

  const metal = new BABYLON.StandardMaterial("metalTop", scene);
  metal.diffuseColor = new BABYLON.Color3(0.72, 0.72, 0.72);
  metal.specularColor = new BABYLON.Color3(1, 1, 1);
  metal.specularPower = 128;
  top.material = metal;

  const bottom = top.clone("canBottom");
  bottom.position.y = -2.36;

  const tab = BABYLON.MeshBuilder.CreateTorus("pullTab", {
    diameter: 0.82,
    thickness: 0.1,
    tessellation: 48
  }, scene);
  tab.position.y = 2.42;
  tab.rotation.x = Math.PI / 2;
  tab.scaling.y = 0.52;
  tab.material = metal;

  const opening = BABYLON.MeshBuilder.CreateCylinder("opening", {
    height: 0.025,
    diameter: 0.48,
    tessellation: 64
  }, scene);
  opening.position.y = 2.405;
  const openingMaterial = new BABYLON.StandardMaterial("openingMaterial", scene);
  openingMaterial.diffuseColor = new BABYLON.Color3(0.04, 0.04, 0.04);
  opening.material = openingMaterial;

  const canParts = [can, top, bottom, tab, opening];
  let angle = 0;

  engine.runRenderLoop(() => {
    angle += engine.getDeltaTime() * (Math.PI * 2 / 16000);
    canParts.forEach((part) => {
      part.rotation.y = angle;
    });
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
});
