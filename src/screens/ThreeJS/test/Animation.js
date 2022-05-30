function getKeyByValue(object, value) {
  return Object.keys(object).filter((key) => object[key] === value);
}

class Animation {
  constructor(name, time, optionHidden, uid, type) {
    this.name = name;
    this.time = time;
    this.optionHidden = optionHidden;
    this.uid = uid;
    this.type = type;
  }
}

class Fixed extends Animation {
  constructor(name, time, optionHidden, uid) {
    super(name, time, optionHidden, uid, "fixed");
  }
  play(aP, instant) {
    return;
  }
  preview(aP) {
    return;
  }
  clone() {
    return new Fixed(this.name, this.time, this.optionHidden, this.uid);
  }
  toJson(aP) {
    return {
      name: this.name,
      type: "fixed",
      time: "0",
      refItemId: "-1",
      isBlocker: "false",
      optionHidden: this.optionHidden,
      uid: this.uid,
      argList: [],
      itemList: [],
    };
  }
}

class NoAction extends Animation {
  constructor(name, time, optionHidden, uid) {
    super(name, time, optionHidden, uid, "noAction");
  }
  play(aP, instant) {
    return;
  }
  preview(aP) {
    return;
  }
  clone() {
    return new NoAction(this.name, this.time, this.optionHidden, this.uid);
  }
  toJson(aP) {
    return {
      name: this.name,
      type: "noAction",
      time: "0",
      refItemId: "-1",
      isBlocker: "false",
      optionHidden: this.optionHidden,
      uid: this.uid,
      argList: [],
      itemList: [],
    };
  }
}

class Hide extends Animation {
  constructor(name, time, optionHidden, uid, hide, meshList) {
    super(name, time, optionHidden, uid, "hide");
    this.hide = hide;
    this.meshList = meshList;
  }
  play(aP, instant) {
    this.meshList.forEach((mesh) => {
      mesh.visible = !this.hide;
    });
    return;
  }
  preview(aP) {
    return;
  }
  clone() {
    return new Hide(this.name, this.time, this.optionHidden, this.uid, this.hide, [...this.meshList]);
  }
  toJson(aP) {
    let itemList = [];
    for (let mesh of this.meshList) {
      itemList.push(getKeyByValue(aP.assembly.dict, mesh.id)[0]);
    }
    return {
      name: this.name,
      type: "hide",
      time: "0",
      refItemId: "-1",
      isBlocker: "false",
      optionHidden: this.optionHidden,
      uid: this.uid,
      argList: [this.hide ? "true" : "false"],
      itemList: itemList,
    };
  }
}

class Break extends Animation {
  constructor(name, time, optionHidden, uid, isBlocker) {
    super(name, time, optionHidden, uid, "break");
    this.isBlocker = true;
  }
  play(aP, instant) {
    return;
  }
  preview(aP) {
    return;
  }
  clone() {
    return new Break(this.name, this.time, this.optionHidden, this.uid, this.isBlocker);
  }
  toJson(aP) {
    return {
      name: this.name,
      type: "break",
      time: this.time.toString(),
      refItemId: "-1",
      isBlocker: "true",
      optionHidden: this.optionHidden,
      uid: this.uid,
      argList: [],
      itemList: [],
    };
  }
}

class Text extends Animation {
  constructor(name, time, optionHidden, uid, text) {
    super(name, time, optionHidden, uid, "text");
    this.text = text;
  }
  play(aP, instant) {
    aP.divText.textContent = this.text;
    return;
  }
  preview(aP) {
    this.play(aP);
  }
  clone() {
    return new Text(this.name, this.time, this.optionHidden, this.uid, this.text);
  }
  toJson(aP) {
    return {
      name: this.name,
      type: "text",
      time: "0",
      refItemId: "-1",
      isBlocker: "false",
      optionHidden: this.optionHidden,
      uid: this.uid,
      argList: [this.text],
      itemList: [],
    };
  }
}

