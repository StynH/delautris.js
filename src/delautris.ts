class Point{
    private x: number;
    private y: number;
    private z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get getX(){
        return this.x;
    }

    get getY(){
        return this.y;
    }

    get getZ(){
        return this.z;
    }

    set setX(x: number){
        this.x = x;
    }

    set setY(y: number){
        this.y = y;
    }

    set setZ(z: number){
        this.z = z;
    }
}

class Delautris {
    private screenWidth: number = 0;
    private screenHeight: number = 0;

    private readonly interval:number;

    private readonly amountOfPoints: number;
    private readonly fps: number;
    private points: Point[] = [];

    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    constructor(canvasName: string = "delautrisCanvas", amountOfPoints: number = 64, fps: number = 144) {
        if(!document.querySelector("#" + canvasName)){
            throw "Canvas not found (ID = " + canvasName + "), make sure it exists.";
        }

        this.amountOfPoints = amountOfPoints;
        this.fps = fps;
        this.canvas = <HTMLCanvasElement>document.querySelector("#" + canvasName);
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        this.interval = 1000 / this.fps;

        this.resizeFunction();
    }

    resizeFunction(){
        // @ts-ignore
        this.ctx.canvas.width = this.canvas.clientWidth;
        // @ts-ignore
        this.ctx.canvas.height = this.canvas.clientHeight;

        // @ts-ignore
        this.screenWidth = this.ctx.canvas.width;
        // @ts-ignore
        this.screenHeight = this.ctx.canvas.height;
    };

    getRandom(min: number, max: number){
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    };

    addPoint(x: number, y: number, z: number){
        this.points.push(new Point(x, y, z));
    }

    setup(){
        for(let i = 0; i < this.amountOfPoints; ++i){
            this.addPoint(
                this.getRandom(0, this.screenWidth),
                this.getRandom(0, this.screenHeight),
                0
            );
        }
    }

    drawPoint(point: Point){
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(point.getX, point.getY, 3, 3);
    }

    mainLoop(){
        this.points.forEach((point) => {
           this.drawPoint(point);
        });
    }

    start(){
        this.setup();
        setInterval(() => {
            this.mainLoop();
        }, this.interval);
    }
}