import { Mesh } from "three";
// THREE import
import {
  Clock,
  Object3D,
  NumberKeyframeTrack,
  AnimationClip,
  AnimationMixer,
  LoopOnce,
  Scene,
} from "three";
import {
  Fixed,
  Scale,
  Color,
  NoAction,
  Hide,
  Break,
  Translate,
  Rotate,
  TranslateAndRotate,
  Text,
} from "./Animation.js";
import { observable } from "micro-observables";
import { Children } from "react";

const TRANSLATE_REDUCER = 0.001;
const ROTATION_REDUCER = Math.PI / 180;
const SCALE_REDUCER = 0.01;
const EMPTY_ANIMATION = [
  {
    name: "Begin animation",
    type: "fixed",
    time: "0",
    refItemId: "-1",
    isBlocker: "false",
    optionHidden: "default",
    uid: "",
    argList: [],
    itemList: [],
  },
  {
    name: "End animation",
    type: "fixed",
    time: "0",
    refItemId: "-1",
    isBlocker: "false",
    optionHidden: "default",
    uid: "",
    argList: [],
    itemList: [],
  },
];

interface Animation {
  name: string;
  type: string;
  time: string;
  refItemId: string;
  isBlocker: string;
  optionHidden: string;
  uid: string;
  argList: any[];
  itemList: any[];
}

class AnimationPlayer {
  sceneManager: any;
  animations: Animation[] = [];
  divText: any;
  meshes: Mesh[];
  dict: number[] = [];
  numAnimation = -1;
  name = "New Animation";
  timeouts = [];
  mixers = [];
  assembly: { dict: number[] };
  animList: any;
  clock: Clock;
  nextToPlay: number;
  preview: Set<any>;
  transformControls: null;
  play = observable(false);
  text = observable("");
  currentAnimation = 0;
  initialScene: any;
  initialState: any;

  constructor(
    sceneManager: any,
    animations: Animation[],
    divText: any,
    meshes: Object3D[],
    dict: number[],
    initialState: any[],
    numAnimation = -1,
    name = "New Animation"
  ) {
    console.log("RECEIVED ANIMATIONS", animations);
    this.sceneManager = sceneManager; // SceneManager use to access scene, camera
    this.initialScene = sceneManager.scene.clone();
    this.initialState = initialState;
    this.divText = divText; // Div where text is displayed
    this.numAnimation = numAnimation; // Animation Id from API
    this.name = name; // Animation name from API
    this.timeouts = []; // Use to store timeout when playing animation
    this.mixers = []; // Use to store mixers to update
    this.clock = new Clock();
    this.meshes = meshes;
    this.assembly = { dict };
    this.animList = this.parseAnimations(
      animations.length != 0 ? animations : EMPTY_ANIMATION
    ); // Parse and store animations
    this.nextToPlay = 0; // Use to follow step of animation
    this.preview = new Set([]); // Use to store all previewed meshes
    this.transformControls = null; // Use in editor to move mesh
    this.animate();
  }

