import React, { useState } from "react";

let parameters = {
  criterion: "",
  min_samples_split: 2,
  maxDepth: 2,
  n_features: null,
  maxLeaf: 2,
  oblique: 0,
};

export function Dtparameters() {
  const [criterion, setCriterion] = useState("gini");
  const [max_depth, setMaxDepth] = useState(null);
  const [minSamplesSplit, setMinSplit] = useState(null);
  const [maxLeaf, setMinLeaf] = useState(null);
  const [oblique, setOblique] = useState(null);

  parameters.criterion = criterion;
  parameters.maxDepth = max_depth;
  parameters.minSamplesSplit = minSamplesSplit;
  parameters.maxLeaf = maxLeaf;
  parameters.oblique = oblique;

  const handleObliqueChange = (e) => {
    setOblique(e === "" ? null : parseInt(e, 10));
  };
  const handleMaxDepth = (e) => {
    setMaxDepth(e === "" ? null : parseInt(e, 10));
  };
  const handleMinSplit = (e) => {
    setMinSplit(e === "" ? null : parseInt(e, 10));
  };
  const handleMinLeaf = (e) => {
    setMinLeaf(e === "" ? null : parseInt(e, 10));
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
          value={minSamplesSplit}
          placeholder="default is 2"
          onChange={(e) => handleMinSplit(e.target.value)}
        />
      </div>
      <div>
        <label>Max Leafs: </label>
        <input
          value={maxLeaf}
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
      <div></div>
    </form>
  );
}

export function dtpara() {
  return parameters;
}

export default Dtparameters;
