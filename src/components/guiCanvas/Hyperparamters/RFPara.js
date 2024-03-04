import React, { useState } from "react";
import "../guiCanvas.css";
let parameters = {
  n_trees: 1,
  criterion: "gini",
  max_depth: 2,
  min_samples_leaf: 1,
  n_features: null,
  oblique: null,
};

export function RFparameters() {
  const [nTrees, setTrees] = useState(null);
  const [criterion, setCriterion] = useState("gini");
  const [max_depth, setMaxDepth] = useState(null);
  const [minSamplesLeaf, setMinLeaf] = useState(null);
  const [oblique, setOblique] = useState(null);

  parameters.n_trees = nTrees;
  parameters.criterion = criterion;
  parameters.max_depth = max_depth;
  parameters.min_samples_leaf = minSamplesLeaf;
  parameters.oblique = oblique;

  const handleObliqueChange = (e) => {
    setOblique(e === "" ? null : parseInt(e, 10));
  };
  const handleNTree = (e) => {
    setTrees(e === "" ? null : parseInt(e, 10));
  };
  const handleMinLeaf = (e) => {
    setMinLeaf(e === "" ? null : parseInt(e, 10));
  };
  const handleMaxDepth = (e) => {
    setMaxDepth(e === "" ? null : parseInt(e, 10));
  };

  return (
    <form>
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
        <label>Number of Trees: </label>
        <input
          value={nTrees}
          placeholder="default is none"
          onChange={(e) => handleNTree(e.target.value)}
        />
      </div>
      <div>
        <label>Max Depth: </label>
        <input
          value={max_depth}
          placeholder="default is none"
          onChange={(e) => handleMaxDepth(e.target.value)}
        />
      </div>
      <div>
        <label>Min Splits: </label>
        <input
          value={minSamplesLeaf}
          placeholder="default is 2"
          onChange={(e) => handleMinLeaf(e.target.value)}
        />
      </div>
      <div>
        <label>Oblique: </label>
        <select
          value={oblique}
          onChange={(e) => handleObliqueChange(e.target.value)}
        >
          <option value="0">Off</option>
          <option value="1">On</option>
        </select>
      </div>
    </form>
  );
}

export function RFpara() {
  return parameters;
}

export default RFparameters;
