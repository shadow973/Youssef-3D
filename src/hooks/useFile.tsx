import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { decode } from "base64-arraybuffer";
import store from "../store/store";
import { Object3D } from "three";

interface I_loadGLTFAsync {
  uri: string | null;
}

export async function loadGLTFAsync({ uri }: I_loadGLTFAsync) {
  if (!uri) return;
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const arrayBuffer = decode(base64);
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.parse(
      arrayBuffer,
      "",
      (result) => {
        resolve(result);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

export const useFile = (url: string, fileId: string, reload?: boolean) => {
  const [file, setFile] = useState<string | null>(null);
  const [scene, setScene] = useState<Object3D | null>(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);
  const token = store.getState().auth.access_token;

  const fileUri = `${FileSystem.documentDirectory}${fileId}.glb`;

  const fetchData = async () => {
    console.log("WHAT IS THIS URL ", url);
    if (!url) return;
    try {
      const storedFile = await FileSystem.getInfoAsync(fileUri);
      console.log("storedFile", storedFile, fileUri);
      if (!storedFile.exists) {
        // todo ajouter la gestion du refresh token pour le dl
        const downloadedFile = await FileSystem.downloadAsync(url, fileUri, {
          headers: {
            Authorization: " " + token,
          },
        });
        console.log("Finished downloading to ", downloadedFile);
      }
      const obj: any = await loadGLTFAsync({ uri: fileUri });
      setScene(obj.scene);
      const meshs: any = [];

      obj.scene.traverse((node: Object3D) => {
        if (node.type === "Mesh") {
          meshs.push(node);
        }
      });
      // meshs.sort((a, b) => a.userData.myId - b.userData.myId);
      // meshs.map((mesh: Object3D, key: number) => (mesh.name = key));
      setFile(meshs);
      setloading(false);
    } catch (error) {
      console.error(error);
      setError(error);
      setloading(false);
    }
  };

  useEffect(() => {
    console.log("Get FILE URL ", url);
    fetchData();
  }, [url, reload]);

  return { scene, file, error, loading };
};
