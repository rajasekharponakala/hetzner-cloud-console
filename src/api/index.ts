import { createClient, type HcloudClient } from './client';
import { serversApi, imagesApi, serverTypesApi, locationsApi, sshKeysApi } from './servers';
import {
  volumesApi,
  networksApi,
  firewallsApi,
  loadBalancersApi,
  floatingIpsApi,
  primaryIpsApi,
  placementGroupsApi,
  pricingApi,
} from './resources';

export { createClient };
export type { HcloudClient };

export function createApi(token: string) {
  const client = createClient(token);
  return {
    client,
    servers: serversApi(client),
    images: imagesApi(client),
    serverTypes: serverTypesApi(client),
    locations: locationsApi(client),
    sshKeys: sshKeysApi(client),
    volumes: volumesApi(client),
    networks: networksApi(client),
    firewalls: firewallsApi(client),
    loadBalancers: loadBalancersApi(client),
    floatingIps: floatingIpsApi(client),
    primaryIps: primaryIpsApi(client),
    placementGroups: placementGroupsApi(client),
    pricing: pricingApi(client),
  };
}

export type HetznerApi = ReturnType<typeof createApi>;
