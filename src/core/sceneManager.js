export class SceneManager {
    
    constructor(engine, game) {
        this.engine = engine;
        this.game = game;
        this.player = null;
    }

    createScene() {
        const scene = new BABYLON.Scene(this.engine); //scena generale
        const camera = new BABYLON.FollowCamera(
        "FollowCam",
            // Posizione iniziale della camera
            new BABYLON.Vector3(0, 2, -6),
            scene
        );
        // oggetto da seguire
        camera.lockedTarget = this.player;

        // Parametri principali della FollowCamera
        camera.radius = 6;               // distanza dal player
        camera.heightOffset = 2;         // altezza rispetto al player
        camera.rotationOffset = 180;     // da che angolo guardare il player
        camera.cameraAcceleration = 0.05; // velocità con cui la camera “insegue”
        camera.maxCameraSpeed = 20;       // limite massimo della velocità
        camera.attachControl(this.game.canvas, true); //attacco della camera
        new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene); //settings luce
        this.player = BABYLON.MeshBuilder.CreateBox("player", {}, scene); //creazione del player
        return scene;
    }
}
