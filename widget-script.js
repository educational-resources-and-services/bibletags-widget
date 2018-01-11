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

  const setWidgetElStyle = ({ widgetEl, style, iframeEl }) => {
    const { top, bottom, left, width, height, initialHeight, visibility } = style

    const formVal = val => typeof val === 'number' ? val : `${val}px`
    
    if(top) {
      widgetEl.style.top = `${top}px`;
    } else {
      widgetEl.style.top = `auto`;
      widgetEl.style.bottom = `${bottom}px`;
    }
    widgetEl.style.left = `${left}px`;
    widgetEl.style.width = formVal(width);
    widgetEl.style.height = formVal(height || initialHeight);
    widgetEl.style.visibility = visibility;

    iframeEl.style.width = `100%`;
    iframeEl.style.height = `100%`;
  };

  const getWidgetElStyle = ({ options }) => {
    const mobileMode = Math.min(window.innerWidth, window.innerHeight) < 500;
    const width = mobileMode ? '100%' : 400;
    const maxHeight = 800;  // calculate
    const initialHeight = mobileMode ? '100%' : Math.min(250, maxHeight);
    const top = mobileMode ? 0 : 100;  // calculate
    const bottom = mobileMode ? 0 : null;  // calculate
    const left = mobileMode ? 0 : 100;  // calculate

    return {
      top,
      bottom,
      left,
      width,
      maxHeight,
      initialHeight,
      visibility: `visible`,
    };
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

    hideWidgetEl(widgetEl);
    
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
        height: 1px;
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

  window.addEventListener('load', () => addOnDeckInstance({}));
  
  window.bibleTagsWidget = {

    setup: (options={}) => {
      settings = options || {};
    },

    preload: (options={}) => {

      let { widgetEl, iframeEl } = getInstanceTemplate(options);

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
      const style = getWidgetElStyle({ options });

      iframeEl.style.width = `${style.width}px`;
      options.maxHeight = style.maxHeight;
      
      // postMessage the options upon iframe load 
      const sendShowPostMessage = () => {

        const partialSettings = Object.assign({}, settings);
        const partialOptions = Object.assign({}, options);

        delete partialSettings.containerEls;
        delete partialOptions.anchorEl;
        delete partialOptions.containerEl;
        (partialOptions.addlOptions || []).forEach(option => delete option.callback);
        delete partialOptions.fetchVerseCallback;
        delete partialOptions.jumpToLocationCallback;
        partialOptions.searchData && delete partialOptions.searchData.callback;
        delete partialOptions.infoCallback;

        iframeEl.contentWindow.postMessage({
          action: 'show',
          payload: {
            settings: partialSettings,
            options: partialOptions,
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

          case 'ready':
            setWidgetElStyle({ widgetEl, style, iframeEl });
            break;

          case 'updateHeight':
            const newHeight = parseInt(data.payload.height)
            if(newHeight) {
              widgetEl.style.height = `${newHeight}px`;
              style.height = newHeight
            }
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
      
      // the timeout prevents this code from slowing down the initial resize of instance we are now showing
      setTimeout(() => addOnDeckInstance(options), 500);

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