  parseAnimations(animations: Animation[]): any {
    // Recursive function that convert animations from json to object
    const actual = animations[0];
    console.log("animations", animations);
    let anim = null;
    const meshes: Mesh[] = [];
    const time = parseInt(actual["time"]);

    // Get meshes from mesh id
    // console.log("THIS MESHES", this.meshess);
    actual["itemList"].forEach((meshId) => {
      meshes.push(
        this.sceneManager.scene.getObjectById(this.assembly.dict[meshId])
        // this.meshes[meshId]
      );
    });

    // Creation animation object
    switch (actual["type"]) {
      case "noAction":
        anim = new NoAction(
          actual["name"],
          time,
          actual["optionHidden"],
          actual["uid"]
        );
        break;
      case "fixed":
        anim = new Fixed(
          actual["name"],
          time,
          actual["optionHidden"],
          actual["uid"]
        );
        break;
      case "hide":
        anim = new Hide(
          actual["name"],
          time,
          actual["optionHidden"],
          actual["uid"],
          actual["argList"][0] == "true",
          meshes
        );
        break;
      case "break":
        anim = new Break(
          actual["name"],
          time,
          actual["optionHidden"],
          actual["uid"],
          actual["isBlocker"] == "true"
        );
        break;
      case "text":
        anim = new Text(
          actual["name"],
          time,
          actual["optionHidden"],
          actual["uid"],
          actual["argList"][0]
        );
        break;
      case "color":
        anim = new Color(
          actual["name"],
          time,
          actual["optionHidden"],
          actual["uid"],
          parseInt(actual["argList"][0]),
          parseInt(actual["argList"][1]),
          parseInt(actual["argList"][2]),
          parseInt(actual["argList"][3]),
          meshes
        );
        break;
      case "translate":
        anim = new Translate(
          actual["name"],
          time,
          actual["optionHidden"],
          actual["uid"],
          actual["isBlocker"] == "true",
          actual["refItemId"],
          parseInt(actual["argList"][0]),
          parseInt(actual["argList"][1]),
          parseInt(actual["argList"][2]),
          meshes
        );
        break;
      case "scale":
        anim = new Scale(
          actual["name"],
          time,
          actual["optionHidden"],
          actual["uid"],
          actual["isBlocker"] == "true",
          actual["refItemId"],
          parseInt(actual["argList"][0]),
          parseInt(actual["argList"][1]),
          parseInt(actual["argList"][2]),
          meshes
        );
        break;
      case "rotate":
        anim = new Rotate(
          actual["name"],
          time,
          actual["optionHidden"],
          actual["uid"],
          actual["isBlocker"] == "true",
          actual["refItemId"],
          parseInt(actual["argList"][0]),
          parseInt(actual["argList"][1]),
          parseInt(actual["argList"][2]),
          parseInt(actual["argList"][3]),
          meshes
        );
        break;
      case "translateAndRotate":
        anim = new TranslateAndRotate(
          actual["name"],
          time,
          actual["optionHidden"],
          actual["uid"],
          actual["isBlocker"] == "true",
          actual["refItemId"],
          parseInt(actual["argList"][0]),
          parseInt(actual["argList"][1]),
          parseInt(actual["argList"][2]),
          parseInt(actual["argList"][3]),
          parseInt(actual["argList"][4]),
          parseInt(actual["argList"][5]),
          parseInt(actual["argList"][6]),
          meshes
        );
        break;

      default:
        anim = new NoAction(
          actual["name"],
          actual["time"],
          actual["optionHidden"],
          actual["uid"]
        );
    }
    // Remove converted element and manage next one
    animations.shift();

    return animations.length == 0
      ? [anim]
      : [anim].concat(this.parseAnimations(animations));
  }
  loadAnimation(animations: Animation[], id: number, name: string) {
    // Function loading an animation on player
    this.numAnimation = id;
    this.name = name;
    this.animList = this.parseAnimations(
      animations.length != 0 ? animations : EMPTY_ANIMATION
    ); // Parse and store animations
  }
  stopTimeout() {
    // Clear animation timeouts
    this.timeouts.forEach((item) => {
      clearTimeout(item);
    });
  }
  stopMixers() {
    // Stop mixers and reattach all meshes moving to principal object
    const actualMixers: AnimationMixer[] = this.mixers;
    this.mixers = [];
    // For each mixer not related to camera, update them to make them trigger their finished listener
    actualMixers.forEach((mixer) => {
      while (
        mixer.getRoot() != this.sceneManager.camera &&
        mixer.getRoot().children.length > 0
      ) {
        mixer.update(1000000);
      }
    });
  }
  clearPreview() {
    // Remove all previewed pieces
    this.preview.forEach((mesh: Mesh) => {
      mesh?.parent?.remove(mesh);
    });
    this.preview = new Set([]);
  }
  clearTransformControls() {
    // Reattach all meshes related to transformControls
    this.transformControls?.refAxesToMove?.children.forEach((item) => {
      item.originalParent.attach(item);
    });
    this.transformControls?.detach(this.transformControls.refAxesToMove);
    this.sceneManager.scene.remove(this.transformControls);
  }
  async resetAnimation(resetScene = true) {
    // Reset entirely actual animation
    this.stopTimeout();
    this.stopMixers();
    this.clearPreview();
    this.clearTransformControls();
    // Clear text displayed
    this.divText.textContent = "";
    this.text.set("");
    // Reset scene if needed
    if (resetScene) {
      for (let mesh of this.initialState) {
        const sceneMesh = this.sceneManager.scene.getObjectById(mesh.id, true);
        // console.log("Position", mesh.postition, sceneMesh.position);
        // console.log("Visible", sceneMesh.visible);
        mesh.refItem.attach(sceneMesh);
        sceneMesh.position.set(
          mesh.position.x,
          mesh.position.y,
          mesh.position.z
        );
        sceneMesh.rotation.set(
          mesh.rotation._x,
          mesh.rotation._y,
          mesh.rotation._z
        );
        sceneMesh.scale = mesh.scale;
        sceneMesh.material.color.setHex(mesh.color);
        sceneMesh.visible = mesh.visibility;
      }
    } else {
      this.sceneManager.render();
    }
  }

