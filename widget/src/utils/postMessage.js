let settings = {}

export const setup = sttngs => settings = sttngs

export const updateHeight = height => {
  const { origin, source, maxHeight=99999999 } = settings

  source.postMessage({
    action: 'updateHeight',
    payload: {
      height: Math.min(maxHeight, height),
    },
  }, origin)
}

export const close = () => {
  const { origin, source } = settings
  
  source.postMessage({
    action: 'close',
  }, origin)
}