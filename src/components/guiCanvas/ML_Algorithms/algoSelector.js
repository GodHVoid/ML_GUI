import * as tf from "@tensorflow/tfjs";
import { setBackend } from "scikitjs";
import { DecisionTreeClassifier } from "./decisionTree.js";
import { RandomForest } from "./randomForest.js";
setBackend(tf);
//const { RandomForestClassifier, RandomForestRegressor } = require('random-forest')
export function rule(x, y, para, name) {
  if (name === "Decision Tree") {
    const model = new DecisionTreeClassifier(para);
    model.fit(x, y);
    return model;
  } else {
    const model = new RandomForest(para);
    const trained = model.fit(x, y);
    return trained;
  }

  //const rules = extractDecisionRules(dtc, featureNames, classNames);
}
