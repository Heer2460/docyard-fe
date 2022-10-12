import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AppConstants} from "../util/app.constants";
import {BaseDTO} from "../model/base.dto";

@Injectable({
    providedIn: 'root'
})
export class RequestService {

    constructor(private http: HttpClient) {
    }

    getToken() {
        return localStorage.getItem(window.btoa(AppConstants.AUTH_ACCESS_TOKEN));
    }

    getBasicHeaders(): HttpHeaders {
        let reqHeader = null;
        reqHeader = new HttpHeaders(
            {
                'Authorization': 'Bearer ' + this.getToken(),
                'auth_token': 'Bearer ' + this.getToken(),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        );
        return reqHeader;
    }

    getUnAuthBasicHeaders(): HttpHeaders {
        const reqHeader = new HttpHeaders(
            {
                'Authorization': 'Basic ' +
                    btoa(environment.api_access_client + ':' + environment.api_secret_client)
            }
        );
        return reqHeader;
    }

    getBasicMultipartHeaders(): HttpHeaders {
        let reqHeader = null;
        reqHeader = new HttpHeaders(
            {
                'auth_token': 'Bearer ' + this.getToken(),
                'Authorization': 'Bearer ' + this.getToken(),
            }
        );
        return reqHeader;
    }

    getBEAPIServer() {
        let protocol = environment.http_protocol;
        let server = environment.api_end_point_url;
        let port = environment.api_end_point_port;
        let contextPath = environment.api_context_path;
        if (protocol === '' || !protocol || server === '' || !server) {
            return '';
        } else {
            if (port === '' || !port) {
                return protocol + environment.http_separator + server + ':' + port + contextPath;
            } else {
                return protocol + environment.http_separator + server + ':' + port + contextPath;
            }
        }
    }

    postAccessTokenRequest(url: any, params: any) {
        const reqHeader = new HttpHeaders(
            {
                'Authorization': 'Basic ' +
                    window.btoa(environment.api_access_client + ':' + environment.api_secret_client)
            }
        );
        return this.http.post(this.getBEAPIServer() + url, params, {headers: reqHeader, observe: 'response'});
    }

    postSignInRequest(url: any, params?: any) {
        let headers = this.getBasicHeaders();
        return this.http.post(this.getBEAPIServer() + url, params, {headers: headers, observe: 'response'});
    }

    getRequest(url: any, params?: any) {
        let headers = this.getBasicHeaders();
        return this.http.get(this.getBEAPIServer() + url, {headers: headers, params: params, observe: 'response'});
    }

    getRequestFile(url: any) {
        let headers = this.getBasicHeaders();
        return this.http.get(this.getBEAPIServer() + url, {headers: headers, responseType: 'arraybuffer'});
    }

    postRequest(url: any, params: any) {
        let headers = this.getBasicHeaders();
        if (params instanceof BaseDTO) {
            params.createdBy = this.getLoggedInUserId();
            params.updatedBy = this.getLoggedInUserId();
        }
        return this.http.post(this.getBEAPIServer() + url, params, {headers: headers, observe: 'response'});
    }

    postRequestMultipartFormAndData(url: any, files: any[], data: any) {
        let headers = this.getBasicMultipartHeaders();
        let formData: FormData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], {
            type: 'application/json'
        }));
        files.forEach((file, index) => {
            if (file) {
                formData.append(file.type, file.data, file.data.name);
            }
        });
        return this.http.post(this.getBEAPIServer() + url, formData, {headers: headers, observe: 'response'});
    }

    postRequestMultipartFormAndDataUpload(url: any, file: any, data: any) {
        let headers = this.getBasicMultipartHeaders();
        let formData: FormData = new FormData();
        formData.append('reqObj', new Blob([JSON.stringify(data)], {
            type: 'application/json'
        }));
        if (file) {
            formData.append('doc', file.orgFile, file.orgFile.name);
        }

        return this.http.post(this.getBEAPIServer() + url, formData, {
            headers: headers,
            reportProgress: true,
            observe: 'events',
            responseType: 'text'
        });
    }

    putRequest(url: any, params?: any) {
        let headers = this.getBasicHeaders();
        if (params instanceof BaseDTO) {
            params.createdBy = this.getLoggedInUserId();
            params.updatedBy = this.getLoggedInUserId();
        }
        return this.http.put(this.getBEAPIServer() + url, params, {headers: headers, observe: 'response'});
    }

    putRequestMultipartFormAndData(url: any, files: any[], data: any, stateId?: string) {
        let headers = this.getBasicMultipartHeaders();
        let formData: FormData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], {
            type: 'application/json'
        }));
        files.forEach((file, index) => {
            if (file) {
                formData.append(file.type, file.data, file.data.name);
            }
        });
        return this.http.put(this.getBEAPIServer() + url, formData, {headers: headers, observe: 'response'});
    }

    patchRequest(url: any, params?: any) {
        let headers = this.getBasicHeaders();
        if (params instanceof BaseDTO) {
            params.createdBy = this.getLoggedInUserId();
            params.updatedBy = this.getLoggedInUserId();
        }
        return this.http.patch(this.getBEAPIServer() + url, params, {headers: headers, observe: 'response'});
    }

    deleteRequest(url: any) {
        let headers = this.getBasicHeaders();
        return this.http.delete(this.getBEAPIServer() + url, {headers: headers, observe: 'response'});
    }

    public getLoggedInUserId(): number {
        return Number.parseInt(localStorage.getItem(window.btoa('loggedInUserId')) + '');
    }
    putUnAuthRequest(url: any, _params?: any) {
        let headers = this.getUnAuthBasicHeaders();
        return this.http.put(this.getBEAPIServer() + url, _params, {headers: headers, observe: 'response'});
    }
}
