import { SceneManager } from './sceneManager.js';
import { InputManager } from './inputManager.js';
import { UIManager } from './uiManager.js';
import { PlayerController} from './playerController.js'

export class GameEngine { //game engine v.1.0
    
    constructor(canvas) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(canvas, true);
        this.input = new InputManager(this);
        this.ui = new UIManager();
        this.sceneManager = new SceneManager(this.engine, this);
        this.scene = null;
        this.lastTime = performance.now();
        this.systems = [];
    }

    start() {
        this.scene = this.sceneManager.createScene();
        const playerController = new PlayerController(
            this.sceneManager.player,
            this.input,
            this.sceneManager
        );
        this.systems.push(playerController);
        // Loop di gioco
        this.engine.runRenderLoop(() => this.loop());
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    loop(){
        const now = performance.now();
        const delta = (now - this.lastTime) / 1000; // in secondi
        this.lastTime = now;
        this.update(delta);
        this.scene.render(); 
    }

    update(delta) {
        for (const sys of this.systems){
            sys.update(delta);
        }

    }
    


}