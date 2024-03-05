import "./guiCanvas.css";
import React, { useEffect, useRef, useState } from "react";
import { rule } from "./ML_Algorithms/algoSelector.js";
import { Dtparameters, dtpara } from "./Hyperparamters/decisionTreePara";
import { RFparameters, RFpara } from "./Hyperparamters/RFPara.js";
import { PopupWindow } from "./pointSetting/settingWindow.js";
import settingImage from "./Icons/settings.png";

const point_color = ["#e96666", "#9ce472", "#859adf", "#cc49b0"]; // Define point_color array
const background_color = ["#fa0505", "#3a9904", "#0b3cdb", "#a30581"];

function GuiCanvas(props) {
  const canvasRef = useRef(null);
  const [pointOption, setPointOption] = useState(false);
  const [points, setPoints] = useState([]);
  const [prevPoints, setPrevPoints] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPointIndex, setDraggedPointIndex] = useState(null); // Track the index of the dragged point
  const [selectAlgo, setSelectAlgo] = useState("Decision Tree");
  const [color, setColor] = useState("#fa0505");
  const [mode, setMode] = useState("Add"); // Add, Move, Erase
  const [isUndo, setUndo] = useState(false);
  const [imageData, setImageData] = useState(null); // State to store imageData
  const [previousImageData, setPreviousImageData] = useState(null);
  const [isMovingPoints, setIsMovingPoints] = useState(false); // State to track if moving points mode is enabled
  const [misclassification, setMisclassification] = useState(0);
  const [entropyLoss, setEntropyLoss] = useState(0.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 600;
    canvas.height = 500;
    const context = canvas.getContext("2d");
    context.lineWidth = 2;
  }, []);

  useEffect(() => {
    runAlgorithm(); // Run the algorithm whenever selectAlgo changes
  }, [selectAlgo]);

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
    // Clear the imageData state
    setImageData(null);
    setMisclassification(0);
    setEntropyLoss(0);
  }

  function undoCanvas() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (previousImageData) {
      context.putImageData(previousImageData, 0, 0);

      prevPoints.forEach((point) => {
        drawCircle(point.x, point.y, point.color);
      });
    }
  }

  function handleMouseDown(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    if (mode === "Move") {
      points.forEach((point, index) => {
        if (isPointClicked(offsetX, offsetY, point)) {
          setIsDragging(true);
          setDraggedPointIndex(index);
          return;
        }
      });
    } else if (mode === "Add") {
      const classNumber = background_color.indexOf(color);
      const newPoint = { x: offsetX, y: offsetY, color, classNumber };
      setPoints([...points, newPoint]);
      drawCircle(offsetX, offsetY, color);
    } else if (mode === "Erase") {
      const filteredPoints = points.filter(
        (point) => !isPointClicked(offsetX, offsetY, point)
      );
      setPoints(filteredPoints);
      redrawCanvas();
    }
  }

  function redrawCanvas() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (imageData) {
      context.putImageData(imageData, 0, 0);
    }
    points.forEach((point) => {
      drawCircle(point.x, point.y, point.color);
    });
  }

  function handleMouseUp() {
    if (isDragging) {
      redrawCanvas();
      //runAlgorithm();
    }
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

      //
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      redrawCanvas(); // Redraw the canvas with the updated points
    }
  }

  function isPointClicked(x, y, point) {
    const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
    return distance <= 4;
  }

  async function runAlgorithm() {
    try {
      setImageData(null);
      const [X, Y] = getXY();
      let rules;

      if (points.length) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        // Create a new ImageData object to hold the pixel data
        const newImageData = context.createImageData(width, height);
        const data = newImageData.data;

        // Clear the canvas
        context.clearRect(0, 0, width, height);

        rules =
          selectAlgo === "Decision Tree"
            ? rule(X, Y, dtpara(), selectAlgo)
            : rule(X, Y, RFpara(), selectAlgo);
        console.log(rules);
        console.log(RFpara);
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const predictedClass = rules.predict([[x, y]])[0];
            const colorIndex = predictedClass * 4;

            data[(y * width + x) * 4] = parseInt(
              point_color[predictedClass].substring(1, 3),
              16
            );
            data[(y * width + x) * 4 + 1] = parseInt(
              point_color[predictedClass].substring(3, 5),
              16
            );
            data[(y * width + x) * 4 + 2] = parseInt(
              point_color[predictedClass].substring(5, 7),
              16
            );
            data[(y * width + x) * 4 + 3] = 255;
          }
        }
        context.putImageData(newImageData, 0, 0);
        setImageData(newImageData);
        setPreviousImageData(newImageData);
        setPrevPoints(points);
        categoricalCrossEntropyLoss(rules, points);
        // Redraw all points
        redrawCanvas();
      }
    } catch (error) {
      console.error("Error in runAlgorithm:", error);
      // Handle the error appropriately, e.g., display an error message to the user
    }
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
    if (mode === "Add") {
      setIsMovingPoints(false); // Switch to adding points mode
      setMode("Erase");
    } else if (mode === "Erase") {
      setIsMovingPoints(false); // Switch to erasing points mode
      setMode("Move");
    } else {
      setIsMovingPoints(true); // Switch to moving points mode
      setMode("Add");
    }
  }

  const togglePopup = () => {
    setPointOption(!pointOption);
  };

  const toggleErase = () => {
    // setUndo(!isUndo);
    // if (isUndo) {
    //   undoCanvas();
    // } else {
    //   clearCanvas();
    // }
    clearCanvas();
  };

  function categoricalCrossEntropyLoss(model, points) {
    let epsilon = 1e-15; // Small constant to prevent taking the logarithm of zero
    let misCount = 0;
    let totalLoss = 0;

    const [X, yTrue] = getXY(points);
    let yPred = model.predict(X);
    console.log("Contents of yTrue:", yTrue);
    console.log("Contents of yPred:", yPred);

    // Check if yTrue and yPred are arrays and have the same length
    if (
      !Array.isArray(yTrue) ||
      !Array.isArray(yPred) ||
      yTrue.length !== yPred.length
    ) {
      console.error("Invalid input format.");
      return { misclassified: -1, averageLoss: NaN }; // Return error value
    }

    for (let i = 0; i < yTrue.length; i++) {
      const trueClass = yTrue[i];
      const predictedClass = yPred[i];

      // Check if trueClass and predictedClass are out of range
      if (
        trueClass < 0 ||
        trueClass >= yPred.length ||
        predictedClass < 0 ||
        predictedClass >= yPred.length
      ) {
        console.error(
          "True class or predicted class is out of range at index",
          i
        );
        console.log("True class:", trueClass);
        console.log("Predicted class:", predictedClass);
        continue;
      }

      // Calculate cross-entropy loss
      let loss = -Math.log(Math.max(epsilon, yPred[i][trueClass]));
      totalLoss += isNaN(loss) ? 0 : loss;

      // Check for misclassification
      if (trueClass !== predictedClass) {
        misCount++;
      }
    }

    // Compute average loss and round to 5 significant figures
    let averageLoss = X.length > 0 ? totalLoss / X.length : 0;
    averageLoss = parseFloat(averageLoss.toFixed(5));

    setEntropyLoss(averageLoss);
    setMisclassification(misCount);
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
        <div className="rightSide">
          <canvas
            className="canvas-con"
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          ></canvas>
          <div className="bar-con">
            <div>
              <label>Class:</label>
              <select
                className="dropdown"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
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
            </div>
            <button className="button" onClick={toggleErase}>
              {isUndo ? "Undo" : "Clear"}
            </button>
            <button className="button" onClick={toggleMode}>
              {mode === "Add" && "Add Point"}
              {mode === "Erase" && "Erase Point"}
              {mode === "Move" && "Move Point"}
            </button>
          </div>
        </div>
        <div className="pointError">
          <button className="point-setting" onClick={togglePopup}>
            <img className="settingIcon" src={settingImage} alt="Set" />{" "}
            {/* Replace with your settings icon */}
            {pointOption && <PopupWindow />}
          </button>
          <p className="loss">
            Misclassified points: {misclassification}
            <p>Entropy Loss: {entropyLoss}</p>
          </p>
        </div>
      </div>
    </div>
  );
}

export default GuiCanvas;
