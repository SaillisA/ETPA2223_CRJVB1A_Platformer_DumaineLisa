class ScenePreload extends Phaser.Scene {
    constructor() {
        super("ScenePreload")
    }
    init(data) {

    }
    preload() {
        //sprites
        this.load.spritesheet('persoDroite','assets/spriteEcureuilDroite.png', {frameWidth: 400, frameHeight: 321});
        this.load.spritesheet('persoGauche','assets/spriteEcureuilGauche.png', {frameWidth: 400, frameHeight: 321});

        //les png transparents
        this.load.image('imgInvisible', 'assets/trans.png');
        this.load.image('imgInvisibleLong', 'assets/transLong.png')
        this.load.image('imgInvisibleHaut', 'assets/transHauteur.png')
        this.load.image('imgInvisibleLarge', 'assets/transLargeur.png')
        this.load.image('imgInvisibleRangeOiseau', 'assets/transRange.png')

        //divers
        this.load.image('imgNutt', 'assets/noisettes.png')
        this.load.image('imgTrouCachette', 'assets/cache.png')
        this.load.image('imgTrouCachetteMonstre', 'assets/cacheMonstre.png')
        this.load.image('imgOiseau','assets/oiseau.png')

        this.load.image("phaserTileset", "assets/maps/tileset.png");

        //preload de la scene de test
        this.load.image("phaserTilesetTest", "assets/maps/tilesetTest.png");
        this.load.tilemapTiledJSON("carteTest", "assets/maps/testotest.json");
        //preload du niveau 1
        this.load.tilemapTiledJSON("carteNiveau1", "assets/maps/carteTiledNiveau1.json");
        //preload du niveau 2
        this.load.tilemapTiledJSON("carteNiveau2", "assets/maps/carteTiledNiveau2.json");
        //preload du niveau 3
        this.load.tilemapTiledJSON("carteNiveau3", "assets/maps/carteTiledNiveau3.json");
        this.load.image('imgPont', 'assets/pontEn3.png')
        //preload du niveau 3bis
        this.load.tilemapTiledJSON("carteNiveau3bis", "assets/maps/carteTiledNiveau3bis.json");
        //preload du niveau 4
        this.load.tilemapTiledJSON("carteNiveau4", "assets/maps/carteTiledNiveau4.json");
        this.load.image("imgCleFeuille","assets/cleFeuille.png")
        
    }
    create() {
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('persoDroite', {start:0,end:5}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('persoGauche', {start:0,end:5}),
            frameRate: 10,
            repeat: -1
        });
    }
    update() {
        this.scene.start('SceneTest')
    }

}