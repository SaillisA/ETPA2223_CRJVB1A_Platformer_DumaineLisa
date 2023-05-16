class SceneTest extends Phaser.Scene {
    constructor(){
        super("SceneTest")
        this.player;
        this.controller = false;
        this.tileset;
        this.grimeBool = false;
        this.cacheBool = false;
        this.cacher = false;

    }
    init(data){

    }
    preload(){
        
    }
    create(){
        this.carteDuNiveauTest = this.add.tilemap("carteTest");
        this.tileset = this.carteDuNiveauTest.addTilesetImage("tilesetTest","phaserTilesetTest");


        //Calques simples :
        this.calqueBackGround = this.carteDuNiveauTest.createLayer("fond",this.tileset);

        this.calqueMurs = this.carteDuNiveauTest.createLayer("murs",this.tileset);
        this.calqueMurs.setCollisionByProperty({ estSolide: true }); 

        this.calqueTronc = this.carteDuNiveauTest.createLayer("tronc",this.tileset);
        this.calqueTronc.setCollisionByProperty({ estSolide: true });
        this.calqueTronc.setCollisionByProperty({estTronc : true });
        
        this.calquesDetails = this.carteDuNiveauTest.createLayer("detailsObjets",this.tileset);


        //Calques d'objets :
        //trou
        this.trouTest = this.physics.add.group({immovable : true ,allowGravity : false});
        this.calque_trou = this.carteDuNiveauTest.getObjectLayer("trou");
        this.calque_trou.objects.forEach(calque_trou => {
          this.inutile = this.trouTest.create(calque_trou.x+64,calque_trou.y+64,"imgInvisible"); 
        });
        
        //camera 1
        this.cam1 = this.physics.add.group({immovable : true ,allowGravity : false});
        this.objetCamera1 = this.carteDuNiveauTest.getObjectLayer("camera1");
        this.objetCamera1.objects.forEach(objetCamera1 => {
          this.inutile = this.cam1.create(objetCamera1.x+64,objetCamera1.y+64,"imgInvisible"); 
        });

        this.player = this.physics.add.sprite(248, 1040, 'perso');
        //this.player.setSize(40, 90)

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.world.setBounds(0, 0, 4096, 4096);

        //  ajout du champs de la caméra de taille identique à celle du monde
        this.cameras.main.setBounds(0, 0, 4096, 4096);

        // ancrage de la caméra sur le joueur
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.5);

        //coliders
        this.physics.add.collider(this.player,this.calqueMurs);
        this.physics.add.collider(this.player,this.calqueTronc,this.verifGrimpette,null,this);

        this.physics.add.overlap(this.player,this.trouTest,this.cachetteBool,null,this);

    }

    update(){
        if (this.cursors.left.isDown || this.controller.left) { //si la touche gauche est appuyée
            if(this.cacher == true ){
                console.log("plus cacher")
                this.player.setVisible(true);
                this.cacher = false;

            }
            this.player.setVelocityX(-500); //alors vitesse négative en X
            }
        else if (this.cursors.right.isDown || this.controller.right) { //sinon si la touche droite est appuyée
            if(this.cacher == true ){
                console.log("plus cacher")
                this.player.setVisible(true);
                this.cacher = false;

            }
            this.player.setVelocityX(500); //alors vitesse positive en X
            }
        else {
            this.player.setVelocityX(0)
            }


        if (this.cursors.up.isDown && this.player.body.blocked.down|| this.controller.up && this.player.body.blocked.down) {
            console.log("sautette")
            this.player.setVelocityY(-500);
            }
        if (this.cursors.up.isDown && this.player.body.right && this.grimeBool == true){
            console.log("grimpette")
            this.player.setVelocityY(-450);
            }
        if (this.cursors.up.isDown && this.player.body.blocked.left && this.grimeBool == true){
            console.log("grimpette")
            this.player.setVelocityY(-450);
            }
        
        if(this.cursors.space.isDown && this.cacheBool == true){
            console.log("cacher")
            this.player.setVisible(false);
            this.cacher = true;
        }
        this.grimeBool = false;
        this.cacheBool = false;
    }

    verifGrimpette(){
        console.log("verifgrimpette")
        this.grimeBool = true;
    }
    cachetteBool(){
        console.log("cachette possible")
        this.cacheBool = true;
    }
}