
const h = document.getElementById('health');
const coinContainer = document.querySelector('.coin-container')


class Player extends sprite{
    constructor ({ 
        position, 
        collisionBlocks, 
        platformCollisionBlocks,
        imageSrc, 
        frameRate, 
        scale = 0.5, 
        animations,
        isOnGround }){

        super({ imageSrc, frameRate, scale })
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1
        }
        this.collisionBlocks = collisionBlocks;
        this.platformCollisionBlocks = platformCollisionBlocks;
        this.hitBox ={
            position:{
                x: this.position.x,
                y: this.position.y,
            },
            width: 10,
            height: 10,
        }

        this.animations = animations;
        this.lastDirections = 'right';
        this.isOnGround = true;

        for(let Key in this.animations){
            const image = new Image()
            image.src = this.animations[Key].imageSrc

            this.animations[Key].image = image
        }
        this.CameraBox = {
            position:{
                x: this.position.x-50,
                y: this.position.y
            },
            width: 200,
            height: 80,
        }

    }
    

    switchSprite(key){
        if(this.image === this.animations[key].image || !this.loaded) return

         this.currentFrame = 0
         this.image = this.animations[key].image
         this.frameBuffer = this.animations[key].frameBuffer
         this.frameRate = this.animations[key].frameRate
    }

        updateCameraBox(){
            this.CameraBox = {
                position:{
                    x: this.position.x-50,
                    y: this.position.y
                },
                width: 200,
                height: 80,
            }
        }

        shouldPanCameraToTheLeft({canvas, Camera}){
            const cameraBoxRightSide = this.CameraBox.position.x + this.CameraBox.width
            const scaledDownCanvasWidth = canvas.width / 4

            if(cameraBoxRightSide >= 576) return

            if(cameraBoxRightSide >= scaledDownCanvasWidth + Math.abs(Camera.position.x)){
                Camera.position.x -= this.velocity.x
            }
        }

        shouldPanCameraToTheRight({canvas, Camera}){
           if(this.CameraBox.position.x <= 0) return

           if(this.CameraBox.position.x <= Math.abs(Camera.position.x)){
              Camera.position.x -= this.velocity.x
           }
        }

        shouldPanCameraDown({canvas, Camera}){
            if(this.CameraBox.position.y + this.velocity.y <= 0) return
 
            if(this.CameraBox.position.y <= Math.abs(Camera.position.y)){
               Camera.position.y -= this.velocity.y
            }
         }

         shouldPanCameraUp({canvas, Camera}){
            // 432 = image height
            if(this.CameraBox.position.y + this.CameraBox.height + this.velocity.y >= 432) return

            const scaledDownCanvasHeight = canvas.height / 4
 
            if(this.CameraBox.position.y + this.CameraBox.height >= Math.abs(Camera.position.y)
             + scaledDownCanvasHeight){
               Camera.position.y -= this.velocity.y
            }
         }

         checkForGroundCollision () {
            const playerBottom = this.position.y + this.height;
            const collisionBoxBelowPlayer = this.collisionBlocks.find(collisionBox =>
              collisionBox.position.y > playerBottom &&
              collisionBox.position.y < playerBottom + this.velocity.y &&
              this.position.x + this.width > collisionBox.position.x &&
              this.position.x < collisionBox.position.x + collisionBox.width
            );
          
            if (collisionBoxBelowPlayer) {
              this.position.y = collisionBoxBelowPlayer.position.y - this.height;
              this.velocity.y = 0;
              this.isOnGround = true;
            } else {
              this.isOnGround = false;
            }
          }
          
          
         

        update(){
        
        this.updateFrames();
        this.updateHitBox();

        this.updateCameraBox();
        // context.fillStyle = `rgba(0, 0, 255, 0.2)`;
        // context.fillRect(
        //     this.CameraBox.position.x, 
        //     this.CameraBox.position.y, 
        //     this.CameraBox.width,
        //     this.CameraBox.height) 


        // context.fillStyle = `rgba(0, 255, 0, 0.2)`;
        // context.fillRect(this.position.x, this.position.y, this.height, this.width);

        // context.fillStyle = `rgba(0, 0, 0, 0.2)`;
        // context.fillRect(
        //     this.hitBox.position.x, 
        //     this.hitBox.position.y, 
        //     this.hitBox.width,
        //     this.hitBox.height) 

        this.draw();

        this.position.x += this.velocity.x;
        this.updateHitBox();
        this.checkForhorizontalCollision()
        this.applyGravity()
        this.updateHitBox();
        this.checkForVertivalCollision()
        // this.checkForGroundCollision()
    }

    


    updateHitBox(){
        this.hitBox ={
            position:{
                x: this.position.x + 35,
                y: this.position.y + 26,
            },
            width: 14,
            height: 27,
        }
    }

    checkForHorizontalCanvasCollision(){
        if(this.hitBox.position.x + this.hitBox.width + this.velocity.x >= 576 ||
            this.hitBox.position.x + this.velocity.x <= 0){
            this.velocity.x = 0
        }
    }

        checkForhorizontalCollision(){
        for(let i = 0; i < this.collisionBlocks.length; i++){
           const collisionBox = this.collisionBlocks[i];
           
           if(collision({
            object1: this.hitBox,
            object2: collisionBox
           })){
            if(this.velocity.x > 0){
                this.velocity.x = 0

                const offset = this.hitBox.position.x - this.position.x +  this.hitBox.width

                this.position.x = collisionBox.position.x - offset- 0.01
                break;
            }

            if(this.velocity.x < 0){
                this.velocity.x = 0

                const offset = this.hitBox.position.x - this.position.x

                this.position.x = collisionBox.position.x + collisionBox.width- offset + 0.01
                break;
            }
            }
        }
      }


            applyGravity() {
            this.velocity.y += gravity
            this.position.y += this.velocity.y;
            }

            checkForVertivalCollision(){
            for(let i = 0; i < this.collisionBlocks.length; i++){
           const collisionBox = this.collisionBlocks[i];
           
           if(collision({
            object1: this.hitBox,
            object2: collisionBox
           })){
            if(this.velocity.y > 0){
                this.velocity.y = 0

                const offset = this.hitBox.position.y - this.position.y +  this.hitBox.height

                this.position.y = collisionBox.position.y - offset - 0.01
                break;
            }

            if(this.velocity.y < 0){
                this.velocity.y = 0

                const offset = this.hitBox.position.y - this.position.y 

                this.position.y = collisionBox.position.y + collisionBox.height- offset + 0.01
                break;
            }
            }
            }

            for(let i = 0; i < this.platformCollisionBlocks.length; i++){
            const platformCollisionBlock = this.platformCollisionBlocks[i]
            
            if(platformCollision({
             object1: this.hitBox,
             object2: platformCollisionBlock
            })){
             if(this.velocity.y > 0){
                 this.velocity.y = 0
 
                 const offset = this.hitBox.position.y - this.position.y +  this.hitBox.height
 
                 this.position.y = platformCollisionBlock.position.y - offset - 0.01
                 break;
             }
 
            
             }
         }
      }
}

