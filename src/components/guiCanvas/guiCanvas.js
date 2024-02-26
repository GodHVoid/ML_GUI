import "./guiCanvas.css";
import React, { useEffect, useRef, useState } from "react";
import { rule } from "./ML_Algorithms/algoSelector.js";
import { Dtparameters, dtpara } from "./Hyperparamters/decisionTreePara";
import { RFparameters, RFpara } from "./Hyperparamters/RFPara.js";

function GuiCanvas(props) {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPointIndex, setDraggedPointIndex] = useState(null); // Track the index of the dragged point
  const [selectAlgo, setSelectAlgo] = useState("Decision Tree");
  const [color, setColor] = useState("#fa0505");
  const [isMovingPoints, setIsMovingPoints] = useState(false); // State to track if moving points mode is enabled
  const point_color = ["#e96666", "#9ce472", "#859adf", "#cc49b0"]; // Define point_color array
  const background_color = ["#fa0505", "#3a9904", "#0b3cdb", "#a30581"];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 600;
    canvas.height = 500;
    const context = canvas.getContext("2d");
    context.lineWidth = 2;
  }, []);

  function drawCircle(x, y, color) {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = color;
    context.beginPath();
    context.arc(x, y, 4, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Clear the points state
    setPoints([]);
  }

  function handleMouseDown(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    if (isMovingPoints) {
      // Find the point clicked
      points.forEach((point, index) => {
        if (isPointClicked(offsetX, offsetY, point)) {
          setIsDragging(true);
          setDraggedPointIndex(index);
          return;
        }
      });
    } else {
      // Assign class number based on the color index
      const classNumber = background_color.indexOf(color);

      const newPoint = {
        x: offsetX,
        y: offsetY,
        color,
        classNumber,
      };
      setPoints([...points, newPoint]);
      drawCircle(offsetX, offsetY, color);
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
    setDraggedPointIndex(null); // Reset the dragged point index
  }

  function handleMouseMove(event) {
    if (isDragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      const updatedPoints = [...points]; // Copy the points array
      updatedPoints[draggedPointIndex] = {
        ...updatedPoints[draggedPointIndex],
        x: offsetX,
        y: offsetY,
      }; // Update the dragged point
      setPoints(updatedPoints);

      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      updatedPoints.forEach((point) => {
        drawCircle(point.x, point.y, point.color);
      });
    }
  }

  function isPointClicked(x, y, point) {
    const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
    return distance <= 4;
  }

  function runAlgorithm() {
    const [X, Y] = getXY();
    let rules;

    if (points.length) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;
      const imageData = context.createImageData(width, height);
      const data = imageData.data;

      // Clear the canvas
      context.clearRect(0, 0, width, height);

      rules =
        selectAlgo === "Decision Tree"
          ? rule(X, Y, dtpara(), selectAlgo)
          : rule(X, Y, RFpara(), selectAlgo);

      //console.log("Rules:", rules); // Check the value of rules

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const predictedClass = rules.predict([[x, y]]);
          //console.log("Predicted Class:", predictedClass); // Check the value of predictedClass
          const colorIndex = predictedClass * 4; // Each pixel has RGBA values, so multiply the class index by 4

          data[(y * width + x) * 4] = parseInt(
            point_color[predictedClass].substring(1, 3),
            16
          ); // Red
          data[(y * width + x) * 4 + 1] = parseInt(
            point_color[predictedClass].substring(3, 5),
            16
          ); // Green
          data[(y * width + x) * 4 + 2] = parseInt(
            point_color[predictedClass].substring(5, 7),
            16
          ); // Blue
          data[(y * width + x) * 4 + 3] = 255; // Alpha
        }
      }
      context.putImageData(imageData, 0, 0);

      // Redraw all points
      redrawPoints();
    }
  }

  function redrawPoints() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    points.forEach((point) => {
      drawCircle(point.x, point.y, point.color);
    });
  }

  function getXY() {
    let X = [];
    let Y = [];
    points.forEach((point) => {
      X.push([point.x, point.y]);
      Y.push(point.classNumber);
    });
    return [X, Y];
  }

  function toggleMode() {
    setIsMovingPoints(!isMovingPoints);
  }

  return (
    <div className="algo">
      <div className="topbuttom"></div>
      <div className="con">
        <div className="para-con">
          <label>Algorithm:</label>
          <select
            value={selectAlgo}
            onChange={(e) => setSelectAlgo(e.target.value)}
          >
            <option value="Decision Tree">Decision Tree</option>
            <option value="Random Forest">Random Forest</option>
          </select>
          <label>Hyperparameters:</label>
          {selectAlgo === "Decision Tree" ? <Dtparameters /> : <RFparameters />}
          <button className="button" onClick={runAlgorithm}>
            Run
          </button>
        </div>
        <div className="right_Side">
          <canvas
            className="canvas-con"
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          ></canvas>
          <div className="bar-con">
            <label>Class:</label>
            <select value={color} onChange={(e) => setColor(e.target.value)}>
              <option style={{ backgroundColor: "#fa0505" }} value="#fa0505">
                Red
              </option>
              <option style={{ backgroundColor: "#3a9904" }} value="#3a9904">
                Green
              </option>
              <option style={{ backgroundColor: "#0b3cdb" }} value="#0b3cdb">
                Blue
              </option>
              <option style={{ backgroundColor: "#a30581" }} value="#a30581">
                Purple
              </option>
            </select>
            <button className="button" onClick={clearCanvas}>
              Erase
            </button>
            <button className="button" onClick={toggleMode}>
              {isMovingPoints ? "Add Point" : "Move Point"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuiCanvas;
