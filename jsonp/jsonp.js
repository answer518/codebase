let jsonpID = 0;

function jsonp(url, timeout = 7500) {
  const head = document.querySelector('head');
  jsonpID += 1;

  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    const callbackName = `jsonpCallback${jsonpID}`;

    script.src = encodeURI(`${url}?callback=${callbackName}`);
    script.async = true;

    const timeoutId = window.setTimeout(() => {
      cleanUp();

      return reject(new Error('Timeout'));
    }, timeout);

    window[callbackName] = (data) => {
      cleanUp();

      return resolve(data);
    };

    script.addEventListener('error', (error) => {
      cleanUp();

      return reject(error);
    });

    function cleanUp() {
      window[callbackName] = undefined;
      head.removeChild(script);
      window.clearTimeout(timeoutId);
      script = null;
    }

    head.appendChild(script);
  });
}

jsonp('http://192.168.0.103:8081/jsonp', { a: 1, b: 'heiheihei' })
    .then(result => { console.log(result) })
    .catch(err => { console.error(err) })