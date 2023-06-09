class SceneNiveau3 extends Phaser.Scene {
    constructor() {
        super("SceneNiveau3")
        this.player;
        this.controller = false;
        this.tileset;
        //grimpe
        this.grimeBool = false;
        //lance noisettes
        this.noisettesCD = false;
        this.directionPlayer = "";
        this.aninim = 'droite'            //pour déterminer dans quelle direction sera son anim d'attente

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

        this.carteDuNiv3 = this.add.tilemap("carteNiveau3");
        this.tileset = this.carteDuNiv3.addTilesetImage("tileset", "phaserTileset");

        this.calqueFondNiv3 = this.carteDuNiv3.createLayer("fonds", this.tileset);
        this.calqueBranchesNiv3 = this.carteDuNiv3.createLayer("branches", this.tileset)

        this.calqueMurNiv3 = this.carteDuNiv3.createLayer("mur", this.tileset);
        this.calqueMurNiv3.setCollisionByProperty({ estSolide: true });

        this.calqueTroncNiv3 = this.carteDuNiv3.createLayer("tronc", this.tileset);
        this.calqueTroncNiv3.setCollisionByProperty({ estSolide: true })

        this.calqueDecoMurNiv3 = this.carteDuNiv3.createLayer("murDeco", this.tileset)

        this.player = this.physics.add.sprite(this.positionX, this.positionY, 'persoStandingDroite');
        this.player.setSize(250, 130)
        this.player.setOffset(140, 180)

        this.physics.world.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setZoom(0.2);


        //calques objet
        //vide qui nous mène au niveau3bis
        this.videNiv3 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetVideNiv3 = this.carteDuNiv3.getObjectLayer("vide");
        this.objetVideNiv3.objects.forEach(objetVideNiv3 => {
            this.inutile = this.videNiv3.create(objetVideNiv3.x + 4480, objetVideNiv3.y , "imgInvisibleLong");
        });
        //nous mene au prochain niveau (le 4)
        this.sortieNiv3 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetSortieNiv3 = this.carteDuNiv3.getObjectLayer("sortie");
        this.objetSortieNiv3.objects.forEach(objetSortieNiv3 => {
            this.inutile = this.sortieNiv3.create(objetSortieNiv3.x, objetSortieNiv3.y+320, "imgInvisibleHaut");
        });
        //objets du pont qui s'effondre quand le joueur marche dessus.
        this.pontNiv3 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetPontNiv3 = this.carteDuNiv3.getObjectLayer("pont");
        this.objetPontNiv3.objects.forEach(objetPontNiv3 => {
            this.inutile = this.pontNiv3.create(objetPontNiv3.x+192, objetPontNiv3.y+64, "imgPont");
        });
        //mur qui se casse par en dessous
        this.fragileNiv3 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetFragileNiv3 = this.carteDuNiv3.getObjectLayer("fragile");
        this.objetFragileNiv3.objects.forEach(objetFragileNiv3 => {
            this.inutile = this.fragileNiv3.create(objetFragileNiv3.x+192, objetFragileNiv3.y+64, "imgPont");
        });


        this.physics.add.collider(this.player, this.calqueMurNiv3);
        this.physics.add.collider(this.player, this.calqueTroncNiv3, this.verifGrimpette, null, this);
        this.physics.add.collider(this.player, this.videNiv3, this.tomberVide, null, this);
        this.physics.add.collider(this.player, this.sortieNiv3, this.prochaineScene, null, this);
        this.physics.add.collider(this.player, this.pontNiv3, this.effondrementPont, null, this);
        this.physics.add.collider(this.player, this.fragileNiv3);
        

        //noisettes
        this.nutt = this.physics.add.group();
        this.physics.add.collider(this.nutt, this.calqueMurNiv3);
        this.physics.add.collider(this.nutt, this.calqueTroncNiv3);
        this.physics.add.overlap(this.player, this.nutt, this.recupNutt, null, this)
        this.physics.add.collider(this.nutt, this.fragileNiv3, this.casserFragile,null,this);

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
        //cachette
        if (this.keyE.isDown && this.cacheBool == true) {
            console.log("cacher")
            this.player.setVisible(false);
            this.cacher = true;
        }
        this.grimeBool = false;
        this.cacheBool = false;

        if (this.cursors.down.isDown) {
            this.scene.start("SceneNiveau4",{noisettes : this.noisettes})
        }

        //Monstres

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
            this.scoreNutt.setText('' + this.noisettes);
            console.log(this.noisettes)
        }
    }

    tomberVide() {
        this.scene.start('SceneNiveau3bis', { noisettes: this.noisettes, positionX: this.player.body.x, positionY: 0 })
    }
    prochaineScene() {
        this.scene.start('SceneNiveau4', { noisettes: this.noisettes })
    }
    effondrementPont(player,pont) {
        pont.body.setAllowGravity(true);
    }
    casserFragile(nutt,bloc){
        if(bloc.body.touching.down){
            bloc.destroy()
            nutt.destroy()
        }
    }
}
