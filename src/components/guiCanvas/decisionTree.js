// this file is intended to run ml tree algorithms
import {list_points} from './guiCanvas';
import { DecisionTreeClassifier } from 'scikitjs'

// var points = list_points();

// const X = [points.x, points.y];
// const y = points.class;


// for testing purposes
const x = [[2, 1], [1,2], [3,3], [5,1], [10,3]];
const y = [2, 3, 1, 1, 2];

const model = new DecisionTreeClassifier({criterion: 'gini', maxDepth: 3});
await model.fit(X,y);

// since we want to know what the model predicted, we will pass again the dataset points
// through the model
var preds = model.predict(X);   //Returns a 1D array of predictions






// get points from canvas
// train the tree with those points
// test tree

// get the decision boundaries