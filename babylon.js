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

    // Soft studio lighting matched to the site's flat yellow/red/black palette.
    const ambient = new BABYLON.HemisphericLight(
      "duffAmbient",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    ambient.intensity = 1.35;
    ambient.diffuse = new BABYLON.Color3(1, 0.96, 0.9);
    ambient.groundColor = new BABYLON.Color3(0.32, 0.25, 0.18);

    const key = new BABYLON.DirectionalLight(
      "duffKey",
      new BABYLON.Vector3(-0.35, -0.2, -1),
      scene
    );
    key.intensity = 1.15;
    key.diffuse = new BABYLON.Color3(1, 0.9, 0.78);

    const fill = new BABYLON.DirectionalLight(
      "duffFill",
      new BABYLON.Vector3(0.65, -0.1, 0.8),
      scene
    );
    fill.intensity = 0.5;
    fill.diffuse = new BABYLON.Color3(1, 0.82, 0.68);

    /*
     * Main body.
     * A taller, slimmer proportion makes the silhouette read as a classic
     * beer can rather than a short soft-drink can.
     */
    const can = BABYLON.MeshBuilder.CreateCylinder(
      "duffCan",
      {
        height: 5.2,
        diameter: 2.58,
        tessellation: 128
      },
      scene
    );

    const canMaterial = new BABYLON.StandardMaterial(
      "duffCanMaterial",
      scene
    );

    canMaterial.diffuseColor = new BABYLON.Color3(0.94, 0.055, 0.075);
    canMaterial.emissiveColor = new BABYLON.Color3(0.08, 0.008, 0.012);
    canMaterial.specularColor = new BABYLON.Color3(0.72, 0.72, 0.72);
    canMaterial.specularPower = 220;

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
    label.uScale = -1;
    label.uOffset = 1;

    canMaterial.diffuseTexture = label;
    canMaterial.backFaceCulling = true;
    can.material = canMaterial;

    /*
     * Aluminum lids are slightly smaller than the body, creating the
     * unmistakable recessed shoulder of a modern beer can.
     */
    const metal = new BABYLON.StandardMaterial("duffMetal", scene);
    metal.diffuseColor = new BABYLON.Color3(0.86, 0.86, 0.86);
    metal.specularColor = new BABYLON.Color3(1, 1, 1);
    metal.specularPower = 180;

    const top = BABYLON.MeshBuilder.CreateCylinder(
      "duffCanTop",
      {
        height: 0.1,
        diameter: 2.38,
        tessellation: 128
      },
      scene
    );
    top.position.y = 2.62;
    top.material = metal;

    const bottom = top.clone("duffCanBottom");
    bottom.position.y = -2.62;

    const topShoulder = BABYLON.MeshBuilder.CreateTorus(
      "duffTopShoulder",
      {
        diameter: 2.43,
        thickness: 0.12,
        tessellation: 128
      },
      scene
    );
    topShoulder.position.y = 2.56;
    topShoulder.material = metal;

    const bottomShoulder = topShoulder.clone("duffBottomShoulder");
    bottomShoulder.position.y = -2.56;

    const topRim = BABYLON.MeshBuilder.CreateTorus(
      "duffTopRim",
      {
        diameter: 2.28,
        thickness: 0.055,
        tessellation: 128
      },
      scene
    );
    topRim.position.y = 2.68;
    topRim.material = metal;

    const bottomRim = topRim.clone("duffBottomRim");
    bottomRim.position.y = -2.68;

    /*
     * Pull tab and opening.
     */
    const tab = BABYLON.MeshBuilder.CreateTorus(
      "duffPullTab",
      {
        diameter: 0.74,
        thickness: 0.09,
        tessellation: 64
      },
      scene
    );

    tab.position.y = 2.71;
    tab.rotation.x = Math.PI / 2;
    tab.scaling.y = 0.52;
    tab.material = metal;

    const opening = BABYLON.MeshBuilder.CreateCylinder(
      "duffOpening",
      {
        height: 0.03,
        diameter: 0.43,
        tessellation: 64
      },
      scene
    );

    opening.position.y = 2.695;

    const openingMaterial = new BABYLON.StandardMaterial(
      "duffOpeningMaterial",
      scene
    );

    openingMaterial.diffuseColor = new BABYLON.Color3(0.02, 0.02, 0.02);
    opening.material = openingMaterial;

    /*
     * Everything is grouped together so the complete can spins as one.
     */
    const canParts = [
      can,
      top,
      bottom,
      topShoulder,
      bottomShoulder,
      topRim,
      bottomRim,
      tab,
      opening
    ];

    const canRoot = new BABYLON.TransformNode("duffCanRoot", scene);

    canParts.forEach((part) => {
      part.parent = canRoot;
    });

    let rotation = 0;
    let bounceTime = 0;
    let introComplete = false;
    const introDuration = 1200;
    const startY = -2.8;
    const finalY = 0;

    canRoot.position.y = startY;
    canRoot.scaling.setAll(0.82);

    function resize() {
      engine.resize();
    }

    resize();

    engine.runRenderLoop(() => {
      const dt = engine.getDeltaTime();
      bounceTime += dt;

      if (!introComplete) {
        const t = Math.min(bounceTime / introDuration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const bounce = Math.sin(t * Math.PI * 3) * (1 - t) * 0.55;
        canRoot.position.y = BABYLON.Scalar.Lerp(startY, finalY, eased) + bounce;

        const scale =
          0.82 +
          0.18 * eased +
          Math.sin(t * Math.PI * 3) * (1 - t) * 0.035;

        canRoot.scaling.setAll(scale);

        rotation += dt * (Math.PI * 2 / 9000);

        if (t >= 1) {
          introComplete = true;
          canRoot.position.y = finalY;
          canRoot.scaling.setAll(1);
        }
      } else {
        rotation += dt * (Math.PI * 2 / 12000);
      }

      canRoot.rotation.y = rotation;
      scene.render();
    });

    window.addEventListener("resize", resize);
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
