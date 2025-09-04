import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianNumber',
})
export class IndianNumberPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value == null) return '';
    const strValue = value.toString().split('.');
    const lastThree = strValue[0].substring(strValue[0].length - 3);
    const otherNumbers = strValue[0].substring(0, strValue[0].length - 3);
    const formattedWhole = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree;
    return strValue.length > 1 ? `${formattedWhole}.${strValue[1]}` : formattedWhole;
  }

}
