"use strict";

/*
 * DUFF 3D CAN
 * This file contains the Babylon.js scene for the hero can.
 * Babylon itself is loaded by index.html before this file.
 */

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("can3D");
  const site = document.getElementById("site");

  if (!canvas || typeof BABYLON === "undefined") return;

  let started = false;

  function createDuffCan() {
    if (started || (site && site.hidden)) return;
    started = true;

    const engine = new BABYLON.Engine(canvas, true, {
      antialias: true,
      preserveDrawingBuffer: true,
      stencil: true
    });

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    /*
     * Camera is deliberately close enough that the can fills the hero
     * without being clipped.
     */
    const camera = new BABYLON.ArcRotateCamera(
      "duffCamera",
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
    camera.fov = 0.72;

    const ambient = new BABYLON.HemisphericLight(
      "duffAmbient",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    ambient.intensity = 1.15;

    const key = new BABYLON.DirectionalLight(
      "duffKey",
      new BABYLON.Vector3(-0.5, -1, -1),
      scene
    );
    key.position = new BABYLON.Vector3(4, 6, -8);
    key.intensity = 2.1;

    const rim = new BABYLON.PointLight(
      "duffRim",
      new BABYLON.Vector3(-4, 1, 5),
      scene
    );
    rim.diffuse = new BABYLON.Color3(1, 0.32, 0.22);
    rim.intensity = 12;

    const fill = new BABYLON.PointLight(
      "duffFill",
      new BABYLON.Vector3(4, 2, -4),
      scene
    );
    fill.diffuse = new BABYLON.Color3(1, 0.65, 0.55);
    fill.intensity = 7;

    /*
     * Main can body.
     */
    const can = BABYLON.MeshBuilder.CreateCylinder(
      "duffCan",
      {
        height: 4.8,
        diameter: 2.9,
        tessellation: 128
      },
      scene
    );

    const canMaterial = new BABYLON.StandardMaterial(
      "duffCanMaterial",
      scene
    );

    canMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.16, 0.18);
    canMaterial.emissiveColor = new BABYLON.Color3(0.16, 0.01, 0.015);
    canMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
    canMaterial.specularPower = 96;

    /*
     * Duff label texture painted directly onto the cylinder.
     */
    const label = new BABYLON.DynamicTexture(
      "duffLabel",
      { width: 2048, height: 1024 },
      scene,
      true
    );

    const ctx = label.getContext();
    const width = 2048;
    const height = 1024;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#65070c");
    gradient.addColorStop(0.12, "#b20e17");
    gradient.addColorStop(0.3, "#ed1c24");
    gradient.addColorStop(0.5, "#ff3940");
    gradient.addColorStop(0.7, "#ed1c24");
    gradient.addColorStop(0.88, "#b20e17");
    gradient.addColorStop(1, "#65070c");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 30;

    ctx.beginPath();
    ctx.ellipse(
      width / 2,
      height / 2 - 25,
      570,
      285,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#111111";
    ctx.font = "900 300px Arial Black, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Duff", width / 2, height / 2 - 55);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 124px Arial Black, Arial, sans-serif";
    ctx.fillText("BEER", width / 2, height / 2 + 220);

    label.update();

    // Babylon cylinder UVs wrap the texture in the opposite direction.
    // Flip the texture horizontally so the Duff lettering reads normally.
    label.uScale = -1;
    label.uOffset = 1;

    canMaterial.diffuseTexture = label;
    canMaterial.backFaceCulling = true;
    can.material = canMaterial;

    /*
     * Aluminum top and bottom.
     */
    const metal = new BABYLON.StandardMaterial("duffMetal", scene);
    metal.diffuseColor = new BABYLON.Color3(0.86, 0.86, 0.86);
    metal.specularColor = new BABYLON.Color3(1, 1, 1);
    metal.specularPower = 128;

    const top = BABYLON.MeshBuilder.CreateCylinder(
      "duffCanTop",
      {
        height: 0.1,
        diameter: 2.72,
        tessellation: 128
      },
      scene
    );

    top.position.y = 2.42;
    top.material = metal;

    const bottom = top.clone("duffCanBottom");
    bottom.position.y = -2.42;

    const topRim = BABYLON.MeshBuilder.CreateTorus(
      "duffTopRim",
      { diameter: 2.68, thickness: 0.055, tessellation: 128 },
      scene
    );
    topRim.position.y = 2.43;
    topRim.material = metal;

    const bottomRim = topRim.clone("duffBottomRim");
    bottomRim.position.y = -2.43;

    /*
     * Pull tab and opening.
     */
    const tab = BABYLON.MeshBuilder.CreateTorus(
      "duffPullTab",
      {
        diameter: 0.82,
        thickness: 0.1,
        tessellation: 64
      },
      scene
    );

    tab.position.y = 2.49;
    tab.rotation.x = Math.PI / 2;
    tab.scaling.y = 0.52;
    tab.material = metal;

    const opening = BABYLON.MeshBuilder.CreateCylinder(
      "duffOpening",
      {
        height: 0.03,
        diameter: 0.48,
        tessellation: 64
      },
      scene
    );

    opening.position.y = 2.475;

    const openingMaterial = new BABYLON.StandardMaterial(
      "duffOpeningMaterial",
      scene
    );

    openingMaterial.diffuseColor = new BABYLON.Color3(0.02, 0.02, 0.02);
    opening.material = openingMaterial;

    /*
     * Everything is grouped together so the complete can spins as one.
     * One complete revolution takes 16 seconds.
     */
    const canParts = [can, top, bottom, topRim, bottomRim, tab, opening];
    const canRoot = new BABYLON.TransformNode("duffCanRoot", scene);

    canParts.forEach((part) => {
      part.parent = canRoot;
    });

    let rotation = 0;

    function resize() {
      engine.resize();
    }

    /*
     * The age gate hides #site initially. Resize after it becomes visible.
     */
    resize();

    engine.runRenderLoop(() => {
      rotation += engine.getDeltaTime() * (Math.PI * 2 / 16000);
      canRoot.rotation.y = rotation;
      scene.render();
    });

    window.addEventListener("resize", resize);

    /*
     * Recalculate the Babylon canvas dimensions after the age gate closes.
     */
    requestAnimationFrame(resize);
    setTimeout(resize, 100);
  }

  createDuffCan();

  if (site) {
    const observer = new MutationObserver(createDuffCan);
    observer.observe(site, {
      attributes: true,
      attributeFilter: ["hidden"]
    });
  }
});
