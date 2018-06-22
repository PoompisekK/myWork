import { ZybatCoursePrerequisiteEntityModel } from './zybat-course-prerequisite.entity.model';

export class ZybatCoursePrerequisiteModel extends ZybatCoursePrerequisiteEntityModel {

    private PRODUCT_DESC: string;
    private LOCATION_DESC: string;
    private YEAR: string;
    private HAS_HISTORY: string;

    public get productDesc(): string {
        return this.PRODUCT_DESC;
    }
    public set productDesc(value: string) {
        this.PRODUCT_DESC = value;
    }

    public get locationDesc(): string {
        return this.LOCATION_DESC;
    }
    public set locationDesc(value: string) {
        this.LOCATION_DESC = value;
    }

    public get year(): string {
        return this.YEAR;
    }
    public set year(value: string) {
        this.YEAR = value;
    }

    public get hasHistory(): string {
        return this.HAS_HISTORY;
    }
    public set hasHistory(value: string) {
        this.HAS_HISTORY = value;
    }

}