export class SceneManager {
    
    constructor(engine, game) {
        this.engine = engine;
        this.game = game;
    }

    createScene() {
        const scene = new BABYLON.Scene(this.engine); //scena
        const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 10, BABYLON.Vector3(0,1,0), scene); //camera
        camera.attachControl(this.game.canvas, true); //controlli camera
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene); //luce
        BABYLON.MeshBuilder.CreateBox("player", {}, scene); //player
        return scene;
    }
}