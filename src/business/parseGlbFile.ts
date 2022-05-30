export const parseGlbFile = (firstLevelChildren) => {
  const flattenedMesh = [];
  let firstLevelIndex = 0;

  let thirdLevelIndex = 0;

  let secondLevelIndex = 0;
  console.log("firstLevelChildren.length", firstLevelChildren.length);
  while (firstLevelIndex < firstLevelChildren.length) {
    secondLevelIndex = 0;
    if (firstLevelChildren[firstLevelChildren]?.children) {
      console.log("in if");
      while (
        secondLevelIndex <
        firstLevelChildren[firstLevelChildren].children.length
      ) {
        thirdLevelIndex = 0;
        if (
          firstLevelChildren[firstLevelChildren].children[secondLevelIndex]
            .children
        ) {
          while (
            thirdLevelIndex <
            firstLevelChildren[firstLevelChildren].children[secondLevelIndex]
              .children.length
          ) {
            flattenedMesh.push(
              firstLevelChildren[firstLevelChildren].children[secondLevelIndex]
                .children[thirdLevelIndex]
            );

            thirdLevelIndex++;
          }
        } else {
          flattenedMesh.push(
            firstLevelChildren[firstLevelChildren].children[secondLevelIndex]
          );
        }
        secondLevelIndex++;
      }
    } else {
      flattenedMesh.push(firstLevelChildren[firstLevelChildren]);
      //   console.log("in else");
    }
    firstLevelIndex++;
  }
  return flattenedMesh;
};
