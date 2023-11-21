const fs = require('fs');
const { sortAndDeduplicateDiagnostics } = require('typescript');

// Read the JSON file
fs.readFile('../data/vectors.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Parse the JSON data
  const vectors = JSON.parse(data);

  // Create an empty object to store the tag counts
  const tagCounts = {};

  // Loop over the items
  for (let vector of vectors) {
    // Loop over the tags
    for (let tag of vector.tags) {
      // If the tag is already in the tagCounts object, increment its count
      // Otherwise, add it to the tagCounts object with a count of 1
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }

  // Convert the tagCounts object to an array of { name, count } objects
  const tagCountArray = Object.entries(tagCounts).map(([name, count]) => ({ name, count }));

	tagCountArray.sort((a, b) => a.name.localeCompare(b.name));

  // Log the tag count array
  fs.writeFile('../data/tags.json', JSON.stringify(tagCountArray, null, 2), (err) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log('Tag counts saved to tag-counts.json');
	});
});