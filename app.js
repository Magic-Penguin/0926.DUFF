"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("can3D");
  const site = document.getElementById("site");

  if (!canvas) return;

  const showFallback = () => {
    const fallback = document.createElement("div");
    fallback.className = "can-fallback";
    fallback.textContent = "DUFF BEER";
    canvas.replaceWith(fallback);
  };

  if (typeof BABYLON === "undefined") {
    showFallback();
    return;
  }

  // The site starts hidden behind the age gate. Wait until it is visible
  // before Babylon measures the canvas, otherwise the render surface can
  // initialize at 0 x 0 and the can will not appear.
  const init = () => {
    if (canvas.dataset.initialized === "true") return;
    if (site && site.hidden) return;

    canvas.dataset.initialized = "true";

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
      Math.PI / 2,
      8,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.lowerRadiusLimit = 8;
    camera.upperRadiusLimit = 8;
    camera.lowerBetaLimit = Math.PI / 2;
    camera.upperBetaLimit = Math.PI / 2;

    new BABYLON.HemisphericLight(
      "ambientLight",
      new BABYLON.Vector3(0, 1, 0),
      scene
    ).intensity = 1.2;

    const keyLight = new BABYLON.DirectionalLight(
      "keyLight",
      new BABYLON.Vector3(-0.5, -1, -1),
      scene
    );
    keyLight.intensity = 2;
    keyLight.position = new BABYLON.Vector3(4, 6, -8);

    const can = BABYLON.MeshBuilder.CreateCylinder("duffCan", {
      height: 4.8,
      diameter: 2.9,
      tessellation: 96
    }, scene);

    const material = new BABYLON.StandardMaterial("duffCanMaterial", scene);
    material.diffuseColor = new BABYLON.Color3(0.88, 0.03, 0.06);
    material.specularColor = new BABYLON.Color3(1, 1, 1);
    material.specularPower = 96;

    const label = new BABYLON.DynamicTexture(
      "duffLabel",
      { width: 2048, height: 1024 },
      scene,
      true
    );
    const ctx = label.getContext();

    const gradient = ctx.createLinearGradient(0, 0, 2048, 0);
    gradient.addColorStop(0, "#76070c");
    gradient.addColorStop(0.2, "#e51c23");
    gradient.addColorStop(0.5, "#ff343b");
    gradient.addColorStop(0.8, "#e51c23");
    gradient.addColorStop(1, "#76070c");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 1024);

    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 28;
    ctx.beginPath();
    ctx.ellipse(1024, 490, 570, 285, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#111";
    ctx.font = "900 300px Arial Black, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Duff", 1024, 435);

    ctx.fillStyle = "#fff";
    ctx.font = "900 125px Arial Black, Arial, sans-serif";
    ctx.fillText("BEER", 1024, 720);

    label.update();
    material.diffuseTexture = label;
    can.material = material;

    const metal = new BABYLON.StandardMaterial("metal", scene);
    metal.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
    metal.specularColor = new BABYLON.Color3(1, 1, 1);
    metal.specularPower = 128;

    const top = BABYLON.MeshBuilder.CreateCylinder("canTop", {
      height: 0.1,
      diameter: 2.72,
      tessellation: 96
    }, scene);
    top.position.y = 2.42;
    top.material = metal;

    const bottom = top.clone("canBottom");
    bottom.position.y = -2.42;

    const tab = BABYLON.MeshBuilder.CreateTorus("pullTab", {
      diameter: 0.82,
      thickness: 0.1,
      tessellation: 48
    }, scene);
    tab.position.y = 2.49;
    tab.scaling.y = 0.52;
    tab.rotation.x = Math.PI / 2;
    tab.material = metal;

    const opening = BABYLON.MeshBuilder.CreateCylinder("opening", {
      height: 0.03,
      diameter: 0.48,
      tessellation: 64
    }, scene);
    opening.position.y = 2.475;

    const openingMaterial = new BABYLON.StandardMaterial("openingMaterial", scene);
    openingMaterial.diffuseColor = new BABYLON.Color3(0.02, 0.02, 0.02);
    opening.material = openingMaterial;

    const parts = [can, top, bottom, tab, opening];
    let angle = 0;

    // Force a correct size now that the parent is visible.
    engine.resize();

    engine.runRenderLoop(() => {
      angle += engine.getDeltaTime() * (Math.PI * 2 / 16000);
      parts.forEach((part) => {
        part.rotation.y = angle;
      });
      scene.render();
    });

    window.addEventListener("resize", () => engine.resize());
  };

  init();

  if (site) {
    const observer = new MutationObserver(init);
    observer.observe(site, {
      attributes: true,
      attributeFilter: ["hidden"]
    });
  }
});