  async playStep(
    aP: AnimationPlayer,
    from: number,
    to: number,
    instant: boolean
  ) {
    // Recursive function that play a step of the animation
    // If stop is wanted or if "to" is reached then stop
    if (from > to || from >= aP.animList.length || !aP.play.get()) {
      aP.nextToPlay = from;
      // Reset play param
      // this.play.set(false);
      // Update interface
      // document.getElementById("shortcut-play").classList.remove("active"); @html
      return;
    }
    // this.currentAnimation = from + 1;
    aP.nextToPlay = from + 1;

    // Get current step and play it
    let current = aP.animList[from];
    // console.log(
    //   "AnimList",
    //   aP.animList.map((elem) => elem.name)
    // );
    console.log("FROM", from);
    // console.log("CURRENT ANIMATION", current.name);
    current.play(aP, instant); // Play current step

    // If step is blocker or not instant mode then launch next after a timeout
    console.log("this.divText.textContent", aP.divText.textContent);
    aP.text.set(aP.divText.textContent);
    if (current.isBlocker && !instant) {
      aP.timeouts.push(
        setTimeout(
          aP.playStep,
          current.time * 1000 + 50,
          aP,
          from + 1,
          to,
          instant,
          true
        )
      );
    } else {
      aP.playStep(aP, from + 1, to, instant);
    }
  }

  // Utilitary function for animation function
  cloneMeshToGetRefAxes(mesh: Mesh) {
    // Create new object
    const clone = new Object3D();
    // Copy position and rotation
    clone.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
    clone.rotation.set(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z);
    // Setup clone
    clone.visible = true;
    clone.scale.set(1, 1, 1);
    // Return clone
    return clone;
  }
  cloneMeshToPreview(mesh: Mesh) {
    // Clone mesh
    const clone = mesh.clone(false);
    // Clone geometry and material
    clone.geometry = mesh.geometry.clone();
    clone.material = mesh.material.clone();
    // Clear children
    clone.children = [];
    // Setup mesh for preview
    clone.material.transparent = true;
    clone.material.opacity = 0.5;
    clone.userData = { ...mesh.userData };
    clone.userData.preview = true;
    clone.userData.copyFrom = mesh.id;
    // Return
    return clone;
  }

