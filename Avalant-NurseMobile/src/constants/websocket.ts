
/*
 * Web Socket constant
 */
const wsUearnConstant = ENV.WEB_SOCKET.UEARN;
const wsMessengerConstant = ENV.WEB_SOCKET.MESSENGER;

interface IWebSocketConstant {
  url: string;
  path?: string;
}

export class WebSocketConstant {

  public static UEARN: IWebSocketConstant = {
    url: wsUearnConstant.URL,
    path: wsUearnConstant.PATH,
  };

  public static MESSENGER: IWebSocketConstant = {
    url: wsMessengerConstant.URL,
  };

}
