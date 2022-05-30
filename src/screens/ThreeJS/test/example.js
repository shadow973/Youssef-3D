import { AnimationPlayer } from "./AnimationPlayer.js";

// pCamera, resetScene et scene sont stocker dans un objet SceneManager chez moi
// Ce sont les seules variables et fonction provenant du SceneManager utilisé par AnimationPlayer
const resetScene = () => {}; // Reset la scene à l'état initial
const pCamera = null; // PerspectiveCamera
const scene = null; // Scene

const animationJson = [
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
    name: "name",
    type: "translate",
    time: "2",
    refItemId: "0",
    isBlocker: "true",
    optionHidden: "",
    uid: "",
    argList: ["50", "0", "0"],
    itemList: ["0", "1", "2"],
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
// Create an animation player
const aP = new AnimationPlayer(
  { camera: pCamera, scene: scene, resetScene: resetScene },
  animationJson,
  document.querySelector("#display-text-anim")
);

// To play with entire animation
aP.play = true;
aP.playStep(aP, 0, aP.animList.length - 1, false);
aP.resetAnimation(true);

// To play only first two step
aP.play = true;
aP.playStep(aP, 0, 1, false);
aP.resetAnimation(true);

// To play instantly first two step
aP.play = true;
aP.playStep(aP, 0, 1, true);
aP.resetAnimation(true);
