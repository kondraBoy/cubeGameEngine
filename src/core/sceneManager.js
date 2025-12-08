export class SceneManager {
    
    constructor(engine, game) {
        this.engine = engine;
        this.game = game;
        this.player = null;
        this.platforms = [];
        this.platformSize = { width: 3, depth: 3, height: 0.6 };
        this.spawnPoint = new BABYLON.Vector3(0, 1.2, 0); // punto di respawn fisso all'inizio
        this.spawnPlatform = null;
        this.goal = null;
    }

    createScene() {
        const scene = new BABYLON.Scene(this.engine); //scena generale
        new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene); //settings luce

        // Player creato prima della camera così può essere seguito
        this.player = BABYLON.MeshBuilder.CreateBox("player", { size: 1 }, scene); //creazione del player
        this.player.position.copyFrom(this.spawnPoint);

        // Camera orbitale controllabile con tasto destro
        const camera = new BABYLON.ArcRotateCamera(
            "ArcFollowCam",
            Math.PI / 2,      // orientato verso +Z (direzione del percorso)
            Math.PI / 3,
            8,
            this.player.position,
            scene
        );
        camera.lowerRadiusLimit = 4;
        camera.upperRadiusLimit = 20;
        camera.wheelPrecision = 50;
        camera.panningSensibility = 0; // niente pan, solo rotazione
        camera.attachControl(this.game.canvas, true);
        camera.setTarget(this.player.position);
        if (camera.inputs && camera.inputs.attached.pointers) {
            camera.inputs.attached.pointers.buttons = [2]; // rotazione solo con tasto destro
        }

        // Genera una linea di piattaforme davanti al player
        this.generatePlatforms(scene);
        this.createGoal(scene);
        return scene;
    }

    generatePlatforms(scene) {
        const count = 14;
        const spacing = 4; // distanza leggermente aumentata
        const startZ = 6; // prima piattaforma più distante dallo spawn
        const startY = this.platformSize.height / 2;
        const stepUp = 0.4; // salita progressiva

        this.platforms.length = 0;

        // Piattaforma di spawn dedicata
        this.spawnPlatform = BABYLON.MeshBuilder.CreateBox(
            "spawnPlatform",
            {
                width: this.platformSize.width * 1.4,
                depth: this.platformSize.depth * 1.4,
                height: this.platformSize.height,
            },
            scene
        );
        this.spawnPlatform.metadata = {
            width: this.platformSize.width * 1.4,
            depth: this.platformSize.depth * 1.4,
            height: this.platformSize.height,
        };
        const spawnZ = startZ - spacing; // distanza di "spacing" dalla prima piattaforma
        this.spawnPlatform.position = new BABYLON.Vector3(0, startY, spawnZ);
        this.platforms.push(this.spawnPlatform);

        for (let i = 0; i < count; i++) {
            const platform = BABYLON.MeshBuilder.CreateBox(
                `platform_${i}`,
                {
                    width: this.platformSize.width,
                    depth: this.platformSize.depth,
                    height: this.platformSize.height,
                },
                scene
            );
            platform.metadata = {
                width: this.platformSize.width,
                depth: this.platformSize.depth,
                height: this.platformSize.height,
            };
            const zPos = startZ + i * spacing;
            const yPos = startY + i * stepUp;
            // Piccola variazione laterale ma sempre davanti
            const xOffset = (Math.random() - 0.5) * 1.5; // tra -0.75 e 0.75
            platform.position = new BABYLON.Vector3(xOffset, yPos, zPos);
            this.platforms.push(platform);
        }

        // Punto di spawn fissato sulla piattaforma di spawn, centrato
        this.spawnPoint = this.getSpawnPoint();
        this.player.position.copyFrom(this.spawnPoint);
    }

    getSpawnPoint() {
        if (!this.spawnPlatform) return new BABYLON.Vector3(0, 1.2, 0);
        const top = this.spawnPlatform.position.y + this.platformSize.height / 2;
        return new BABYLON.Vector3(
            this.spawnPlatform.position.x,
            top + 0.5, // metà cubo sopra la superficie
            this.spawnPlatform.position.z
        );
    }

    createGoal(scene) {
        if (this.platforms.length === 0) return;
        const last = this.platforms[this.platforms.length - 1];
        const flagHeight = 1.5;
        this.goal = BABYLON.MeshBuilder.CreateCylinder(
            "goalFlag",
            { diameter: 1, height: flagHeight },
            scene
        );
        this.goal.position = new BABYLON.Vector3(
            last.position.x,
            last.position.y + flagHeight / 2 + this.platformSize.height / 2,
            last.position.z + this.platformSize.depth
        );
        this.goal.material = new BABYLON.StandardMaterial("goalMat", scene);
        this.goal.material.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.2);
    }
}
