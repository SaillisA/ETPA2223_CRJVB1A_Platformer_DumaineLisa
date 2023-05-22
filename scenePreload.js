class ScenePreload extends Phaser.Scene {
    constructor(){
        super("ScenePreload")
    }
    init(data){

    }
    preload(){
        //preload de la scene de test
        this.load.image('perso','assets/perso.png');
        this.load.image("phaserTilesetTest","assets/tilesetPNG/tilesetTest.png");
        this.load.tilemapTiledJSON("carteTest","assets/maps/testotest.json");
        this.load.image('imgNutt','assets/noisettes.png')

        //divers
        this.load.image('imgInvisible','assets/trans.png');
        this.load.image('imgInvisibleLong','assets/transLong.png')
        this.load.image('imgInvisibleHaut','assets/transHauteur.png')

        //preload du niveau 1
        this.load.image("phaserTilesetNiveau1","assets/tilesetPNG/tilesetNiveau1.png");
        this.load.tilemapTiledJSON("carteNiveau1","assets/maps/carteTiledNiveau1.json");
        //preload du niveau 2
        this.load.image("phaserTilesetNiveau2","assets/tilesetPNG/tilesetNiveau2.png");
        this.load.tilemapTiledJSON("carteNiveau2","assets/maps/carteTiledNiveau2.json");
    }
    create(){

    }
    update(){
        this.scene.start('SceneTest')
    }

}