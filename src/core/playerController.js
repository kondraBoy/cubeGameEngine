export class PlayerController {
    constructor(player, input, scene) {
        this.player = player;   // mesh del cubo
        this.input = input;     // InputManager
        this.scene = scene;     // scena
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

        // Ground collision (y=0)
        if (this.player.position.y <= 0) {
            this.player.position.y = 0;
            this.velocity.y = 0;
            this.isOnGround = true;
        }
    }
}
