import { useEffect, useRef } from "react";
import { TResource } from "../types";
import {
  ArcFollowCamera,
  ArcRotateCamera,
  BoundingInfo,
  Color3,
  DracoCompression,
  Engine,
  FramingBehavior,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";

import "@babylonjs/loaders/glTF";
import { Button } from "@chakra-ui/react";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

let engine: Engine;
let scene: Scene;
let camera: ArcRotateCamera;

DracoCompression.DefaultNumWorkers = 0;

DracoCompression.Configuration = {
  decoder: {
    wasmUrl: "/libs/draco_wasm_wrapper_gltf.js",
    wasmBinaryUrl: "/libs/draco_decoder_gltf.wasm",
    fallbackUrl: "/libs/draco_decoder_gltf.js",
  },
};

export const Model3D = ({ item }: { item: TResource }) => {
  const containerRef = useRef<HTMLCanvasElement | null>(null);

  const startDebugger = () => {
    scene.debugLayer.show({
      embedMode: true
    });
  };

  const loadModel = () => {
    SceneLoader.LoadAssetContainer(item.url, "", scene, (assets) => {
      scene.rootNodes.forEach((node) => {
        if (node.name === "__root__") {
          node.dispose();
        }
      });

      assets.addAllToScene();

      camera.upperAlphaLimit = null;

      camera.alpha += Math.PI;

      // Enable camera's behaviors
      camera.useFramingBehavior = true;

      const framingBehavior = camera.getBehaviorByName(
        "Framing"
      ) as FramingBehavior;
      framingBehavior.framingTime = 0;
      framingBehavior.elevationReturnTime = -1;

      const worldExtends = scene.getWorldExtends(function (mesh) {
        return (
          mesh.isVisible &&
          mesh.isEnabled() &&
          !mesh.name.startsWith("Background")
        );
      });

      framingBehavior.zoomOnBoundingInfo(worldExtends.min, worldExtends.max);

      const boundingInfo = new BoundingInfo(worldExtends.min, worldExtends.max);

      const size = boundingInfo.boundingBox.extendSize;
      camera.minZ =
        Math.min(Math.abs(size.x), Math.abs(size.z), Math.abs(size.y)) / 10;

      camera.useAutoRotationBehavior = true;
    });
  };

  useEffect(() => {
    if (containerRef.current) {
      engine = new Engine(containerRef.current, true, {
        loseContextOnDispose: true,
      });
      scene = new Scene(engine);

      engine.setSize(
        containerRef.current.parentElement.clientWidth,
        containerRef.current.parentElement.clientHeight
      );

      camera = new ArcRotateCamera("Camera", 0, 0, 10, new Vector3());
      // Targets the camera to scene origin
      camera.setTarget(Vector3.Zero());
      // Attaches the camera to the canvas
      camera.attachControl(containerRef.current, true);

      const helper = scene.createDefaultEnvironment({
        skyboxSize: 1e3,
        groundSize: 1e3,
      });

      helper.setMainColor(Color3.Teal());

      //   loadModel();

      engine.runRenderLoop(() => {
        scene.render();
      });

      const onResize = () => {
        engine.resize();
      };

      window.addEventListener("resize", onResize);

      return () => {
        engine.dispose();
        engine = null;

        window.removeEventListener("resize", onResize);
      };
    }
  }, []);

  useEffect(() => {
    if (!engine) return;

    loadModel();
  }, [item]);

  return (
    <>
      <canvas width="100%" height="100%" ref={containerRef}></canvas>
      <Button
        position="absolute"
        right="10px"
        bottom="10px"
        colorScheme="teal"
        size="xs"
        onClick={startDebugger}
      >
        debugger
      </Button>
    </>
  );
};
