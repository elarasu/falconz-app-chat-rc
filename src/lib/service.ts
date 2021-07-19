export class Service {
  _url: string;
  constructor(url: string) {
    this._url = url;
    console.log('****** Service URL set to ******', this._url);
  }
}
