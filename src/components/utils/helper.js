export function testnetName(temp) {
  if (temp?.includes("-")) {
    const words = temp.replaceAll("-", " ").slice(0, -9).split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join("-");
  } else {
    return temp || "";
  }
}
