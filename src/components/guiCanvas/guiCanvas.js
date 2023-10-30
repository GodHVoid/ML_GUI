import "./guiCanvas.css";
import { useEffect, useRef, useState } from "react";
import { rule } from "./ML_Algorithms/decisionTree.js";
import { Text, StyleSheet } from "react-native";
import { Dtparameters, dtpara } from "./Hyperparamters/decisionTreePara";
import { RFparameters, RFpara } from "./Hyperparamters/RFPara.js";

let [X, Y, points] = [[], [], []];
let [current_shape_index, startX, startY, color, dataURL, isDragging, preRun] =
  [];
//let colors = ["#fa0505", "#3a9904", "#0b3cdb", "#a30581"];
let point_color = ["#e96666", "#9ce472", "#859adf", "#cc49b0"];
let count = 0;
let image = new Image();

// function grid(context){
//     context.beginPath();
//     for(var x=0;x<=700;x+=10) {
//         context.moveTo(x,0);
//         context.lineTo(x,600);
//       }

//       for(var y=0; y<=600; y+=10) {
//         context.moveTo(0,y);
//         context.lineTo(700,y);

//     }
//     context.strokeStyle = "black";
//     context.stroke();
// }

function GuiCanvas(props) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  var setIsDrawing = false;
  const [selectAlgo, setAlgo] = useState("Decision Tree");
  const [colors, setColor] = useState("#fa0505");
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 600;
    canvas.height = 500;
    const context = canvas.getContext("2d");
    context.lineWidth = 2;
    contextRef.current = context;
  }, []);

  //   const changeColor = () => {
  //     const co = document.querySelector(".fruity_buttom");
  //     co.style.backgroundColor = colors[count];
  //     if (count < colors.length - 1) {
  //       count += 1;
  //       console.log(colors[count]);
  //     } else {
  //       count = 0;
  //     }
  //     co.style.backgroundColor = colors[count];
  //   };

  function circles(x, y, context, color) {
    context.strokeStyle = color;
    context.beginPath();
    context.arc(x, y, 4, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
  }

  function redraw() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (preRun) {
      image.onload = function () {
        context.drawImage(image, 0, 0);
        for (let point of points) {
          context.beginPath();
          context.strokeStyle = point.color;
          context.arc(point.x, point.y, 4, 0, 2 * Math.PI);
          context.fillStyle = point.color;
          context.fill();
        }
      };
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let point of points) {
        context.beginPath();
        context.strokeStyle = point.color;
        context.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        context.fillStyle = point.color;
        context.fill();
      }
    }
  }

  //   function button_draw() {
  //     setIsDrawing ? (setIsDrawing = false) : (setIsDrawing = true);
  //   }

  let is_mouse_in_shape = function (x, y, point) {
    let shape_left = point.x - 2;
    let shape_right = point.x + 2;
    let shape_top = point.y - 2;
    let shape_bottom = point.y + 2;
    if (
      x >= shape_left &&
      x <= shape_right &&
      y >= shape_top &&
      y <= shape_bottom
    ) {
      //console.log('point was clicked');
      return true;
    }
    //console.log('point was not clicked');
    return false;
  };

  let mouse_down = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    nativeEvent.preventDefault();
    startX = parseInt(offsetX);
    startY = parseInt(offsetY);
    let det = false;
    if (!setIsDrawing) {
      let index = 0;
      for (let point of points) {
        //console.log(points);
        //console.log((`X coordinates: ${startX}, Y coordinates: ${startY}`));
        if (is_mouse_in_shape(startX, startY, point)) {
          current_shape_index = index;
          isDragging = true;
          det = true;
        } else {
          index++;
          //console.log('no');
        }
      }
      console.log(`was the point clicked: ${det}`);
    }
  };

  const mouse_up = ({ nativeEvent }) => {
    if (!isDragging) {
      return;
    }
    nativeEvent.preventDefault();
    isDragging = false;
  };

  const mouse_out = ({ nativeEvent }) => {
    if (!isDragging) {
      return;
    }
    nativeEvent.preventDefault();
    isDragging = false;
  };

  const mouse_move = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (!isDragging) {
      return;
    } else {
      console.log("move");
      nativeEvent.preventDefault();
      let mouseX = parseInt(offsetX);
      let mouseY = parseInt(offsetY);
      let dx = mouseX - startX;
      let dy = mouseY - startY;
      let current_point = points[current_shape_index];
      current_point.x += dx;
      current_point.y += dy;
      redraw(canvasRef.current);
      image.src = dataURL;
      startX = mouseX;
      startY = mouseY;
    }
  };

  const startDrawing = ({ nativeEvent }) => {
    if (setIsDrawing) {
      const { offsetX, offsetY } = nativeEvent;
      points.push({
        x: offsetX,
        y: offsetY,
        color: colors,
        clsName: count,
      });
      circles(offsetX, offsetY, contextRef.current, colors);
    }
  };

  const clearAll = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    preRun = false;
    X = [];
    Y = [];
    // After modifying the image data
    dataURL = canvas.toDataURL();
    image.src = dataURL;
    context.lineWidth = 2;
    contextRef.current = context;
    context.drawImage(image, 0, 0);
  };

  const getX = () => {
    if (points) {
      for (let point of points) {
        X.push([point.x, point.y]);
        Y.push(point.clsName);
      }
    }
  };

  function drawAreas() {
    let rules;
    //console.log(dtpara())
    if (points.length) {
      preRun = true;
      const canvas = canvasRef.current;
      //const context = canvas.getContext('2d');
      getX();
      // console.log(X)
      // console.log(Y)
      selectAlgo === "Decision Tree"
        ? (rules = rule(X, Y, dtpara(), selectAlgo))
        : (rules = rule(X, Y, RFpara(), selectAlgo));
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
      for (let cox = 0; cox < canvas.width; cox++) {
        for (let coy = 0; coy < canvas.height; coy++) {
          // Apply the decision tree rules to classify the point
          const predictedClass = rules.predict([[cox, coy]]);
          // Map the predicted class to a color
          color = point_color[predictedClass];
          // Draw a pixel on the canvas with the determined color
          contextRef.current.fillStyle = color;
          contextRef.current.fillRect(cox, coy, 1, 1);
        }
      }
      dataURL = canvas.toDataURL();
      for (let point of points) {
        contextRef.current.strokeStyle = point.color;
        contextRef.current.beginPath();
        contextRef.current.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        contextRef.current.fillStyle = point.color;
        contextRef.current.fill();
      }
    }
  }

  return (
    <div className="algo">
      <div className="topbuttom"></div>
      <div className="con">
        <div className="para-con">
          <Text style={styles.titleText}>{"Algorithm:"}</Text>
          <select value={selectAlgo} onChange={(e) => setAlgo(e.target.value)}>
            <option value="Decision Tree">Decision Tree</option>
            <option value="Random Forest">Random Forest</option>
          </select>
          <Text style={styles.titleText}>{"Hyperparameters:"}</Text>
          {selectAlgo === "Decision Tree" ? <Dtparameters /> : <RFparameters />}
          <button className="button" onClick={drawAreas}>
            Run
          </button>
        </div>
        <div className="right_Side">
          <canvas
            className="canvas-con"
            ref={canvasRef}
            onMouseDown={mouse_down}
            onMouseUp={mouse_up}
            onMouseOut={mouse_out}
            onMouseMove={mouse_move}
            onClick={startDrawing}
          ></canvas>
          <div className="bar-con">
            <label>Mode:</label>
            <select>
              <option
                onClick={() => {
                  setIsDrawing = true;
                }}
              >
                Add
              </option>
              <option
                onClick={() => {
                  setIsDrawing = false;
                }}
              >
                Move
              </option>
            </select>
            <button className="button" onClick={clearAll}>
              Erase
            </button>
            <label>Class: </label>
            <select
              value={colors}
              onChange={(e) => {
                setColor(e.target.value);
              }}
            >
              <option
                style={{ backgroundColor: "#fa0505" }}
                onClick={() => {
                  count = 0;
                  setIsDrawing = true;
                }}
                value="#fa0505"
              >
                Red
              </option>
              <option
                style={{ backgroundColor: "#3a9904" }}
                onClick={() => {
                  count = 1;
                  setIsDrawing = true;
                }}
                value="#3a9904"
              >
                Green
              </option>
              <option
                style={{ backgroundColor: "#0b3cdb" }}
                onClick={() => {
                  count = 2;
                  setIsDrawing = true;
                }}
                value="#0b3cdb"
              >
                Blue
              </option>
              <option
                style={{ backgroundColor: "#a30581" }}
                onClick={() => {
                  count = 3;
                  setIsDrawing = true;
                }}
                value="#a30581"
              >
                Purple
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Cochin",
    textAlign: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default GuiCanvas;
