
import './guiCanvas.css';
import {useEffect, useRef, useState} from 'react';
import { rule } from './ML_Algorithms/decisionTree.js'
import { Tile } from '@tensorflow/tfjs';
import {Text, StyleSheet} from 'react-native';
type CanvasProps = React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;

let points = [];
let X = [];
let Y = [];
let prev_canvas = [];
let current_shape_index = null;
let isDragging = false;
let startX;
let startY;
let colors = ['#fa0505','#3a9904', '#0b3cdb', '#a30581'];
let point_color =['#e96666','#9ce472', '#859adf', '#cc49b0']
let count = 0;
let color;
let dataURL;
let image=new Image();
let reset;


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
    const canvasRef = useRef('.canvas-con');
    const contextRef = useRef('.canvas-con');
    var setIsDrawing = false;
    const [criterion, setCriterion] = useState("");
    const [Splitter, setSplitter] = useState("");
    const [max_depth, setMaxDepth] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        // 👇 Store the input value to local state
        setCriterion(e.target.value);
      };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 500;

        canvas.height = 500;
        const context = canvas.getContext('2d')
        context.lineWidth = 2;
        contextRef.current = context;
        reset = canvas.toDataURL();
        

    }, []);

    const setColor = () => {
        const co = document.querySelector('.fruity_buttom');
        co.style.backgroundColor = colors[count];
        if(count < (colors.length-1)){
            count +=1;
            console.log(colors[count]);
        } else{
            count = 0;
        }
        co.style.backgroundColor = colors[count]
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

        image.onload = function(){
            context.drawImage(image,0,0);
            for(let point of points){
                context.beginPath();
                context.strokeStyle = point.color;
                context.arc(point.x, point.y, 4, 0, 2 * Math.PI);
                context.fillStyle = point.color;
                context.fill();
            };
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
            image.src=dataURL;
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
        prev_canvas = [];
        X = [];
        Y = [];
         // After modifying the image data
        dataURL = canvas.toDataURL();
        image.src=dataURL;
        context.lineWidth = 2;
        contextRef.current = context;
        context.drawImage(image, 0,0);

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
        if(points.length){
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            getX()
            console.log(X)
            console.log(Y)
            const rules = rule(X,Y);
            contextRef.current.clearRect(0,0,canvas.width,canvas.height);
            for (let cox = 0; cox < canvas.width; cox++) {
                for (let coy = 0; coy < canvas.height; coy++) {
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
            dataURL = canvas.toDataURL();

            for(let point of points){
                contextRef.current.strokeStyle = point.color;
                contextRef.current.beginPath();
                contextRef.current.arc(point.x, point.y, 4, 0, 2 * Math.PI);
                contextRef.current.fillStyle = point.color;
                contextRef.current.fill();
            };
        }
        
    }
    

    return (
        <div  className ="con">
            <div className='para-con'>
                <Text style={styles.titleText}>{'Hyperparameters:'}
                </Text>
                <form>
                    <label>Criterion: </label> 
                        <select value={criterion} onChange={handleChange}>            
                            <option value="gini">gini</option>
                            <option value="entropy">entropy</option>
                            <option value="log loss">log loss</option>
                        </select>
                    <label>Splitter: </label>
                        <select value={Splitter} onChange={handleChange}>            
                            <option value="best">best</option>
                            <option value="random">random</option>
                        </select>
                    <label>Max Depth: </label>
                        <input value={max_depth} placeholder='default is none'></input>

                    <label>Min splits: </label>
                        <input value={max_depth} placeholder='default is 2'></input>
                    <label>Min leafs: </label>
                        <input value={max_depth} placeholder='default is 2'></input>
                    <label>Max leafs: </label>
                        <input value={max_depth} placeholder='default is 2'></input>
                    <label>Impurity: </label>
                        <input value={max_depth} placeholder='ex:0.0'></input>
                    <label>Ccp alpha: </label>
                        <input value={max_depth} placeholder='ex:0.0'></input>
                </form>

                <button className= '.button' onClick={drawAreas}>
                    Run
                </button>
            </div>
           <div className='right_Side'>
                <canvas className='canvas-con'
                ref = {canvasRef}
                onMouseDown={mouse_down}
                onMouseUp={mouse_up}
                onMouseOut={mouse_out}
                onMouseMove={mouse_move}
                onClick={startDrawing}>
                </canvas>
                <div className='bar-con'>

                    <button className= '.button' onClick={button_draw}>
                        Draw
                    </button>
                    <button className= '.button'  onClick={clearAll}>
                        Erase
                    </button>
                    <button className = "fruity_buttom" onClick={setColor}>
                        Change Class
                    </button>
                    
                </div>
           </div>
        </div>
    )

}

const styles = StyleSheet.create({
    baseText: {
      fontFamily: 'Cochin',
      textAlign: 'center',
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });


export default GuiCanvas;