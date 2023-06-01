class SceneNiveau4 extends Phaser.Scene {
    constructor() {
        super("SceneNiveau4")
        this.player;
        this.controller = false;
        this.tileset;
        this.noisettes = 10
        //grimpe
        this.grimeBool = false;
        //lance noisettes
        this.noisettesCD = false;
        this.directionPlayer = "";
        //animation
        this.aninim = ''            //pour déterminer dans quelle direction sera son anim d'attente
    }
    init(data) {

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
        //flèches directionnelles pour changer la direction du lancer de noisettes

        this.carteDuNiv4 = this.add.tilemap("carteNiveau4");
        this.tileset = this.carteDuNiv4.addTilesetImage("tileset", "phaserTileset");

        this.calqueFondNiv4 = this.carteDuNiv4.createLayer("fonds", this.tileset);
        this.calqueBranchesNiv4 = this.carteDuNiv4.createLayer("branches", this.tileset)

        this.calqueMurNiv4 = this.carteDuNiv4.createLayer("mur", this.tileset);
        this.calqueMurNiv4.setCollisionByProperty({ estSolide: true });

        this.calqueTroncNiv4 = this.carteDuNiv4.createLayer("tronc", this.tileset);
        this.calqueTroncNiv4.setCollisionByProperty({ estSolide: true })

        //créationd du player
        this.player = this.physics.add.sprite(112, 1054, 'perso');
        this.player.setSize(250, 130)
        this.player.setOffset(140, 180)

        //création de la caméra
        this.physics.world.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setZoom(0.2);

        //calques objets
        //vide
        this.videNiv4 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetVideNiv4 = this.carteDuNiv4.getObjectLayer("vide");
        this.objetVideNiv4.objects.forEach(objetVideNiv4 => {
            this.inutile = this.videNiv4.create(objetVideNiv4.x + 4480, objetVideNiv4.y + 128, "imgInvisibleLong");
        });

        //pour la noisettes
        this.noisettesCD = false;
        this.nutt = this.physics.add.group();
        this.physics.add.overlap(this.player, this.nutt, this.recupNutt, null, this)

        //collider
        this.physics.add.collider(this.player, this.calqueMurNiv4);
        this.physics.add.collider(this.player, this.calqueTroncNiv4, this.verifGrimpette, null, this);
        this.physics.add.collider(this.player, this.videNiv4, this.teleportationVide, null, this);

        //overlap
    }

    update() {
        //déplacements
        if (this.keyQ.isDown || this.controller.left) { //si la touche gauche est appuyée
            if (this.cacher == true) {
                console.log("plus cacher")
                this.player.setVisible(true);
                this.cacher = false;

            }
            this.player.setVelocityX(-1000); //alors vitesse négative en X
            this.player.setSize(250, 130)
            this.player.setOffset(10, 180)
            this.player.anims.playReverse('left', true); //et animation => gauche
            this.aninim = 'gauche'
        }
        else if (this.keyD.isDown || this.controller.right) { //sinon si la touche droite est appuyée
            if (this.cacher == true) {
                console.log("plus cacher")
                this.player.setVisible(true);
                this.cacher = false;
            }
            this.player.setVelocityX(1000); //alors vitesse positive en X
            this.player.setSize(250, 130)
            this.player.setOffset(140, 180)
            this.player.anims.play('right', true); //et animation => droite
            this.aninim = 'droite'
        }
        else {
            this.player.setVelocityX(0)
            if (this.aninim == 'gauche') {

            }
            if (this.aninim == 'droite') {

            }
        }
        //direction noisettes
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
        //grimpette
        if (this.player.body.right && this.grimeBool == true || this.controller.B && this.player.body.right && this.grimeBool == true) {
            console.log("grimpette")
            if (this.keyZ.isDown) {
                this.player.setVelocityY(-1000);
            }
            if (this.keyS.isDown) {
                this.player.setVelocityY(1000)
            }
        }
        if (this.cursors.space.isDown && this.player.body.blocked.left && this.grimeBool == true || this.cursors.B && this.player.body.blocked.left && this.grimeBool == true) {
            console.log("grimpette")
            this.player.setVelocityY(-1000);
        }
        this.grimeBool = false;
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
            this.scene.start("SceneNiveau2", { noisettes: this.noisettes })
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
    recupNutt(player, nutt) {
        if (nutt.body.blocked.down) {
            console.log(this.noisettes)
            nutt.destroy();
            this.noisettes += 1;
            console.log(this.noisettes)
        }
    }
    teleportationVide() {
        this.player.body.x = 112;
        this.player.body.y = 1054;
    }


}