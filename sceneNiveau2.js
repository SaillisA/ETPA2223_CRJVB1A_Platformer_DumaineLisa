class SceneNiveau2 extends Phaser.Scene {
    constructor(){
        super("SceneNiveau2")
        this.player;
        this.controller = false;
        this.tilesetNiv2;
        //grimpe
        this.grimeBool = false;

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

        this.calqueFondNiv2 = this.carteDuNiv2.createLayer("fonds",this.tilesetNiv2);
        this.calqueBranchesNiv2 = this.carteDuNiv2.createLayer("branches",this.tilesetNiv2)
        this.calqueMurNiv2 = this.carteDuNiv2.createLayer("mur",this.tilesetNiv2);
        this.calqueMurNiv2.setCollisionByProperty({ estSolide: true }); 

        this.calqueTroncNiv2 = this.carteDuNiv2.createLayer("tronc",this.tilesetNiv2);
        this.calqueTroncNiv2.setCollisionByProperty({ estSolide: true })

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



        //collider :
        this.physics.add.collider(this.player,this.calqueMurNiv2);
        this.physics.add.collider(this.player,this.calqueTroncNiv2,this.verifGrimpette,null,this);

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
            
        this.grimeBool = false;
    }
    verifGrimpette(){
        console.log("verifgrimpette")
        this.grimeBool = true;
    }

}
    