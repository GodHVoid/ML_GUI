import { DecisionTree } from "./decisionTree.js";

let x = [[1,2,3],[4,5,6],[7,8,9]];
console.log(x[1].slice());

// console.log(x.map(row => row[0]))

// function test(x, y){
//   return [x+y, x*y];
// }

// var x = 5;
// var y = 10;
// var [sum, prod] = [2, 4];//test(x, y);

// console.log(sum, prod);

// function _most_common_label(y){
//     console.time("executing...");
//     // returns the most common label of y
//     // we expect y to be a 1-D array
//     let maxKey = null;
//     let maxVal = -Infinity;
//     let freq = {};

//     // make a histogram of the frequencies of each label
//     for(let i = 0; i < y.length; i++){
//         if(y[i] in freq){
//             freq[y[i]] += 1;
//         }
//         else{
//             freq[y[i]] = 1;
//         }
//     }console.log(freq);
//     // look for the most common label
//     for(const label in freq){
//         if(freq[label] > maxVal){
//             maxVal = freq[label];
//             maxKey = label;
//         }
//     }console.timeEnd("executing...");
//     return maxKey;
// }

// var y = [1, 3, 5, 4, 3, 3, 1, 2, 6, 5, 4, 3, 2, 3, 2, 2, 2];

// console.log(_most_common_label(y));


// var data = {
//     "yellow": 10,
//     "green": 3,
//     "red": 8,
// };

// if("yellow" in data){
//     data['yellow'] += 1;
//     console.log(data);
// }

// console.log(data.length);


// function onlyUnique(value, index, array) {
//     return array.indexOf(value) === index;
//   }

// var arr = [1, 2 ,3, 3, 1, 2, 3, 5, 4, 9];
// var unique = arr.filter(onlyUnique).sort();

// console.log(unique);

// function getFrequency(arr, limit=1) {
//     const frequencyObj = {};
  
//     for (const element of arr) {
//       if (element in frequencyObj) {
//         frequencyObj[element]++;
//       } else {
//         frequencyObj[element] = 1;
//       }
//     }


  
//     return frequencyObj;
//   }
  
//   const myList = [1, 2, 2, 3, 4, 4, 5];
//   const frequencyObj = getFrequency(myList);

//   console.log(frequencyObj);
//   console.log(Object.values(frequencyObj));
  
//   // To access the frequency of a specific element (e.g., 2):
//   const countOf2 = frequencyObj[2];
//   console.log(countOf2); // Output: 2