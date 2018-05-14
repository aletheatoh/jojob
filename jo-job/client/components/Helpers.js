export function comparePrice(a, b) {

  const val1 = parseFloat(a.price.replace('$',''));
  const val2 = parseFloat(b.price.replace('$',''));

  return val1-val2;
}

export function compareReviews(a, b) {

  const val1 = (a.reviews === "") ? 0: parseInt(a.reviews.match(/\d+/)[0]);
  const val2 = (b.reviews === "") ? 0: parseInt(b.reviews.match(/\d+/)[0]);

  return val2-val1;
}
