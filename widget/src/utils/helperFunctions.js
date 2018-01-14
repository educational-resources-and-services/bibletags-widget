export const formLoc = ({ bookId, chapter, verse }) => (
  `${(bookId + '').padStart(2, "0")}${(chapter + '').padStart(3, "0")}${(verse + '').padStart(3, "0")}`
)

export const getDataVar = props => {

  if(props.data) return props.data

  const data = {
    loading: false,
    count: 0,
  }

  for(let x in props) {
    if(props[x] && [ 'loading', 'networkStatus', 'variables', 'refetch' ].every(y => props[x][y] !== undefined)) {
      // if it has all the properties above, in all likelihood it is a query
      data[x + 'DataObj'] = props[x]
      data[x] = props[x][x]
      data.loading = data.loading || props[x].loading
      if(!data.error && props[x].error) {
        data.error = props[x].error
      }
      if(props[x][x]) {
        data.count += parseInt(props[x][x].count, 10) || 0
      }
    }
  }

  return data

}