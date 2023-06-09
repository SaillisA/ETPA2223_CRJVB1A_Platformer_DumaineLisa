class SceneNiveau4 extends Phaser.Scene {
    constructor() {
        super("SceneNiveau4")
        this.player;
        this.controller = false;
        this.tileset;
        this.noisettes = 10
        this.cle = 0;
        //grimpe
        this.grimeBool = false;
        //lance noisettes
        this.noisettesCD = false;
        this.directionPlayer = "";
        //animation
        this.aninim = ''            //pour déterminer dans quelle direction sera son anim d'attente
        this.martreDirection = true         //true = va a droite et false = va a gauche
        
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

        this.calquePorteNiv4 = this.carteDuNiv4.createLayer("porte", this.tileset);
        this.calquePorteNiv4.setCollisionByProperty({ estSolide: true });

        this.calqueDecoMurNiv4 = this.carteDuNiv4.createLayer("murDeco", this.tileset)

        //créationd du player
        this.player = this.physics.add.sprite(112, 1054, 'persoStandingDroite');
        this.player.setSize(210, 140)
        this.player.setOffset(100, 170)

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
        //cle
        this.cleNiv4 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetCleNiv4 = this.carteDuNiv4.getObjectLayer("cle");
        this.objetCleNiv4.objects.forEach(objetCleNiv4 => {
            this.inutile = this.cleNiv4.create(objetCleNiv4.x + 64, objetCleNiv4.y + 64, "imgCleFeuille");
        });
        //sortie
        this.sortieNiv4 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetSortieNiv4 = this.carteDuNiv4.getObjectLayer("sortie");
        this.objetSortieNiv4.objects.forEach(objetSortieNiv4 => {
            this.inutile = this.sortieNiv4.create(objetSortieNiv4.x + 64, objetSortieNiv4.y + 64, "imgInvisibleHaut");
        });
        //colliser
        this.collisionNiv4 = this.physics.add.group({ immovable: true, allowGravity: false });
        this.objetCollisionNiv4 = this.carteDuNiv4.getObjectLayer("collision");
        this.objetCollisionNiv4.objects.forEach(objetCollisionNiv4 => {
            this.inutile = this.collisionNiv4.create(objetCollisionNiv4.x + 64, objetCollisionNiv4.y + 64, "imgInvisibleHaut");
        });

        //pour la noisettes
        this.noisettesCD = false;
        this.nutt = this.physics.add.group();
        this.physics.add.overlap(this.player, this.nutt, this.recupNutt, null, this)
        this.physics.add.collider(this.nutt, this.calqueMurNiv4)
        //martre
        this.degatBool == true
        this.martre = this.physics.add.group();
        this.martre.create(2304, 3968, "imgMartreDroite").body.setVelocityX(1000)
        this.physics.add.collider(this.martre, this.calqueMurNiv4);
        this.physics.add.collider(this.martre, this.collisionNiv4, this.changementDirection, null, this);
        this.physics.add.overlap(this.martre, this.player, this.degats, null, this)

        //collider 
        this.physics.add.collider(this.player, this.calqueMurNiv4);
        this.physics.add.collider(this.player, this.calqueTroncNiv4, this.verifGrimpette, null, this);
        this.physics.add.collider(this.player, this.videNiv4, this.teleportationVide, null, this);
        this.collisionPorteNiv4 = this.physics.add.collider(this.player, this.calquePorteNiv4, this.ouverture, null, this);
        
        
        //overlap
        this.physics.add.overlap(this.player, this.cleNiv4, this.recupCle, null, this);
        this.physics.add.overlap(this.player, this.sortieNiv4, this.finJeu, null, this);

        this.add.image(0,0,"imgUid").setOrigin(0,0);
        this.scoreNutt=this.add.text(275,250,this.noisettes,{fontSize:'200px',fill:'#000'});
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
            this.scene.start("SceneFin", { noisettes: this.noisettes })
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
            this.scoreNutt.setText('' + this.noisettes);
            console.log(this.noisettes)
        }
    }
    teleportationVide() {
        this.player.body.x = 112;
        this.player.body.y = 1054;
    }
    ouverture(){
        if(this.cle == 6){
            this.physics.world.removeCollider(this.collisionPorteNiv4)
            this.calquePorteNiv4.setVisible(false);
        }
    }
    recupCle(player,clecle){
        this.cle += 1;
        console.log(this.cle)
        clecle.destroy()
    }
    finJeu(){
        console.log("fin")
        this.scene.start("SceneFin",{noisettes : this.noisettes})
    }
    changementDirection(martre,collision){
        if(this.martreDirection == true){
            martre.anims.play('martreRight', true);
            martre.body.setVelocityX(1000)
            this.martreDirection =false
        }
        else{
            martre.anims.play('martreLeft', true);
            martre.body.setVelocityX(-1000)
            this.martreDirection =true
        }
    }
    degats() {
        if(this.degatBool == true){
            this.noisettes -= 2;
            this.scoreNutt.setText('' + this.noisettes);
            console.log("joueur prend des dégats")
            this.degatBool = false
            this.time.delayedCall(500, this.cdAttaque, [], this);
           
        }
    }
    cdAttaque(){
        this.degatBool = true
    }

}
