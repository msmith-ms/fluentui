import { IRestrictedDatesOptions } from './dateGrid.types';
import * as DateGrid from './isAfterMaxDate';

enum Months {
  Jan = 0,
  Feb = 1,
  Mar = 2,
  Apr = 3,
  May = 4,
  Jun = 5,
  Jul = 6,
  Aug = 7,
  Sep = 8,
  Oct = 9,
  Nov = 10,
  Dec = 11,
}

describe('isAfterMaxDate', () => {
  const date = new Date(2016, Months.Apr, 3);
  it('returns false if max date is empty', () => {
    const options: IRestrictedDatesOptions = {};
    const result = DateGrid.isAfterMaxDate(date, options);
    expect(result).toBeFalsy();
  });
  it('returns false if max date is greater than date', () => {
    const options: IRestrictedDatesOptions = {
      maxDate: new Date(2016, Months.Apr, 7),
    };
    const result = DateGrid.isAfterMaxDate(date, options);
    expect(result).toBeFalsy();
  });
  it('returns false if max date is equal to date', () => {
    const options: IRestrictedDatesOptions = {
      maxDate: new Date(2016, Months.Apr, 3),
    };
    const result = DateGrid.isAfterMaxDate(date, options);
    expect(result).toBeFalsy();
  });
  it('returns true if max date is less than date', () => {
    const options: IRestrictedDatesOptions = {
      maxDate: new Date(2016, Months.Apr, 1),
    };
    const result = DateGrid.isAfterMaxDate(date, options);
    expect(result).toBeTruthy();
  });
});
