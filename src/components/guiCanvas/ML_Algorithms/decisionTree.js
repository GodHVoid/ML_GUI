import * as tf from "@tensorflow/tfjs";
import { DecisionTreeClassifier, setBackend } from "scikitjs";
setBackend(tf);
//const { RandomForestClassifier, RandomForestRegressor } = require('random-forest')
export function rule(x, y, para, name) {
  if (name === "Decision Tree") {
    const model = new DecisionTreeClassifier(para);
    const trained = model.fit(x, y);
    return trained;
  } else {
    const model = new DecisionTreeClassifier(para);
    const trained = model.fit(x, y);
    return trained;
  }

  //const rules = extractDecisionRules(dtc, featureNames, classNames);
}
