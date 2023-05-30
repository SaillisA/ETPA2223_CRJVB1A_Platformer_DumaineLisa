class SceneNiveau2 extends Phaser.Scene {
    constructor() {
        super("SceneNiveau2")
        this.player;
        this.controller = false;
        this.tileset;
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
        this.noisettes = data.noisettes
    }
    preload() {
    }
    create() {
        //creation des touches
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);    //lancer noisettes
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);    //se cacher
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);    //interaction
        this.cursors = this.input.keyboard.createCursorKeys();
        //la barre est utilisé pour le saut
        //flèches directionnelles pour se déplacer a gauche et a droite
        this.noisettesCD = false;

        this.carteDuNiv2 = this.add.tilemap("carteNiveau2");
        this.tileset = this.carteDuNiv2.addTilesetImage("tileset", "phaserTileset");


        //calques tuiles
        this.calqueFondNiv2 = this.carteDuNiv2.createLayer("fonds", this.tileset);
        this.calqueBranchesNiv2 = this.carteDuNiv2.createLayer("branches", this.tileset)

        this.calqueMurNiv2 = this.carteDuNiv2.createLayer("mur", this.tileset);
        this.calqueMurNiv2.setCollisionByProperty({ estSolide: true });

        this.calqueMurCasserNiv2 = this.carteDuNiv2.createLayer("murCasser", this.tileset);
        this.calqueMurCasserNiv2.setCollisionByProperty({ estSolide: true });

        this.calqueMurFragileNiv2 = this.carteDuNiv2.createLayer("fragile", this.tileset);
        this.calqueMurFragileNiv2.setCollisionByProperty({ estSolide: true });

        this.calqueTroncNiv2 = this.carteDuNiv2.createLayer("tronc", this.tileset);
        this.calqueTroncNiv2.setCollisionByProperty({ estSolide: true })

        //calques objet
        //cachettes trous
        this.trouNiv2 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetTrouNiv2 = this.carteDuNiv2.getObjectLayer("trou");
        this.objetTrouNiv2.objects.forEach(objetTrouNiv2 => {
            this.inutile = this.trouNiv2.create(objetTrouNiv2.x + 64, objetTrouNiv2.y + 32, "imgTrouCachette");
        });
        //range de l'oiseau
        this.rangeNiv2 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetRangeNiv2 = this.carteDuNiv2.getObjectLayer("rangeDetection");
        this.objetRangeNiv2.objects.forEach(objetRangeNiv2 => {
            this.inutile = this.rangeNiv2.create(objetRangeNiv2.x + 2760, objetRangeNiv2.y + 1860, "imgInvisibleRangeOiseau");
        });
        //vide
        this.videNiv2 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetVideNiv2 = this.carteDuNiv2.getObjectLayer("vide");
        this.objetVideNiv2.objects.forEach(objetVideNiv2 => {
            this.inutile = this.videNiv2.create(objetVideNiv2.x + 4480, objetVideNiv2.y + 128, "imgInvisibleLong");
        });
        this.sortieNiv2 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetSortieNiv2 = this.carteDuNiv2.getObjectLayer("sortie");
        this.objetSortieNiv2.objects.forEach(objetSortieNiv2 => {
            this.inutile = this.sortieNiv2.create(objetSortieNiv2.x, objetSortieNiv2.y+256, "imgInvisibleHaut");
        });




        this.player = this.physics.add.sprite(194, 1620, 'perso');
        this.player.setSize(230, 130)
        this.player.setOffset(165, 75)

        this.physics.world.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setZoom(0.2);

        this.calquePremierPlanNiveau2 = this.carteDuNiv2.createLayer("premierPlan", this.tileset);
        //calques objet

        //noisettes
        this.nutt = this.physics.add.group();
        this.physics.add.collider(this.nutt, this.calqueMurNiv2);
        this.physics.add.collider(this.nutt, this.calqueTroncNiv2);
        this.physics.add.collider(this.nutt, this.calqueMurCasserNiv2);
        this.physics.add.collider(this.nutt, this.calqueMurFragileNiv2, this.brancheCasser, null, this);
        this.physics.add.overlap(this.player, this.nutt, this.recupNutt, null, this)
        //collider :
        this.physics.add.collider(this.player, this.calqueMurNiv2);
        this.physics.add.collider(this.player, this.calqueTroncNiv2, this.verifGrimpette, null, this);
        this.collisionMurCasser = this.physics.add.collider(this.player, this.calqueMurCasserNiv2);
        this.collisionMurFragile = this.physics.add.collider(this.player, this.calqueMurFragileNiv2);
        this.physics.add.collider(this.player, this.videNiv2, this.teleportationVide, null, this);
        //overlap :
        this.physics.add.overlap(this.player, this.trouNiv2, this.cachetteBool, null, this);
        this.physics.add.overlap(this.player, this.sortieNiv2, this.prochainNiveau, null, this);
    }

    update() {
        if (this.cursors.left.isDown || this.controller.left) { //si la touche gauche est appuyée
            if (this.cacher == true) {
                console.log("plus cacher")
                this.player.setVisible(true);
                this.cacher = false;

            }
            this.player.setVelocityX(-1000); //alors vitesse négative en X
            this.directionPlayer = "left"
        }
        else if (this.cursors.right.isDown || this.controller.right) { //sinon si la touche droite est appuyée
            if (this.cacher == true) {
                console.log("plus cacher")
                this.player.setVisible(true);
                this.cacher = false;
            }
            this.player.setVelocityX(1000); //alors vitesse positive en X
            this.directionPlayer = "right"
        }
        else {
            this.player.setVelocityX(0)
        }
        if (this.cursors.up.isDown || this.controller.up) {
            this.directionPlayer = "up"
        }

        //saut
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
        //cachette
        if (this.keyZ.isDown && this.cacheBool == true) {
            console.log("cacher")
            this.player.setVisible(false);
            this.cacher = true;
        }
        this.grimeBool = false;
        this.cacheBool = false;

        //Monstres

        /*if (this.cursors.down.isDown) {
            this.scene.start("SceneNiveau3",{noisettes : this.noisettes, positionX :192, positionY : 3212})
        }*/

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
    brancheCasser(nutt) {
        this.calqueMurCasserNiv2.setVisible(false);
        this.physics.world.removeCollider(this.collisionMurFragile)
        this.calqueMurFragileNiv2.setVisible(false);
        this.physics.world.removeCollider(this.collisionMurCasser)
        nutt.setVisible(false);

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
        this.player.body.x = 194;
        this.player.body.y = 1620;
    }
    prochainNiveau(){
        this.scene.start("SceneNiveau3",{noisettes : this.noisettes, positionX :192, positionY : 3212})
    }

}
