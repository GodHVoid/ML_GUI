import React, { useState } from "react";

let parameters = {
  criterion: "",
  splitter: "",
  maxDepth: 0,
  minSamplesSplit: 2,
  minSamplesLeaf: 1,
  minImpurityDecrease: 0.0,
};

export function Dtparameters() {
  const [criterion, setCriterion] = useState("gini");
  const [splitter, setSplipper] = useState("best");
  const [max_depth, setMaxDepth] = useState(0);
  const [minSamplesSplit, setMinSplit] = useState(2);
  const [minSamplesLeaf, setMinLeaf] = useState(1);
  const [minImpurity, setImpurity] = useState(0.0);

  parameters.criterion = criterion;
  parameters.splitter = splitter;
  parameters.maxDepth = max_depth;
  parameters.minSamplesSplit = minSamplesSplit;
  parameters.minSamplesLeaf = minSamplesLeaf;
  parameters.minImpurityDecrease = minImpurity;
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
        </select>
      </div>
      <div>
        <label>Splitter: </label>
        <select value={splitter} onChange={(e) => setSplipper(e.target.value)}>
          <option value="best">Best</option>
          <option value="random">Random</option>
        </select>
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
          value={minSamplesSplit}
          placeholder="default is 2"
          onChange={(e) => setMinSplit(e.target.value)}
        ></input>
      </div>
      <div>
        <label>Min leafs: </label>
        <input
          value={minSamplesLeaf}
          placeholder="default is 2"
          onChange={(e) => setMinLeaf(e.target.value)}
        ></input>
      </div>
      <div>
        <label>Impurity: </label>
        <input
          value={minImpurity}
          placeholder="default is 0.0"
          onChange={(e) => setImpurity(e.target.value)}
        ></input>
      </div>
    </form>
  );
}

export function dtpara() {
  return parameters;
}

export default Dtparameters;
