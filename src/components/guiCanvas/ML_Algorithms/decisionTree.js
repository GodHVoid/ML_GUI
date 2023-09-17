import * as tf from '@tensorflow/tfjs'
import {DecisionTreeClassifier,  setBackend } from 'scikitjs'
setBackend(tf)

export function rule(x,y){
    const model = new DecisionTreeClassifier({criterion: 'gini', maxDepth: 7});
    const dtc = model.fit(x,y);
    //const rules = extractDecisionRules(dtc, featureNames, classNames);

    return dtc;
    
}

export function extractDecisionRules(tree, featureNames, classNames) {
    const rules = [];
  
    function traverse(node, rule) {
      if (node.left === null && node.right === null) {
        // Leaf node, add the decision
        rule.decision = classNames[node.value];
        rules.push(rule);
      } else {
        // Decision node, add the condition and recurse
        const featureName = featureNames[node.feature];
        const threshold = node.threshold;
        const condition = `${featureName} <= ${threshold}`;
  
        traverse(node.left, { ...rule, condition, outcome: 'Left' });
        traverse(node.right, { ...rule, condition, outcome: 'Right' });
      }
    }
  
    traverse(tree.tree_, {});
  
    return rules;
  }