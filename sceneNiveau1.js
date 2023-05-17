class SceneNiveau1 extends Phaser.Scene {
    constructor(){
        super("SceneNiveau1")
        this.player;
        this.controller = false;
        this.tilesetNiv1;

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
    

        this.carteDuNiv1 = this.add.tilemap("carteNiveau1");
        this.tilesetNiv1 = this.carteDuNiv1.addTilesetImage("tilesetNiveau1","phaserTilesetNiveau1");

        this.calqueFondNiv1 = this.carteDuNiv1.createLayer("fonds",this.tilesetNiv1);
        this.calqueBranchesNiv1 = this.carteDuNiv1.createLayer("branches",this.tilesetNiv1)
        this.calqueMurNiv1 = this.carteDuNiv1.createLayer("mur",this.tilesetNiv1);
        this.calqueMurNiv1.setCollisionByProperty({ estSolide: true }); 


        this.player = this.physics.add.sprite(312, 2750, 'perso');
        this.player.setSize(230, 130)
        this.player.setOffset(165,75)

        this.physics.world.setBounds(0, 0, 8960, 4608);
        //  ajout du champs de la caméra de taille identique à celle du monde
        this.cameras.main.setBounds(0, 0, 8960, 4608);
        // ancrage de la caméra sur le joueur
        //this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.2);

        this.calquePremierPlanNiveau1 = this.carteDuNiv1.createLayer("premierPlan",this.tilesetNiv1);
        //calques objet
        //sortie
        //vide
        this.vide = this.physics.add.group({immovable : true ,allowGravity : false});
        this.objetVide = this.carteDuNiv1.getObjectLayer("vide");
        this.objetVide.objects.forEach(objetVide => {
          this.inutile = this.vide.create(objetVide.x+1000,objetVide.y+128,"imgInvisibleLong"); 
        });



        //collider :
        this.physics.add.collider(this.player,this.calqueMurNiv1);

        //overlap :
        this.physics.add.collider(this.player,this.vide,this.teleportationVide,null,this);
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
            this.player.setVelocityY(-1300);
            }
        
    }

    teleportationVide(){
        this.player.body.x = 312;
        this.player.body.y = 2750;
    }
}
    