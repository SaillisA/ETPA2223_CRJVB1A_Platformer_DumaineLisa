class SceneTest extends Phaser.Scene {
    constructor() {
        super("SceneTest")
        this.player;
        this.controller = false;
        this.tileset;
        this.noisettes = 10;
        //saut
        //grimpe
        this.grimeBool = false;
        //cachette
        this.cacheBool = false;
        this.cacher = false;
        //lance noisettes
        this.noisettesCD = false;
        this.directionPlayer = "";


    }
    init(data) {

    }
    preload() {

    }
    create() {
        //creation des touches
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);    //lancer noisettes
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);    //se cacher
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);    //interaction
        //la barre espace est utilisé pour le saut
        //flèches directionnelles pour se déplacer a gauche et a droite
        this.noisettesCD = false;

        this.carteDuNiveauTest = this.add.tilemap("carteTest");
        this.tileset = this.carteDuNiveauTest.addTilesetImage("tilesetTest", "phaserTilesetTest");


        //Calques simples :
        this.calqueBackGround = this.carteDuNiveauTest.createLayer("fond", this.tileset);

        this.calqueMurs = this.carteDuNiveauTest.createLayer("murs", this.tileset);
        this.calqueMurs.setCollisionByProperty({ estSolide: true });

        this.calqueTronc = this.carteDuNiveauTest.createLayer("tronc", this.tileset);
        this.calqueTronc.setCollisionByProperty({ estSolide: true });
        this.calqueTronc.setCollisionByProperty({ estTronc: true });

        this.calquesDetails = this.carteDuNiveauTest.createLayer("detailsObjets", this.tileset);


        //Calques d'objets :
        //trou
        this.trouTest = this.physics.add.group({ immovable: true, allowGravity: false });
        this.calque_trou = this.carteDuNiveauTest.getObjectLayer("trou");
        this.calque_trou.objects.forEach(calque_trou => {
            this.inutile = this.trouTest.create(calque_trou.x + 64, calque_trou.y + 64, "imgInvisible");
        });

        //camera 1
        this.cam1 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetCamera1 = this.carteDuNiveauTest.getObjectLayer("camera1");
        this.objetCamera1.objects.forEach(objetCamera1 => {
            this.pasSiInutileQueCa = this.cam1.create(objetCamera1.x + 64, objetCamera1.y + 64, "imgInvisible");
        });

        this.player = this.physics.add.sprite(248, 1040, 'perso');
        this.player.setSize(230, 130)
        this.player.setOffset(165, 75)

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.world.setBounds(0, 0, 4096, 4096);

        //  ajout du champs de la caméra de taille identique à celle du monde
        this.cameras.main.setBounds(0, 0, 4096, 4096);

        // ancrage de la caméra sur le joueur
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.5);

        //noisettes
        this.nutt = this.physics.add.group();
        this.physics.add.collider(this.nutt, this.calqueMurs);
        this.physics.add.collider(this.nutt, this.calqueTronc);
        this.physics.add.collider(this.nutt, this.player, this.recupNutt, null, this)

        //coliders
        this.physics.add.collider(this.player, this.calqueMurs);
        this.physics.add.collider(this.player, this.calqueTronc, this.verifGrimpette, null, this);

        this.physics.add.overlap(this.player, this.trouTest, this.cachetteBool, null, this);

    }

    update() {
        //déplacements + look up
        if (this.cursors.left.isDown || this.controller.left) { //si la touche gauche est appuyée
            if (this.cacher == true) {
                console.log("plus cacher")
                this.player.setVisible(true);
                this.cacher = false;

            }
            this.player.setVelocityX(-500); //alors vitesse négative en X
            this.directionPlayer = "left"
        }
        else if (this.cursors.right.isDown || this.controller.right) { //sinon si la touche droite est appuyée
            if (this.cacher == true) {
                console.log("plus cacher")
                this.player.setVisible(true);
                this.cacher = false;
            }
            this.player.setVelocityX(500); //alors vitesse positive en X
            this.directionPlayer = "right"
        }
        else {
            this.player.setVelocityX(0)
        }
        if (this.cursors.up.isDown || this.controller.up) {
            this.directionPlayer = "up"
        }

        //saut et grimpette
        if (this.cursors.space.isDown && this.player.body.blocked.down || this.controller.B && this.player.body.blocked.down) {
            if (this.cacher == true) {
                console.log("plus cacher")
                this.player.setVisible(true);
                this.cacher = false;
            }
            console.log("sautette")
            this.player.setVelocityY(-1300);
        }
        if (this.cursors.space.isDown && this.player.body.right && this.grimeBool == true || this.controller.B && this.player.body.right && this.grimeBool == true) {
            console.log("grimpette")
            this.player.setVelocityY(-1000);
        }
        if (this.cursors.space.isDown && this.player.body.blocked.left && this.grimeBool == true || this.cursors.B && this.player.body.blocked.left && this.grimeBool == true) {
            console.log("grimpette")
            this.player.setVelocityY(-1000);
        }



        //lancer noisettes
        if (this.keyA.isDown && this.noisettes > 0 && this.noisettesCD == false || this.controller.A && this.noisettes > 0 && this.noisettesCD == false) {
            console.log("condition pour lancer des noisettes remplies :)")
            this.noisettes -= 1;
            console.log(this.noisettes)

            if (this.directionPlayer == "left") {
                this.nutt.create(this.player.x, this.player.y, "imgNutt").body.setVelocityX(-800)
            };
            if (this.directionPlayer == "right") {
                this.nutt.create(this.player.x, this.player.y, "imgNutt").body.setVelocityX(800)
            }
            if (this.directionPlayer == "up") {
                this.nutt.create(this.player.x, this.player.y, "imgNutt").body.setVelocityY(-1300)
            };

            this.noisettesCD = true;
            this.time.delayedCall(500, this.resertNoisettesCD, [], this);
        }

        //cachette
        if (this.keyZ.isDown && this.cacheBool == true) {
            console.log("cacher")
            this.player.setVisible(false);
            this.cacher = true;
        }
        this.grimeBool = false;
        this.cacheBool = false;


        if (this.cursors.down.isDown) {
            this.scene.start("SceneNiveau1")
        }
    }

    verifGrimpette() {
        console.log("verifgrimpette")
        this.grimeBool = true;
    }
    resertNoisettesCD() {
        console.log("lancer de noisettes disponibles")
        this.noisettesCD = false;
    }
    cachetteBool() {
        console.log("cachette possible")
        this.cacheBool = true;
    }

}