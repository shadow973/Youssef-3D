import OrbitControlsView from "@estebanleclet/expo-three-orbit-controls";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import * as ExpoTHREE from "expo-three";
import React, { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import {
  AmbientLight,
  DirectionalLight,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  Spherical,
  Vector2,
  Vector3,
} from "three";
import { useFile } from "../../../hooks/useFile";
import { AnimationPlayer } from "./AnimationPlayer";
import { Controls } from "../controls";
import { useComponentWillUnmount } from "../../../hooks/useUnMount";
// import 'react-native-gesture-handler';
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Text, useWindowDimensions, View } from "react-native";
import { update } from "../../../store/slices/userSlices";
import { Button } from "../../../components";
import { useNavigation } from "@react-navigation/core";

const sphericalDelta = new Spherical();
const spherical = new Spherical();
const rotateEnd = new Vector2();
const rotateStart = new Vector2();
const rotateDelta = new Vector2();
const target = new Vector3();
const offset = new Vector3();
const minAzimuthAngle = -Infinity; // radians
const maxAzimuthAngle = Infinity; // radians
const minDistance = 0;
const maxDistance = Infinity;
const minPolarAngle = 0; // radians
const maxPolarAngle = Math.PI; // radians
const panOffset = new Vector3();
let scale = 1;
let zoomChanged = false;

const EPS = 0.000001;