  // Function related to animation creation
  createAnimationClip(param, period, startPoint, value, axes = "x") {
    // Define reducer
    let reducer = 0;
    switch (param) {
      case "position":
        reducer = TRANSLATE_REDUCER;
        break;
      case "rotation":
        reducer = ROTATION_REDUCER;
        break;
      case "scale":
        reducer = SCALE_REDUCER;
        break;
    }
    // Create animation clip
    const times = [0, period];
    const values = [startPoint, startPoint + value * reducer];
    const trackName = `.${param}[${axes}]`;
    const track = new NumberKeyframeTrack(trackName, times, values);
    return new AnimationClip(null, period, [track]);
  }
  createMixer(param, mesh, time, axes) {
    // Create mixer
    const mixer = new AnimationMixer(mesh);

    // For each axes create an animation clip
    axes.forEach((item) => {
      // Create animation
      let animation = this.createAnimationClip(
        param,
        time,
        mesh[param][item.axe],
        item.value,
        item.axe
      );

      // Setup action
      let action = mixer.clipAction(animation);
      action.loop = LoopOnce;
      action.clampWhenFinished = true;
      action.play();
    });
    return mixer;
  }
  createAnimatedAction(param, refMesh, meshList, time, axes) {
    // Clone ref mesh
    const refMeshClone = this.cloneMeshToGetRefAxes(refMesh);
    // Place ref mesh clone in parent of ref mesh
    refMesh.parent.add(refMeshClone);

    // Intermediate obj is also a clone of ref mesh
    const intermediateObj = this.cloneMeshToGetRefAxes(refMesh);
    refMesh.parent.add(intermediateObj);
    refMeshClone.attach(intermediateObj);

    // Attach all meshes which have to move to the intermediate obj
    meshList.forEach((mesh) => {
      intermediateObj.attach(mesh);
    });

    // Create animation on the intermediate obj
    let mixer = this.createMixer(param, intermediateObj, time, axes);
    let player = this;

    // Replace all children at the good place at the end
    mixer.addEventListener("finished", () => {
      // If at least one action clip is running do nothing
      for (let act of mixer._actions) {
        if (act.isRunning() == true) {
          return;
        }
      }

      // Update mixer one time because listener triggered one frame before end
      mixer.update(1000);

      // Attach each child of intermediate Obj to parent of ref mesh ClosePopupOnEscape
      while (intermediateObj.children.length != 0) {
        let obj = intermediateObj.children[0];
        // if meshes and all animation finished for thoses meshes
        if (obj.originalParent != null && refMeshClone.parent.name != "") {
          obj.originalParent.attach(obj);
        } else {
          refMeshClone.parent.attach(obj);
        }
        obj.updateMatrix();
      }

      // Remove ref mesh clone when finished
      refMeshClone.parent.remove(refMeshClone);

      // Remove mixer from list
      player.mixers.splice(player.mixers.indexOf(mixer), 1);
    });

    return mixer;
  }
  createInstantAction(param, refMesh, meshList, time, axes, preview = false) {
    // Clone ref mesh
    const refMeshClone = this.cloneMeshToGetRefAxes(refMesh);
    // Place ref mesh clone in parent of ref mesh
    refMesh.parent.add(refMeshClone);

    // Intermediate obj is also a clone of ref mesh
    const intermediateObj = this.cloneMeshToGetRefAxes(refMesh);
    refMesh.parent.add(intermediateObj);
    refMeshClone.attach(intermediateObj);

    // Attach all meshes which have to move to the intermediate obj if preview clone mesh before attach except for rotate on translate and rotate
    meshList.forEach((mesh) => {
      intermediateObj.attach(
        preview && this.preview != meshList
          ? this.cloneMeshToPreview(mesh)
          : mesh
      );
    });

    // Make action according to param
    switch (param) {
      case "position":
        axes.forEach((item) => {
          intermediateObj.position[item.axe] += item.value * TRANSLATE_REDUCER;
        });
        break;
      case "rotation":
        axes.forEach((item) => {
          intermediateObj.rotation[item.axe] += item.value * ROTATION_REDUCER;
        });
        break;
      case "scale":
        axes.forEach((item) => {
          intermediateObj.scale[item.axe] += item.value * SCALE_REDUCER;
        });
        break;
    }

    // Attach each child of intermediate Obj to parent of ref mesh ClosePopupOnEscape
    while (intermediateObj.children.length != 0) {
      let obj = intermediateObj.children[0];
      // if meshes and all animation finished for thoses meshes
      if (obj.originalParent != null && refMeshClone.parent.name != "") {
        obj.originalParent.attach(obj);
      } else {
        refMeshClone.parent.attach(obj);
      }
      // Add to preview array
      if (preview) {
        this.preview.add(obj);
      }
      obj.updateMatrix();
    }

    // Remove ref mesh clone when finished
    refMeshClone.parent.remove(refMeshClone);
  }

  // Animate loop
  animate() {
    let delta = this.clock.getDelta();
    // Update mixers
    this.mixers.forEach((mixer) => {
      mixer.update(delta);
    });
    requestAnimationFrame(() => {
      this.animate();
    });
    // Update controls
    this.sceneManager.controls.update();
    // Render
    this.sceneManager.render();
  }
}

export { AnimationPlayer };
