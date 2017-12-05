!(function (d) {

  if(window.bibleTagsWidget) return

  const widgetDomain = 'https://cdn.bibletags.org'
  const preloaderUrl = `${widgetDomain}/preloader`
  const widgetUrl = `${widgetDomain}/widget`

  const newEl = function (type, attrs) {
    const el = d.createElement(type);
    for (let attr in attrs) {
      el[attr] = attrs[attr];
    }
    return el;
  }

  const pseudoHiddenStyles = `
    visibility: hidden;
    width: 1px;
    height: 1px;
    position: absolute;
    top: 0;
    left: 0;
  `

  if(!window.bibleTagsWidget) {
    const node = d.createElement('style');
    node.innerHTML = '';  // add styles in here
    d.head.appendChild(node);
  }

  let settings = {};
  let instances = {};
  let idIndex = 1;

  window.bibleTagsWidget = {

    setup: function(options) {
      settings = options;

      // load iframe with eng widget to try and ensure no delay on show
      let iframeEl = newEl('iframe', {
        src: `${widgetUrl}/eng/index.html`,
        style: pseudoHiddenStyles,
      });

      document.body.appendChild(iframeEl);
      
      // destroy it in 30 seconds no matter what
      setTimeout(() => iframeEl && iframeEl.remove(), 30 * 1000);
    },

    preload: function(options) {
      // create iframe that will retrieve the data and place it in localstorage (filtering out old preloads)
      let iframeEl = newEl('iframe', {
        src: preloaderUrl,
        style: pseudoHiddenStyles,
      });

      // postMessage the options upon iframe load 
      iframeEl.onload = () => {
        // iframeEl.contentWindow.postMessage(options, widgetDomain);
        iframeEl.contentWindow.postMessage(options, '*');
      };

      // set up postMessage communcation
      window.addEventListener('message', event => {
        const { data, source, origin } = event;

        if(source != iframeEl.contentWindow) return;
        if(origin != widgetDomain) return;

        switch(data.action) {
          case 'close':
            iframeEl.remove();
            iframeEl = null;
            break;
        }
      });

      document.body.appendChild(iframeEl);
      
      // destroy it in 30 seconds no matter what
      setTimeout(() => iframeEl && iframeEl.remove(), 30 * 1000);

    },

    show: function(options) {

      const id = idIndex++

      let uiLanguageCode
      try {
        uiLanguageCode = options.uiLanguageCode
          || localStorage.getItem(`uiLang-${options.versions[0].versionCode}`)
          || 'eng'  // unknown; widget will redirect to correct language if necessary
      } catch(e) {
        uiLanguageCode = 'eng'
      }

      // create widget container
      let containerEl = newEl('div', {
        style: `
          position: absolute;
          top: 50px;
          left: 50px;
          width: 400px;
          max-height: 600px;
        `,
      });

      // create widget arrow element
      let arrowEl = newEl('div', {
        style: `
          position: absolute;
          width: 16px;
          height: 16px;
          border: 1px solid #333;
        `,
      });

      // create iframe with widget
      const iframeEl = newEl('iframe', {
        // src: `${widgetUrl}/${uiLanguageCode}/index.html`,
        src: `widget/build/index.html`,
        style: `
          visibility: hidden;
          width: 100px;
          height: 100px;
          position: absolute;
          top: 0;
          left: 0;
        `,
      });

      instances[id] = {
        containerEl,
      }

      containerEl.appendChild(arrowEl);
      containerEl.appendChild(iframeEl);
      (options.containerEl || document.body).appendChild(containerEl);

      // postMessage the options upon iframe load 
      iframeEl.onload = () => {
console.log('go postMessage setup')
        iframeEl.contentWindow.postMessage({
          action: 'setup',
          payload: {
            settings,
            options,
          },
        // }, widgetDomain);
        }, '*');
      };

      // set up postMessage communcation
      window.addEventListener('message', event => {
        const { data, source, origin } = event;

        if(source != iframeEl.contentWindow) return;
        if(origin != widgetDomain) return;

        switch(data.action) {
          case 'close':
            iframeEl.remove();
            iframeEl = null;
            break;

          case '':
            break;
        }
      });

      return id;
      
    },

    hide: function(id) {
      // destroy the matching widget iframe (or all, if id is absent)
      if(id) {
        if(instances[id]) {
          instances[id].containerEl.remove();
          delete instances[id];
        }
      } else {
        Object.values(instances).forEach(instance => instance.containerEl.remove())
        instances = {};
      }
    },

  };

})(document);