// Least-used, topic-relevant assets; never substitute a different model's product.
export function chooseMedia(candidates, posts, count = 1) {
  const published = posts.filter(post => post.metadata.draft === false)
    .sort((a, b) => Date.parse(b.metadata.pubDate || 0) - Date.parse(a.metadata.pubDate || 0));
  const recent = published.slice(0, 2).map(post => post.metadata.cover);
  const occurrences = asset => published.reduce((total, post) =>
    total + Number(post.metadata.cover === asset.publicPath)
      + (post.body.split(asset.publicPath).length - 1), 0);
  return [...candidates].sort((a, b) =>
    Number(recent.includes(a.publicPath)) - Number(recent.includes(b.publicPath))
      || occurrences(a) - occurrences(b)
      || a.publicPath.localeCompare(b.publicPath)).slice(0, count);
}
export function chooseCover(catalog, category, posts) {
  const matching = catalog.assets.filter(asset => asset.categories.includes(category));
  const cover = chooseMedia(matching, posts)[0];
  if (!cover) throw new Error('No approved journal cover for ' + category);
  return cover;
}
export function chooseProductImages(catalog, model, posts) {
  const assets = chooseMedia(catalog.assets.filter(asset => asset.model === model), posts, 2);
  if (!assets.length) throw new Error('No approved product image for ' + model);
  return assets;
}
