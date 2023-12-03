/* eslint-disable camelcase */
import axios from 'axios'
import FormData from 'form-data'

import { Utils } from '../../misc/utils'
import { HttpProtocol } from '../../models/http-protocol'
import { RequestOptions } from '../../models/request-options'

export class Http {
  /**
   * Public methods
   */
  static get<T>(host: string, port: number, path: string, options?: RequestOptions, onDone?: (statusCode: number, data: T) => void, onError?: (error) => void) {
    Http.call(HttpProtocol.GET, host, port, path, options, onDone, onError)
  }

  static post<T>(host: string, port: number, path: string, options?: RequestOptions, onDone?: (statusCode: number, data: T) => void, onError?: (error) => void) {
    Http.call(HttpProtocol.POST, host, port, path, options, onDone, onError)
  }

  static put<T>(host: string, port: number, path: string, options?: RequestOptions, onDone?: (statusCode: number, data: T) => void, onError?: (error) => void) {
    Http.call(HttpProtocol.PUT, host, port, path, options, onDone, onError)
  }

  static patch<T>(host: string, port: number, path: string, options?: RequestOptions, onDone?: (statusCode: number, data: T) => void, onError?: (error) => void) {
    Http.call(HttpProtocol.PATCH, host, port, path, options, onDone, onError)
  }

  static delete<T>(host: string, port: number, path: string, options?: RequestOptions, onDone?: (statusCode: number, data: T) => void, onError?: (error) => void) {
    Http.call(HttpProtocol.DELETE, host, port, path, options, onDone, onError)
  }

  /**
   * Private methods
   */
  private static call<T>(protocol: HttpProtocol, host: string, port: number, path: string, options?: RequestOptions, onDone?: (statusCode: number, data: T) => void, onError?: (error) => void) {
    if (path[0] !== '/') {
      path = '/' + path
    }

    let url = `${host}:${String(port)}${path}`
    if (options?.queryParams) {
      let i = 0
      Object.entries(options.queryParams).forEach(([key, value]) => {
        url += (i === 0 ? '?' : '&') + key + '=' + value
        i++
      })
    }
    let formData
    if (options?.formData || options?.attachments) {
      if (options?.body) {
        console.warn(`Trying to send Body besides a FormData discards the Body. Endpoint: ${url}, Options: ${Utils.objectToString(options)} `) // 8a8f use logger
      }
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
              console.error('Api call error appending attachment:', Utils.objectToString(attachment)) // 8a8f use logger
              onError(error)
            }
          }
        })
      }
    }

    axios({
      method: protocol,
      url,
      headers: { 'Content-Type': formData ? 'multipart/form-data' : 'application/json' },
      data: formData ?? options?.body
    }).then((data) => {
      console.log(`Request successful: '${url}'`) // 8a8f use logger
      if (onDone) {
        onDone(data.status, data.data)
      }
    }).catch(error => {
      const errorStr = `Request response error - '${url}' - ${error.response?.data ? Utils.objectToString(error.response?.data) : Utils.objectToString(error)}`
      console.error(errorStr) // 8a8f use logger
      if (onError) {
        onError(errorStr)
      }
    })
  }
}
