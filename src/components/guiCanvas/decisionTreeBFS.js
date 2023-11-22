/*
DECISION TREE IMPLEMENTATION (FROM SCRATCH)
*/

function unique(value, index, array) {
    return array.indexOf(value) === index;
  }


// Expects y to be an integer array
export class Node{
    constructor({feature=null, threshold=null, left=null, right=null, value=null}){
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

export class DecisionTreeClassifier{
    constructor({criterion = 'entropy', min_samples_split=2, max_depth=100, n_features=null, max_leaves = null}){
        this.criterion = criterion;
        this.min_samples_split = min_samples_split;
        this.max_depth = max_depth;
        this.n_features = n_features;
        this.root = null;
        this.max_leaves = max_leaves;
    }

    fit(X, y){
        if(~ this.n_features){
            this.n_features = X[0].length;
        }else{
            Math.min(X[0].length, this.n_features);
        }
        this._grow_tree(X, y);
    }

    _grow_tree(X, y, depth=0){
        let n_samples = X.length;

        // number of leaves counter
        let n_leaves = 0;

        // queue to store nodes
        let queue = [];

        // enqueue root (or parent) node
        queue.push({"par_node": null, "X": X, "y": y, "depth": depth});

        while(queue.length){
            // dequeue node
            let {par_node, X, y, depth} = queue.shift();

            // get the number of labels
            let n_labels = y.filter(unique).length;
            
            // declare children of parent node
            let new_node;

            // check the stopping criteria
            if((this.max_depth !== null && depth>=this.max_depth) || 
                n_labels===1 || 
                n_samples < this.min_samples_split || 
                (this.max_leaves !== null && n_leaves + queue.length >= this.max_leaves-1)){
                
                let leaf_value = this._most_common_label(y);
                new_node = new Node({value: leaf_value});
                n_leaves++;
                
            } else {
                // create parent node for children nodes
                new_node = new Node({});

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

                new_node.feature = best_feature;
                new_node.threshold = best_thresh;
                
                // create left and right children of current root node
                queue.push({"par_node": new_node, "X": X_left, "y": y_left, "depth": depth+1});
                queue.push({"par_node": new_node, "X": X_right, "y": y_right, "depth": depth+1})
            }
            
            // assigning parent node its children nodes
            if (par_node !== null) {
                if (par_node.left === null) {
                    par_node.left = new_node;
                } else {
                    par_node.right = new_node;
                }
            } else {
                this.root = new_node;
            }
        }
    }

    _best_split(X, y){
        let best_gain = -1;
        let split_idx = null;   // best feature (or column) of X to split on
        let split_threshold = null;

        for(let feat_idx = 0; feat_idx < X[0].length; feat_idx++){
            let X_column = X.map(row => row[feat_idx]);     // get column of X at index feat_idx
            let thresholds = X_column.filter(unique).sort((a,b) => a-b);

            for(let [i, thr] of thresholds.entries()){
                // calculate thresholds
                if(i < thresholds.length-1){
                    thr = (thresholds[i] + thresholds[i+1]) / 2;
                }
                // get information gain per feature (or column) in X
                let gain = this._information_gain(y, X_column, thr);

                if(gain >= best_gain){
                    best_gain = gain;
                    split_idx = feat_idx;
                    split_threshold = thr;
                }
            }
        }
        return [split_idx, split_threshold];
    }

    _information_gain(y, X_column, threshold){
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
        
        // let parent_impurity;
        // let child_impurity;

        // create a mapping to criterion functions
        const criterionFunctions = {
            "entropy": this._entropy.bind(this),
            "gini": this._gini.bind(this)
        };

        // get impurity of left and right children of parent
        let i_l = criterionFunctions[this.criterion](y_left_idxs)
        let i_r = criterionFunctions[this.criterion](y_right_idxs);
        let child_impurity = (n_l/n) * i_l + (n_r/n) * i_r;
    
        
        let parent_impurity = criterionFunctions[this.criterion](y);
        
        
        // let [e_l, e_r] = [this._entropy(y_left_idxs), this._entropy(y_right_idxs)];
        // let child_entropy = (n_l/n) * e_l + (n_r/n) * e_r;

        // calculating the information gain
        let information_gain = parent_impurity - child_impurity;
        
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

    _create_hist(y){
        // find max value of y
        let n_labels = Math.max(...y)+1;

        // create a histogram of labels in y
        let hist = new Array(n_labels).fill(0);
        for(let i = 0; i < y.length; i++){
            hist[y[i]] += 1;
        }
        
        // normalize histogram
        for(let i = 0; i < hist.length; i++){
            hist[i] /= y.length;
        }
        return hist;
    }


    _entropy(y){
        let hist = this._create_hist(y);

        // calculating entropy
        let E = 0;
        for(const p of hist){
            if(p > 0){
                E += p * Math.log2(p);
            }
        }

        return -E;
    }


    _gini(y){
        let hist = this._create_hist(y);
        
        // calculating gini impurity
        let G = 0;
        for(const p of hist){
            if(p > 0){
                G += p * (1-p);
            }
        }

        return G;
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