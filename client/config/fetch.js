/*
 * @Author: zb
 * @Date: 2019-03-25 18:01:10
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-25 18:26:53
 */
import socket from '../socket';

export default function fetch(event, data = {}, {
  toast = true,
} = {}) {
  return new Promise((resolve) => {
    socket.emit(event, data, (res) => {
      if (typeof res === 'string') {
        if (toast) {
        //   Message.error(res)
        }
        resolve([null, res])
      } else {
        resolve([res, null])
      }
    });
  });
}