class Color extends Animation {
  constructor(name, time, optionHidden, uid, r, g, b, t, meshList) {
    super(name, time, optionHidden, uid, "color");
    this.r = r;
    this.g = g;
    this.b = b;
    this.t = t;
    this.meshList = meshList;
  }
  play(aP, instant) {
    // For each mesh
    this.meshList.forEach((mesh) => {
      if (this.r == "-1" && this.g == "-1" && this.b == "-1") {
        // Reset color
        mesh.resetColor();
      } else {
        // Apply color
        mesh.material.color.setRGB(
          this.r == "-1" ? 0 : this.r / 255,
          this.g == "-1" ? 0 : this.g / 255,
          this.b == "-1" ? 0 : this.b / 255
        );
      }
    });
    return;
  }
  preview(aP) {
    this.play();
  }
  clone() {
    return new Color(this.name, this.time, this.optionHidden, this.uid, this.r, this.g, this.b, this.t, [
      ...this.meshList,
    ]);
  }
  toJson(aP) {
    let itemList = [];
    for (let mesh of this.meshList) {
      itemList.push(getKeyByValue(aP.assembly.dict, mesh.id)[0]);
    }
    return {
      name: this.name,
      type: "color",
      time: "0",
      refItemId: "-1",
      isBlocker: "false",
      optionHidden: this.optionHidden,
      uid: this.uid,
      argList: [this.r.toString(), this.g.toString(), this.b.toString(), this.t.toString()],
      itemList: itemList,
    };
  }
}

class Translate extends Animation {
  constructor(name, time, optionHidden, uid, isBlocker, refMeshId, x, y, z, meshList) {
    super(name, time, optionHidden, uid, "translate");
    this.isBlocker = isBlocker;
    this.refMeshId = refMeshId;
    this.xT = x;
    this.yT = y;
    this.zT = z;
    this.meshList = meshList;
  }
  play(aP, instant) {
    // If no ref mesh is indicate return
    if (this.refMeshId == "-1") return;

    // Get ref mesh and define  parameters
    const refMesh = aP.sceneManager.scene.getObjectById(aP.assembly.dict[this.refMeshId]);
    const axes = [
      { axe: "x", value: this.xT },
      { axe: "y", value: this.yT },
      { axe: "z", value: this.zT },
    ];

    // If it isn't in instant mode or time != 0
    if (!instant && this.time != 0) {
      // Create an animated action and push it in mixers
      const mixer = aP.createAnimatedAction("position", refMesh, this.meshList, this.time, axes);
      aP.mixers.push(mixer);
    }
    // If in instant play or time = 0
    else {
      aP.createInstantAction("position", refMesh, this.meshList, this.time, axes);
    }
  }
  preview(aP) {
    // If no ref mesh is indicate return
    if (this.refMeshId == "-1") return;

    // Define ref mesh and axes parameters
    const refMesh = aP.sceneManager.scene.getObjectById(aP.assembly.dict[this.refMeshId]);
    const axes = [
      { axe: "x", value: this.xT },
      { axe: "y", value: this.yT },
      { axe: "z", value: this.zT },
    ];
    // Launch instant translate in preview mode
    aP.createInstantAction("position", refMesh, this.meshList, this.time, axes, true);
  }
  clone() {
    return new Translate(
      this.name,
      this.time,
      this.optionHidden,
      this.uid,
      this.isBlocker,
      this.refMeshId,
      this.xT,
      this.yT,
      this.zT,
      [...this.meshList]
    );
  }
  toJson(aP) {
    let itemList = [];
    for (let mesh of this.meshList) {
      itemList.push(getKeyByValue(aP.assembly.dict, mesh.id)[0]);
    }
    return {
      name: this.name,
      type: "translate",
      time: this.time.toString(),
      refItemId: this.refMeshId.toString(),
      isBlocker: this.isBlocker ? "true" : "false",
      optionHidden: this.optionHidden,
      uid: this.uid,
      argList: [this.xT.toString(), this.yT.toString(), this.zT.toString()],
      itemList: itemList,
    };
  }
}

