const settings = {}

export const setUp = sttngs => Object.assign(settings, sttngs)

export const ready = () => {
  window.parent.postMessage({
    action: 'ready',
  }, '*')
}

export const updateHeight = height => {
  const { maxHeight=99999999 } = settings

  window.parent.postMessage({
    action: 'updateHeight',
    payload: {
      height: Math.min(maxHeight, height),
    },
  }, '*')
}

export const report = ({ action, payload }) => {
  window.parent.postMessage({
    action,
    payload,
  }, '*')
}

export const close = () => {
  window.parent.postMessage({
    action: 'close',
  }, '*')
}