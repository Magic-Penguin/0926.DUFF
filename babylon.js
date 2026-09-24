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

    // Warm studio lighting keeps the metallic red/gold design integrated
    // with the yellow, red, and black visual language of the page.
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
     * Taller and slimmer than a soda can, with a substantial beer-can
     * silhouette and enough surface area for a more detailed wrap.
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
    canMaterial.emissiveColor = new BABYLON.Color3(0.055, 0.004, 0.006);
    canMaterial.specularColor = new BABYLON.Color3(0.72, 0.72, 0.72);
    canMaterial.specularPower = 220;

    /*
     * Rich beer-style wrap.
     *
     * The old design was mostly an empty red field. This version uses
     * layered gold bands, a cream center badge, black pin-striping,
     * secondary typography, and subtle bubbles so the can has visual
     * hierarchy all the way around the cylinder.
     */
    const label = new BABYLON.DynamicTexture(
      "duffLabel",
      { width: 2048, height: 2048 },
      scene,
      true
    );

    const ctx = label.getContext();
    const width = 2048;
    const height = 2048;

    // Deep red metallic-looking base.
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#52060a");
    gradient.addColorStop(0.08, "#8d0912");
    gradient.addColorStop(0.22, "#d3131d");
    gradient.addColorStop(0.42, "#ef2029");
    gradient.addColorStop(0.5, "#f52b32");
    gradient.addColorStop(0.58, "#ef2029");
    gradient.addColorStop(0.78, "#d3131d");
    gradient.addColorStop(0.92, "#8d0912");
    gradient.addColorStop(1, "#52060a");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle vertical can-print texture.
    ctx.globalAlpha = 0.12;
    for (let x = 0; x < width; x += 26) {
      ctx.fillStyle = x % 52 === 0 ? "#ffffff" : "#000000";
      ctx.fillRect(x, 0, 10, height);
    }
    ctx.globalAlpha = 1;

    // Gold rails near the top and bottom of the printed label.
    const gold = "#f6c72b";
    const darkGold = "#a86b05";

    ctx.fillStyle = darkGold;
    ctx.fillRect(0, 190, width, 34);
    ctx.fillRect(0, 1824, width, 34);

    ctx.fillStyle = gold;
    ctx.fillRect(0, 204, width, 20);
    ctx.fillRect(0, 1824, width, 20);

    // Black pinstripes give the wrap a more deliberate beer-label structure.
    ctx.fillStyle = "#151515";
    ctx.fillRect(0, 246, width, 14);
    ctx.fillRect(0, 1788, width, 14);

    // Central cream/white badge.
    ctx.fillStyle = "#fff5d1";
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.ellipse(
      width / 2,
      height / 2 - 20,
      760,
      430,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();

    // Gold inner badge border.
    ctx.strokeStyle = gold;
    ctx.lineWidth = 28;
    ctx.beginPath();
    ctx.ellipse(
      width / 2,
      height / 2 - 20,
      690,
      365,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    // Main Duff wordmark.
    ctx.fillStyle = "#111111";
    ctx.font = "900 350px Arial Black, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Duff", width / 2, height / 2 - 85);

    // Gold underline/crest detail.
    ctx.strokeStyle = "#c78a0b";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(590, height / 2 + 120);
    ctx.lineTo(1458, height / 2 + 120);
    ctx.stroke();

    // Secondary beer branding.
    ctx.fillStyle = "#111111";
    ctx.font = "900 108px Arial Black, Arial, sans-serif";
    ctx.fillText("PREMIUM LAGER", width / 2, height / 2 + 205);

    ctx.fillStyle = "#9a090f";
    ctx.font = "900 82px Arial Black, Arial, sans-serif";
    ctx.fillText("BREWED FOR THE BOLD", width / 2, height / 2 + 315);

    // Small star/crest marks around the badge.
    ctx.fillStyle = gold;
    ctx.font = "900 92px Arial Black, Arial, sans-serif";
    ctx.fillText("★", 470, height / 2 + 10);
    ctx.fillText("★", 1578, height / 2 + 10);

    // Subtle bubble field outside the main badge.
    ctx.globalAlpha = 0.24;
    for (let i = 0; i < 90; i++) {
      const x = 80 + ((i * 173) % 1880);
      const y = 300 + ((i * 97) % 1440);
      const radius = 3 + (i % 4) * 2;
      ctx.fillStyle = "#fff7c2";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    label.update();

    // Babylon cylinder UVs wrap the texture in the opposite direction.
    label.uScale = -1;
    label.uOffset = 1;

    canMaterial.diffuseTexture = label;
    canMaterial.backFaceCulling = true;
    can.material = canMaterial;

    /*
     * Aluminum lids.
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
     * Extra raised gold bands add physical depth to the printed design.
     */
    const accentMaterial = new BABYLON.StandardMaterial(
      "duffGoldAccent",
      scene
    );
    accentMaterial.diffuseColor = new BABYLON.Color3(0.96, 0.62, 0.06);
    accentMaterial.specularColor = new BABYLON.Color3(1, 0.92, 0.55);
    accentMaterial.specularPower = 160;

    const upperAccent = BABYLON.MeshBuilder.CreateTorus(
      "duffUpperGoldBand",
      {
        diameter: 2.59,
        thickness: 0.035,
        tessellation: 128
      },
      scene
    );
    upperAccent.position.y = 1.98;
    upperAccent.material = accentMaterial;

    const lowerAccent = upperAccent.clone("duffLowerGoldBand");
    lowerAccent.position.y = -1.98;

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
      opening,
      upperAccent,
      lowerAccent
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
