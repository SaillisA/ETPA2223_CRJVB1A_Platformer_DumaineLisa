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
        this.positionJoueurY = 0;
        this.oiseauBool = true;
        this.degatBool = true;
        this.aninim = 'droite'            //pour déterminer dans quelle direction sera son anim d'attente

    }
    init(data) {
        this.noisettes = data.noisettes
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

        this.calqueDecoMurNiv2 = this.carteDuNiv2.createLayer("murDeco", this.tileset)

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
            this.inutile = this.rangeNiv2.create(objetRangeNiv2.x + 2384, objetRangeNiv2.y + 1860, "imgInvisibleRangeOiseau");
        });
        //vide
        this.videNiv2 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetVideNiv2 = this.carteDuNiv2.getObjectLayer("vide");
        this.objetVideNiv2.objects.forEach(objetVideNiv2 => {
            this.inutile = this.videNiv2.create(objetVideNiv2.x + 4300, objetVideNiv2.y + 128, "imgInvisibleLong");
        });
        //sortie
        this.sortieNiv2 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetSortieNiv2 = this.carteDuNiv2.getObjectLayer("sortie");
        this.objetSortieNiv2.objects.forEach(objetSortieNiv2 => {
            this.inutile = this.sortieNiv2.create(objetSortieNiv2.x, objetSortieNiv2.y + 320, "imgInvisibleHaut");
        });
        //noisetteSpawn
        this.spawnNuttNiv2 = this.physics.add.group({ immovable: true, allowGravity: true });
        this.objetSpawnNuttNiv2 = this.carteDuNiv2.getObjectLayer("spawnNutt");
        this.objetSpawnNuttNiv2.objects.forEach(objetSpawnNuttNiv2 => {
            this.inutile = this.spawnNuttNiv2.create(objetSpawnNuttNiv2.x+0, objetSpawnNuttNiv2.y + 0, "imgNutt");
        });




        this.player = this.physics.add.sprite(194, 1620, 'persoStandingDroite');
        this.player.setSize(250, 130)
        this.player.setOffset(140, 180)

        this.physics.world.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setZoom(0.2);

        this.calquePremierPlanNiveau2 = this.carteDuNiv2.createLayer("premierPlan", this.tileset);
        //oiseau
        this.objetOiseauNiv2 = this.carteDuNiv2.getObjectLayer("oiseau");
        this.objetOiseauNiv2.objects.forEach(objetOiseauNiv2 => {
            this.oiseauNiv2 = this.physics.add.sprite(objetOiseauNiv2.x + 64 , objetOiseauNiv2.y + 64 , 'imgOiseau');
        });
        this.oiseauNiv2.body.setAllowGravity(false)

        //oiseau
        this.physics.add.overlap(this.oiseauNiv2, this.player, this.degats, null, this)
        this.physics.add.collider(this.oiseauNiv2, this.nutt, this.etourdissement, null, this)
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
        this.physics.add.collider(this.spawnNuttNiv2, this.calqueMurNiv2);
        //overlap :
        this.physics.add.overlap(this.player, this.trouNiv2, this.cachetteBool, null, this);
        this.physics.add.overlap(this.player, this.sortieNiv2, this.prochainNiveau, null, this);
        this.physics.add.overlap(this.player, this.rangeNiv2, this.criOiseau, null, this);
        this.physics.add.overlap(this.player, this.spawnNuttNiv2, this.recupNutt, null, this);

        this.add.image(0,0,"imgUid").setOrigin(0,0);
        this.scoreNutt=this.add.text(275,250,this.noisettes,{fontSize:'200px',fill:'#000'});
    }

    update() {
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
            if(this.aninim == 'gauche'){
                this.player.setSize(210, 140)
                this.player.setOffset(100, 170)
                this.player.anims.play('leftStand', true);
            }
            if(this.aninim == 'droite'){
                this.player.setSize(210, 140)
                this.player.setOffset(100, 170)
                this.player.anims.play('rightStand', true);
            }
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

        //lancer noisettes
        if (this.keyA.isDown && this.noisettes > 0 && this.noisettesCD == false || this.controller.A && this.noisettes > 0 && this.noisettesCD == false) {
            console.log("condition pour lancer des noisettes remplies :)")
            this.noisettes -= 1;
            this.scoreNutt.setText('' + this.noisettes);
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
        //cachette
        if (this.keyE.isDown && this.cacheBool == true) {
            console.log("cacher")
            this.player.setVisible(false);
            this.cacher = true;
        }
        this.grimeBool = false;
        this.cacheBool = false;

        //Monstres
        if(this.oiseauNiv2.body.x <=0 && this.oiseauBool == false){
            this.oiseauNiv2.setVelocityX(0)
            this.respawnOiseau()

        }

        if (this.cursors.down.isDown) {
            this.scene.start("SceneNiveau3", { noisettes: this.noisettes, positionX: 192, positionY: 3212 })
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
            this.scoreNutt.setText('' + this.noisettes);
            console.log(this.noisettes)
        }
    }
    criOiseau() {
        if (this.oiseauBool == true && this.cacher ==false) {
            console.log("joueur repérer")
            //l'oiseau cris
            this.oiseauBool = false
            this.oiseauNiv2.setVelocityY(-1000)
            this.degatBool = true
            this.time.delayedCall(500, this.attaqueOiseau, [], this);
        }
    }
    attaqueOiseau() {
        this.oiseauNiv2.setVelocityY(0)
        this.positionJoueurY = this.player.body.y
        console.log("oiseau fonce sur joueur")
        this.oiseauNiv2.setPosition(9100,this.positionJoueurY )
        this.oiseauNiv2.setVelocityX(-2500)
    }

    degats() {
        if(this.cacher == false){
            if(this.degatBool == true){
                this.noisettes -= 2;
                this.scoreNutt.setText('' + this.noisettes);
                console.log("joueur prend des dégats")
                this.degatBool = false
            }
        }
        if(this.cacher == true){
            console.log("pas de dégats")
        }
    }
    /*etourdissement(oiseau, noisette) {
        console.log("oiseau étourdit")
        noisette.destroy()
        this.oiseauNiv2.body.setVelocityY(10000)
        this.time.delayCall(1000, this.respawnOiseau, [], this)
    }*/
    respawnOiseau() {
        console.log("oiseau revient")
        this.oiseauNiv2.body.position.x = 4156;
        this.oiseauNiv2.body.position.y = 252;
        this.oiseauBool = true;
    }

    teleportationVide() {
        this.player.body.x = 194;
        this.player.body.y = 1620;
    }
    prochainNiveau() {
        this.scene.start("SceneNiveau3", { noisettes: this.noisettes, positionX: 192, positionY: 3212 })
    }

}
