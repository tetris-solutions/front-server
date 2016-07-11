import {execFileSync} from 'child_process'
import path from 'path'

const reader = path.resolve(__dirname, '..', 'print-messages-file.js')

export function readMessageFile (messageFile) {
  return JSON.parse(execFileSync(reader, [messageFile], {
    encoding: 'utf8'
  }))
}
