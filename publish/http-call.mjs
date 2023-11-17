import axios from 'axios'
import FormData from 'form-data'

export const HttpProtocol = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
}

export const httpCall = (protocol, url, options, headers, onDone, onError) => {
  if (options?.queryParams) {
    let i = 0
    Object.entries(options.queryParams).forEach(([key, value]) => {
      url += (i === 0 ? '?' : '&') + key + '=' + value
      i++
    })
  }
  let formData
  if (options?.formData || options?.attachments) {
    formData = new FormData()
    if (options?.formData) {
      Object.entries(options.formData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }
    if (options?.attachments) {
      options.attachments.forEach((attachment) => {
        try {
          formData.append(attachment.key, attachment.value)
        } catch (error) {
          if (onError) {
            console.error('Api call error appending attachment:', attachment)
            onError(error)
          }
        }
      })
    }
  }

  axios({
    method: protocol,
    url,
    headers: { 'Content-Type': formData ? 'multipart/form-data' : 'application/json', ...headers },
    data: formData ?? options?.body
  }).then((data) => {
    console.log(`Request successful: '${url}'`)
    if (onDone) {
      onDone(data.status, data.data)
    }
  }).catch(error => {
    const errorStr = `Request response error - '${url}' - ${error.response?.data ? error.response?.data : error}`
    console.error(errorStr)
    if (onError) {
      onError(errorStr)
    }
  })
}
