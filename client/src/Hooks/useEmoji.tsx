import React from "react";

type singleEmoji = {
  stringValue: string;
  unicode: string;
};

export default function useEmoji() {
  //Emoji array
  const emoji: singleEmoji[] = [
    {
      stringValue: "smile",
      unicode: "🙂",
    },
    { stringValue: "grinning_face", unicode: "😀" },
  ];

  function emojify(string: string) {
    if (!string.includes(":")) return string;

    let indexes: number[] = [];

    let stringArray = Array.from(string);

    //Find every ":" nad save their indexes in array
    while (
      stringArray.findIndex(
        (char, index) => char === ":" && !indexes.includes(index)
      ) !== -1
    ) {
      indexes.push(
        stringArray.findIndex(
          (char, index) => char === ":" && !indexes.includes(index)
        )
      );
    }

    if (indexes.length < 2) return string;

    //Check if between ":" are any emoji string values and change them if yes
    while (indexes.length > 1) {
      let startIndex = indexes[indexes.length - 2];
      let endIndex = indexes[indexes.length - 1];

      let slice = stringArray.slice(startIndex + 1, endIndex);
      let checkEmoji = emoji.find((el) => el.stringValue === slice.join(""));

      if (checkEmoji) {
        stringArray[startIndex] = checkEmoji.unicode;
        stringArray.splice(startIndex + 1, slice.length + 1);
      }

      indexes.pop();
      indexes.pop();
    }

    return stringArray.join("");
  }

  return { emojify };
}
