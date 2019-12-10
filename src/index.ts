import Delaunator from 'delaunator';
import Noise from 'simplex-noise';
import SimplexNoise from "simplex-noise";

class Point{
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toArray(): Array<number>{
        return [this.x, this.y];
    }
}

class Triangle{
    public a: Point;
    public b: Point;
    public c: Point;

    constructor(a: Point, b: Point, c: Point) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    get points(): Array<Point>{
        return [this.a, this.b, this.c];
    }
}

class Delautris {
    private screenWidth: number = 0;
    private screenHeight: number = 0;

    private readonly interval:number;

    private readonly amountOfPoints: number;
    private readonly fps: number;
    private time: number = 0;

    private points: Point[] = [];
    private triangles: Triangle[] = [];

    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    private readonly noise: SimplexNoise = new SimplexNoise();

    constructor(canvasName: string = "delautrisCanvas", amountOfPoints: number = 32, fps: number = 144) {
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
        this.ctx.canvas.width = this.canvas.clientWidth;
        this.ctx.canvas.height = this.canvas.clientHeight;

        this.screenWidth = this.ctx.canvas.width;
        this.screenHeight = this.ctx.canvas.height;
    };

    getRandom(min: number, max: number){
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    };

    addPoint(x: number, y: number, z: number){
        this.points.push(new Point(x, y, z));
    }

    setup(){
        this.buildEdge();
        this.scatterIndices();
        this.buildTriangles();
    }

    buildEdge(){
        for(let x = 0; x <= this.screenWidth; x += this.screenWidth / 16){
            for(let y = 0; y <= this.screenHeight; y += this.screenHeight / 16){
                if(y != 0 && x != 0 && x != this.screenWidth && y != this.screenHeight) continue;

                this.addPoint(
                    x,
                    y,
                    0
                );
            }
        }
    }

    scatterIndices(){
        for(let i = 0; i < this.amountOfPoints; ++i){
            this.addPoint(
                this.getRandom(0, this.screenWidth),
                this.getRandom(0, this.screenHeight),
                this.getRandom(-8, 8)
            );
        }
    }

    buildTriangles(){
        const converted = this.points.map((point) => point.toArray());
        const delaunay = Delaunator.from(converted);

        //Iterate indices
        for(let i = delaunay.triangles.length - 1; i >= 0; i -= 3){
            this.triangles.push(
                new Triangle(
                    this.points[delaunay.triangles[i]],
                    this.points[delaunay.triangles[i - 1]],
                    this.points[delaunay.triangles[i - 2]]
                )
            )
        }
    }

    increaseBrightness(hex: string, lum: number){
        hex = String(hex).replace(/[^0-9a-f]/gi, "");

        if (hex.length < 6) {
            hex = hex.replace(/(.)/g, '$1$1');
        }
        lum = lum || 0;

        let rgb = "#", c;
        for (let i = 0; i < 3; ++i) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }
        return rgb;
    };

    updatePoints(point: Point){
        point.z = 16*this.noise.noise3D(point.x / 8, point.y / 8, this.time * 1e-4);
    }

    drawTriangle(triangle: Triangle){
        this.ctx.fillStyle=this.increaseBrightness("#550000", ((triangle.a.z + triangle.b.z + triangle.c.z) / 3) / 16 + 0.1);
        this.ctx.beginPath();
        this.ctx.moveTo(triangle.a.x, triangle.a.y);
        this.ctx.lineTo(triangle.b.x, triangle.b.y);
        this.ctx.lineTo(triangle.c.x, triangle.c.y);
        this.ctx.lineTo(triangle.a.x, triangle.a.y);
        this.ctx.fill();
    }

    mainLoop(){
        this.triangles.forEach((tri) => {
           this.drawTriangle(tri);

            for (let point of tri.points) {
                this.updatePoints(point);
            }
        });
    }

    start(){
        this.setup();
        setInterval(() => {
            this.mainLoop();
            this.time += this.interval;
        }, this.interval);
    }
}

export { Delautris as Instance }