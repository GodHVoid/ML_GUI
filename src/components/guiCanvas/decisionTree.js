/*
DECISION TREE IMPLEMENTATION (FROM SCRATCH)
*/

function unique(value, index, array) {
    return array.indexOf(value) === index;
  }


// Expects y to be an integer array
export class Node{
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

export class DecisionTree{
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
            let leaf_value = this._most_common_label(y);
            return new Node(null, null, null, null, leaf_value);
        }

        // find the best split
        let [best_feature, best_thresh] = this._best_split(X, y);

        // create child nodes through feature and threshold that yield best info gain
        let [left_idxs, right_idxs] = this._split(X.map(row => row[best_feature]), best_thresh);

        // get the indices of data that will go on the left child node after splitting
        let X_left = left_idxs.map(i => X[i]);
        let y_left = left_idxs.map(i => y[i]);

        // get the indices of data that will go on the right child node after splitting
        let X_right = right_idxs.map(i => X[i]);
        let y_right = right_idxs.map(i => y[i]);
        // for(let i = 0; i < Math.max(left_idxs.length, right_idxs.length); i++){
        //     if(i < left_idxs.length){
        //         X_left_idxs.push(X[left_idxs[i]]);
        //     }
        //     if(i < right_idxs.length){
        //         X_right_idxs.push(X[right_idxs[i]]);
        //     } 
        // }
        let left = this._grow_tree(X_left, y_left, depth+1);
        let right = this._grow_tree(X_right, y_right, depth+1);


        return new Node(best_feature, best_thresh, left, right);
    }

    _best_split(X, y){
        let best_gain = -1;
        let split_idx = null;   // best feature (or column) of X to split on
        let split_threshold = null;

        for(let feat_idx = 0; feat_idx < X[0].length; feat_idx++){
            console.log("\nfeat_idx = ", feat_idx, "\n");
            let X_column = X.map(row => row[feat_idx]);
            let thresholds = X_column.filter(unique).sort((a,b) => a-b);
            // console.log("thresholds: ", thresholds);

            for(let [i, thr] of thresholds.entries()){
                // calculate the information gain
                if(i < thresholds.length-1){
                    thr = (thresholds[i] + thresholds[i+1]) / 2;
                }
                // console.log("thr = ", thr);
                // console.log("y = ", y);
                // console.log("X_column = ", X_column);
                let gain = this._information_gain(y, X_column, thr);

                // whenever we find severla splits with equivalent value of best_gain, the code chooses the smallest feature index and the smallest threshold value
                if(gain > best_gain){
                    best_gain = gain;
                    split_idx = feat_idx;
                    split_threshold = thr;
                }
            }
        }
        console.log("best_feature = ", split_idx);
        console.log("best_thresh = ", split_threshold);

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
        let y_left_idxs = [];
        let y_right_idxs = [];
        for(let i = 0; i < Math.max(left_idxs.length, right_idxs.length); i++){
            if(i < left_idxs.length){
                y_left_idxs.push(y[left_idxs[i]]);
            }
            if(i < right_idxs.length){
                y_right_idxs.push(y[right_idxs[i]]);
            } 
        }
        // for(let i = 0; i < left_idxs.length; i++){
        //     y_left_idxs.push(y[left_idxs[i]]); 
        // }
        // for(let i = 0; i < right_idxs.length; i++){
        //     y_right_idxs.push(y[right_idxs[i]]); 
        // }
        
        let [e_l, e_r] = [this._entropy(y_left_idxs), this._entropy(y_right_idxs)];
        let child_entropy = (n_l/n) * e_l + (n_r/n) * e_r;
        console.log("\nparent_entropy = ", parent_entropy);
        // console.log("child_entropy = ", child_entropy);
        // console.log("e_l = ", e_l);
        // console.log("e_r = ", e_r,"\n");

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
        // let n_labels = y.filter(unique).length;

        // create a histogram of labels in y
        let hist = new Array(Math.max(...y)+1).fill(0);
        
        for(let i = 0; i < y.length; i++){
            hist[y[i]] += 1;
        }
        
        for(let i = 0; i < hist.length; i++){
            hist[i] /= y.length;
        }
        let ps = hist;
        let sum = 0;
        for(const p of ps){
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
        for(const x in X){
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