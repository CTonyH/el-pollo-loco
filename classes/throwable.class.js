class ThrowableObject extends MoveableObject {

    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    constructor(x, y){
        super().loadImage(this.IMAGES_BOTTLE);
        this.x = x;
        this.y = y;
        this.height = 100;

        this.throw();
    }

    throw(){
        this.speedY = 30;
        this.applyGravity();
        setInterval (()=>{
            this.x += 10;
        }, 25)
    }
}