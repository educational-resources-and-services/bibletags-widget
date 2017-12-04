!(function (d) {

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

  if(!window.bibleTagsWidget) {
    const node = d.createElement('style');
    node.innerHTML = '';  // add styles in here
    d.head.appendChild(node);
  }

  const settings = {};
  let instances = {};

  window.bibleTagsWidget = window.bibleTagsWidget || {

    setup: function(options) {
      settings = options;
    },

    preload: function(options) {
      // create iframe that will retrieve the data and place it in localstorage (filtering out old preloads)
      let iframeEl = newEl('iframe', {
        src: preloaderUrl,
        style: `
          visibility: hidden;
          width: 1px;
          height: 1px;
          position: absolute;
          top: 0;
          left: 0;
        `,
      });

      // postMessage the options upon iframe load 
      iframeEl.addEventListener('onload', () => {
        iframeEl.postMessage(options, widgetDomain);
      });

      // set up postMessage communcation
      window.addEventListener('message', event => {
        const { data, source, origin } = event;

        if(source != iframeEl) return;
        if(origin != widgetDomain) return;

        switch(data.action) {
          case 'close':
            iframeEl.remove();
            iframeEl = null;
            break;
        }
      });
      
      // destroy it in 30 seconds no matter what
      setTimeout(() => iframeEl && iframeEl.remove(), 30 * 1000);

    },

    show: function(options) {

      let uiLanguageCode
      try {
        uiLanguageCode = options.uiLanguageCode
          || localStorage.getItem(`uiLang-${options.versions[0].versionCode}`)
          || 'eng'  // unknown; widget will redirect to correct language if necessary
      } catch(e) {
        uiLanguageCode = 'eng'
      }

      // create widget container
      let widgetContainerEl = newEl('div', {
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
        src: `${widgetUrl}/${uiLanguageCode}/index.html`,
        style: `
          visibility: hidden;
          width: 1px;
          height: 1px;
          position: absolute;
          top: 0;
          left: 0;
        `,
      });

      widgetContainerEl.appendChild(arrowEl);
      widgetContainerEl.appendChild(iframeEl);
      (options.containerEl || document.body).appendChild(widgetContainerEl);

      // postMessage the options upon iframe load 
      iframeEl.addEventListener('onload', () => {
        iframeEl.postMessage({
          action: 'setup',
          payload: {
            settings,
            options,
          },
        }, widgetDomain);
      });

      // set up postMessage communcation
      window.addEventListener('message', event => {
        const { data, source, origin } = event;

        if(source != iframeEl) return;
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
      
    },

    hide: function(uid) {
      // destroy the matching widget iframe (or all, if uid is absent)
      if(uid) {
        if(instances[uid]) {
          instances[uid].containerEl.remove();
          delete instances[uid];
        }
      } else {
        instances.forEach(instance => instance.containerEl.remove())
        instances = {};
      }
    },

  };

})(document);