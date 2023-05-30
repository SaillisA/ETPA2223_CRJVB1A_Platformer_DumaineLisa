class ScenePreload extends Phaser.Scene {
    constructor() {
        super("ScenePreload")
    }
    init(data) {

    }
    preload() {
        //preload de la scene de test
        this.load.image('perso', 'assets/perso.png');
        this.load.image("phaserTilesetTest", "assets/maps/tilesetTest.png");
        this.load.tilemapTiledJSON("carteTest", "assets/maps/testotest.json");
        this.load.image('imgNutt', 'assets/noisettes.png')

        //divers
        this.load.image('imgInvisible', 'assets/trans.png');
        this.load.image('imgInvisibleLong', 'assets/transLong.png')
        this.load.image('imgInvisibleHaut', 'assets/transHauteur.png')
        this.load.image('imgInvisibleLarge', 'assets/transLargeur.png')
        this.load.image('imgInvisibleRangeOiseau', 'assets/transRange.png')
        this.load.image('imgTrouCachette', 'assets/cache.png')
        this.load.image('imgTrouCachetteMonstre', 'assets/cacheMonstre.png')

        this.load.image("phaserTileset", "assets/maps/tileset.png");

        //preload du niveau 1
        this.load.tilemapTiledJSON("carteNiveau1", "assets/maps/carteTiledNiveau1.json");
        //preload du niveau 2
        this.load.tilemapTiledJSON("carteNiveau2", "assets/maps/carteTiledNiveau2.json");
        //preload du niveau 3
        this.load.tilemapTiledJSON("carteNiveau3", "assets/maps/carteTiledNiveau3.json");
        this.load.image('imgPont', 'assets/pontEn3.png')
        //preload du niveau 3bis
        this.load.tilemapTiledJSON("carteNiveau3bis", "assets/maps/carteTiledNiveau3bis.json");
    }
    create() {

    }
    update() {
        this.scene.start('SceneTest')
    }

}