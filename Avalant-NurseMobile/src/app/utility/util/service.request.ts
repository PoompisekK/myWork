import { CallbackMethod } from '../../../constants/oneweb/callbackMethod';
export class ServiceRequest {
	// ex searchParam.push({ name: "Name of Param", val: "value"});
	private _searchParam = [];

	// SEARCH
	private _page: number;
	private _volumePerPage: number;

	// GET
	private _ID: number;

	// SAVE
	private _body;

	public get searchParam() {
		return this._searchParam;
	}

	public set searchParam(value) {
		this._searchParam = value;
	}

	public get page(): number {
		return this._page;
	}

	public set page(value: number) {
		this._page = value;
	}

	public get volumePerPage(): number {
		return this._volumePerPage;
	}

	public set volumePerPage(value: number) {
		this._volumePerPage = value;
	}

	public get body() {
		return this._body;
	}

	public set body(value) {
		this._body = value;
	}

	public get ID() {
		return this._ID;
	}

	public set ID(value) {
		this._ID = value;
	}

	public buildSearchRequest(): any {
		let request = {};

		request['handleForm'] = "Y";
		request['page'] = this.page;
		request['volumePerPage'] = this.volumePerPage;
		// request['cbMethod'] = CallbackMethod.SEARCH;

		for (let param of this.searchParam) {
			for (let prop in param) {
				request[prop] = param[prop];
			}
		}

		request = this.buildParam(request);

		return request;
	}

	public buildGetRequest(): any {
		let request = {};
		request['ID'] = this._ID;
		request['cbMethod'] = CallbackMethod.GET;
		if (this.searchParam) {
			for (let param of this.searchParam) {
				for (let prop in param) {
					request[prop] = param[prop];
				}
			}
		}

		request = this.buildParam(request);

		return request;
	}

	private buildParam(request: any) {
		for (let i of this.searchParam) {
			request[i.name] = i.val;
		}
		return request;
	}

}