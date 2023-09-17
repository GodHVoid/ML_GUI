
import './guiCanvas.css';
import {useEffect, useRef, useState} from 'react';
import { rule } from './ML_Algorithms/decisionTree.js'
type CanvasProps = React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;

let points = [];
let X = []
let Y = []
let prev_canvas = [];
let current_shape_index = null;
let isDragging = false;
let startX;
let startY;
let colors = ['#fa0505','#3a9904', '#0b3cdb'];
let point_color =['#e96666','#9ce472', '#859adf']
let count = 0;
let color;

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
        contextRef.current = context;
    }, []);

    const setColor = () => {
        if(count < cls){
            count +=1;
            console.log(colors[count]);
            const co = document.querySelector('.fruity_buttom');
            co.style.backgroundColor = colors[count];
        } else{
            count = 0;
            const co = document.querySelector('.fruity_buttom');
            co.style.backgroundColor = colors[count];
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
        context.clearRect(0,0,canvas.width, canvas.height);
        for(let point of points){
            context.strokeStyle = point.color;
            context.beginPath();
            context.arc(point.x, point.y, 4, 0, 2 * Math.PI);
            context.fillStyle = point.color;
            context.fill();
        };

        for (let cox = 0; cox < 700; cox++) {
            for (let coy = 0; coy < 600; coy++) {
                // Draw a pixel on the canvas with the determined color
                context.beginPath();
                context.fillStyle = prev_canvas.color;
                context.fillRect(prev_canvas.x, prev_canvas.y, 1, 1);
            }
        }
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
            points.push({x:offsetX, y:offsetY, color: colors[count], clsName: count})
            circles(offsetX,offsetY, contextRef.current,colors[count]);
        }
    };

    const clearAll = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.clearRect(0,0,canvas.width,canvas.height);
        points= [];
        context.lineWidth = 2;
        contextRef.current = context;

    }
    
    const getX = () => {
        if(points){
            for(let point of points){
                X.push([point.x, point.y]);
                Y.push(point.clsName);
            }
        }
    };

    function mapToCanvas(x, y) {
        const canvasX = (x ) * 700;
        const canvasY = 600 - (y) * 600;
        return { x: canvasX, y: canvasY };
    }

    function classifyPointWithRules(rules, x, y) {
        // Start with the most specific (leaf) rule and work towards the root
        for (let i = rules.length - 1; i >= 0; i--) {
          const rule = rules[i];
          const [feature, operator, threshold] = rule.condition.split(' ');
      
          // Convert feature and threshold to numbers
          const featureValue = parseFloat(feature === 'feature1' ? x : y);
          const thresholdValue = parseFloat(threshold);
      
          // Check if the condition holds for this rule
          if (
            (operator === '<=' && featureValue <= thresholdValue) ||
            (operator === '>' && featureValue > thresholdValue)
          ) {
            // If the condition holds, return the predicted class
            return rule.decision;
          }
        }
      
        // If no rule is satisfied, return a default class label or handle it as needed
        return 'Unknown';
    }
      
    function drawAreas(){
        getX()
        console.log(X)
        console.log(Y)
        const rules = rule(X,Y);
        for (let cox = 0; cox < 700; cox++) {
            for (let coy = 0; coy < 600; coy++) {
                // Apply the decision tree rules to classify the point
                const predictedClass = rules.predict([[cox,coy]]);
                //console.log(`class: ${predictedClass}`)
                // Map the predicted class to a color
                color = point_color[predictedClass];
                // Draw a pixel on the canvas with the determined color
                contextRef.current.fillStyle = color;
                contextRef.current.fillRect(cox, coy, 1, 1);
                prev_canvas.push({x:cox,y:coy,color:color})
            }
        }
        contextRef.current.save();
        for(let point of points){
            contextRef.current.strokeStyle = point.color;
            contextRef.current.beginPath();
            contextRef.current.arc(point.x, point.y, 4, 0, 2 * Math.PI);
            contextRef.current.fillStyle = point.color;
            contextRef.current.fill();
        };
        contextRef.current.save();
        contextRef.current.setTransform(1, 0, 0, 1, 0, 0);
    }
    

    return (
        <div  className ="canvas-con">
            <canvas
            ref = {canvasRef}
            onMouseDown={mouse_down}
            onMouseUp={mouse_up}
            onMouseOut={mouse_out}
            onMouseMove={mouse_move}
            onClick={startDrawing}>
            </canvas>
            <div className='bar-con'>

                <button onClick={button_draw}>
                    Draw
                </button>
                <button  onClick={clearAll}>
                    Erase
                </button>
                <button className = "fruity_buttom" onClick={setColor}>
                    fruity_buttom
                </button>
                <input value={cls} placeholder = "Enter number of class"onChange={(e) => {setValue(e.target.value)}} />
                <button onClick={handle}>Button</button>
                <button onClick={drawAreas}>
                    Run
                </button>
                
            </div>
        </div>
    )

}


export default GuiCanvas;