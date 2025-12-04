export class SceneManager {
    
    constructor(engine, game) {
        this.engine = engine;
        this.game = game;
        this.player = null;
    }

    createScene() {
        const scene = new BABYLON.Scene(this.engine); //scena generale
        const camera = new BABYLON.ArcRotateCamera( //camera DA FIXARE E METTERE IN 3 PERSONA
            "camera",
            Math.PI / 2, Math.PI / 3,
            10,
            new BABYLON.Vector3(0,1,0),
            scene
        );
        camera.attachControl(this.game.canvas, true); //attacco della camera
        new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene); //settings luce
        this.player = BABYLON.MeshBuilder.CreateBox("player", {}, scene); //creazione del player
        return scene;
    }
}
