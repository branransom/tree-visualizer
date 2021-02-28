const unflatten = (items) => {
  const tree = [];
  const mappedArr = {};
  let mappedElem;

  mappedArr["root"] = { children: [] };

  // Build a hash table and map items to objects
  items.forEach((item) => {
    const id = item.id;
    if (!mappedArr.hasOwnProperty(id)) {
      // in case of duplicates
      mappedArr[id] = item; // the extracted id as key, and the item as value
      mappedArr[id].children = []; // under each item, add a key "children" with an empty array as value
    }
  });

  // Loop over hash table
  for (const id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];

      // If the element is not at the root level, add it to its parent array of children. Note this will continue till we have only root level elements left
      if (mappedElem.parent) {
        const parentId = mappedElem.parent || "root";
        mappedArr[parentId].children.push(mappedElem);
      }

      // If the element is at the root level, directly push to the tree
      else {
        tree.push(mappedElem);
      }
    }
  }

  return tree;
};

export default unflatten;
