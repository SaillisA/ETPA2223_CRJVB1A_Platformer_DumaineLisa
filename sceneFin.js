class SceneFin extends Phaser.Scene {
    constructor() {
        super("SceneFin")
    }
    init(data) {
        this.noisettes = data.noisettes
    }
    preload() {
        this.load.image('imgParfait', 'assets/fin5.png');
        this.load.image('imgBien', 'assets/fin4.png');
        this.load.image('imgNeutre', 'assets/fin3.png');
        this.load.image('imgNul', 'assets/fin2.png');
        this.load.image('imgHorrible', 'assets/fin1.png');
    }
    create() {

        this.physics.world.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setBounds(0, 0, 8960, 4608);
        this.cameras.main.setZoom(0.2);
    }
    update(){
        if(this.noisettes > 8){
            this.add.image(0,0,"imgParfait").setOrigin(0,0);
        }
        if(this.noisettes > 6 && this.noisettes <=8){
            this.add.image(0,0,"imgBien").setOrigin(0,0);
        }
        if(this.noisettes>=4  && this.noisettes <= 6 ){
            this.add.image(0,0,"imgNeutre").setOrigin(0,0);
        }
        if(this.noisettes >=1 && this.noisettes <4 ){
            this.add.image(0,0,"imgNul").setOrigin(0,0);
        }
        if(this.noisettes<= 0){
            this.add.image(0,0,"imgHorrible").setOrigin(0,0);

        }


    }


}