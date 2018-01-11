let settings = {}

export const setup = sttngs => settings = sttngs

export const ready = () => {
  const { origin, source } = settings
  
  if(!source) return

  source.postMessage({
    action: 'ready',
  }, origin)
}

export const updateHeight = height => {
  const { origin, source, maxHeight=99999999 } = settings

  if(!source) return

  source.postMessage({
    action: 'updateHeight',
    payload: {
      height: Math.min(maxHeight, height),
    },
  }, origin)
}

export const close = () => {
  const { origin, source } = settings
  
  if(!source) return

  source.postMessage({
    action: 'close',
  }, origin)
}