import React, { useState } from "react";

// n_trees: 10, // Set the number of trees
// max_depth: 5, // Set the maximum depth of each tree
// min_samples_split: 2, // Set the minimum number of samples required to split a node
// n_features: 2, // Set the number of features to consider when looking for the best split

let parameters = {
  n_trees: 1,
  max_depth: 2,
  min_samples_leaf: 1,
  n_features: null,
  oblique: 0,
};

export function RFparameters() {
  const [nTrees, setTrees] = useState(1);
  const [max_depth, setMaxDepth] = useState(0);
  const [minSamplesLeaf, setMinLeaf] = useState(1);
  const [oblique, setOblique] = useState(0);

  parameters.n_trees = nTrees;
  parameters.max_depth = max_depth;
  parameters.min_samples_leaf = minSamplesLeaf;
  parameters.oblique = oblique;

  return (
    <form>
      <div>
        <label>N tree: </label>
        <input
          value={nTrees}
          placeholder="default is none"
          onChange={(e) => setTrees(e.target.value)}
        ></input>
      </div>
      <div>
        <label>Max Depth: </label>
        <input
          value={max_depth}
          placeholder="default is none"
          onChange={(e) => setMaxDepth(e.target.value)}
        ></input>
      </div>
      <div>
        <label>Min splits: </label>
        <input
          value={minSamplesLeaf}
          placeholder="default is 2"
          onChange={(e) => setMinLeaf(e.target.value)}
        ></input>
      </div>
      <div>
        <label>Oblique: </label>
        <input
          value={oblique}
          placeholder="0 or 1"
          onChange={(e) => setOblique(e.target.value)}
        ></input>
      </div>
    </form>
  );
}

export function RFpara() {
  return parameters;
}

export default RFparameters;
