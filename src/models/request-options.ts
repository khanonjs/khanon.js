import { FormDataAttachment } from './formdata-attachment'

export interface RequestOptions {
  queryParams?: object
  body?: object
  formData?: object
  attachments?: FormDataAttachment[]
}
