import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true,
})
export class AgePipe implements PipeTransform {
  transform(dateOfBirth: string): string {
    if (!dateOfBirth) return '';

    const birth = new Date(dateOfBirth);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    const days = now.getDate() - birth.getDate();

    if (days < 0) months--;
    if (months < 0) { years--; months += 12; }

    if (years === 0 && months === 0) {
      const diffDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} old`;
    }

    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''} old`;
    }

    if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''} old`;
    }

    return `${years} yr${years !== 1 ? 's' : ''}, ${months} mo old`;
  }
}
