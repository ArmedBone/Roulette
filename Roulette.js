class CuteLine {
    constructor(x,y,width,height,dr){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height = height;
        this.dr=dr;
    }
    draw(ctx,fillColor){
        ctx.fillStyle=fillColor;
        ctx.fillRect(this.x,this.y-2,this.width,this.height);
    }
}
class CuteDot {
    constructor(x,y,r){
        this.x=x;
        this.y=y;
        this.r=r;
    }
    draw(ctx,fillColor){
        ctx.fillStyle=fillColor;
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    }
}
class Roulette {
    constructor(x0,y0,r0,dr=1,rw=20,rh=2){
        this.items=[];
        this.x0=x0;
        this.y0=y0;
        this.r0=r0;
        this.dr=dr;
        this.rw=rw;
        this.rh=rh;
    }
    translateCircle(a){
        let offset = 10;
        var rad = a * Math.PI/180;
        var x  = this.r0;
        var y = 0;
        var rx  = (this.r0+offset);
        var ry = 0;
        return {
            "dot":{x,y},
            "rect":{rx,ry},
            "rad":rad
        };
    }
    getCirclePoints(){
        var points = [];
        for(var i=190;i<=350;i+=4){
            points.push(this.translateCircle(i));
        }
        return points;
    }
    initStart(){
        let points =this.getCirclePoints();
        points.forEach(point=>{
            let item =new Map();
            item.set("rad",point.rad);
            item.set("dot",new CuteDot(point["dot"].x,point["dot"].y,this.dr));
            item.set("rect",new CuteLine(point["rect"].rx,point["rect"].ry,this.rw,this.rh));
            this.items.push(item);
        })
    }

}
class Stage {
    constructor(canvasDom,width=600,height=600){
        this.canvasDom = canvasDom;
        this.canvasDom.width = width;
        this.canvasDom.height = height;
        this.context = this.canvasDom.getContext('2d');
    }
    create(roulette,value){
        var self=this;
        roulette.items.forEach(item=>{
           self.render(item,'silver');
        })
        this.setPercent(roulette,value)
    }
    setPercent(roulette,value){
        var max = Math.floor(value/100*roulette.items.length),index = 0,self=this;
        this.ticker(function () {
            let item=roulette.items[index]
            self.render(item,'blue');

            if(index<max){
                index++;
                return true
            }else{
                return false
            }
        })
    }
    render(item,fillColor){
        let rad = item.get('rad');
        let ctx = this.context,self=this;
        ctx.translate(this.canvasDom.width/2, this.canvasDom.height/2)
        ctx.rotate(rad);

        let dot = item.get("dot");
        let rect = item.get("rect");

        ctx.beginPath();
        dot.draw(ctx,fillColor);
        rect.draw(ctx,fillColor);
        ctx.fill();

        ctx.rotate(-rad);
        ctx.translate(-this.canvasDom.width/2, -this.canvasDom.height/2)
    }
    ticker(Function){
        var self=this,flag;
        function requestAnimationFrame(){
            flag = Function(self.context);
            setTimeout( function () {
                if(flag)requestAnimationFrame()
            },15)
        }
        requestAnimationFrame();
    }
}

