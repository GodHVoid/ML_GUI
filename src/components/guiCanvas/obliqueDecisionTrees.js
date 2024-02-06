import { DecisionTreeClassifier } from "./decisionTreeBFS.js";

export class ObliqueDecisionTree{
    constructor({X, y, d_theta=15, weights=[]}){
        this.d_theta = d_theta;
        this.weights = weights;
        this.X = this._feature_transform(X, this.d_theta);
        this.y = y;
    }

    _feature_transform(X, d_theta){
        for(let theta = d_theta; theta < 180; theta +=d_theta){
            let w1 = Math.sin(theta);
            let w2 = Math.cos(theta);
        
            // resulting feature will be w1*x1 + w2*x2
            let feat_1 = X.map(row => row[0]);
            let feat_2 = X.map(row => row[1]);
            for(let i = 0; i < X.map(row => row[0]).length; i++){
                    feat_1[i] = feat_1[i]*w1;
                    feat_2[i] = feat_2[i]*w2;
            }
            // w1x1 + w2x2
            let projection = feat_1.map((value, index) => value + feat_2[index]);
            
            // append into X the resulting projection feature
            for(let i = 0; i < X.length; i++){
                X[i].push(projection[i]);
            }

            // save the weights [w1, w2]
            this.weights.push([w1, w2]);
            
        }
        return X;
    }

    fit(){
        let tree = new DecisionTreeClassifier({});
        tree.fit(this.X, this.y);
        console.log(tree);
    }

    predict(X){
        let preds = [];
        for(const x in X){
            preds.push(this._traverse_tree(x, tree.root));
        }
        return preds;
    }

    _traverse_tree(x, node){
        if (node.is_leaf_node){
            return node.value;
        }

        // if w1*x1 + w2*x2 <= -bias
        if(tree.weights[node.feature-1]*x[0] + tree.weights[node.feature-1]*x[1] <= node.threshold){
            return this._traverse_tree(x, node.left);
        }
        return this._traverse_tree(x, node.right);
    }

}