class Scale extends Animation {
  constructor(name, time, optionHidden, uid, isBlocker, refMeshId, x, y, z, meshList) {
    super(name, time, optionHidden, uid, "scale");
    this.isBlocker = isBlocker;
    this.refMeshId = refMeshId;
    this.xS = x;
    this.yS = y;
    this.zS = z;
    this.meshList = meshList;
  }
  play(aP, instant) {
    // If no ref mesh is indicate return
    if (this.refMeshId == "-1") return;

    // Get ref mesh and define scale for each axes
    const refMesh = aP.sceneManager.scene.getObjectById(aP.assembly.dict[this.refMeshId]);
    const axes = [
      { axe: "x", value: this.xS },
      { axe: "y", value: this.yS },
      { axe: "z", value: this.zS },
    ];

    // If not on instant play
    if (!instant && this.time != 0) {
      const mixer = aP.createAnimatedAction("scale", refMesh, this.meshList, this.time, axes);
      aP.mixers.push(mixer);
    }
    // If in instant play or time = 0
    else {
      aP.createInstantAction("scale", refMesh, this.meshList, this.time, axes);
    }
  }
  preview(aP) {
    // If no ref mesh is indicate return
    if (this.refMeshId == "-1") return;

    // Define ref mesh and axes parameters
    const refMesh = aP.sceneManager.scene.getObjectById(aP.assembly.dict[this.refMeshId]);
    const axes = [
      { axe: "x", value: this.xS },
      { axe: "y", value: this.yS },
      { axe: "z", value: this.zS },
    ];

    // Launch instant scale in preview mode
    aP.createInstantAction("scale", refMesh, this.meshList, this.time, axes, true);
  }
  clone() {
    return new Scale(
      this.name,
      this.time,
      this.optionHidden,
      this.uid,
      this.isBlocker,
      this.refMeshId,
      this.xS,
      this.yS,
      this.zS,
      [...this.meshList]
    );
  }
  toJson(aP) {
    let itemList = [];
    for (let mesh of this.meshList) {
      itemList.push(getKeyByValue(aP.assembly.dict, mesh.id)[0]);
    }
    return {
      name: this.name,
      type: "scale",
      time: this.time.toString(),
      refItemId: this.refMeshId.toString(),
      isBlocker: this.isBlocker ? "true" : "false",
      optionHidden: this.optionHidden,
      uid: this.uid,
      argList: [this.xS.toString(), this.yS.toString(), this.zS.toString()],
      itemList: itemList,
    };
  }
}

class Rotate extends Animation {
  constructor(name, time, optionHidden, uid, isBlocker, refMeshId, degree, x, y, z, meshList) {
    super(name, time, optionHidden, uid, "rotate");
    this.isBlocker = isBlocker;
    this.refMeshId = refMeshId;
    this.degreeR = degree;
    this.xR = x;
    this.yR = y;
    this.zR = z;
    this.meshList = meshList;
  }
  play(aP, instant) {
    // If no ref mesh is indicate return
    if (this.refMeshId == "-1") return;

    // Get ref mesh and define degree to rotate on each axis
    const refMesh = aP.sceneManager.scene.getObjectById(aP.assembly.dict[this.refMeshId]);
    const axes = [];
    if (this.xR != 0) {
      axes.push({ axe: "x", value: this.xR == 1 ? this.degreeR : -this.degreeR });
    }
    if (this.yR != 0) {
      axes.push({ axe: "y", value: this.yR == 1 ? this.degreeR : -this.degreeR });
    }
    if (this.zR != 0) {
      axes.push({ axe: "z", value: this.zR == 1 ? this.degreeR : -this.degreeR });
    }

    // If not on instant play
    if (!instant && this.time != 0) {
      const mixer = aP.createAnimatedAction("rotation", refMesh, this.meshList, this.time, axes);
      aP.mixers.push(mixer);
    }
    // If in instant play or time = 0
    else {
      aP.createInstantAction("rotation", refMesh, this.meshList, this.time, axes);
    }
  }
  preview(aP) {
    // If no ref mesh is indicate return
    if (this.refMeshId == "-1") return;

    // Get ref mesh and define degree to rotate on each axis
    const refMesh = aP.sceneManager.scene.getObjectById(aP.assembly.dict[this.refMeshId]);
    const axes = [];
    if (this.xR != 0) {
      axes.push({ axe: "x", value: this.xR == 1 ? this.degreeR : -this.degreeR });
    }
    if (this.yR != 0) {
      axes.push({ axe: "y", value: this.yR == 1 ? this.degreeR : -this.degreeR });
    }
    if (this.zR != 0) {
      axes.push({ axe: "z", value: this.zR == 1 ? this.degreeR : -this.degreeR });
    }

    // Launch instant rotate in preview mode
    aP.createInstantAction("rotation", refMesh, this.meshList, this.time, axes, true);
  }
  clone() {
    return new Rotate(
      this.name,
      this.time,
      this.optionHidden,
      this.uid,
      this.isBlocker,
      this.refMeshId,
      this.degreeR,
      this.xR,
      this.yR,
      this.zR,
      [...this.meshList]
    );
  }
  toJson(aP) {
    let itemList = [];
    for (let mesh of this.meshList) {
      itemList.push(getKeyByValue(aP.assembly.dict, mesh.id)[0]);
    }
    return {
      name: this.name,
      type: "rotate",
      time: this.time.toString(),
      refItemId: this.refMeshId.toString(),
      isBlocker: this.isBlocker ? "true" : "false",
      optionHidden: this.optionHidden,
      uid: this.uid,
      argList: [this.degreeR.toString(), this.xR.toString(), this.yR.toString(), this.zR.toString()],
      itemList: itemList,
    };
  }
}

