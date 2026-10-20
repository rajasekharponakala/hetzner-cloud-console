import type { HcloudClient } from './client';
import type {
  Volume,
  VolumesResponse,
  Network,
  NetworksResponse,
  Firewall,
  FirewallsResponse,
  LoadBalancer,
  LoadBalancersResponse,
  FloatingIp,
  FloatingIpsResponse,
  PrimaryIp,
  PrimaryIpsResponse,
  PlacementGroup,
  PlacementGroupsResponse,
  PricingResponse,
} from '@/types/hetzner';

export function volumesApi(c: HcloudClient) {
  return {
    list: (page = 1, perPage = 50) =>
      c.get<VolumesResponse>(`/volumes?page=${page}&per_page=${perPage}`),
    get: (id: number) => c.get<{ volume: Volume }>(`/volumes/${id}`),
    create: (body: any) => c.post<{ volume: Volume; action: any }>('/volumes', body),
    update: (id: number, body: any) => c.put<{ volume: Volume }>(`/volumes/${id}`, body),
    delete: (id: number) => c.delete<{ action: any }>(`/volumes/${id}`),
    action: (id: number, name: string, body?: any) =>
      c.post<{ action: any }>(`/volumes/${id}/actions/${name}`, body ?? {}),
  };
}

export function networksApi(c: HcloudClient) {
  return {
    list: (page = 1, perPage = 50) =>
      c.get<NetworksResponse>(`/networks?page=${page}&per_page=${perPage}`),
    get: (id: number) => c.get<{ network: Network }>(`/networks/${id}`),
    create: (body: any) => c.post<{ network: Network; action: any }>('/networks', body),
    update: (id: number, body: any) => c.put<{ network: Network }>(`/networks/${id}`, body),
    delete: (id: number) => c.delete(`/networks/${id}`),
  };
}

export function firewallsApi(c: HcloudClient) {
  return {
    list: (page = 1, perPage = 50) =>
      c.get<FirewallsResponse>(`/firewalls?page=${page}&per_page=${perPage}`),
    get: (id: number) => c.get<{ firewall: Firewall }>(`/firewalls/${id}`),
    create: (body: any) => c.post<{ firewall: Firewall }>('/firewalls', body),
    update: (id: number, body: any) => c.put<{ firewall: Firewall }>(`/firewalls/${id}`, body),
    delete: (id: number) => c.delete(`/firewalls/${id}`),
    setRules: (id: number, body: any) =>
      c.post<{ firewall: Firewall; action: any }>(`/firewalls/${id}/actions/set_rules`, body),
  };
}

export function loadBalancersApi(c: HcloudClient) {
  return {
    list: (page = 1, perPage = 50) =>
      c.get<LoadBalancersResponse>(`/load_balancers?page=${page}&per_page=${perPage}`),
    get: (id: number) => c.get<{ load_balancer: LoadBalancer }>(`/load_balancers/${id}`),
    create: (body: any) =>
      c.post<{ load_balancer: LoadBalancer; action: any }>('/load_balancers', body),
    update: (id: number, body: any) =>
      c.put<{ load_balancer: LoadBalancer }>(`/load_balancers/${id}`, body),
    delete: (id: number) => c.delete(`/load_balancers/${id}`),
  };
}

export function floatingIpsApi(c: HcloudClient) {
  return {
    list: (page = 1, perPage = 50) =>
      c.get<FloatingIpsResponse>(`/floating_ips?page=${page}&per_page=${perPage}`),
    create: (body: any) => c.post<{ floating_ip: FloatingIp; action: any }>('/floating_ips', body),
    delete: (id: number) => c.delete(`/floating_ips/${id}`),
  };
}

export function primaryIpsApi(c: HcloudClient) {
  return {
    list: (page = 1, perPage = 50) =>
      c.get<PrimaryIpsResponse>(`/primary_ips?page=${page}&per_page=${perPage}`),
    create: (body: any) => c.post<{ primary_ip: PrimaryIp; action: any }>('/primary_ips', body),
    delete: (id: number) => c.delete(`/primary_ips/${id}`),
  };
}

export function placementGroupsApi(c: HcloudClient) {
  return {
    list: () => c.get<PlacementGroupsResponse>(`/placement_groups?per_page=50`),
    create: (body: any) => c.post<{ placement_group: PlacementGroup }>('/placement_groups', body),
    delete: (id: number) => c.delete(`/placement_groups/${id}`),
  };
}

export function pricingApi(c: HcloudClient) {
  return {
    get: () => c.get<PricingResponse>(`/pricing`),
  };
}
