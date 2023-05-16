class ScenePreload extends Phaser.Scene {
    constructor(){
        super("ScenePreload")
    }
    init(data){

    }
    preload(){
        //prelod de la scene de test
        this.load.image('perso','assets/perso.png');
        this.load.image("phaserTilesetTest","assets/tilesetTest.png");
        this.load.tilemapTiledJSON("carteTest","assets/testotest.json");
        this.load.image('imgInvisible','assets/trans.png');
    }
    create(){

    }
    update(){
        this.scene.start('SceneTest')
    }

}