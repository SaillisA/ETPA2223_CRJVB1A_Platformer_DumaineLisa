class SceneNiveau1 extends Phaser.Scene {
    constructor() {
        super("SceneNiveau1")
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
        this.aninim = 'droite'            //pour déterminer dans quelle direction sera son anim d'attente
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
        //flèches directionnelles pour se déplacer a gauche et a droite


        this.noisettesCD = false;


        this.carteDuNiv1 = this.add.tilemap("carteNiveau1");
        this.tileset = this.carteDuNiv1.addTilesetImage("tileset", "phaserTileset");

        this.calqueFondNiv1 = this.carteDuNiv1.createLayer("fonds", this.tileset);
        this.calqueBranchesNiv1 = this.carteDuNiv1.createLayer("branches", this.tileset)
        this.calqueMurNiv1 = this.carteDuNiv1.createLayer("mur", this.tileset);
        this.calqueMurNiv1.setCollisionByProperty({ estSolide: true });
        this.calqueTroncNiv1 = this.carteDuNiv1.createLayer("tronc", this.tileset)
        this.calqueTroncNiv1.setCollisionByProperty({ estSolide: true });

        this.player = this.physics.add.sprite(312, 2750, 'persoStandingDroite');
        this.player.setSize(250, 130)
        this.player.setOffset(140, 180)

        this.physics.world.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setZoom(0.2);

        this.calquePremierPlanNiveau1 = this.carteDuNiv1.createLayer("premierPlan", this.tileset);
        //calques objet
        //sortie
        this.sortie = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetSortie = this.carteDuNiv1.getObjectLayer("sortie");
        this.objetSortie.objects.forEach(objetSortie => {
            this.inutile = this.sortie.create(objetSortie.x + 32, objetSortie.y + 320, "imgInvisibleHaut");
        });
        //vide
        this.vide = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetVide = this.carteDuNiv1.getObjectLayer("vide");
        this.objetVide.objects.forEach(objetVide => {
            this.inutile = this.vide.create(objetVide.x + 1000, objetVide.y + 128, "imgInvisibleLong");
        });

        this.nutt = this.physics.add.group();
        this.physics.add.collider(this.nutt, this.calqueMurNiv1);
        this.physics.add.collider(this.nutt, this.calqueTroncNiv1);
        this.physics.add.overlap(this.player, this.nutt, this.recupNutt, null, this)

        //collider :
        this.physics.add.collider(this.player, this.calqueMurNiv1);
        this.physics.add.collider(this.player, this.calqueTroncNiv1, this.verifGrimpette, null, this);

        //overlap :
        this.physics.add.collider(this.player, this.vide, this.teleportationVide, null, this);
        this.physics.add.collider(this.player, this.sortie, this.prochainNiveau, null, this)
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
        //grimpette
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
        this.grimeBool = false;


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
        this.player.body.x = 312;
        this.player.body.y = 2750;
    }
    prochainNiveau() {
        this.scene.start('SceneNiveau2', {noisettes : this.noisettes})
    }
}
