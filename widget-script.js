!((d, w) => {
  
  if(w.bibleTagsWidget) return;

  // constants
  const INITIAL_HEIGHT = 250;
  const MINIMUM_HEIGHT = 200;
  const SPACE_BELOW_NEEDED_TO_AUTOMATICALLY_EXPAND_DOWN = 800;
  const MAXIMUM_NON_MOBILE_WIDGET_WIDTH = 400;
  const DEFAULT_MARGIN = 10;
  const DEFAULT_Z_INDEX = 100;

  // development
  const widgetDomain = '*';
  const widgetUrl = `http://localhost:3000/index.html`;
  
  // // staging
  // const widgetDomain = 'https://cdn.staging.bibletags.org';
  // const widgetUrl = `${widgetDomain}/widget/build/index.html`;
  
  // // production
  // const widgetDomain = 'https://cdn.bibletags.org';
  // const widgetUrl = `${widgetDomain}/widget/build/index.html`;


  let onDeckInstances = [];
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

  const getMobileMode = () => Math.min(w.innerWidth, w.innerHeight) < 500;
  
  const getContainerEl = options => ((!getMobileMode() && options.containerEl) || d.body);
  
  const hideWidgetEl = widgetEl => {
    const widgetElStyle = widgetEl.style;
    widgetElStyle.position = 'absolute';
    widgetElStyle.overflow = 'hidden';
    widgetElStyle.top = 0;
    widgetElStyle.left = 0;
    widgetElStyle.width = `1px`;
    widgetElStyle.height = `1px`;
    widgetElStyle.visibility = `hidden`;
  };

  const setWidgetElStyle = ({ widgetEl, style, iframeEl }) => {
    
    const formVal = val => typeof val === 'number' ? `${val}px` : (val == null ? `auto` : val);

    for(let attr in style) {
      widgetEl.style[attr] = formVal(style[attr]);
    }

    iframeEl.style.width = `100%`;
    iframeEl.style.height = `100%`;

  };

  const getWidgetElStyle = ({ options }) => {
    const mobileMode = getMobileMode();
    const containerEl = getContainerEl(options);

    const margin = parseInt(options.margin, 10) || DEFAULT_MARGIN;
    const containerElScroll = mobileMode
      ?
        { x:0, y:0 }
      :
        (
          options.containerElTargetScroll
            || 
          {
            x: containerEl.scrollLeft,
            y: containerEl.scrollTop,
          }
        );
    
    const containerElRect = containerEl.getBoundingClientRect();
    const containerElInnerWidth = containerEl.clientWidth;
    const containerElInnerHeight = containerEl.clientHeight;
    const tenPercentDownInContainerEl = containerElRect.top + containerElRect.height * .1;
    const anchorElRect = options.anchorEl
      ?
        options.anchorEl.getBoundingClientRect()
      : 
        {
          top: tenPercentDownInContainerEl,
          bottom: tenPercentDownInContainerEl,
          left: containerElRect.left + containerElInnerWidth/2,
          width: 0,
          height: 0,
        };
    const containerElComputedStyle = getComputedStyle(containerEl)
    const containerElBorderTop = parseInt(containerElComputedStyle.borderTopWidth, 10) || 0;
    const containerElBorderLeft = parseInt(containerElComputedStyle.borderLeftWidth, 10) || 0;
    const containerElBorderAndScrollBottom = containerElRect.height - containerElInnerHeight - containerElBorderTop;
    const containerElBorderAndScrollRight = containerElRect.width - containerElInnerWidth - containerElBorderLeft;

    const width = mobileMode ? '100%' : Math.max(Math.min(containerElInnerWidth - margin * 2, MAXIMUM_NON_MOBILE_WIDGET_WIDTH), 0.1);
    const spaceAboveInContainer = anchorElRect.top - containerElRect.top - containerElBorderTop;
    const spaceBelowInContainer = containerElRect.bottom - anchorElRect.bottom - containerElBorderAndScrollBottom;
    const spaceAboveInViewPort = anchorElRect.top;
    const spaceBelowInViewPort = d.body.clientHeight - anchorElRect.bottom;
    const spaceAbove = Math.min(spaceAboveInContainer, spaceAboveInViewPort);
    const spaceBelow = Math.min(spaceBelowInContainer, spaceBelowInViewPort);
    const anchorElTopInContainer = containerElScroll.y + spaceAboveInContainer;
    const anchorElBottomInContainer = containerEl.scrollHeight - anchorElTopInContainer - anchorElRect.height;
    const anchorElLeftInContainer = containerElScroll.x + (anchorElRect.left - containerElBorderLeft - containerElRect.left);
    const expandsDown =
      spaceBelow > SPACE_BELOW_NEEDED_TO_AUTOMATICALLY_EXPAND_DOWN
        ||
      (
        Math.max(spaceBelow, spaceAbove) >= MINIMUM_HEIGHT
          ? spaceBelow >= spaceAbove
          : spaceBelowInViewPort >= spaceAboveInViewPort
      );
    const top = mobileMode ? 0 : (expandsDown ? (anchorElTopInContainer + anchorElRect.height) : null);
    const bottom = mobileMode ? 0 : (expandsDown ? null : (spaceBelowInContainer - containerElScroll.y + anchorElRect.height));
    const left = mobileMode
      ? 0
      :
        Math.min(
          Math.max(
            anchorElLeftInContainer + anchorElRect.width/2 - width/2,
            containerElScroll.x + Math.max(containerElRect.left * -1 - containerElBorderLeft, 0) + margin
          ),
          containerElInnerWidth + containerEl.scrollLeft - Math.max(containerElRect.right - containerElBorderAndScrollRight - d.body.clientWidth, 0) - margin - width
        );
    const maxHeight = mobileMode ? '100vh' : Math.max((expandsDown ? spaceBelow : spaceAbove) - margin, MINIMUM_HEIGHT);
    const height = mobileMode ? '100vh' : Math.min(INITIAL_HEIGHT, maxHeight);  // initial height
    const position = mobileMode ? 'fixed' : 'absolute';
    const zIndex = (options.zIndex != null ? options.zIndex : DEFAULT_Z_INDEX) + '';  // if it is not a string, "px" will get appended
    const border = mobileMode ? '' : '1px solid #333';
    const borderRadius = mobileMode ? 0 : 3;
    const boxShadow = mobileMode ? '' : '0 2px 8px rgba(0,0,0,.2)';
    const visibility = 'visible';

    return {
      top,
      bottom,
      left,
      width,
      maxHeight,
      height,
      position,
      zIndex,
      border,
      borderRadius,
      boxShadow,
      visibility,
    };
  };

  const getInstanceTemplate = () => {

    // create widget container
    const widgetEl = newEl('div');

    hideWidgetEl(widgetEl);
    
    // create widget arrow element
    const arrowEl = newEl('div', {
      style: `
        position: absolute;
        width: 16px;
        height: 16px;
        border: 1px solid #333;
      `,
    });

    // create iframe with widget
    const iframeEl = newEl('iframe', {
      src: widgetUrl,
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

  const makeRelativeIfStatic = el => {
    const elComputedStyle = el && getComputedStyle(el);

    if(el && elComputedStyle.position === 'static') {
      el.style.setProperty('position', 'relative', 'important');
    }
  };

  const loadOnDeckInstances = () => {
    const onDeckInstanceContainers = onDeckInstances.map(onDeckInstance => onDeckInstance.widgetEl.parentNode);

    // no more than 10 containers
    (settings.containerEls instanceof Array
      ? settings.containerEls
      : [d.body]
    ).slice(0,10).forEach(containerEl => {

      if(onDeckInstanceContainers.includes(containerEl)) return;
  
      const onDeckInstance = getInstanceTemplate();
  
      onDeckInstances.push(onDeckInstance);
      makeRelativeIfStatic(containerEl);
      containerEl.appendChild(onDeckInstance.widgetEl);
    })
  };

  const destroyInstance = id => {
    if(!instances[id]) return;
    const { widgetEl, iframeElEvent } = instances[id];
    widgetEl.remove();
    w.removeEventListener('message', iframeElEvent) ;         
    delete instances[id];
  };

  const styleEl = d.createElement('style');
  styleEl.innerHTML = '';  // add styles in here
  d.head.appendChild(styleEl);

  w.addEventListener('load', loadOnDeckInstances);
  
  w.bibleTagsWidget = {

    setup: (options={}) => {
      settings = options || {};
      loadOnDeckInstances();
    },

    preload: (options={}) => {

      let { widgetEl, iframeEl } = getInstanceTemplate();

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
        w.removeEventListener('message', iframeElEvent);
        widgetEl = iframeEl = null;
      }

      w.addEventListener('message', iframeElEvent);

      d.body.appendChild(widgetEl);
      
      // destroy it in 30 seconds no matter what
      setTimeout(close, 30 * 1000);

    },

    show: (options={}) => {

      const id = idIndex++;
      const style = getWidgetElStyle({ options });
      const containerEl = getContainerEl(options);

      const { widgetEl, iframeEl, arrowEl } = (() => {
        for(let idx=0; idx<onDeckInstances.length; idx++) {
          if(onDeckInstances[idx].widgetEl.parentNode === containerEl) {
            return onDeckInstances.splice(idx, 1)[0];
          }
        }
        if(onDeckInstances.length > 0) {
          return onDeckInstances.splice(0, 1)[0];
        }
        return getInstanceTemplate();
      })();

      if(!(settings.containerEls instanceof Array)) {
        settings.containerEls = [ containerEl ]
      } else {
        // make sure it is the first in the list of containerEls
        settings.containerEls = settings.containerEls.filter(el => el !== containerEl);
        settings.containerEls.unshift(containerEl);
      }

      iframeEl.style.width = `${style.width}px`;
      options.maxHeight = style.maxHeight;
      
      // postMessage the options upon iframe load 
      const sendShowPostMessage = () => {

        iframeEl.loaded = false;

        const partialSettings = Object.assign({}, settings);
        const partialOptions = Object.assign({}, options);

        delete partialSettings.containerEls;
        delete partialOptions.anchorEl;
        delete partialOptions.containerEl;
        (partialOptions.addlOptions || []).forEach(option => option.callback = !!option.callback);
        partialOptions.fetchVerseCallback = !!partialOptions.fetchVerseCallback;
        partialOptions.jumpToLocationCallback = !!partialOptions.jumpToLocationCallback;
        if(partialOptions.searchData) partialOptions.searchData.callback = !!partialOptions.searchData.callback;
        partialOptions.infoCallback = !!partialOptions.infoCallback;

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
            setTimeout(() => widgetEl.style.transition = `height .1s ease-in-out`, 100);
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

      if(widgetEl.parentElement != containerEl) {
        makeRelativeIfStatic(containerEl);
        iframeEl.loaded = false;
        containerEl.appendChild(widgetEl);
      }

      if(!options.anchorEl || getMobileMode()) {
        arrowEl.remove();
      }
      
      w.addEventListener('message', iframeElEvent)

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
      setTimeout(loadOnDeckInstances, 500);

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

})(document, window);