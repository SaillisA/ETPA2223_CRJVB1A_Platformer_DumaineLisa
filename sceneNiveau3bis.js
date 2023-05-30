class SceneNiveau3bis extends Phaser.Scene {
    constructor() {
        super("SceneNiveau3bis")
        this.player;
        this.controller = false;
        this.tileset;
        //grimpe
        this.grimeBool = false;
        //lance noisettes
        this.noisettesCD = false;
        this.directionPlayer = "";

    }
    init(data) {
        this.noisettes = data.noisettes
        this.positionX = data.positionX
        this.positionY = data.positionY
    }
    preload() {
    }
    create() {
        //creation des touches
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);    //lancer noisettes  
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);    //se cacher
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);  
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);    //aller a gauche
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);  
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);    //aller a droite
        this.cursors = this.input.keyboard.createCursorKeys();
        //la barre est utilisé pour le saut
        this.noisettesCD = false;

        this.carteDuNiv3bis = this.add.tilemap("carteNiveau3bis");
        this.tileset = this.carteDuNiv3bis.addTilesetImage("tileset", "phaserTileset");

        this.calqueFondNiv3bis = this.carteDuNiv3bis.createLayer("fond", this.tileset);

        this.calqueBranchesNiv3bis = this.carteDuNiv3bis.createLayer("branches", this.tileset)

        this.calqueMurNiv3bis = this.carteDuNiv3bis.createLayer("mur", this.tileset);
        this.calqueMurNiv3bis.setCollisionByProperty({ estSolide: true });

        this.calqueTroncNiv3bis = this.carteDuNiv3bis.createLayer("tronc", this.tileset);
        this.calqueTroncNiv3bis.setCollisionByProperty({ estSolide: true });

        this.player = this.physics.add.sprite(this.positionX, this.positionY, 'perso');
        this.player.setSize(230, 130)
        this.player.setOffset(165, 75)

        this.physics.world.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setZoom(0.2);

        //calques objets
        this.sortieNiv3bis = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetSortieNiv3bis = this.carteDuNiv3bis.getObjectLayer("sortie");
        this.objetSortieNiv3bis.objects.forEach(objetSortieNiv3bis => {
            this.inutile = this.sortieNiv3bis.create(objetSortieNiv3bis.x, objetSortieNiv3bis.y, "imgInvisibleLarge");
        });


        //colliders
        this.physics.add.collider(this.player, this.calqueMurNiv3bis);
        this.physics.add.collider(this.player, this.calqueTroncNiv3bis, this.verifGrimpette, null, this);

        //overlaps
        this.physics.add.overlap(this.player, this.sortieNiv3bis, this.retourNiveau3,null,this)
        //noisettes
        this.nutt = this.physics.add.group();
        this.physics.add.collider(this.nutt, this.calqueMurNiv3bis);
        this.physics.add.collider(this.nutt, this.calqueTroncNiv3bis);
        this.physics.add.overlap(this.player, this.nutt, this.recupNutt, null, this)
    }

    update() {
        if (this.keyQ.isDown || this.controller.left) { //si la touche gauche est appuyée
            if (this.cacher == true) {
                console.log("plus cacher")
                this.player.setVisible(true);
                this.cacher = false;

            }
            this.player.setVelocityX(-1000); //alors vitesse négative en X
        }
        else if (this.keyD.isDown || this.controller.right) { //sinon si la touche droite est appuyée
            if (this.cacher == true) {
                console.log("plus cacher")
                this.player.setVisible(true);
                this.cacher = false;
            }
            this.player.setVelocityX(1000); //alors vitesse positive en X
        }
        else {
            this.player.setVelocityX(0)
        }
        if (this.cursors.up.isDown || this.controller.up) {
            this.directionPlayer = "up"
        }
        if (this.cursors.left.isDown || this.controller.up) {
            this.directionPlayer = "left"
        }
        if (this.cursors.right.isDown || this.controller.up) {
            this.directionPlayer = "right"
        }

        //saut
        if (this.cursors.space.isDown && this.player.body.blocked.down || this.controller.B && this.player.body.blocked.down) {
            console.log("sautette")
            this.player.setVelocityY(-1000);
        }
        if (this.player.body.right && this.grimeBool == true || this.controller.B && this.player.body.right && this.grimeBool == true) {
            console.log("grimpette")
            if(this.keyZ.isDown){
            this.player.setVelocityY(-1000);
            }
            if(this.keyS.isDown){
                this.player.setVelocityY(1000)
            }
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
                this.nutt.create(this.player.x, this.player.y, "imgNutt").body.setVelocityX(-1000)
            };
            if (this.directionPlayer == "right") {
                this.nutt.create(this.player.x, this.player.y, "imgNutt").body.setVelocityX(1000)
            }
            if (this.directionPlayer == "up") {
                this.nutt.create(this.player.x, this.player.y, "imgNutt").body.setVelocityY(-1300)
            };

            this.noisettesCD = true;
            this.time.delayedCall(500, this.resertNoisettesCD, [], this);
        }
        if (this.cursors.down.isDown) {
            this.scene.start("SceneNiveau2", {noisettes : this.noisettes})
        }
        //cachette
        if (this.keyE.isDown && this.cacheBool == true) {
            console.log("cacher")
            this.player.setVisible(false);
            this.cacher = true;
        }
        this.grimeBool = false;
        this.cacheBool = false;


    }
    verifGrimpette() {
        console.log("verifgrimpette")
        this.grimeBool = true;
    }
    resertNoisettesCD() {
        console.log("lancer de noisettes disponibles")
        this.noisettesCD = false;
    }

    recupNutt(player, nutt) {
        if (nutt.body.blocked.down) {
            console.log(this.noisettes)
            nutt.destroy();
            this.noisettes += 1;
            console.log(this.noisettes)
        }
    }

    retourNiveau3(){
        this.scene.start("SceneNiveau3",{noisettes : this.noisettes, positionX :2430, positionY : 4430})
    }
}