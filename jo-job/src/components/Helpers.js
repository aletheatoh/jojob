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

export function unitSizeDic(dim) {

  if (dim == '20-37') return '5 x 5';
  if (dim == '37-62') return '5 x 10';
  if (dim == '62-87') return '5 x 15';
  if (dim == '87-125') return '10 x 10';
  if (dim == '125-175') return '10 x 15';
  if (dim == '175-250') return '10 x 20';
  if (dim == '250-999') return '10 x 30';

  return 'None';

}
