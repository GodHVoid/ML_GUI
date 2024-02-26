import React, { useState } from "react";

/*  criterion = "entropy",
    min_samples_split = 2,
    max_depth = 100,
    n_features = null,
    max_leaves = null,
    oblique = false,
*/
let parameters = {
  criterion: "",
  maxDepth: 1,
  minSamplesSplit: 2,
  maxLeaf: 1,
  oblique: 0,
};

export function Dtparameters() {
  const [criterion, setCriterion] = useState("gini");
  const [max_depth, setMaxDepth] = useState(0);
  const [minSamplesSplit, setMinSplit] = useState(2);
  const [maxLeaf, setMinLeaf] = useState(null);
  const [oblique, setOblique] = useState(0);

  parameters.criterion = criterion;
  parameters.maxDepth = max_depth;
  parameters.minSamplesSplit = minSamplesSplit;
  parameters.maxLeaf = maxLeaf;
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
          <option value="Classification Error">Classification Error</option>
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
        <label>Max leafs: </label>
        <input
          value={maxLeaf}
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

export function dtpara() {
  return parameters;
}

export default Dtparameters;
