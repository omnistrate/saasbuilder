const formatSequence = (seq) => {
  if (seq.length > 2) {
    return `${seq[0]} - ${seq[seq.length - 1]}`;
  }
  return seq.join(", ");
};

// Process an Array of Ports To Return a String
// Sample Input: [23, 24, 25, 26, 90, 11, 56, 57, 58, 97, 111, 112, 53] - Array
// Sample Output: "23 - 26, 90, 11, 56 - 58, 97, 111, 112, 53" - String

const processClusterPorts = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return "";
  }

  let result = "";
  let currentSequence = [arr[0]];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] - arr[i - 1] === 1) {
      // Continue the Current Sequence
      currentSequence.push(arr[i]);
    } else {
      // End the Current Sequence
      result += formatSequence(currentSequence) + ", ";
      currentSequence = [arr[i]];
    }
  }

  // Add the last Sequence
  result += formatSequence(currentSequence);

  return result;
};

export default processClusterPorts;
