import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeOptionsService {
  // Start time
  getHourOptions(period: 'AM' | 'PM'): string[] {
    if (period === 'AM') {
      return ['10', '11'];
    } else {
      return ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
    }
  }

  getMinuteOptions(hours: string, period: 'AM' | 'PM'): string[] {
    if(hours === '09' && period === 'PM') {
      return ['00'];
    }
    return ['00', '15', '30', '45'];
  }

  // End time
  getEndHourOptions(startHour: string, startPeriod: 'AM' | 'PM', endPeriod: 'AM' | 'PM'): string[] {
    const allHoursAM = ['10', '11', '12'];
    const allHoursPM = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09'];

    // If end period is AM
    if (endPeriod === 'AM') {
      if (startPeriod === 'AM') {
        return allHoursAM.filter(h => {
          const hourNum = h === '12' ? 12 : parseInt(h);
          const startNum = startHour === '12' ? 12 : parseInt(startHour);
          return hourNum >= startNum;
        });
      }
      // If start was PM, no valid AM end times
      return [];
    }
    // If end period is PM
    else {
      // If start was AM, allow all PM hours
      if (startPeriod === 'AM') {
        return allHoursPM;
      }
      // If start was PM, only allow hours greater than or equal to start hour
      return allHoursPM.filter(h => {
        const hourNum = h === '12' ? 0 : parseInt(h);
        const startNum = startHour === '12' ? 0 : parseInt(startHour);
        return hourNum >= startNum;
      });
    }
  }

  getEndMinuteOptions(startHour: string, startMinute: string, startPeriod: 'AM' | 'PM', endHour: string, endPeriod: 'AM' | 'PM'): string[] {
    const minutes = ['00', '15', '30', '45'];

    // Same hour and same period must be at least 15 minutes later
     if (endHour === startHour && endPeriod === startPeriod) {
      const startMinInt = parseInt(startMinute);
      return minutes.filter(m => parseInt(m) > startMinInt);
    }

    // 9 PM can only be 00 minutes because its the closing time
    if(endHour === '09' && endPeriod === 'PM') {
      return ['00'];
    }
    return minutes;
  }
}
