!(function (d) {

  if(window.bibleTagsWidget) return

  // development
  const widgetDomain = '*'
  const widgetUrl = `http://localhost:3000/index.html`
  
  // // staging
  // const widgetDomain = 'https://s3.amazonaws.com'
  // const widgetUrl = `${widgetDomain}/cdn.bibletags.org/build/index.html`
  
  // // production
  // const widgetDomain = 'https://cdn.bibletags.org'
  // const widgetUrl = `${widgetDomain}/index-{{LANG}}.html`


  const instances = {};
  let settings = {};
  let idIndex = 1;

  const newEl = function (type, attrs) {
    const el = d.createElement(type);
    for (let attr in attrs) {
      el[attr] = attrs[attr];
    }
    return el;
  }

  const getUiLanguageCode = options => {
    let uiLanguageCode
    try {
      uiLanguageCode = options.uiLanguageCode
        || localStorage.getItem(`uiLang-${options.versions[0].versionCode}`)
        || 'eng'  // unknown; widget will redirect to correct language if necessary
    } catch(e) {
      uiLanguageCode = 'eng'
    }
    return uiLanguageCode
  }

  const destroyInstance = id => {
    if(!instances[id]) return
    const { containerEl, iframeElEvent } = instances[id]
    containerEl.remove()
    window.removeEventListener('message', iframeElEvent)          
    delete instances[id];
  }

  const pseudoHiddenStyles = `
    visibility: hidden;
    width: 1px;
    height: 1px;
    position: absolute;
    top: 0;
    left: 0;
  `

  const node = d.createElement('style');
  node.innerHTML = '';  // add styles in here
  d.head.appendChild(node);

  window.bibleTagsWidget = {

    setup: function(options) {
      settings = options;

      // load iframe with eng widget to try and ensure no delay on show
      let iframeEl = newEl('iframe', {
        src: widgetUrl.replace('{{LANG}}', 'eng'),
        style: pseudoHiddenStyles,
      });

      document.body.appendChild(iframeEl);
      
      // destroy it in 30 seconds no matter what
      setTimeout(() => iframeEl.remove(), 30 * 1000);
    },

    preload: function(options) {

      const uiLanguageCode = getUiLanguageCode(options)

      // create iframe that will retrieve the data and place it in localstorage (filtering out old preloads)
      let iframeEl = newEl('iframe', {
        src: widgetUrl.replace('{{LANG}}', uiLanguageCode),
        style: pseudoHiddenStyles,
      });

      // postMessage the options upon iframe load 
      iframeEl.onload = () => {
        iframeEl.contentWindow.postMessage({
          action: 'preload',
          payload: {
            settings,
            options,
          },
        }, widgetDomain);
      };

      // set up postMessage communcation
      const iframeElEvent = event => {
        const { data, source, origin } = event;

        if(source != iframeEl.contentWindow) return;
        if(origin != widgetDomain && widgetDomain != '*') return;

        switch(data.action) {
          case 'close':
            close();
            break;
        }
      };

      const close = () => {
        if(!iframeEl) return;
        iframeEl.remove();
        window.removeEventListener('message', iframeElEvent);
        iframeEl = null;
      }

      window.addEventListener('message', iframeElEvent)

      document.body.appendChild(iframeEl);
      
      // destroy it in 30 seconds no matter what
      setTimeout(close, 30 * 1000);

    },

    show: function(options) {

      const id = idIndex++
      const uiLanguageCode = getUiLanguageCode(options)

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
        src: widgetUrl.replace('{{LANG}}', uiLanguageCode),
        style: `
          visibility: hidden;
          width: 100px;
          height: 100px;
          position: absolute;
          top: 0;
          left: 0;
        `,
      });

      containerEl.appendChild(arrowEl);
      containerEl.appendChild(iframeEl);
      (options.containerEl || document.body).appendChild(containerEl);

      // postMessage the options upon iframe load 
      iframeEl.onload = () => {
        iframeEl.contentWindow.postMessage({
          action: 'show',
          payload: {
            settings,
            options,
          },
        }, widgetDomain);
      };

      // set up postMessage communcation
      const iframeElEvent = event => {
        const { data, source, origin } = event;

        if(source != iframeEl.contentWindow) return;
        if(origin != widgetDomain && widgetDomain != '*') return;

        switch(data.action) {
          case 'close':
            destroyInstance(id)
            break;

          case '':
            break;
        }
      };

      window.addEventListener('message', iframeElEvent)

      instances[id] = {
        containerEl,
        iframeElEvent,
      }
      
      return id;
      
    },

    hide: function(id) {
      // destroy the matching widget iframe (or all, if id is absent)
      if(id) {
        destroyInstance(id)
      } else {
        Object.keys(instances).forEach(id => destroyInstance(id))
      }
    },

  };

})(document);