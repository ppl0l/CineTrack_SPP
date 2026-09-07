const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = require('../components/App').default;

module.exports = function render(props) {
  const html = ReactDOMServer.renderToString(React.createElement(App, props));

  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CineTrack</title>
      <link rel="stylesheet" href="/css/main.css">
    </head>
    <body>
      <div id="root">${html}</div>
      <script>
        window.__INITIAL_PROPS__ = ${JSON.stringify(props).replace(/</g, '\\u003c')};
      </script>
      <script src="/bundle.js"></script>
    </body>
    </html>
  `;
};
