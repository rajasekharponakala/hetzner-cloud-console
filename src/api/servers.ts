import type { HcloudClient } from './client';
import type {
  ServersResponse,
  ServerResponse,
  ActionResponse,
  Image,
  ImagesResponse,
  ServerType,
  ServerTypesResponse,
  Location,
  LocationsResponse,
  SshKey,
  SshKeysResponse,
} from '@/types/hetzner';

export function serversApi(client: HcloudClient) {
  return {
    list: (page = 1, perPage = 50) =>
      client.get<ServersResponse>(`/servers?page=${page}&per_page=${perPage}`),
    get: (id: number) => client.get<ServerResponse>(`/servers/${id}`),
    create: (body: any) =>
      client.post<ServerResponse & { action?: any; next_actions?: any[] }>('/servers', body),
    update: (id: number, body: any) => client.put<ServerResponse>(`/servers/${id}`, body),
    delete: (id: number) => client.delete<{ action?: any }>(`/servers/${id}`),
    action: (id: number, name: string, body?: any) =>
      client.post<ActionResponse>(`/servers/${id}/actions/${name}`, body ?? {}),
    metrics: (id: number, type: string, start: string, end: string) =>
      client.get<any>(`/servers/${id}/metrics?type=${type}&start=${start}&end=${end}`),
  };
}

export function imagesApi(client: HcloudClient) {
  return {
    list: (page = 1, perPage = 50) =>
      client.get<ImagesResponse>(`/images?page=${page}&per_page=${perPage}`),
    get: (id: number) => client.get<{ image: Image }>(`/images/${id}`),
    update: (id: number, body: any) => client.put<{ image: Image }>(`/images/${id}`, body),
    delete: (id: number) => client.delete<{ action?: any }>(`/images/${id}`),
  };
}

export function serverTypesApi(client: HcloudClient) {
  return {
    list: () => client.get<ServerTypesResponse>(`/server_types?per_page=50`),
    get: (id: number) => client.get<{ server_type: ServerType }>(`/server_types/${id}`),
  };
}

export function locationsApi(client: HcloudClient) {
  return {
    list: () => client.get<LocationsResponse>(`/locations?per_page=50`),
    get: (id: number) => client.get<{ location: Location }>(`/locations/${id}`),
  };
}

export function sshKeysApi(client: HcloudClient) {
  return {
    list: (page = 1, perPage = 50) =>
      client.get<SshKeysResponse>(`/ssh_keys?page=${page}&per_page=${perPage}`),
    create: (body: any) => client.post<{ ssh_key: SshKey }>('/ssh_keys', body),
    delete: (id: number) => client.delete(`/ssh_keys/${id}`),
  };
}
