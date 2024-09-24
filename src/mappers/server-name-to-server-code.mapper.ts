import { ServersList } from '../servers-list';

export class ServerNameToServerCodeMapper {
  public static map(serverName: string): string {
    return ServersList.find((server) => serverName === server.serverName)
      .serverCode;
  }
}
