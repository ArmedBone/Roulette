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
const CuteText = {
    draw(ctx,value,size,fillColor,x0,y0){
        ctx.fillStyle=fillColor;
        ctx.font = "normal "+size+"px Verdana";
        ctx.fillText(value+"%",x0-20, y0);
    }
}
class Roulette {
    constructor(el,x0=120,y0=120,r0=80,dr=1,rw=20,rh=2){
        this.el=el;
        this.items=[];
        this.x0=x0;
        this.y0=y0;
        this.r0=r0;
        this.dr=dr;
        this.rw=rw;
        this.rh=rh;
        this.stage= new Stage(el,2*x0,2*y0);
        this.initStart();
    }
    setValue(num){
        this.stage.create(this,num);
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
        for(var i=150;i<=390;i+=4){
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
    constructor(canvasDom,width=160,height=160){
        this.canvasDom = canvasDom;
        this.canvasDom.width = width;
        this.canvasDom.height = height;
        this.context = this.canvasDom.getContext('2d');
        this.stackSize=0;
    }
    create(roulette,value){
        var self=this;
        roulette.items.forEach(item=>{
           self.render(item,0,'silver');
        })
        this.setLabel();
        this.setPercent(roulette,value)
    }
    setLabel(){
        let ctx = this.context,self=this;
        ctx.beginPath();
        ctx.fillStyle="silver"
        ctx.font = "normal 20px Verdana";
        ctx.fillText("好评率",this.canvasDom.width/2-30, this.canvasDom.height/2);
        ctx.fill();
    }
    Linear(t, b, c, d) { return c*t/d + b; }
    setPercent(roulette,value){
        this.stackSize = roulette.items.length
        var max = value/100*this.stackSize,index = 0,self=this,value=0;
        this.ticker(function () {
            let item=roulette.items[Math.floor(value)]
            self.render(item,value,'blue');
            if(index<self.stackSize){
                index+=1;
                value=(index/self.stackSize)*max;
                return true
            } else{
                return false
            }
        })
    }
    render(item,value,fillColor){

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

        this.drawValue(value);
    }
    drawValue(value){
        value =value*100/this.stackSize;
        let ctx = this.context,self=this;
        ctx.beginPath();
        ctx.fillStyle ='rgba(255,255,255,1)';
        ctx.fillRect(this.canvasDom.width/2-40, this.canvasDom.height/2+10,80, 25);
        ctx.fill();
        ctx.beginPath();
        CuteText.draw(ctx,value.toFixed(2),20,'black',this.canvasDom.width/2-20, this.canvasDom.height/2+30);
        ctx.fill();
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

