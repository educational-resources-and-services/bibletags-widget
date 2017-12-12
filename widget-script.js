!((d) => {

  if(window.bibleTagsWidget) return;

  // development
  const widgetDomain = '*';
  const widgetUrl = `http://localhost:3000/index.html`;
  
  // // staging
  // const widgetDomain = 'https://s3.amazonaws.com';
  // const widgetUrl = `${widgetDomain}/cdn.bibletags.org/build/index.html`;
  
  // // production
  // const widgetDomain = 'https://cdn.bibletags.org';
  // const widgetUrl = `${widgetDomain}/index-{{LANG}}.html`;


  let onDeckInstance;
  const instances = {};
  let settings = {};
  let idIndex = 1;

  const newEl = (type, attrs) => {
    const el = d.createElement(type);
    for (let attr in attrs) {
      el[attr] = attrs[attr];
    }
    return el;
  };

  const getUiLanguageCode = options => {
    let uiLanguageCode
    try {
      uiLanguageCode = options.uiLanguageCode
        || localStorage.getItem(`uiLang-${options.versions && (options.versions[0] || {}).versionCode}`)
        || localStorage.getItem(`uiLang`)  // latest language code used
        || 'eng'  // unknown; widget will redirect to correct language if necessary
    } catch(e) {
      uiLanguageCode = 'eng';
    }
    return uiLanguageCode;
  };
  
  const hideWidgetEl = widgetEl => {
    widgetEl.style.top = 0;
    widgetEl.style.left = 0;
    widgetEl.style.width = `1px`;
    widgetEl.style.height = `1px`;
    widgetEl.style.visibility = `hidden`;
  };

  const setWidgetElStyle = ({ widgetEl, options }) => {
    const mobileMode = Math.min(window.innerWidth, window.innerHeight) < 500;
    const width = mobileMode ? '100%' : 400;
    const maxHeight = 800;  // calculate
    const initialHeight = mobileMode ? '100%' : Math.min(350, maxHeight);
    const top = mobileMode ? 0 : 100;  // calculate
    const bottom = mobileMode ? 0 : null;  // calculate
    const left = mobileMode ? 0 : 100;  // calculate

    if(top) {
      widgetEl.style.top = `${top}px`;
    } else {
      widgetEl.style.bottom = `${bottom}px`;
    }
    widgetEl.style.left = `${left}px`;
    widgetEl.style.width = `${width}px`;
    widgetEl.style.height = `${initialHeight}px`;
    widgetEl.style.visibility = `visible`;
  };

  const getInstanceTemplate = options => {

    const uiLanguageCode = getUiLanguageCode(options);

    // create widget container
    const widgetEl = newEl('div', {
      style: `
        position: absolute;
        border: 1px solid #333;
        border-radius: 3px;
        overflow: hidden;
      `,
    });

    setWidgetElStyle({ widgetEl, options });

    // create widget arrow element
    const arrowEl = options.anchorEl && newEl('div', {
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
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        border: none;
      `,
    });

    iframeEl.onload = () => iframeEl.loaded = true;

    arrowEl && widgetEl.appendChild(arrowEl);
    widgetEl.appendChild(iframeEl);

    return {
      widgetEl,
      arrowEl,
      iframeEl,
    };
    
  };

  const addOnDeckInstance = options => {
    onDeckInstance = getInstanceTemplate(options);
    hideWidgetEl(onDeckInstance.widgetEl);
    (options.containerEl || d.body).appendChild(onDeckInstance.widgetEl);
  };

  const destroyInstance = id => {
    if(!instances[id]) return;
    const { widgetEl, iframeElEvent } = instances[id];
    widgetEl.remove();
    window.removeEventListener('message', iframeElEvent) ;         
    delete instances[id];
  };

  const styleEl = d.createElement('style');
  styleEl.innerHTML = '';  // add styles in here
  d.head.appendChild(styleEl);

  window.onload = () => addOnDeckInstance({});
  
  window.bibleTagsWidget = {

    setup: (options={}) => {
      settings = options || {};
    },

    preload: (options={}) => {

      let { widgetEl, iframeEl } = getInstanceTemplate(options);

      hideWidgetEl(widgetEl);

      // postMessage the options upon iframe load 
      iframeEl.onload = () => {
        iframeEl.contentWindow.postMessage({
          action: 'preload',
          payload: {
            settings,
            options,
          },
        }, widgetDomain);
      }

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
        if(!widgetEl) return;
        widgetEl.remove();
        window.removeEventListener('message', iframeElEvent);
        widgetEl = iframeEl = null;
      }

      window.addEventListener('message', iframeElEvent);

      d.body.appendChild(widgetEl);
      
      // destroy it in 30 seconds no matter what
      setTimeout(close, 30 * 1000);

    },

    show: (options={}) => {

      const id = idIndex++;
      const { widgetEl, iframeEl } = d.body.contains(onDeckInstance.widgetEl) ? onDeckInstance : getInstanceTemplate(options);

      setWidgetElStyle({ widgetEl, options });
      
      // postMessage the options upon iframe load 
      const sendShowPostMessage = () => {
        iframeEl.contentWindow.postMessage({
          action: 'show',
          payload: {
            settings,
            options,
          },
        }, widgetDomain);
      }

      // set up postMessage communcation
      const iframeElEvent = event => {
        const { data, source, origin } = event;

        if(source != iframeEl.contentWindow) return;
        if(origin != widgetDomain && widgetDomain != '*') return;

        switch(data.action) {
          case 'close':
            destroyInstance(id);
            break;

          case '':
            break;
        }
      };

      if(widgetEl.parentElement != (options.containerEl || d.body)) {
        (options.containerEl || d.body).appendChild(widgetEl);
      }

      window.addEventListener('message', iframeElEvent)

      if(iframeEl.loaded) {
        sendShowPostMessage();
      } else {
        iframeEl.onload = sendShowPostMessage;
      }

      instances[id] = {
        widgetEl,
        iframeElEvent,
      };
      
      addOnDeckInstance(options);

      return id;
      
    },

    hide: id => {
      // destroy the matching widget iframe (or all, if id is absent)
      if(id) {
        destroyInstance(id);
      } else {
        Object.keys(instances).forEach(id => destroyInstance(id));
      }
    },

  };

})(document);