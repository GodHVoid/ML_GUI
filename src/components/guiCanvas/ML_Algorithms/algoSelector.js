import * as tf from "@tensorflow/tfjs";
import { setBackend } from "scikitjs";
import { DecisionTreeClassifier } from "./decisionTree.js";
import { RandomForest } from "./randomForest.js";
setBackend(tf);
export function rule(x, y, para, name) {
  if (name === "Decision Tree") {
    const model = new DecisionTreeClassifier(para);
    model.fit(x, y);
    return model;
  } else {
    const model = new RandomForest(para);
    model.fit(x, y);
    return model;
  }
}
