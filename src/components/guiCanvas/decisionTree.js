// this file is intended to run ml tree algorithms
import {list_points} from './guiCanvas';
import { DecisionTreeClassifier } from 'scikitjs';


function unique(value, index, array) {
    return array.indexOf(value) === index;
  }

// var points = list_points();

// const X = [points.x, points.y];
// const y = points.class;


// data for testing purposes
const x = [[2, 1], [1,2], [3,3], [5,1], [10,3]];
const y = [2, 3, 1, 1, 2];


/*
DECISION TREE IMPLEMENTATION (FROM SCRATCH)
*/
// Expects y to be an integer array
class Node{
    constructor(feature=null, threshold=null, left=null, right=null, value=null){
        this.feature = feature;
        this.threshold = threshold;
        this.left = left;
        this.right = right;
        this.value=value;
    }

    is_leaf_node(){
        if(this.value !== null && self.value !== undefined){
            return this.value;
        }else{
            return null;
        }
    }

}

export class DecisinTree{
    constructor(min_samples_split=2, max_depth=100, n_features=null){
        this.min_samples_split = min_samples_split;
        this.max_depth = max_depth;
        this.n_features = n_features;
        this.root = null;
    }

    fit(X, y){
        if(~ this.n_features){
            this.n_features = X[0].length;
        }else{
            Math.min(X[0].length, this.n_features);
        }
        this.root = this._grow_tree(X, y);
    }

    _grow_tree(X, y, depth=0){
        let shape = [X.length, X[0].length];
        let n_samples = shape[0];
        let n_feats = shape[1];
        let n_labels = y.filter(unique).length;

        // check the stopping criteria
        if(depth>=this.max_depth || n_labels===1 || n_samples < this.min_samples_split){
            leaf_value = this._most_common_label(y);
            return new Node(value=leaf_value);
        }

        // find the best split
        let [best_thresh, best_feature] = this._best_split(X, y);

        // create child nodes (re-call _grow_tree())
        let [left_idxs, right_idxs] = this._split(X.map(row => row[best_feature], best_thresh));
        let left = this._grow_tree(X[left_idxs].slice(), y[left_idxs], depth+1);
        let right = this._grow_tree(X[right_idxs].slice(), y[right_idxs], depth+1);

        return new Node(best_feature, best_thresh, left, right);
    }

    _best_split(X, y){
        let best_gain = -1;
        let split_idx = null;
        let split_threshold = null;

        for(feat_idx in X[0].length){
            let X_column = X.map(row => row[feat_idx]);
            let thresholds = X_column.filter(onlyUnique).sort();

            for(thr in thresholds){
                // calculate the information gain
                let gain = this._information_gain(y, X_column, thr);

                if(gain > best_gain){
                    best_gain = gain;
                    split_idx = feat_idx;
                    split_threshold = thr;
                }
            }
        }
        return [split_idx, split_threshold];
    }

    _information_gain(y, X_column, threshold){
        let parent_entropy = this._entropy(y);

        // create children
        let [left_idxs, right_idxs] = this._split(X_column, threshold);

        if(left_idxs.length === 0 || right_idxs.length === 0){
            return 0;
        }

        // calculate weighted average entropy of children
        let n = y.length;
        let [n_l, n_r] = [left_idxs.length, right_idxs.length];
        let [e_l, e_r] = [this._entropy(y[left_idxs]), this._entropy(y[right_idxs])];
        let child_entropy = (n_l/n) * e_l + (n_r/n) * e_r;

        // calculating the information gain
        let information_gain = parent_entropy - child_entropy;
        return information_gain;
    }

    _split(X_column, split_thresh){
        let left_idxs = [];
        let right_idxs = [];

        for(let i = 0; i < X_column.length; i++){
            if(X_column[i] <= split_thresh){
                left_idxs.push(i);
            }
            else{
                right_idxs.push(i);
            }
        }
        return [left_idxs, right_idxs]; 
    }

    _entropy(y){
        // find max value of y
        // alternatively we can find the unique values of y and get the length of the array of unique values
        let n_labels = y.filter(unique).length;

        // create a histogram of labels in y
        let hist = new Array(n_labels);
        for(let i = 0; i < y.length; i++){
            hist[y[i]] += 1;
        }
        
        for(let i = 0; i < hist.length; i++){
            hist[i] /= y.length;
        }
        
        let ps = hist;
        let sum = 0;
        for(p in ps){
            if(p > 0){
                sum += p * Math.log2(p);
            }
        }

        return -sum;
    }

    _most_common_label(y){
        // returns the most common label of y
        // we expect y to be a 1-D array
        let maxKey = null;
        let maxVal = -Infinity;
        let freq = {};

        // make a histogram of the frequencies of each label
        for(let i = 0; i < y.length; i++){
            if(y[i] in freq){
                freq[y[i]] += 1;
            }
            else{
                freq[y[i]] = 1;
            }
        }
        // look for the most common label
        for(const label in freq){
            if(freq[label] > maxVal){
                maxVal = freq[label];
                maxKey = label;
            }
        }
        return maxKey;
    }

    predict(X){
        let preds = [];
        for(x in X){
            preds.push(this._traverse_tree(x, this.root));
        }
        return preds;
    }

    _traverse_tree(x, node){
        if (node.is_leaf_node){
            return node.value;
        }

        if(n[node.feature] <= node.threshold){
            return this._traverse_tree(x, node.left);
        }
        return this._traverse_tree(x, node.right);
    }
}












/*
SECTION BELOW IS DECISION TREE DONE IN SKLEARN.JS
*/
// const model = new DecisionTreeClassifier({criterion: 'gini', maxDepth: 3});
// await model.fit(X,y);

// since we want to know what the model predicted, we will pass again the dataset points
// through the model
// var preds = model.predict(X);   //Returns a 1D array of predictions

// console.log(preds);




// get points from canvas
// train the tree with those points
// test tree

// get the decision boundaries