import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

/**
 * 抽象服务类
 */
export class AbstractService {

  protected API_PREFIX = '/api';

  constructor() { }

  /**
   * 处理异常的响应消息
   */
  protected mapToError<T>() {
    return catchError<T, never>(err => {
      const error = new Error();
      error.message = '未知错误, 请检查网络是否正常或者联系开发人员';
      if (err instanceof HttpErrorResponse) {
        const rsp: HttpErrorResponse = err;
        if (rsp.status !== 200) {
          if (rsp.error) {
            error.message = rsp.error.msg;
          }
        }
      } else {
        console.error(err);
      }
      throw error;
    });
  }
}
