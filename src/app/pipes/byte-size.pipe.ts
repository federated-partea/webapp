import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteSize'
})
export class ByteSizePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value < 1024) {
      return `${value} B`;
    }

    if (value < 1024 * 1024) {
      return `${(value / 1024).toFixed(2)} KB`;
    }

    if (value < 1024 * 1024 * 1024) {
      return `${(value / 1024 / 1024).toFixed(2)} MB`;
    }

    if (value < 1024 * 1024 * 1024 * 1024) {
      return `${(value / 1024 / 1024 / 1024).toFixed(2)} GB`;
    }

    return `${(value / 1024 / 1024 / 1024 / 1024).toFixed(2)} TB`;
  }

}
