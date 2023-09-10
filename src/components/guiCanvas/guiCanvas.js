
import './guiCanvas.css';
import {useEffect, useRef, useState} from 'react';

type CanvasProps = React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;

let points = [];
let current_shape_index = null;
let isDragging = false;
let startX;
let startY;
let colors;
let count=0;

function grid(context){
    context.beginPath();
    for(var x=0;x<=700;x+=10) {
        context.moveTo(x,0);
        context.lineTo(x,600);
      }

      for(var y=0; y<=600; y+=10) {
        context.moveTo(0,y);
        context.lineTo(700,y);

    }
    context.strokeStyle = "black";
    context.stroke();
}

export function list_points(){
    return points;
};

const GuiCanvas: React.FC<CanvasProps> = ({...props}) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    var setIsDrawing = false;
    const[cls, setValue] = useState(""); 
    function handle() {
        console.log(cls);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 700;
        canvas.height = 600;
        const context = canvas.getContext('2d')
        context.lineWidth = 2;
        grid(context);
        contextRef.current = context;
    }, []);

    const setColor = () => {
        if(count <= cls){
            colors = '';
            var r = 255*Math.random()|0,
            g = 255*Math.random()|0,
            b = 255*Math.random()|0;
            colors = 'rgb(' + r + ',' + g + ',' + b + ')';
            console.log(colors);
            const co = document.querySelector('.fruity_buttom');
            co.style.backgroundColor = colors;
        }
    };

    function circles(x,y,context,color){
        //points.push({x:x, y:y, color:color})
        context.strokeStyle = color;
        context.beginPath();
        context.arc(x, y, 4, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill()
    }
    
    function redraw(){
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.clearRect(0,0,canvas.width,canvas.height);
        for(let point of points){
            context.strokeStyle = point.color;
            context.beginPath();
            context.arc(point.x, point.y, 4, 0, 2 * Math.PI);
            context.fillStyle = point.color;
            context.fill()
        };
    }
    
    function button_draw(){
        if(setIsDrawing === false){
            setIsDrawing = true;
        } else {
            setIsDrawing = false;
        }
    }

    let is_mouse_in_shape = function(x,y,point){
        let shape_left = point.x - 1;
        let shape_right = point.x + 1;
        let shape_top = point.y-1;
        let shape_bottom = point.y+1;

        if(x >=shape_left && x <= shape_right && y >= shape_top && y <= shape_bottom){
            //console.log('point was clicked');
            return true;
        }else{
            //console.log('point was not clicked');
            return false;
        };
    }   

    let mouse_down = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        nativeEvent.preventDefault();
        startX = parseInt(offsetX);
        startY = parseInt(offsetY);
        let det = false;
        if(setIsDrawing === false){
            let index = 0;
            for (let point of points) {
                //console.log(points);
                //console.log((`X coordinates: ${startX}, Y coordinates: ${startY}`));
                if(is_mouse_in_shape(startX,startY,point)){
                    current_shape_index = index;
                    isDragging = true;
                    det = true;
                } else{
                    index++;
                    //console.log('no');
                };
                
            };
            console.log(`was the point clicked: ${det}`);
        }
        
    };

    const mouse_up = ({nativeEvent}) =>{
        if(!isDragging) {
            return;
        };
        nativeEvent.preventDefault();
        isDragging = false;
    };

    const mouse_out = ({nativeEvent}) =>{
        if(!isDragging) {
            return;
        };
        nativeEvent.preventDefault();
        isDragging = false;
    };

    const mouse_move = ({nativeEvent}) =>{
        const {offsetX, offsetY} = nativeEvent;
        if(!isDragging){
            return;
        }else{
            console.log('move');
            nativeEvent.preventDefault();
            let mouseX = parseInt(offsetX);
            let mouseY = parseInt(offsetY);

            let dx = mouseX - startX;
            let dy = mouseY - startY;

            let current_point = points[current_shape_index];
            current_point.x += dx;
            current_point.y += dy;
            redraw(canvasRef.current);
            startX = mouseX;
            startY = mouseY;

        }
    };

    const startDrawing = ({nativeEvent}) =>{
        if(setIsDrawing){
            const {offsetX, offsetY} = nativeEvent;
            points.push({x:offsetX, y:offsetY, color: colors})
            circles(offsetX,offsetY, contextRef.current,colors);
        }
    };

    // const draw = ({nativeEvent}) => {
    //     const {offsetX, offsetY} = nativeEvent;
    //     contextRef.current.moveTo(offsetX,offsetY);
    //     contextRef.current.stroke();
    //     nativeEvent.preventDefault();
    // };
    // const stopDraw = () => {
    //     contextRef.current.closePath();
    //     setIsDrawing(false);
    // };
    // const showCoords = ({nativeEvent}) =>{
    //     const {offsetX, offsetY} = nativeEvent;
    //     console.log((`X coordinates: ${offsetX}, Y coordinates: ${offsetY}`));
        
    // }

    const clearAll = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.clearRect(0,0,canvas.width,canvas.height);
        points= [];
        context.lineWidth = 2;
        grid(context);
        contextRef.current = context;

    }
    

    return (
        <div>
            <canvas className ="canvas-con"
            ref = {canvasRef}
            onMouseDown={mouse_down}
            onMouseUp={mouse_up}
            onMouseOut={mouse_out}
            onMouseMove={mouse_move}
            onClick={startDrawing}
            onDoubleClick={setColor}>
            </canvas>
            <div>
                <button onClick={button_draw}>
                    Draw
                </button>
                <button  onClick={clearAll}>
                    Erase
                </button>
                <button className = "fruity_buttom" >
                    fruity_buttom
                </button>
                <input value={cls} placeholder = "Enter number of class"onChange={(e) => {setValue(e.target.value)}} />
                <button onClick={handle}>Button</button>
                
            </div>
        </div>
    )

}


export default GuiCanvas;