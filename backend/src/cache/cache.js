import NodeCache from 'node-cache'


export const userCache = new NodeCache({ stdTTL: 300, checkperiod: 120 })
export const flightCache = new NodeCache({ stdTTL: 300, checkperiod: 120 })


export const getCache = (cache, key) => {
    return cache.get(key)
}

export const setCache = (cache, key, value) => {
    cache.set(key, value)
}

export const deleteCache = (cache, key) => {
    cache.del(key)
}