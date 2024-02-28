import React, { useState } from "react";

let parameters = {
  n_trees: 1,
  criterion: "gini",
  max_depth: 2,
  min_samples_leaf: 1,
  n_features: null,
  oblique: null,
};

export function RFparameters() {
  const [nTrees, setTrees] = useState(1);
  const [criterion, setCriterion] = useState("gini");
  const [max_depth, setMaxDepth] = useState(null);
  const [minSamplesLeaf, setMinLeaf] = useState(1);
  const [oblique, setOblique] = useState(null);

  parameters.n_trees = nTrees;
  parameters.criterion = criterion;
  parameters.max_depth = max_depth;
  parameters.min_samples_leaf = minSamplesLeaf;
  parameters.oblique = oblique;

  const handleObliqueChange = (e) => {
    const value = e.target.value.trim(); // Trim any leading/trailing whitespace
    // Bug issue with turning off oblique unless it is turn into an int
    // why? because Javascript
    setOblique(value === "" ? null : parseInt(value, 10)); // Convert empty string to null
  };

  return (
    <form>
      <div>
        <label>N tree: </label>
        <input
          value={nTrees}
          placeholder="default is none"
          onChange={(e) => setTrees(e.target.value)}
        />
      </div>
      <div>
        <label>Criterion: </label>
        <select
          value={criterion}
          onChange={(e) => setCriterion(e.target.value)}
        >
          <option value="gini">Gini</option>
          <option value="entropy">Entropy</option>
          <option value="classification_error">Classification Error</option>
        </select>
      </div>
      <div>
        <label>Max Depth: </label>
        <input
          value={max_depth}
          placeholder="default is none"
          onChange={(e) => setMaxDepth(e.target.value)}
        />
      </div>
      <div>
        <label>Min splits: </label>
        <input
          value={minSamplesLeaf}
          placeholder="default is 2"
          onChange={(e) => setMinLeaf(e.target.value)}
        />
      </div>
      <div>
        <label>Oblique: </label>
        <input
          value={oblique !== null ? oblique : ""} // Ensure empty string if null
          placeholder="0 or 1"
          onChange={handleObliqueChange}
        />
      </div>
    </form>
  );
}

export function RFpara() {
  return parameters;
}

export default RFparameters;
