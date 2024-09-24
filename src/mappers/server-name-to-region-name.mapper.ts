import { ServersList } from '../servers-list';

export class ServerNameToRegionNameMapper {
  public static map(serverName: string): string {
    return ServersList.find((server) => serverName === server.serverName)
      .regionName;
  }
}
