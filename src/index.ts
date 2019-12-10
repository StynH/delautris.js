import Delaunator from 'delaunator';

class Point{
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toArray(){
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
}

class Delautris {
    private screenWidth: number = 0;
    private screenHeight: number = 0;

    private readonly interval:number;

    private readonly amountOfPoints: number;
    private readonly fps: number;

    private points: Point[] = [];
    private triangles: Triangle[] = [];

    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

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
        this.drawEdge();
        this.scatterIndices();
        this.buildTriangles();
    }

    drawEdge(){
        for(let x = 0; x <= this.screenWidth; x += this.screenWidth / 8){
            for(let y = 0; y <= this.screenHeight; y += this.screenHeight / 8){
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
                0
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

        console.log(this.triangles);
    }

    drawPoint(point: Point){
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(point.x, point.y, 3, 3);
    }

    drawTriangle(triangle: Triangle){
        this.ctx.strokeStyle = "#000000";
        this.ctx.beginPath();
        this.ctx.moveTo(triangle.a.x, triangle.a.y);
        this.ctx.lineTo(triangle.b.x, triangle.b.y);
        this.ctx.lineTo(triangle.c.x, triangle.c.y);
        this.ctx.lineTo(triangle.a.x, triangle.a.y);
        this.ctx.stroke();
    }

    mainLoop(){
        this.triangles.forEach((tri) => {
           this.drawTriangle(tri);
        });
    }

    start(){
        this.setup();
        setInterval(() => {
            this.mainLoop();
        }, this.interval);
    }
}

export { Delautris as Instance }