const teiParser = (tei) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(tei, "text/xml");
    const textElement = xmlDoc.querySelector("text body");

    if(!textElement) return "";
     let text = "";
  
     for (const paragraph of textElement.children) {
    text+=`<p>${paragraph.innerHTML}</p>`
  }

  return text
};

export default teiParser