export const SceneI = ({ route }: I_Scene) => {
  const { animationList, animationid, modelId, modelUrl } = route.params;
  const { file, scene: object } = useFile(modelUrl, modelId, true);
  const [ap, setAp] = useState(null);
  const [savedScene, setSavedScene] = useState(null);
  const [glContext, setGLContext] = useState<null | ExpoWebGLRenderingContext>(
    null
  );
  const [camera, setCamera] = useState<null | PerspectiveCamera>(null);
  const [savedMeshes, setSavedMeshes] = useState([]);
  const orbitRef = useRef(null);
  const { width: wWidth, height: hHeight } = useWindowDimensions();
  const { navigate } = useNavigation()

  // const gesture = Gesture.Manual();

  // const controls = orbitRef?.current?.getControls();
  // console.log("controls", controls);

  const updateRotation = (() => {
    if (!camera) return;
    const offset = new Vector3();
    const quat = new Quaternion().setFromUnitVectors(
      camera.up,
      new Vector3(0, 1, 0)
    );
    const quatInverse = quat.clone().invert();
    const lastPosition = new Vector3();
    const lastQuaternion = new Quaternion();

    return () => {
      const position = camera.position;
      offset.copy(position).sub(target);
      // rotate offset to "y-axis-is-up" space
      offset.applyQuaternion(quat);
      // angle from z-axis around y-axis
      spherical.setFromVector3(offset);

      spherical.theta += sphericalDelta.theta;
      spherical.phi += sphericalDelta.phi;
      // restrict theta to be between desired limits
      spherical.theta = Math.max(
        minAzimuthAngle,
        Math.min(maxAzimuthAngle, spherical.theta)
      );
      // restrict phi to be between desired limits
      spherical.phi = Math.max(
        minPolarAngle,
        Math.min(maxPolarAngle, spherical.phi)
      );
      spherical.makeSafe();
      spherical.radius *= scale;
      // restrict radius to be between desired limits
      spherical.radius = Math.max(
        minDistance,
        Math.min(maxDistance, spherical.radius)
      );
      // move target to panned location
      target.add(panOffset);
      offset.setFromSpherical(spherical);
      // rotate offset back to "camera-up-vector-is-up" space
      offset.applyQuaternion(quatInverse);
      position.copy(target).add(offset);
      camera.lookAt(target);
      sphericalDelta.set(0, 0, 0);
      panOffset.set(0, 0, 0);
      scale = 1;
      // update condition is:
      // min(camera displacement, camera rotation in radians)^2 > this.EPS
      // using small-angle approximation cos(x/2) = 1 - x^2 / 8
      // if (this.zoomChanged ||
      //     lastPosition.distanceToSquared(this.object.position) > EPS ||
      //     8 * (1 - lastQuaternion.dot(this.object.quaternion)) > EPS) {
      //     this.dispatchEvent(this.changeEvent);
      //     lastPosition.copy(this.object.position);
      //     lastQuaternion.copy(this.object.quaternion);
      //     this.zoomChanged = false;
      //     return true;
      // }

      if (
        // zoomChanged ||
        lastPosition.distanceToSquared(camera.position) > EPS ||
        8 * (1 - lastQuaternion.dot(camera.quaternion)) > EPS
      ) {
        // dispatchEvent(this.changeEvent);
        lastPosition.copy(camera.position);
        lastQuaternion.copy(camera.quaternion);
        // zoomChanged = false;
        return true;
      }
      return false;
    };
  })();

  const handleMouseMoveRotate = (clientX, clientY) => {
    console.log("camera position", camera?.position);
    rotateEnd.set(clientX, clientY);
    rotateDelta.clamp(rotateEnd, rotateStart).multiplyScalar(0.01);
    // const element =
    //   this.domElement === document ? this.domElement.body : this.domElement;
    rotateLeft((2 * Math.PI * rotateDelta.x) / hHeight); // yes, height
    rotateUp((2 * Math.PI * rotateDelta.y) / hHeight);
    rotateStart.copy(rotateEnd);
    // updateRotation();
  };

  function rotateLeft(angle: number) {
    sphericalDelta.theta -= angle;
  }

  function rotateUp(angle: number) {
    sphericalDelta.phi -= angle;
  }

  const moveCamera = (data: any) => {
    // console.log("onGestureEvent", data.nativeEvent, Object.keys(camera));
    console.log("moveCamera", data.nativeEvent);
    if (!camera) return;

    // so camera.up is the orbit axis
    handleMouseMoveRotate(
      data.nativeEvent.velocityX,
      data.nativeEvent.velocityY
    );
    updateRotation();
    // camera.lookAt(0, 0, 0);
    // camera.updateProjectionMatrix();
  };

  const manageZoom = (data) => {
    if (camera.zoom < 0.2 && data.nativeEvent.scale < 1) return;
    if (camera.zoom > 5 && data.nativeEvent.scale > 1) return;
    const zoom = camera.zoom * data.nativeEvent.scale;

    camera.zoom = camera.zoom + (zoom - camera.zoom) * 0.1;

    camera.updateProjectionMatrix();
  };

  const onSingleTap = (event: TapGestureHandlerStateChangeEvent) => {
    // console.log("I'm touched", event.nativeEvent.x, event.nativeEvent.y);
    // console.log("event.nativeEvent.state", event.nativeEvent.state);
    if (event.nativeEvent.state === State.END) {
      const raycaster = new THREE.Raycaster();
      console.log("WindowsDimension", wWidth, hHeight);

      const pointer = new THREE.Vector2();

      pointer.x = (event.nativeEvent.x / wWidth) * 2 - 1;
      pointer.y = -(event.nativeEvent.y / hHeight) * 2 + 1;
      console.log("pointer x y", pointer);
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(savedMeshes, false);

      if (intersects.length) {
        intersects[0]?.object.material.color.setRGB(
          1 / 255,
          255 / 255,
          1 / 255
        );
        console.log(
          "I'm touched",
          intersects[0]?.object.name,
          Object.keys(intersects[0]?.object),
          intersects.length,
          savedMeshes.length
        );
      } else {
        console.log("No Ibkect tOUCHED");
      }
    }
  };

  useComponentWillUnmount(() => {
    console.log("+================= UNMOUNT");
    if (glContext) GLView.destroyContextAsync(glContext);
    if (ap) ap.resetAnimation(false);
  });

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    console.log("onContextCreate");
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    setGLContext(gl);
    const resetScene = () => {}; // Reset la scene à l'état initial
    const meshes: Object3D[] = [];
    const renderer = new ExpoTHREE.Renderer({ gl });
    const scene = new THREE.Scene();
    scene.add(new AmbientLight());
    scene.add(new DirectionalLight(0xffffff, 1.1));
    // scene.add(new GridHelper(10, 10));
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl; // Définition des dimensions d'affichage
    const sceneColor = 0x7f8fa6; // Couleur de fond de la zone

    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 1000);

    camera.position.set(0, 0, 1);
    if (camera) setCamera(camera);

    const dict: any = {};
    const initialState: any = [];
    console.log("DIC INIT");
    if (object) scene.add(object);
    scene.traverse((mesh) => {
      if (mesh.type === "Mesh") {
        dict[mesh.userData.myId] = mesh.id;
        initialState.push({
          id: mesh.id,
          refItem: mesh.parent,
          position: { ...mesh.position },
          rotation: { ...mesh.rotation },
          visibility: mesh.visible,
          color: mesh.material.color.getHex(),
          scale: mesh.scale,
        });
        meshes.push(mesh);
      }
    });

    console.log("SCENE LENGTH", Object.keys(scene.children));
    console.log("DICT", dict);
    setSavedScene(scene);
    setSavedMeshes(meshes);
    renderer.render(scene, camera);
    gl.endFrameEXP();

    if (animationList) {
      const aP = new AnimationPlayer(
        {
          camera: camera,
          scene: scene,
          resetScene: resetScene,
          controls: {
            update: () => {
              // orbitRef?.current.getControls()?.update();
            },
          },
          render: () => {
            renderer.render(scene, camera);
            gl.endFrameEXP();
          },
          meshes: meshes,
        },
        [
          ...animationList.filter((a) => a.animationid === animationid)[0][
            "animation"
          ]["actionList"],
        ],
        () => {},
        meshes,
        dict,
        initialState
      );

      setAp(aP);
    } else {
      new AnimationPlayer(
        {
          camera: camera,
          scene: scene,
          resetScene: resetScene,
          controls: {
            update: () => {
              // orbitRef?.current.getControls()?.update();
            },
          },
          render: () => {
            renderer.render(scene, camera);
            gl.endFrameEXP();
          },
          meshes: meshes,
        },
        [],
        () => {},
        meshes,
        dict
      );
    }
  };
  if (!object) return null;
  return (
    <>
      <PinchGestureHandler onGestureEvent={manageZoom}>
        <PanGestureHandler
          onGestureEvent={moveCamera}
          maxPointers={1}
          // onHandlerStateChange={(d) => console.log("onHandlerStateChange")}
        >
          <TapGestureHandler onHandlerStateChange={onSingleTap}>
            {/* <OrbitControlsView
              style={{ flex: 1 }}
              camera={camera}
              ref={orbitRef}
            > */}
              <GLView
                style={{ flex: 1, borderWidth: 1}}
                onContextCreate={onContextCreate}
              />
            {/* </OrbitControlsView> */}
          </TapGestureHandler>
        </PanGestureHandler>
      </PinchGestureHandler>
      {ap && <Controls AP={ap} camera={camera} orbitRef={orbitRef}></Controls>}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Button color={'green'} onPress={() => {
          navigate('SceneAR')
        }}>
          <Text>Convert to AR</Text>
        </Button>
        <Button color={'green'} onPress={() => null}>
          <Text>Convert to VR</Text>
        </Button>
      </View>
    </>
  );
};

interface I_Scene {
  route: {
    params: {
      animationid: string;
      animationList: any[];
      modelId: string;
      modelUrl: string;
    };
  };
}
