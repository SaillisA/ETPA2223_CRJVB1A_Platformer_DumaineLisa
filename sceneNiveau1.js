class SceneNiveau1 extends Phaser.Scene {
    constructor() {
        super("SceneNiveau1")
        this.player;
        this.controller = false;
        this.tileset;
        this.noisettes = 10
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


        this.player = this.physics.add.sprite(312, 2750, 'perso');
        this.player.setSize(230, 130)
        this.player.setOffset(165, 75)

        this.physics.world.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setZoom(0.2);

        this.calquePremierPlanNiveau1 = this.carteDuNiv1.createLayer("premierPlan", this.tileset);
        //calques objet
        //sortie
        this.sortie = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetSortie = this.carteDuNiv1.getObjectLayer("sortie");
        this.objetSortie.objects.forEach(objetSortie => {
            this.inutile = this.sortie.create(objetSortie.x + 32, objetSortie.y + 32, "imgInvisibleHaut");
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

        //collider :
        this.physics.add.collider(this.player, this.calqueMurNiv1);

        //overlap :
        this.physics.add.collider(this.player, this.vide, this.teleportationVide, null, this);
        this.physics.add.collider(this.player, this.sortie, this.prochainNiveau, null, this)
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
            console.log("sautette")
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
        /*if (this.cursors.down.isDown) {
            this.scene.start("SceneNiveau2", {noisettes : this.noisettes})
        }*/


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
