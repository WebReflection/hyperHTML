var OpenExchangeRates = function () {
  /*! (c) Andrea Giammarchi */
  return function OpenExchangeRates(APP_ID) {
    var cache = {};
    return {
      format: (amount, currency) =>
        format(amount, currency),
      clear: (base) =>
        delete cache[(base || 'USD').toUpperCase()],
      convert: (amount, from, to) =>
        latest(from).then(info =>
          format(info.rates[to.toUpperCase()] * amount, to)),
      currencies: () =>
        cache.currencies || (cache.currencies = new Promise((res, rej) => {
          load(urlFor('currencies'), res, rej);
        })),
      latest: (base) => {
        base = (base || 'USD').toUpperCase();
        return cache[base] || (cache[base] = new Promise((res, rej) => {
          load(`${urlFor('latest')}&base=${base}`, res, rej);
        }));
      }
    };
    function urlFor(key) {
      return `https://openexchangerates.org/api/${key}.json?app_id=${APP_ID}`;
    }
    function latest(base) {
      base = (base || 'USD').toUpperCase();
      return cache[base] || (cache[base] = new Promise((res, rej) => {
        load(`${urlFor('latest')}&base=${base}`, res, rej);
      }));
    }

  };
  function format(amount, currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    })
    .format(amount)
    .replace(/^NaN$/, '')
    .replace(/^(\D+)/, '$1 ')
    .replace('BTC', '₿');
  }
  function load(url, res, rej) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.onload = () => res(JSON.parse(xhr.responseText));
    xhr.onerror = rej;
    xhr.send(null);
  }
}();