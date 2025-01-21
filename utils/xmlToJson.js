const xmlToJson = (xml) => {
    const parser = new DOMParser();
     const xmlDoc = parser.parseFromString(xml, 'text/xml');
     const metadataNode = xmlDoc.querySelector('metadata');
     if(!metadataNode) return null;
          const metadata = {
            title: metadataNode.querySelector('title')?.textContent || null,
          creator: metadataNode.querySelector('creator')?.textContent || null,
          date: metadataNode.querySelector('date')?.textContent || null,
             description: metadataNode.querySelector('description')?.textContent || null,
            subjects: Array.from(metadataNode.querySelectorAll('subject')).map(subject => subject.textContent) || [],
          }
        
           return metadata
  }

export default xmlToJson