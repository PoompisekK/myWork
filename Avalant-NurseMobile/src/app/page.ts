
export interface Page {
  title: string;
  iconName?: string;
  component: object;
  onSelect?: Function;
  condition?: Function | boolean;
  usePush?: boolean;
  useAuth?: boolean;
  messages?: string;
  params?: { [key: string]: any };
  isDisabled?: boolean;
}
