import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'ftFormat' })
export class FtFormatPipe implements PipeTransform {
  transform(value: number): string {
    return value.toLocaleString('hu-HU') + ' Ft';
  }
}