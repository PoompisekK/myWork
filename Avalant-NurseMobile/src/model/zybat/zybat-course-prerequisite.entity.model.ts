
export class ZybatCoursePrerequisiteEntityModel {
	private COURSE_PREREQUISITE_ID: string;
	private PRODUCT_ITEM_ID: string;
	private PRODUCT_ID: string;
	private PRE_PRODUCT_ID: string;
	private PRE_PRODUCT_ITEM_ID: string;
	private CREATE_BY: string;
	private CREATE_DATE: string;
	private UPDATE_BY: string;
	private UPDATE_DATE: string;
	private STATUS: string;

	public get coursePrerequisiteId(): string {
		return this.COURSE_PREREQUISITE_ID;
	}
	public set coursePrerequisiteId(value: string) {
		this.COURSE_PREREQUISITE_ID = value;
	}

	public get productItemId(): string {
		return this.PRODUCT_ITEM_ID;
	}
	public set productItemId(value: string) {
		this.PRODUCT_ITEM_ID = value;
	}

	public get productId(): string {
		return this.PRODUCT_ID;
	}
	public set productId(value: string) {
		this.PRODUCT_ID = value;
	}

	public get preProductId(): string {
		return this.PRE_PRODUCT_ID;
	}
	public set preProductId(value: string) {
		this.PRE_PRODUCT_ID = value;
	}

	public get preProductItemId(): string {
		return this.PRE_PRODUCT_ITEM_ID;
	}
	public set preProductItemId(value: string) {
		this.PRE_PRODUCT_ITEM_ID = value;
	}

	public get createBy(): string {
		return this.CREATE_BY;
	}
	public set createBy(value: string) {
		this.CREATE_BY = value;
	}
	public get createDate(): string {
		return this.CREATE_DATE;
	}
	public set createDate(value: string) {
		this.CREATE_DATE = value;
	}

	public get updateBy(): string {
		return this.UPDATE_BY;
	}
	public set updateBy(value: string) {
		this.UPDATE_BY = value;
	}

	public get updateDate(): string {
		return this.UPDATE_DATE;
	}
	public set updateDate(value: string) {
		this.UPDATE_DATE = value;
	}

	public get status(): string {
		return this.STATUS;
	}
	public set status(value: string) {
		this.STATUS = value;
	}

}