import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PmisService {
  // apiRoot: string = 'http://172.16.130.20:3116';
   apiRoot: string = 'http://210.5.100.45:3116';
  //  apiRoot: string = 'http://localhost:3116';

  constructor(private http: HttpClient) {}

  login(username, password) {
    const url = `${this.apiRoot}/login`;
    return this.http.post(url, { username, password });
  }

  getFinPerformance(): Observable<any> {
    const url = `${this.apiRoot}/getFinPerformance`;
    return this.http.get<any>(url);
  }

  pdz(): Observable<any> {
    const url = `${this.apiRoot}/pdz`;
    return this.http.get<any>(url);
  }

  budget_assignment(uid): Observable<any> {
    const url = `${this.apiRoot}/budget_assignment`;
    return this.http.post<any>(url, {uid});
  }

  month_locked(): Observable<any> {
    const url = `${this.apiRoot}/month_locked`;
    return this.http.get<any>(url);
  }

  distinctProv(): Observable<any> {
    const url = `${this.apiRoot}/distinctProv`;
    return this.http.get<any>(url);
  }
  distinctMun(): Observable<any> {
    const url = `${this.apiRoot}/distinctMun`;
    return this.http.get<any>(url);
  }

  getPerformance_program(pid: number) {
    const url = `${this.apiRoot}/getFinPerformance`;
    return this.http.post<any>(url, { pid });
  }

  by_district(data: any) {
    const url = `${this.apiRoot}/by_district`;
    return this.http.post<any>(url, { data });
  }

  by_mun(data: any) {
    const url = `${this.apiRoot}/by_mun`;
    return this.http.post<any>(url, { data });
  }

  getMFO(pid: number): Observable<any> {
    const url = `${this.apiRoot}/mfos`;
    return this.http.post<any>(url, { pid });
  }

  getLastUpdated(beds: number, pid: number) {
    const url = `${this.apiRoot}/lastUpdated`;
    return this.http.post<any>(url, { pid, beds });
  }

  updateAllotment(id: number, value: number, col: string) {
    const url = `${this.apiRoot}/updateAllotment`;
    return this.http.post(url, { id, value, col });
  }

  getMFOPhysical(pid: number): Observable<any> {
    const url = `${this.apiRoot}/mfosPhysical`;
    return this.http.post<any>(url, { pid });
  }

  getSummaryObject(pid: number): Observable<any> {
    const url = `${this.apiRoot}/summaryObject`;
    return this.http.post(url, { pid });
  }

  getObjectCode(): Observable<any> {
    const url = `${this.apiRoot}/getObjectCode`;
    return this.http.get(url);
  }

  addObject(mfo_id, object_id, pid) {
    const url = `${this.apiRoot}/addObject`;
    return this.http.post(url, { mfo_id, object_id, pid });
  }

  updateObject(object_id, id) {
    const url = `${this.apiRoot}/updateObject`;
    return this.http.post(url, { id, object_id });
  }

  removeObject(id) {
    const url = `${this.apiRoot}/removeObject`;
    return this.http.post(url, { id});
  }

  updatePhysical(id: number, value: number, col: string) {
    const url = `${this.apiRoot}/updatePhysical`;
    return this.http.post<any>(url, { id, value, col });
  }

  getLogs(beds: number, pid: number): Observable<any> {
    const url = `${this.apiRoot}/getLogs`;
    return this.http.post<any>(url, { pid, beds });
  }

  getDistrict(pid: number): Observable<any> {
    const url = `${this.apiRoot}/getDistrict`;
    return this.http.post<any>(url, { pid });
  }

  getDistrictDetails(data): Observable<any> {
    const url = `${this.apiRoot}/getDistrictDetails`;
    return this.http.post<any>(url, { data });
  }

  getDistrictAccomp(data): Observable<any> {
    const url = `${this.apiRoot}/getDistrictAccomp`;
    return this.http.post<any>(url, { data });
  }

  updateDistrictDetails(id: number, value: number, col: string) {
    const url = `${this.apiRoot}/updateDistrictDetails`;
    return this.http.post<any>(url, { id, value, col });
  }

  syncPhysicalDistrict(data): Observable<any> {
    const url = `${this.apiRoot}/syncPhysicalDistrict`;
    return this.http.post<any>(url, { data });
  }

  logsReport(): Observable<any> {
    const url = `${this.apiRoot}/logsReport`;
    return this.http.get<any>(url);
  }

  updateLogs(
    mfo_id: number,
    value: number,
    pid: number,
    col: string,
    month: string,
    beds: number,
    prov: any,
    mun: any
  ): Observable<any> {
    const url = `${this.apiRoot}/addLogs`;
    let mo: string;
    if (
      month === 'jan' ||
      month === 'jan_t' ||
      month === 'jant' ||
      month === 'jana' ||
      month === 'janr'
    )
      mo = 'January';
    if (
      month === 'feb' ||
      month === 'feb_t' ||
      month === 'febt' ||
      month === 'feba' ||
      month === 'febr'
    )
      mo = 'February';
    if (
      month === 'mar' ||
      month === 'mar_t' ||
      month === 'mart' ||
      month === 'mara' ||
      month === 'marr'
    )
      mo = 'March';
    if (
      month === 'apr' ||
      month === 'apr_t' ||
      month === 'aprt' ||
      month === 'apra' ||
      month === 'aprr'
    )
      mo = 'April';
    if (
      month === 'may' ||
      month === 'may_t' ||
      month === 'mayt' ||
      month === 'maya' ||
      month === 'mayr'
    )
      mo = 'May';
    if (
      month === 'jun' ||
      month === 'jun_t' ||
      month === 'junt' ||
      month === 'juna' ||
      month === 'junnr'
    )
      mo = 'June';
    if (
      month === 'jul' ||
      month === 'jul_t' ||
      month === 'jult' ||
      month === 'jula' ||
      month === 'julr'
    )
      mo = 'July';
    if (
      month === 'aug' ||
      month === 'aug_t' ||
      month === 'augt' ||
      month === 'auga' ||
      month === 'augr'
    )
      mo = 'August';
    if (
      month === 'sep' ||
      month === 'sep_t' ||
      month === 'sept' ||
      month === 'sepa' ||
      month === 'sepr'
    )
      mo = 'September';
    if (
      month === 'oct' ||
      month === 'oct_t' ||
      month === 'octt' ||
      month === 'octa' ||
      month === 'octr'
    )
      mo = 'October';
    if (
      month === 'nov' ||
      month === 'nov_t' ||
      month === 'novt' ||
      month === 'nova' ||
      month === 'novr'
    )
      mo = 'November';
    if (
      month === 'decm' ||
      month === 'dec_t' ||
      month === 'dect' ||
      month === 'deca' ||
      month === 'decr'
    ) {
      mo = 'December';
    } else {
      mo = month;
    }

    var message = col + ' was updated to ' + value + ' in the month of ' + mo;
    if (beds == 21) {
      message =
        col +
        ' in ' +
        mun +
        ', ' +
        prov +
        ' was updated to ' +
        value +
        ' in the month of ' +
        mo;
      beds = 2;
    }

    return this.http.post<any>(url, { mfo_id, pid, message, beds });
  }
}
