class SceneNiveau2 extends Phaser.Scene {
    constructor(){
        super("SceneNiveau2")
        this.player;
        this.controller = false;
        this.tilesetNiv2;
        this.noisettes = 10;
        //grimpe
        this.grimeBool = false;
        //cachette
        this.cacheBool = false;
        this.cacher = false;
        //lance noisettes
        this.noisettesCD = false;
        this.directionPlayer = "";

    }
    init(data){

    }
    preload(){
    }
    create(){
        //creation des touches
        this.keyA =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);    //lancer noisettes
        this.keyZ =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);    //se cacher
        this.keyE =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);    //interaction
        this.cursors = this.input.keyboard.createCursorKeys();
        //la barre est utilisé pour le saut
        //flèches directionnelles pour se déplacer a gauche et a droite
        this.noisettesCD = false;
    
        this.carteDuNiv2 = this.add.tilemap("carteNiveau2");
        this.tilesetNiv2 = this.carteDuNiv2.addTilesetImage("tilesetNiveau2","phaserTilesetNiveau2");


        //calques tuiles
        this.calqueFondNiv2 = this.carteDuNiv2.createLayer("fonds",this.tilesetNiv2);
        this.calqueBranchesNiv2 = this.carteDuNiv2.createLayer("branches",this.tilesetNiv2)

        this.calqueMurNiv2 = this.carteDuNiv2.createLayer("mur",this.tilesetNiv2);
        this.calqueMurNiv2.setCollisionByProperty({ estSolide: true }); 

        this.calqueMurCasserNiv2 = this.carteDuNiv2.createLayer("murCasser",this.tilesetNiv2);
        this.calqueMurCasserNiv2.setCollisionByProperty({ estSolide: true }); 

        this.calqueMurFragileNiv2 = this.carteDuNiv2.createLayer("fragile",this.tilesetNiv2);
        this.calqueMurFragileNiv2.setCollisionByProperty({ estSolide: true }); 

        this.calqueTroncNiv2 = this.carteDuNiv2.createLayer("tronc",this.tilesetNiv2);
        this.calqueTroncNiv2.setCollisionByProperty({ estSolide: true })

        //calques objet

        this.player = this.physics.add.sprite(194, 1620, 'perso');
        this.player.setSize(230, 130)
        this.player.setOffset(165,75)

        this.physics.world.setBounds(0, 0, 8960, 4608);
        //  ajout du champs de la caméra de taille identique à celle du monde
        this.cameras.main.setBounds(0, 0, 8960, 4608);
        // ancrage de la caméra sur le joueur
        //this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.2);

        this.calquePremierPlanNiveau2 = this.carteDuNiv2.createLayer("premierPlan",this.tilesetNiv2);
        //calques objet

        //noisettes
        this.nutt = this.physics.add.group();
        this.physics.add.collider(this.nutt, this.calqueMurNiv2);
        this.physics.add.collider(this.nutt, this.calqueTroncNiv2);
        this.physics.add.collider(this.nutt, this.calqueMurCasserNiv2);
        this.physics.add.collider(this.nutt, this.calqueMurFragileNiv2,this.brancheCasser,null,this);
        //collider :
        this.physics.add.collider(this.player,this.calqueMurNiv2);
        this.physics.add.collider(this.player,this.calqueTroncNiv2,this.verifGrimpette,null,this);
        this.collisionMurCasser=this.physics.add.collider(this.player,this.calqueMurCasserNiv2);
        this.collisionMurFragile=this.physics.add.collider(this.player,this.calqueMurFragileNiv2);
        //overlap :
    }

    update(){
        if (this.cursors.left.isDown || this.controller.left) { //si la touche gauche est appuyée
            if(this.cacher == true ){
                console.log("plus cacher")
                this.player.setVisible(true);
                this.cacher = false;

            }
            this.player.setVelocityX(-1000); //alors vitesse négative en X
            this.directionPlayer = "left"
            }
        else if (this.cursors.right.isDown || this.controller.right) { //sinon si la touche droite est appuyée
            if(this.cacher == true ){
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
        if(this.cursors.up.isDown || this.controller.up){
            this.directionPlayer = "up"
        }
        
        //saut
        if (this.cursors.space.isDown && this.player.body.blocked.down|| this.controller.B && this.player.body.blocked.down) {
            console.log("sautette")
            this.player.setVelocityY(-1000);
            }
        if (this.cursors.space.isDown && this.player.body.right && this.grimeBool == true || this.controller.B && this.player.body.right && this.grimeBool == true){
            console.log("grimpette")
            this.player.setVelocityY(-1000);
            }
        if (this.cursors.space.isDown && this.player.body.blocked.left && this.grimeBool == true || this.cursors.B && this.player.body.blocked.left && this.grimeBool == true){
            console.log("grimpette")
            this.player.setVelocityY(-1000);
            }
        
        //lancer noisettes
        if(this.keyA.isDown && this.noisettes>0 && this.noisettesCD == false || this.controller.A && this.noisettes>0 && this.noisettesCD == false ){
            console.log("condition pour lancer des noisettes remplies :)")
            this.noisettes -= 1;
            console.log(this.noisettes)

            if(this.directionPlayer == "left" ){
                this.nutt.create(this.player.x, this.player.y, "imgNutt").body.setVelocityX(-1000)
            };
            if(this.directionPlayer == "right"){
                this.nutt.create(this.player.x, this.player.y, "imgNutt").body.setVelocityX(1000)
            }
            if(this.directionPlayer == "up" ){
                this.nutt.create(this.player.x, this.player.y, "imgNutt").body.setVelocityY(-1300)
            };

            this.noisettesCD = true;
            this.time.delayedCall(500, this.resertNoisettesCD, [], this);
        }
        //cachette
        if(this.keyZ.isDown && this.cacheBool == true){
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
    resertNoisettesCD(){
        console.log("lancer de noisettes disponibles")
        this.noisettesCD = false;
    }
    cachetteBool(){
        console.log("cachette possible")
        this.cacheBool = true;
    }
    brancheCasser(nutt){
        this.calqueMurCasserNiv2.setVisible(false);
        this.physics.world.removeCollider(this.collisionMurFragile)
        this.calqueMurFragileNiv2.setVisible(false);
        this.physics.world.removeCollider(this.collisionMurCasser)
        nutt.setVisible(false);
        
    }

}
    