class TranslateAndRotate extends Animation {
  constructor(name, time, optionHidden, uid, isBlocker, refMeshId, xT, yT, zT, degreeR, xR, yR, zR, meshList) {
    super(name, time, optionHidden, uid, "translateAndRotate");
    this.isBlocker = isBlocker;
    this.refMeshId = refMeshId;
    this.xT = xT;
    this.yT = yT;
    this.zT = zT;
    this.degreeR = degreeR;
    this.xR = xR;
    this.yR = yR;
    this.zR = zR;
    this.meshList = meshList;
  }
  play(aP, instant) {
    // If no ref mesh is indicate return
    if (this.refMeshId == "-1") {
      return;
    }

    // Get ref mesh and define distance to translate and degree to rotate on each axis
    const refMesh = aP.sceneManager.scene.getObjectById(aP.assembly.dict[this.refMeshId]);
    const axesT = [
      { axe: "x", value: this.xT },
      { axe: "y", value: this.yT },
      { axe: "z", value: this.zT },
    ];
    const axesR = [];
    if (this.xR != 0) {
      axesR.push({ axe: "x", value: this.xR == 1 ? this.degreeR : -this.degreeR });
    }
    if (this.yR != 0) {
      axesR.push({ axe: "y", value: this.yR == 1 ? this.degreeR : -this.degreeR });
    }
    if (this.zR != 0) {
      axesR.push({ axe: "z", value: this.zR == 1 ? this.degreeR : -this.degreeR });
    }

    // If not on instant play
    if (!instant && this.time != 0) {
      const mixerTranslate = aP.createAnimatedAction("position", refMesh, this.meshList, this.time, axesT);
      aP.mixers.push(mixerTranslate);

      if (axesR.length != 0) {
        const mixerRotate = aP.createAnimatedAction("rotation", refMesh, this.meshList, this.time, axesR);
        aP.mixers.push(mixerRotate);
      }
    }
    // If in instant play or time = 0
    else {
      aP.createInstantAction("position", refMesh, this.meshList, this.time, axesT);
      aP.createInstantAction("rotation", refMesh, this.meshList, this.time, axesR);
    }
  }
  preview(aP) {
    // If no ref mesh is indicate return
    if (this.refMeshId == "-1") return;

    // Get ref mesh and define distance to translate and degree to rotate on each axis
    const refMesh = aP.sceneManager.scene.getObjectById(aP.assembly.dict[this.refMeshId]);
    const axesT = [
      { axe: "x", value: this.xT },
      { axe: "y", value: this.yT },
      { axe: "z", value: this.zT },
    ];
    const axesR = [];
    if (this.xR != 0) {
      axesR.push({ axe: "x", value: this.xR == 1 ? this.degreeR : -this.degreeR });
    }
    if (this.yR != 0) {
      axesR.push({ axe: "y", value: this.yR == 1 ? this.degreeR : -this.degreeR });
    }
    if (this.zR != 0) {
      axesR.push({ axe: "z", value: this.zR == 1 ? this.degreeR : -this.degreeR });
    }
    // Launch
    aP.createInstantAction("position", refMesh, this.meshList, this.time, axesT, true);
    aP.createInstantAction("rotation", refMesh, aP.preview, this.time, axesR, true);
  }
  clone() {
    return new TranslateAndRotate(
      this.name,
      this.time,
      this.optionHidden,
      this.uid,
      this.isBlocker,
      this.refMeshId,
      this.xT,
      this.yT,
      this.zT,
      this.degreeR,
      this.xR,
      this.yR,
      this.zR,
      [...this.meshList]
    );
  }
  toJson(aP) {
    let itemList = [];
    for (let mesh of this.meshList) {
      itemList.push(getKeyByValue(aP.assembly.dict, mesh.id)[0]);
    }
    return {
      name: this.name,
      type: "translateAndRotate",
      time: this.time.toString(),
      refItemId: this.refMeshId.toString(),
      isBlocker: this.isBlocker ? "true" : "false",
      optionHidden: this.optionHidden,
      uid: this.uid,
      argList: [
        this.xT.toString(),
        this.yT.toString(),
        this.zT.toString(),
        this.degreeR.toString(),
        this.xR.toString(),
        this.yR.toString(),
        this.zR.toString(),
      ],
      itemList: itemList,
    };
  }
}

export { Break, Color, Fixed, Hide, NoAction, Rotate, Scale, Text, Translate, TranslateAndRotate };
