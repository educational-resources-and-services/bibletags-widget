import { client, getQueryVars } from '../components/smart/Apollo'
import embeddingAppQuery from '../data/queries/embeddingApp'
import { hash64 } from './helperFunctions.js'

let embeddingAppId = null
let fetchingEmbeddingApp = false
let deviceId = null

export const getEmbeddingAppId = () => embeddingAppId

export const setEmbeddingAppId = ({ uri }) => {

  if(!embeddingAppId && !fetchingEmbeddingApp) {

    fetchingEmbeddingApp = true

    return client.query({
      query: embeddingAppQuery,
      variables: {
        uri,
      },
      fetchPolicy: "cache-first",
    })
      .then(queryInfo => {
        const { embeddingApp } = getQueryVars({ queryInfo }).data

        fetchingEmbeddingApp = false
        if(embeddingApp) embeddingAppId = parseInt(embeddingApp.id, 10)
      })
      .catch(err => {
        fetchingEmbeddingApp = false
        throw err
      })

  }
}

export const getDeviceId = () => {
  if(deviceId) return deviceId

  try {
    deviceId = localStorage.getItem('deviceId')
  } catch(e) {
    console.log('could not get deviceId from localStorage', e)
    deviceId = 'no.local.storage'
  }

  if(deviceId) return deviceId

  try {
    deviceId = hash64(Math.random())  // effectively creating a uuid 24 characters long
    localStorage.setItem('deviceId', deviceId)
  } catch(e) {
    console.log('could not set deviceId in localStorage', e)
    deviceId = 'no.local.storage'
  }

  return deviceId
}
