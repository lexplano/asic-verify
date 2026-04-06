import Assert from 'node:assert';

export function findEntry(entries, fn) {
  const entry = entries.filter((item) => {
    return item.fileName === fn;
  });
  Assert.equal(entry.length, 1, `Could not find exactly one entry for ${fn}`);
  return entry[0];
}
