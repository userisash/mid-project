const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const jumpSound = new Audio('./audio/jump.mp3')
const runsound = new Audio('./audio/running.mp3')
const landsound = new Audio('./audio/land.mp3')

canvas.width = 1024;
canvas.height = 576;

const scaledCanvase = {
    width: canvas.width / 4,
    height: canvas.height / 4
}

const floorCollision2D = []
for(let i = 0; i < floorCollisions.length; i += 36){
    floorCollision2D.push(floorCollisions.slice(i, i + 36))
}


const collisionBlocks = []
floorCollision2D.forEach((row, y) =>{
    row.forEach((Symbol, x) =>{
       if(Symbol === 202){
        collisionBlocks.push(
            new collisionBox({
                position:{
                    x: x * 16,
                    y: y * 16
                }
            })
        )
       }
    })
})




const platformCollision2d =[]
for(let i = 0; i < platformCollisions.length; i += 36){
    platformCollision2d.push(platformCollisions.slice(i, i + 36))
}

const platformCollisionBlocks =[]
platformCollision2d.forEach((row, y) =>{
    row.forEach ((Symbol, x) =>{
        if(Symbol === 202){
            platformCollisionBlocks.push(
                new collisionBox({
                    position:{
                        x: x * 16,
                        y: y * 16
                    },
                    height: 4
                })
            )
        }
    })
})

const gravity = 0.1;


const player= new Player( {
    position:{
        x: 100,
        y: 300,
    },
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc: './assets/warrior/Idle.png',
    frameRate: 8,
    animations:{
     Idle:{
        imageSrc: './assets/warrior/Idle.png',
        frameRate: 8,
        frameBuffer: 5,
     },
     Run:{
        imageSrc: './assets/warrior/Run.png',
        frameRate: 8,
        frameBuffer: 7,
     },
     Jump:{
        imageSrc: './assets/warrior/jump.png',
        frameRate: 2,
        frameBuffer: 3,
     },
     Fall:{
        imageSrc: './assets/warrior/Fall.png',
        frameRate: 2,
        frameBuffer: 3,
     },
     FallLeft:{
        imageSrc: './assets/warrior/FallLeft.png',
        frameRate: 2,
        frameBuffer: 3,
     },
     RunLeft:{
        imageSrc: './assets/warrior/RunLeft.png',
        frameRate: 8,
        frameBuffer: 5,
     },
     IdleLeft:{
        imageSrc: './assets/warrior/IdleLeft.png',
        frameRate: 8,
        frameBuffer: 5,
     },
     JumpLeft:{
        imageSrc: './assets/warrior/JumpLeft.png',
        frameRate: 2,
        frameBuffer: 3,
     },
    }
})

const coins = document.querySelectorAll('.coin');
coins.forEach((coin) => {
  coin.addEventListener('click', () => {
    handleCollision(player, coin);
    coin.remove();
  });
});

const keys ={
    d:{
        pressed: false
    },
    a:{
        pressed: false
    },
    w:{
        pressed: false
    }
}

const background = new sprite({
    position:{
        x: 0,
        y: 0
    },

    imageSrc:'./img/background.png', 
})

const backGroundImageHeight = 432

const Camera = {
    position:{
        x: 0,
        y: -backGroundImageHeight + scaledCanvase.height
    }
}

function updateCollectables() {
    const coinsElement = document.getElementById("coins");
    coinsElement.innerText = player.coins;

    let count = 0;
    setInterval(function() {
        count++;
        coinsElement.innerText = parseInt(player.coins) + count;
        console.log(count);
    }, 1000);

    // update health element
    document.getElementById("health").innerText = player.health;
}

function animate(){
    window.requestAnimationFrame(animate);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height)

    // save and restore to only effect the code inside of them 
    context.save();
    context.scale(4, 4);
    context.translate(Camera.position.x, Camera.position.y)
    background.update();
    // collisionBlocks.forEach(collisionBox =>{
    //     collisionBox.update()
    // })

    // platformCollisionBlocks.forEach(collisionBox =>{
    //     collisionBox.update()
    // })

    player.checkForHorizontalCanvasCollision();
    player.update();


    
    player.velocity.x = 0;
    if(keys.d.pressed){
        player.switchSprite('Run')
        player.velocity.x = 2
        player.lastDirections = 'right'
        player.shouldPanCameraToTheLeft({canvas, Camera});
        
    }else if(keys.a.pressed){
        // player.switchSprite('RunLeft')
        player.switchSprite('RunLeft')
        player.velocity.x = -2
        player.lastDirections = 'left'
        player.shouldPanCameraToTheRight({canvas, Camera});
        
    }else if(player.velocity.y === 0){
        if(player.lastDirections === 'right'){
            player.switchSprite('Idle')
        }else{
            player.switchSprite('IdleLeft')
        }
    }
    if(player.velocity.y < 0){
        player.shouldPanCameraDown({canvas, Camera})
        if(player.lastDirections === 'left'){
            player.switchSprite('Jump')
        }else{
            player.switchSprite('JumpLeft')
        }
        
    }else if(player.velocity.y > 0){
        player.shouldPanCameraUp({canvas, Camera})
        if(player.lastDirections === 'right'){
            player.switchSprite('Fall')
        }else{
            player.switchSprite('FallLeft')
        }
    }else if (collisionBox.height === 0){
        player.isOnGround = true
    }else{
        player.isOnGround = false
    }

    context.restore();
    
    
}
animate();



window.addEventListener('keydown', (e) =>{
    switch(e.key){
        case 'd':
        keys.d.pressed = true
        runsound.play()
        break;

        case 'a':
        keys.a.pressed = true;
        runsound.play()
        break;

        case 'w':
        jumpSound.play()
        player.velocity.y = -3;
        console.log('jump')
        break;
    }
})

window.addEventListener('keyup', (e) =>{
    switch(e.key){
        case 'd':
        keys.d.pressed = false;
        runsound.pause()
        break;

        case 'a':
        keys.a.pressed = false;
        runsound.pause()
        break;
        
    }
})

console.log(context)