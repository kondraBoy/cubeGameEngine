export class PlayerController {
    constructor(player, input, sceneManager) {
        this.player = player;          // mesh del cubo
        this.input = input;            // InputManager
        this.sceneManager = sceneManager; // per conoscere piattaforme
        this.velocity = new BABYLON.Vector3(0, 0, 0);
        this.gravity = -9.8;
        this.jumpForce = 4;
        this.speed = 3;
        this.isOnGround = true;
    }

    update(delta) {
        // mappatura input
        const forward = this.input.isKeyDown('w');
        const backward = this.input.isKeyDown('s');
        const left = this.input.isKeyDown('a');
        const right = this.input.isKeyDown('d');
        const jump = this.input.isKeyDown(' '); // salto

        // gestione con Vector3
        let moveX = (right ? 1 : 0) - (left ? 1 : 0);
        let moveZ = (forward ? 1 : 0) - (backward ? 1 : 0);
        let move = new BABYLON.Vector3(moveX, 0, moveZ);

        if (move.length() > 0) {
            move = move.normalize().scale(this.speed);
        }

        // velocity orizzontale
        this.velocity.x = move.x;
        this.velocity.z = move.z;

        // gravità
        if (!this.isOnGround) {
            this.velocity.y += this.gravity * delta;
        }

        // salto
        if (jump && this.isOnGround) {
            this.velocity.y = this.jumpForce;
            this.isOnGround = false;
        }

        // movimento
        const deltaPosition = this.velocity.scale(delta);
        this.player.position.addInPlace(deltaPosition);

        // Ground collision solo con piattaforme
        const groundInfo = this.getGroundInfo();
        const playerHalfSize = 0.5; // il cubo è size 1
        if (groundInfo.isPlatform && this.player.position.y - playerHalfSize <= groundInfo.height) {
            this.player.position.y = groundInfo.height + playerHalfSize;
            this.velocity.y = 0;
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }

        // Respawn se cade nel vuoto o è fuori da ogni piattaforma sotto il livello top dello spawn
        const spawnLevelTop = this.getSpawnTop();
        if (
            this.player.position.y < -10 ||
            (!groundInfo.isPlatform && this.player.position.y < spawnLevelTop)
        ) {
            this.respawn();
        }

        // Ritorno all'inizio quando raggiunge il traguardo
        this.checkGoalReached();
    }

    getGroundInfo() {
        let ground = Number.NEGATIVE_INFINITY;
        let isPlatform = false;
        if (!this.sceneManager || !this.sceneManager.platforms) {
            return { height: ground, isPlatform };
        }

        for (const platform of this.sceneManager.platforms) {
            const size = platform.metadata || this.sceneManager.platformSize;
            const epsilon = 0.01;
            const halfW = (size.width ?? this.sceneManager.platformSize.width) / 2 + epsilon;
            const halfD = (size.depth ?? this.sceneManager.platformSize.depth) / 2 + epsilon;
            const height = size.height ?? this.sceneManager.platformSize.height;

            if (
                Math.abs(this.player.position.x - platform.position.x) <= halfW &&
                Math.abs(this.player.position.z - platform.position.z) <= halfD
            ) {
                const top = platform.position.y + height / 2;
                if (top > ground) {
                    ground = top;
                    isPlatform = true;
                }
            }
        }

        return { height: ground, isPlatform };
    }

    respawn() {
        if (this.sceneManager && this.sceneManager.getSpawnPoint) {
            const spawn = this.sceneManager.getSpawnPoint();
            this.player.position.copyFrom(spawn);
        } else if (this.sceneManager && this.sceneManager.spawnPoint) {
            this.player.position.copyFrom(this.sceneManager.spawnPoint);
        } else {
            this.player.position = new BABYLON.Vector3(0, 1, 0);
        }
        this.velocity.set(0, 0, 0);
        this.isOnGround = false;
    }

    getSpawnTop() {
        if (this.sceneManager && this.sceneManager.spawnPlatform) {
            const size = this.sceneManager.spawnPlatform.metadata || this.sceneManager.platformSize;
            const top = this.sceneManager.spawnPlatform.position.y + (size.height ?? this.sceneManager.platformSize.height) / 2;
            return top;
        }
        return 0;
    }

    checkGoalReached() {
        if (!this.sceneManager || !this.sceneManager.goal) return;
        const dist = BABYLON.Vector3.Distance(this.player.position, this.sceneManager.goal.position);
        if (dist < 1.5) {
            this.respawn();
        }
    }
}
