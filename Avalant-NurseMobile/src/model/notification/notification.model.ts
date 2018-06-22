import { EAFModuleBase } from '../eaf-rest/eaf-module-base';
import { Table, Field } from '../../services/eaf-rest/eaf-rest.decorators';

@Table('SHOP_NOTIFICATION', {
  eafModuleId: 'MD1171335451', entityId: 'EN_170629133512312_v001'
})
export class NotificationModel extends EAFModuleBase {

  @Field('NOTIFICATION_ID') public ID: string;
  @Field('STATUS') public status: NotificationStatus;

  @Field('NOTIFICATION_TIME', {
    isOnlyGui: true
  })
  public time: string;

  @Field('NOTIFICATION_TEXT', {
    isOnlyGui: true
  })
  public text: string;

  public get title(): string {
    return this.text;
  }

  public set title(value: string) {
    this.text = value;
  }

  @Field('NOTIFICATION_MESSAGE', {
    isOnlyGui: true
  })
  public message: string;

  // Getter setter for alternative field
  public get body(): string {
    return this.message;
  }

  public set body(value: string) {
    this.message = value;
  }

  @Field('NOTIFICATION_LINK', {
    isOnlyGui: true
  })
  public link: string;

  public type?: NotificationType;

  @Field('TO_USER_NAME', {
    isOnlyGui: true
  })
  public ownerUsername: string;

  @Field('TO_USER_ID', {
    isOnlyGui: true
  })
  public ownerUserId: string;

  @Field('ORG_ID', {
    isOnlyGui: true
  })
  public organizationId: string;

}

export enum NotificationType {
  BINARY = 'BIN',
  JSON = 'JSON',
  TEXT = 'TEXT',
  HTML = 'HTML',
  LINK = 'LINK',
  EXTERNAL_LINK = 'EXT_LINK',
  ALERT = 'ALERT',
}

export enum NotificationStatus {
  NEW = 'N',
  READ = 'R',
  DELETED = 'D',
}
