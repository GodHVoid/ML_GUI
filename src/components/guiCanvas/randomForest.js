/*
RANDOM FOREST IMPLEMENTATION (FROM SCRATCH)
*/
import {DecisionTreeClassifier} from "./decisionTreeBFS.js";

// this file is intended to run a random forest algorithm
export class RandomForest{
    constructor({n_trees, max_depth, min_samples_split=2, n_features=null}){
        this.n_trees = n_trees;
        this.max_depth = max_depth;
        this.min_samples_split = min_samples_split;
        this.n_features = n_features;
        this.trees = []; //keep track of the decision trees we created so far
    }

    fit(X, y){
        this.trees = [];
        for(let i = 0; i < this.n_trees; i++){
            let tree =  new DecisionTreeClassifier({criterion: 'gini',
                                    max_depth: this.max_depth,
                                    min_samples_split: this.min_samples_split,
                                    n_features: this.n_features});
            
            let [X_sample, y_sample] = this._bootstrap_samples(X, y);
            tree.fit(X_sample, y_sample);
            this.trees.push(tree);
        }
    }

    _bootstrap_samples(X, y){
        this.n_samples = X.length;

        // sample with replacement
        let idxs = [];
        for(let i = 0; i < this.n_samples; i++){
            idxs.push( Math.floor(Math.random() * this.n_samples) );
        }
        
        // map indices with their corresponding array index
        let X_sample = idxs.map(i => X[i]);
        let y_sample = idxs.map(i => y[i]);

        return [X_sample, y_sample];
    }


    // predict(X){
    //     let preds = [];
    //     for(tree in this.trees){
    //         preds.push(tree.predict(X));
    //         console.log(preds);
    //     }

    // }
}
