import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PatchVersionRepositoryInterface } from '../../interfaces/patch-version-respository.interface';

@Injectable()
export class HttpRiotPatchVersionService
  implements PatchVersionRepositoryInterface
{
  private url;
  constructor(private readonly httpService: HttpService) {
    this.url = process.env.RIOT_API_URL;
  }

  public async getNewest(): Promise<string> {
    const response = await lastValueFrom(
      this.httpService.get(`${this.url}/api/versions.json`),
    );

    const newestPatch = JSON.stringify(response.data[0]);
    return newestPatch.substring(1, newestPatch.length - 1);
  }
}
