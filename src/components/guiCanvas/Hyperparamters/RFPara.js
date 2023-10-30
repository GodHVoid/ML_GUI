import React, {useState} from 'react';

let parameters = {nEstimator:"",maxDepth:0, minSamplesLeaf: 1, minInfoGain:0};

export function RFparameters(){
    const [nEstimator, setEstimator] = useState(1);
    const [max_depth, setMaxDepth] = useState(0);
    const [minSamplesLeaf, setMinLeaf] = useState(1);
    const [minInfo, setInfo] = useState(0.0);

    parameters.nEstimator = nEstimator;
    parameters.maxDepth = max_depth;
    parameters.minSamplesLeaf = minSamplesLeaf;
    parameters.minInfoGain = minInfo;
    return(
        <form>
            <div>
                <label>N Estimator: </label>
                <input value={nEstimator} placeholder='default is none' onChange={e => setEstimator(e.target.value)}></input>
            </div>
            <div>
                <label>Max Depth: </label>
                <input value={max_depth} placeholder='default is none' onChange={e => setMaxDepth(e.target.value)}></input>

            </div>
            <div>
                <label>Min leafs: </label>
                <input value={minSamplesLeaf} placeholder='default is 2' onChange={e =>setMinLeaf(e.target.value)}></input>
            </div>
            <div>
                <label>Info Gain: </label>
                <input value={minInfo} placeholder='default is 0.0'onChange={e => setInfo(e.target.value)}></input>
            </div>
        </form>
       );
}

export function RFpara() {
    return parameters;
}

export default RFparameters
