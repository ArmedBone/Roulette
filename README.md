>安装

```angular2
  npm i roule --save-dev
   ```
>使用
   new Roule(HTMLCanvasDom,x,y,r);
   
```angular2
var r =new Roule(document.querySelector("#canvas")，120,120,80);
    r.setValue(92.52)
    setTimeout(function () {
        r.setValue(73)
    },2000)
```
