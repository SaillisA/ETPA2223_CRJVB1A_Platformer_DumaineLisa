class SceneTest extends Phaser.Scene {
    constructor(){
        super("SceneTest")
        this.player;
        this.controller = false;
        this.tileset;
    }
    init(data){

    }
    preload(){
        this.load.image('perso','assets/perso.png');
        this.load.image("Phaser_tuilesdejeuTest","assets/tilesetTest.png");
        this.load.tilemapTiledJSON("carteTest","assets/testotest.json");
    }
    create(){
        this.carteDuNiveau = this.add.tilemap("carteTest");
        this.tileset = this.carteDuNiveau.addTilesetImage("tilesetTest","Phaser_tuilesdejeuTest");

        this.calqueMurs = this.carteDuNiveau.createLayer("murs",this.tileset);
        this.calqueTronc = this.carteDuNiveau.createLayer("tronc",this.tileset);

        this.calqueMurs.setCollisionByProperty({ estSolide: true }); 

        this.player = this.physics.add.sprite(248, 1040, 'perso');
        //this.player.setSize(40, 90)

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.world.setBounds(0, 0, 4096, 4096);

        //  ajout du champs de la caméra de taille identique à celle du monde
        this.cameras.main.setBounds(0, 0, 4096, 4096);

        // ancrage de la caméra sur le joueur
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.3);

        //coliders
        this.physics.add.collider(this.player,this.calqueMurs);
    }

    update(){
        if (this.cursors.left.isDown || this.controller.left) { //si la touche gauche est appuyée
            this.player.setVelocityX(-500); //alors vitesse négative en X
            }
        else if (this.cursors.right.isDown || this.controller.right) { //sinon si la touche droite est appuyée
              this.player.setVelocityX(500); //alors vitesse positive en X
            }
        else {
              this.player.setVelocityX(0)
            }
        if (this.cursors.up.isDown && this.player.body.blocked.down|| this.controller.up) {
              this.player.setVelocityY(-450);
            }

    }

}