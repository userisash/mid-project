// class Sprite {
//   constructor({ imageSrc, scale = 0.5 }) {
//     this.image = new Image();
//     this.image.src = imageSrc;
//     this.scale = scale;
//     this.width = this.image.width * this.scale;
//     this.height = this.image.height * this.scale;
//   }

//   draw(context, x, y) {
//     context.save();
//     context.beginPath();
//     context.fillStyle = "yellow";
//     context.fillRect(100, 300, 5, 0, Math.PI * 2);
//     context.fill();
//     context.restore();;
//   }
// }

// class Collectable extends Sprite {
//   constructor({ position, imageSrc, scale = 0.5 }) {
//     super({ imageSrc, scale });
//     this.position = position;
//     this.hitBox = {
//       position: {
//         x: this.position.x,
//         y: this.position.y,
//       },
//       width: 10,
//       height: 10,
//     };
//   }

//   updateHitBox() {
//     this.hitBox = {
//       position: {
//         x: this.position.x,
//         y: this.position.y,
//       },
//       width: this.width,
//       height: this.height,
//     };
//   }

//   update(player, coins) {
//     this.updateHitBox();
    
//     // Check collision with player
//     if (this.hitBox.position.x < player.hitBox.position.x + player.hitBox.width &&
//         this.hitBox.position.x + this.hitBox.width > player.hitBox.position.x &&
//         this.hitBox.position.y < player.hitBox.position.y + player.hitBox.height &&
//         this.hitBox.height + this.hitBox.position.y > player.hitBox.position.y) {
        
//         // Remove the collectable from the scene
//         this.remove();

//         // Increment the value of coins by one
//         coins.value += 1;
//     }
    
//     this.draw();
//   }

//   draw() {
//     const ctx = game.context;
//     ctx.save();
//     ctx.beginPath();
//     ctx.fillStyle = "yellow";
//     ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.restore();
//   }
// }