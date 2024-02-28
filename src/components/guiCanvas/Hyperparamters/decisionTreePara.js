import React, { useState } from "react";

let parameters = {
  criterion: "",
  min_samples_split: 2,
  maxDepth: 1,
  n_features: null,
  maxLeaf: null,
  oblique: null,
};

export function Dtparameters() {
  const [criterion, setCriterion] = useState("gini");
  const [max_depth, setMaxDepth] = useState(null);
  const [minSamplesSplit, setMinSplit] = useState(2);
  const [maxLeaf, setMinLeaf] = useState(null);
  const [oblique, setOblique] = useState(null);

  parameters.criterion = criterion;
  parameters.maxDepth = max_depth;
  parameters.minSamplesSplit = minSamplesSplit;
  parameters.maxLeaf = maxLeaf;
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
          value={minSamplesSplit}
          placeholder="default is 2"
          onChange={(e) => setMinSplit(e.target.value)}
        />
      </div>
      <div>
        <label>Max leafs: </label>
        <input
          value={maxLeaf}
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

export function dtpara() {
  return parameters;
}

export default Dtparameters;
