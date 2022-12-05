const generate = function (innerHtml, title) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      ${innerHtml}
    </body>
    </html>`;
};

module.exports = {
  generate
};